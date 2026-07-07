import os
import pandas as pd
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import Base, engine, get_db
from .models import ProductInventory
from .schemas import ProductOut, AssistantRequest, AssistantResponse
from .services import calculate_inventory_fields, dashboard_summary, assistant_answer

Base.metadata.create_all(bind=engine)

app = FastAPI(title="InventoryPulse AI API", version="0.1.0")

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REQUIRED_COLUMNS = {
    "sku", "product_name", "category", "warehouse", "current_stock", "reserved_stock",
    "reorder_level", "reorder_quantity", "unit_cost", "avg_daily_sales",
    "lead_time_days", "supplier", "reliability_score"
}

@app.get("/health")
def health():
    return {"status": "ok", "app": "InventoryPulse AI"}

@app.post("/upload")
async def upload_inventory(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV upload is supported in this MVP.")

    storage_dir = "/app/storage"
    os.makedirs(storage_dir, exist_ok=True)
    file_path = os.path.join(storage_dir, file.filename)

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    df = pd.read_csv(file_path)
    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing columns: {sorted(list(missing))}")

    db.query(ProductInventory).delete()
    db.commit()

    inserted = 0
    for raw in df.to_dict(orient="records"):
        row = calculate_inventory_fields(raw)
        item = ProductInventory(
            sku=str(row["sku"]),
            product_name=str(row["product_name"]),
            category=str(row.get("category", "")),
            warehouse=str(row.get("warehouse", "")),
            current_stock=int(row["current_stock"]),
            reserved_stock=int(row["reserved_stock"]),
            available_stock=int(row["available_stock"]),
            reorder_level=int(row["reorder_level"]),
            reorder_quantity=int(row["reorder_quantity"]),
            unit_cost=float(row["unit_cost"]),
            avg_daily_sales=float(row["avg_daily_sales"]),
            lead_time_days=int(row["lead_time_days"]),
            supplier=str(row.get("supplier", "")),
            reliability_score=float(row["reliability_score"]),
            days_of_inventory_remaining=float(row["days_of_inventory_remaining"]),
            stockout_risk=str(row["stockout_risk"]),
            reorder_flag=str(row["reorder_flag"]),
            inventory_value=float(row["inventory_value"]),
        )
        db.add(item)
        inserted += 1

    db.commit()
    return {"message": "Inventory uploaded and processed", "rows_inserted": inserted}

@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    return dashboard_summary(db)

@app.get("/products", response_model=list[ProductOut])
def products(db: Session = Depends(get_db)):
    return db.query(ProductInventory).order_by(ProductInventory.product_name.asc()).all()

@app.get("/stockout-risk", response_model=list[ProductOut])
def stockout_risk(db: Session = Depends(get_db)):
    return (
        db.query(ProductInventory)
        .filter(ProductInventory.stockout_risk.in_(["High Risk", "Medium Risk"]))
        .order_by(ProductInventory.days_of_inventory_remaining.asc())
        .all()
    )

@app.get("/reorder-recommendations", response_model=list[ProductOut])
def reorder_recommendations(db: Session = Depends(get_db)):
    return (
        db.query(ProductInventory)
        .filter(ProductInventory.reorder_flag == "Reorder Needed")
        .order_by(ProductInventory.days_of_inventory_remaining.asc())
        .all()
    )

@app.post("/assistant", response_model=AssistantResponse)
def assistant(req: AssistantRequest, db: Session = Depends(get_db)):
    return {"answer": assistant_answer(db, req.question)}
