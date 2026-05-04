import { apiDocs } from "@/lib/documentation";

export default function ApiDocsPage() {
  return (
    <article className="docs-article">
      <span className="eyebrow">API and functions</span>
      <h1>API Documentation</h1>
      <p>
        The app does not currently define custom Next.js API routes. Its callable API surface is made of
        local utility functions, React hooks and Supabase table operations.
      </p>

      <table className="docs-table">
        <thead>
          <tr>
            <th>Function</th>
            <th>Location</th>
            <th>Inputs</th>
            <th>Outputs</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {apiDocs.map((api) => (
            <tr key={api.name}>
              <td><strong>{api.name}</strong></td>
              <td><code>{api.location}</code></td>
              <td>{api.inputs}</td>
              <td>{api.output}</td>
              <td><code>{api.example}</code></td>
            </tr>
          ))}
        </tbody>
      </table>

      <section>
        <h2>Supabase operations</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Operation</th>
              <th>Table</th>
              <th>Used by</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Select public font records</td>
              <td><code>custom_fonts</code></td>
              <td><code>loadRemoteFonts()</code></td>
            </tr>
            <tr>
              <td>Select character grids for loaded font ids</td>
              <td><code>custom_font_characters</code></td>
              <td><code>loadRemoteFonts()</code></td>
            </tr>
            <tr>
              <td>Upsert font metadata</td>
              <td><code>custom_fonts</code></td>
              <td><code>saveRemoteFont()</code></td>
            </tr>
            <tr>
              <td>Replace character rows</td>
              <td><code>custom_font_characters</code></td>
              <td><code>saveRemoteFont()</code></td>
            </tr>
            <tr>
              <td>Delete a font</td>
              <td><code>custom_fonts</code></td>
              <td><code>deleteRemoteFont()</code></td>
            </tr>
          </tbody>
        </table>
      </section>
    </article>
  );
}
