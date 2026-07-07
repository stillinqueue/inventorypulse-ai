import Header from "@/components/Header";
import RiskBadge from "@/components/RiskBadge";
import { apiGet } from "@/lib/api";

export default async function ProductsPage() {
  const products = await apiGet("/products");

  return (
    <>
      <Header title="Products" subtitle="All uploaded products with stock, supplier, and value details." />
      <table className="table">
        <thead>
          <tr>
            <th>SKU</th><th>Product</th><th>Category</th><th>Warehouse</th><th>Available</th><th>Sales/Day</th><th>Risk</th><th>Value</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: any) => (
            <tr key={p.id}>
              <td>{p.sku}</td>
              <td>{p.product_name}</td>
              <td>{p.category}</td>
              <td>{p.warehouse}</td>
              <td>{p.available_stock}</td>
              <td>{p.avg_daily_sales}</td>
              <td><RiskBadge value={p.stockout_risk} /></td>
              <td>€{p.inventory_value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
