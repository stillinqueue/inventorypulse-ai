export default function RiskBadge({ value }: { value: string }) {
  const cls = value === "High Risk" ? "high" : value === "Medium Risk" ? "medium" : "low";
  return <span className={`badge ${cls}`}>{value}</span>;
}
