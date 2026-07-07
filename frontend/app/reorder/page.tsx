import Header from "@/components/Header";
import { apiGet } from "@/lib/api";

export default async function ReorderPage() {
  let products: any[] = [];
  try {
    products = await apiGet("/reorder-recommendations");
  } catch {
    return (
      <>
        <Header title="Reorder Recommendations" subtitle="Products where available stock is below or equal to the reorder level." />
        <div className="error">Could not load reorder recommendations. Start Docker Compose and upload CSV first.</div>
      </>
    );
  }

  return (
    <>
      <Header title="Reorder Recommendations" subtitle="Products where available stock is below or equal to the reorder level." />
      <table className="table">
        <thead>
          <tr>
            <th>SKU</th><th>Product</th><th>Available</th><th>Reorder Level</th><th>Recommended Qty</th><th>Supplier</th><th>Lead Time</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: any) => (
            <tr key={p.id}>
              <td>{p.sku}</td>
              <td>{p.product_name}</td>
              <td>{p.available_stock}</td>
              <td>{p.reorder_level}</td>
              <td>{p.reorder_quantity}</td>
              <td>{p.supplier}</td>
              <td>{p.lead_time_days} days</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
