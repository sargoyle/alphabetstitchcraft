import { componentDocs } from "@/lib/documentation";

export default function ComponentsDocsPage() {
  return (
    <article className="docs-article">
      <span className="eyebrow">Component library</span>
      <h1>Components</h1>
      <p>
        These are the major reusable components in the current app. Props are documented as practical
        inputs rather than exhaustive TypeScript declarations.
      </p>

      <table className="docs-table">
        <thead>
          <tr>
            <th>Component</th>
            <th>What it does</th>
            <th>Used in</th>
            <th>Inputs</th>
          </tr>
        </thead>
        <tbody>
          {componentDocs.map((component) => (
            <tr key={component.name}>
              <td>
                <strong>{component.name}</strong>
                <br />
                <code>{component.file}</code>
              </td>
              <td>{component.purpose}</td>
              <td>{component.usedIn}</td>
              <td>{component.inputs}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section>
        <h2>Component pattern rules</h2>
        <ul>
          <li>Reusable controls live in <code>src/components</code>.</li>
          <li>Route-specific orchestration stays in <code>src/app</code> pages or client route components.</li>
          <li>Grid mutation logic should use helpers from <code>gridUtils.ts</code>.</li>
          <li>Text pattern rendering should go through <code>renderTextToGrid.ts</code>.</li>
        </ul>
      </section>
    </article>
  );
}
