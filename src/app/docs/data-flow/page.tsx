export default function DataFlowDocsPage() {
  return (
    <article className="docs-article">
      <span className="eyebrow">Data flow</span>
      <h1>Data Flow</h1>
      <p>
        The app is mostly browser-driven: user input updates React state, utility functions convert font data
        into grids, and Supabase stores shared public fonts.
      </p>

      <section>
        <h2>Font loading</h2>
        <pre className="code-block">{`Page mounts
  -> useFonts()
  -> load deleted font ids from localStorage
  -> load built-in defaultFonts
  -> if Supabase is configured, loadRemoteFonts()
  -> merge built-in fonts with saved database fonts
  -> render Font Library, Generator, Editor or Manage Fonts`}</pre>
      </section>

      <section>
        <h2>Creating or editing a font</h2>
        <pre className="code-block">{`User creates, renames or edits a font
  -> route page calls saveFont(font)
  -> useFonts ensures the font has a database UUID
  -> saveRemoteFont upserts custom_fonts
  -> existing custom_font_characters are replaced
  -> fresh character rows are inserted
  -> useFonts refreshes the visible font list`}</pre>
      </section>

      <section>
        <h2>Generating lettering</h2>
        <pre className="code-block">{`User changes text or spacing controls
  -> Generator settings update React state
  -> settings are also saved to localStorage
  -> renderTextToGrid(text, font, options)
  -> TextPatternPreview renders the returned grid
  -> ExportControls can export PNG, JSON or copied stitch size`}</pre>
      </section>

      <section>
        <h2>Authentication flow</h2>
        <p>
          Supabase Auth scaffolding still exists, but the current product decision is that shared custom fonts
          are public and do not require login. Existing auth utilities are not required for adding, editing or
          deleting fonts in the present workflow.
        </p>
      </section>

      <section>
        <h2>Error and offline states</h2>
        <ul>
          <li>If Supabase environment values are missing, font writing is disabled and the app shows a sync message.</li>
          <li>If a remote save or delete fails, the app alerts the user and pauses write actions until refresh.</li>
          <li>Generator settings and selected font id still use localStorage for convenience preferences.</li>
        </ul>
      </section>
    </article>
  );
}
