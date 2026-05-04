import Link from "next/link";
import { defaultFonts } from "@/lib/fonts";
import { renderTextToGrid } from "@/lib/renderTextToGrid";
import { TextPatternPreview } from "@/components/TextPatternPreview";

export default function HomePage() {
  const pattern = renderTextToGrid("LOVE\n2026", defaultFonts[2], {
    letterSpacing: 1,
    wordSpacing: 3,
    lineSpacing: 2,
    alignment: "center"
  });

  return (
    <section className="hero-grid">
      <div className="hero-copy">
        <span className="eyebrow">Stitch-based lettering workspace</span>
        <h1>Design cross-stitch words that actually fit the grid.</h1>
        <p>
          Browse original stitch alphabets, preview every character, generate lettering with exact stitch dimensions,
          edit individual characters and export a clean PNG pattern.
        </p>
        <div className="button-row">
          <Link className="button primary" href="/generator">
            Generate lettering
          </Link>
          <Link className="button secondary" href="/fonts">
            Browse fonts
          </Link>
        </div>
      </div>

      <div className="hero-preview" aria-label="Sample stitch lettering preview">
        <div className="panel-heading">
          <span className="eyebrow">Live stitch preview</span>
          <span className="dimension-pill">
            {pattern.width} x {pattern.height}
          </span>
        </div>
        <TextPatternPreview pattern={pattern} showGrid showFilled zoom={18} />
      </div>

      <div className="quick-links" aria-label="Primary product workflows">
        <Link href="/fonts">Browse stitch alphabets</Link>
        <Link href="/generator">Render custom text</Link>
        <Link href="/editor">Edit a character grid</Link>
        <Link href="/custom-fonts">Manage editable fonts</Link>
      </div>
    </section>
  );
}
