import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stitch Lettering Library",
  description: "Browse, create, edit and export stitch-based lettering patterns."
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/fonts", label: "Alphabet Library" },
  { href: "/generator", label: "Create Pattern" },
  { href: "/editor", label: "Font Editor" }
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="aura-shell">
          <header className="site-header">
            <Link className="brand" href="/">
              <span className="brand-mark">+</span>
              <span>Stitch Lettering Library</span>
            </Link>
            <nav aria-label="Primary navigation">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
