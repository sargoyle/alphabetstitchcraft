import { dependencies } from "@/lib/documentation";

export default function DependenciesDocsPage() {
  return (
    <article className="docs-article">
      <span className="eyebrow">External dependencies</span>
      <h1>Dependencies</h1>
      <p>
        These services and libraries are the meaningful external dependencies in the current app. The table
        explains why each exists and what would break if it were removed.
      </p>

      <table className="docs-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Why it is used</th>
            <th>If removed</th>
          </tr>
        </thead>
        <tbody>
          {dependencies.map((dependency) => (
            <tr key={dependency.name}>
              <td><strong>{dependency.name}</strong></td>
              <td>{dependency.type}</td>
              <td>{dependency.usedFor}</td>
              <td>{dependency.removalImpact}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section>
        <h2>Environment values</h2>
        <pre className="code-block">{`NEXT_PUBLIC_SUPABASE_URL=Supabase project API URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Supabase publishable/anon key`}</pre>
        <p>
          These values are safe for browser use only when the database policies intentionally allow the
          behavior. The current project decision is that shared custom fonts are public read/write data.
        </p>
      </section>
    </article>
  );
}
