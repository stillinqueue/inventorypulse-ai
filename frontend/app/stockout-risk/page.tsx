import Header from "@/components/Header";
import RiskBadge from "@/components/RiskBadge";
import { apiGet } from "@/lib/api";

export default async function StockoutRiskPage() {
  let products: any[] = [];
  try {
    products = await apiGet("/stockout-risk");
  } catch {
    return (
      <>
        <Header title="Stockout Risk" subtitle="Products likely to run out before supplier replenishment arrives." />
        <div className="error">Could not load stockout risk data. Start Docker Compose and upload CSV first.</div>
      </>
    );
  }

  return (
    <>
      <Header title="Stockout Risk" subtitle="Products likely to run out before supplier replenishment arrives." />
      <table className="table">
        <thead>
          <tr>
            <th>SKU</th><th>Product</th><th>Available</th><th>Days Left</th><th>Lead Time</th><th>Supplier</th><th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: any) => (
            <tr key={p.id}>
              <td>{p.sku}</td>
              <td>{p.product_name}</td>
              <td>{p.available_stock}</td>
              <td>{p.days_of_inventory_remaining}</td>
              <td>{p.lead_time_days}</td>
              <td>{p.supplier}</td>
              <td><RiskBadge value={p.stockout_risk} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
