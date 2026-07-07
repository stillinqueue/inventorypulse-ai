import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "InventoryPulse AI",
  description: "AI inventory intelligence SaaS MVP"
};

const nav = [
  ["/", "Dashboard"],
  ["/upload", "Upload"],
  ["/products", "Products"],
  ["/stockout-risk", "Stockout Risk"],
  ["/reorder", "Reorder Recommendations"],
  ["/assistant", "AI Assistant"]
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <aside className="sidebar">
            <div className="logo">InventoryPulse AI</div>
            <div className="tagline">Stockout risk, reorder intelligence, and inventory chat.</div>
            <nav className="nav">
              {nav.map(([href, label]) => (
                <Link key={href} href={href}>{label}</Link>
              ))}
            </nav>
          </aside>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
