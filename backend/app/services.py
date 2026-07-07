from sqlalchemy.orm import Session
from sqlalchemy import func
from .models import ProductInventory

def calculate_inventory_fields(row: dict) -> dict:
    current_stock = int(row.get("current_stock", 0) or 0)
    reserved_stock = int(row.get("reserved_stock", 0) or 0)
    reorder_level = int(row.get("reorder_level", 0) or 0)
    reorder_quantity = int(row.get("reorder_quantity", 0) or 0)
    unit_cost = float(row.get("unit_cost", 0) or 0)
    avg_daily_sales = float(row.get("avg_daily_sales", 0) or 0)
    lead_time_days = int(row.get("lead_time_days", 0) or 0)
    reliability_score = float(row.get("reliability_score", 1) or 1)

    available_stock = current_stock - reserved_stock
    if avg_daily_sales > 0:
        days_remaining = round(available_stock / avg_daily_sales, 2)
    else:
        days_remaining = 9999

    if avg_daily_sales <= 0:
        risk = "No Recent Sales"
    elif days_remaining <= lead_time_days:
        risk = "High Risk"
    elif days_remaining <= lead_time_days + 7:
        risk = "Medium Risk"
    else:
        risk = "Low Risk"

    reorder_flag = "Reorder Needed" if available_stock <= reorder_level else "No Reorder Needed"
    inventory_value = round(current_stock * unit_cost, 2)

    row["available_stock"] = available_stock
    row["days_of_inventory_remaining"] = days_remaining
    row["stockout_risk"] = risk
    row["reorder_flag"] = reorder_flag
    row["inventory_value"] = inventory_value
    row["reorder_quantity"] = reorder_quantity
    row["reliability_score"] = reliability_score
    return row

def dashboard_summary(db: Session) -> dict:
    total_products = db.query(func.count(ProductInventory.id)).scalar() or 0
    high_risk = db.query(func.count(ProductInventory.id)).filter(ProductInventory.stockout_risk == "High Risk").scalar() or 0
    reorder_needed = db.query(func.count(ProductInventory.id)).filter(ProductInventory.reorder_flag == "Reorder Needed").scalar() or 0
    inventory_value = db.query(func.coalesce(func.sum(ProductInventory.inventory_value), 0)).scalar() or 0

    risk_rows = (
        db.query(ProductInventory.stockout_risk, func.count(ProductInventory.id))
        .group_by(ProductInventory.stockout_risk)
        .all()
    )

    top_risky = (
        db.query(ProductInventory)
        .filter(ProductInventory.stockout_risk.in_(["High Risk", "Medium Risk"]))
        .order_by(ProductInventory.days_of_inventory_remaining.asc())
        .limit(5)
        .all()
    )

    return {
        "total_products": total_products,
        "high_risk_products": high_risk,
        "reorder_needed": reorder_needed,
        "inventory_value": round(float(inventory_value), 2),
        "risk_distribution": [{"risk": r[0], "count": r[1]} for r in risk_rows],
        "top_risky_products": [
            {
                "sku": p.sku,
                "product_name": p.product_name,
                "available_stock": p.available_stock,
                "days_of_inventory_remaining": p.days_of_inventory_remaining,
                "stockout_risk": p.stockout_risk,
                "reorder_flag": p.reorder_flag,
            }
            for p in top_risky
        ],
    }

def assistant_answer(db: Session, question: str) -> str:
    q = question.lower()

    if "reorder" in q:
        products = (
            db.query(ProductInventory)
            .filter(ProductInventory.reorder_flag == "Reorder Needed")
            .order_by(ProductInventory.days_of_inventory_remaining.asc())
            .limit(10)
            .all()
        )
        if not products:
            return "No products currently need reorder based on available stock and reorder level."
        lines = [
            f"- {p.sku} / {p.product_name}: available stock {p.available_stock}, reorder level {p.reorder_level}, recommended quantity {p.reorder_quantity}."
            for p in products
        ]
        return "Products needing reorder:\n" + "\n".join(lines)

    if "risk" in q or "stockout" in q or "high" in q:
        products = (
            db.query(ProductInventory)
            .filter(ProductInventory.stockout_risk == "High Risk")
            .order_by(ProductInventory.days_of_inventory_remaining.asc())
            .limit(10)
            .all()
        )
        if not products:
            return "No high-risk stockout products found."
        lines = [
            f"- {p.sku} / {p.product_name}: {p.days_of_inventory_remaining} days remaining, supplier lead time {p.lead_time_days} days."
            for p in products
        ]
        return "High stockout risk products:\n" + "\n".join(lines)

    if "supplier" in q:
        rows = (
            db.query(
                ProductInventory.supplier,
                func.count(ProductInventory.id),
                func.avg(ProductInventory.lead_time_days),
                func.avg(ProductInventory.reliability_score),
            )
            .group_by(ProductInventory.supplier)
            .order_by(func.avg(ProductInventory.lead_time_days).desc())
            .limit(10)
            .all()
        )
        lines = [
            f"- {supplier}: {count} products, avg lead time {round(avg_lead or 0, 1)} days, avg reliability {round(avg_rel or 0, 2)}."
            for supplier, count, avg_lead, avg_rel in rows
        ]
        return "Supplier overview:\n" + "\n".join(lines)

    summary = dashboard_summary(db)
    return (
        f"InventoryPulse summary: {summary['total_products']} products, "
        f"{summary['high_risk_products']} high-risk products, "
        f"{summary['reorder_needed']} products needing reorder, "
        f"total inventory value {summary['inventory_value']}."
    )
