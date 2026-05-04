import Link from "next/link";
import { documentationPages } from "@/lib/documentation";

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="docs-shell">
      <aside className="docs-sidebar" aria-label="Documentation navigation">
        <div>
          <span className="eyebrow">Documentation</span>
          <h1>Project reference</h1>
        </div>
        <nav>
          {documentationPages.map((page) => (
            <Link key={page.href} href={page.href}>
              <span>{page.title}</span>
              <small>{page.description}</small>
            </Link>
          ))}
        </nav>
      </aside>
      <div className="docs-content">{children}</div>
    </section>
  );
}
