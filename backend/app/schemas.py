from pydantic import BaseModel

class ProductOut(BaseModel):
    id: int
    sku: str
    product_name: str
    category: str | None = None
    warehouse: str | None = None
    current_stock: int
    reserved_stock: int
    available_stock: int
    reorder_level: int
    reorder_quantity: int
    unit_cost: float
    avg_daily_sales: float
    lead_time_days: int
    supplier: str | None = None
    reliability_score: float
    days_of_inventory_remaining: float
    stockout_risk: str
    reorder_flag: str
    inventory_value: float

    class Config:
        from_attributes = True

class AssistantRequest(BaseModel):
    question: str

class AssistantResponse(BaseModel):
    answer: str
