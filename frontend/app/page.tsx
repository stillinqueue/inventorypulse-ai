import Header from "@/components/Header";
import { apiGet } from "@/lib/api";

export default async function Dashboard() {
  let data: any = null;
  try {
    data = await apiGet("/dashboard");
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <>
        <Header title="Dashboard" subtitle="Upload inventory CSV first to see insights." />
        <div className="card">Backend is not ready or no data is available.</div>
      </>
    );
  }

  const maxRiskCount = Math.max(
    1,
    ...data.risk_distribution.map((item: any) => Number(item.count || 0))
  );

  return (
    <>
      <Header title="Dashboard" subtitle="Executive view of inventory health and stockout exposure." />
      <div className="grid grid-4">
        <div className="card"><div className="label">Total Products</div><div className="metric">{data.total_products}</div></div>
        <div className="card"><div className="label">High Risk Products</div><div className="metric">{data.high_risk_products}</div></div>
        <div className="card"><div className="label">Reorder Needed</div><div className="metric">{data.reorder_needed}</div></div>
        <div className="card"><div className="label">Inventory Value</div><div className="metric">€{data.inventory_value}</div></div>
      </div>

      <div style={{ height: 24 }} />

      <div className="card">
        <h2>Risk Distribution</h2>
        <div className="simple-chart">
          {data.risk_distribution.map((item: any) => {
            const width = Math.max(6, (Number(item.count || 0) / maxRiskCount) * 100);
            return (
              <div className="simple-chart-row" key={item.risk}>
                <div className="simple-chart-label">{item.risk}</div>
                <div className="simple-chart-track">
                  <div className="simple-chart-bar" style={{ width: `${width}%` }} />
                </div>
                <div className="simple-chart-value">{item.count}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: 24 }} />

      <div className="card">
        <h2>Top Risky Products</h2>
        <table className="table">
          <thead>
            <tr><th>SKU</th><th>Product</th><th>Available</th><th>Days Left</th><th>Risk</th><th>Reorder</th></tr>
          </thead>
          <tbody>
            {data.top_risky_products.map((p: any) => (
              <tr key={p.sku}>
                <td>{p.sku}</td>
                <td>{p.product_name}</td>
                <td>{p.available_stock}</td>
                <td>{p.days_of_inventory_remaining}</td>
                <td>{p.stockout_risk}</td>
                <td>{p.reorder_flag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
