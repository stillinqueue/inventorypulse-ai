import Header from "@/components/Header";
import { apiGet } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={data.risk_distribution}>
              <XAxis dataKey="risk" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
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
