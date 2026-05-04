import Link from "next/link";
import { documentationPages } from "@/lib/documentation";

export default function DocumentationHomePage() {
  return (
    <article className="docs-article">
      <span className="eyebrow">Living reference</span>
      <h1>Documentation Center</h1>
      <p>
        The Stitch Lettering Library documentation center collects the current product, architecture,
        implementation and dependency details as routable app pages. It is intended for anyone building,
        reviewing or maintaining the project.
      </p>

      <section>
        <h2>Project overview</h2>
        <p>
          This app helps cross-stitch designers browse stitch alphabets, generate lettering on a grid,
          edit individual characters, save shared public fonts to Supabase and export generated lettering
          patterns. Version 1 stays focused on lettering rather than full cross-stitch chart design.
        </p>
      </section>

      <section>
        <h2>Documentation index</h2>
        <div className="docs-index-grid">
          {documentationPages
            .filter((page) => page.href !== "/docs")
            .map((page) => (
              <Link className="docs-link-card" key={page.href} href={page.href}>
                <strong>{page.title}</strong>
                <span>{page.description}</span>
              </Link>
            ))}
        </div>
      </section>

      <section>
        <h2>Current source documents</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>docs/masterplan.md</td>
              <td>North Star product direction and scope.</td>
            </tr>
            <tr>
              <td>docs/tasks.md</td>
              <td>Implementation order and completion tracking.</td>
            </tr>
            <tr>
              <td>docs/rules.md</td>
              <td>Project-wide decisions and rules.</td>
            </tr>
            <tr>
              <td>docs/changelog.md</td>
              <td>Historical record of notable completed work.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </article>
  );
}
