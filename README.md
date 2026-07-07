# InventoryPulse AI - Codespaces Ready

InventoryPulse AI is a fast SaaS MVP for inventory intelligence.

It includes:

- Dashboard
- Upload CSV
- Products
- Stockout Risk
- Reorder Recommendations
- AI Assistant
- FastAPI backend
- Next.js frontend
- PostgreSQL database
- Docker Compose
- GitHub Codespaces support

---

## Open in GitHub Codespaces

1. Create a new GitHub repository.
2. Upload all files from this zip into the repository.
3. Click:

```text
Code -> Codespaces -> Create codespace on main
```

4. Wait until Codespaces opens.
5. In the Codespaces terminal, run:

```bash
docker compose up --build
```

6. Open the forwarded ports:

```text
Frontend: port 3000
Backend API: port 8000
```

Backend API docs:

```text
https://your-codespace-url-8000.app.github.dev/docs
```

---

## Demo Flow

1. Open the frontend on port `3000`.
2. Go to `Upload`.
3. Upload:

```text
sample_data/inventory_sample.csv
```

4. Visit:

```text
Dashboard
Products
Stockout Risk
Reorder Recommendations
AI Assistant
```

---

## CSV Format

Required columns:

```text
sku,product_name,category,warehouse,current_stock,reserved_stock,reorder_level,reorder_quantity,unit_cost,avg_daily_sales,lead_time_days,supplier,reliability_score
```

---

## What This MVP Does

- Uploads inventory CSV data
- Stores products in PostgreSQL
- Calculates available stock
- Calculates days of inventory remaining
- Detects stockout risk
- Detects products needing reorder
- Calculates inventory value
- Shows dashboard KPIs
- Shows risk distribution chart
- Provides a simple rule-based AI assistant

---

## Current Assistant Questions

Try asking:

```text
Which products should be reordered?
Which products are high stockout risk?
Give me supplier overview
Summarize inventory health
```

---

## Next SaaS Improvements

- Login and organizations
- True multi-tenant data model
- IONOS/S3 file storage
- OpenAI-powered AI assistant
- Vector search / RAG
- Email alerts
- Stripe billing
- Databricks integration for larger customers


---

## Troubleshooting

### Rebuild after pulling changes

If the frontend still shows an old error, stop Docker Compose and rebuild without cache:

```bash
docker compose down
docker compose build --no-cache
docker compose up
```

### Recharts error

This fixed version does not use Recharts. The dashboard chart is a simple CSS bar chart to avoid React 19 / Recharts server-rendering compatibility issues in Codespaces.
