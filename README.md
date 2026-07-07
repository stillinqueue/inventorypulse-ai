# InventoryPulse AI

A fast SaaS MVP for AI-assisted inventory intelligence.

## What it includes

- Dashboard
- Products
- Stockout Risk
- Reorder Recommendations
- AI Assistant
- CSV upload
- PostgreSQL database
- FastAPI backend
- Next.js frontend
- Docker Compose setup
- Rule-based inventory intelligence now
- OpenAI/RAG-ready assistant placeholder

## Quick start

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs

## Demo flow

1. Start the app.
2. Go to `Upload`.
3. Upload `sample_data/inventory_sample.csv`.
4. Open Dashboard, Products, Stockout Risk, Reorder Recommendations, and AI Assistant.

## CSV format

Required columns:

```text
sku,product_name,category,warehouse,current_stock,reserved_stock,reorder_level,reorder_quantity,unit_cost,avg_daily_sales,lead_time_days,supplier,reliability_score
```

## MVP positioning

InventoryPulse AI helps eCommerce and warehouse teams detect stockout risk, identify reorder needs, and ask inventory questions in plain English.

## Next improvements

- Add authentication and organizations
- Add true multi-tenant database isolation
- Add S3/IONOS object storage
- Add OpenAI or local LLM integration
- Add vector search for product/inventory RAG
- Add alerts by email
- Add Databricks connector for heavy enterprise processing
- Add billing with Stripe
