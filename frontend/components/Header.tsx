export default function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}
