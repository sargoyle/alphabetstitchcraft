import { databaseTables, folderStructure } from "@/lib/documentation";

export default function ArchitectureDocsPage() {
  return (
    <article className="docs-article">
      <span className="eyebrow">System architecture</span>
      <h1>Architecture</h1>
      <p>
        The app is a Next.js, React and TypeScript product with local default font data, browser-side
        rendering, and Supabase persistence for shared public custom fonts.
      </p>

      <section>
        <h2>Tech stack</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Layer</th>
              <th>Current choice</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>App framework</td>
              <td>Next.js App Router</td>
              <td>Routes, layout, static/server pages and client screens.</td>
            </tr>
            <tr>
              <td>UI</td>
              <td>React 19 + TypeScript</td>
              <td>Interactive generator, editor and reusable components.</td>
            </tr>
            <tr>
              <td>Styling</td>
              <td>Tailwind pipeline + custom CSS</td>
              <td>Global design tokens, responsive layouts and grid visuals.</td>
            </tr>
            <tr>
              <td>Database</td>
              <td>Supabase Postgres</td>
              <td>Shared public custom font and character persistence.</td>
            </tr>
            <tr>
              <td>Export</td>
              <td>Browser canvas + clipboard</td>
              <td>PNG download, JSON export and design-size copy.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Folder structure</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Path</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            {folderStructure.map((item) => (
              <tr key={item.path}>
                <td><code>{item.path}</code></td>
                <td>{item.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Frontend and backend connection</h2>
        <p>
          Client pages call <code>useFonts()</code>, which merges built-in font data with remote fonts.
          Remote persistence goes through <code>fontPersistence.ts</code> and the singleton Supabase client
          in <code>supabaseClient.ts</code>. The required environment values are
          <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
        </p>
        <pre className="code-block">{`UI page -> useFonts()
  -> defaultFonts
  -> loadRemoteFonts()
  -> Supabase custom_fonts + custom_font_characters`}</pre>
      </section>

      <section>
        <h2>Database schema overview</h2>
        <p>
          The schema started with owner-based RLS and collaboration-ready workspaces. Current migrations make
          custom fonts a shared public library: everyone can read, create, edit, rename and delete public
          custom fonts.
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Table</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            {databaseTables.map((table) => (
              <tr key={table.table}>
                <td><code>{table.table}</code></td>
                <td>{table.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </article>
  );
}
