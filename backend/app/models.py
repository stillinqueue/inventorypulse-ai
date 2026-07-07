from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from .database import Base

class ProductInventory(Base):
    __tablename__ = "product_inventory"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(100), index=True, nullable=False)
    product_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    warehouse = Column(String(100), nullable=True)

    current_stock = Column(Integer, default=0)
    reserved_stock = Column(Integer, default=0)
    available_stock = Column(Integer, default=0)

    reorder_level = Column(Integer, default=0)
    reorder_quantity = Column(Integer, default=0)

    unit_cost = Column(Float, default=0)
    avg_daily_sales = Column(Float, default=0)
    lead_time_days = Column(Integer, default=0)

    supplier = Column(String(255), nullable=True)
    reliability_score = Column(Float, default=1.0)

    days_of_inventory_remaining = Column(Float, default=0)
    stockout_risk = Column(String(50), default="Unknown")
    reorder_flag = Column(String(50), default="No Reorder Needed")
    inventory_value = Column(Float, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
