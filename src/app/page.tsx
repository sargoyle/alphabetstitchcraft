import Link from "next/link";
import { defaultFonts } from "@/lib/fonts";
import { renderTextToGrid } from "@/lib/renderTextToGrid";
import { TextPatternPreview } from "@/components/TextPatternPreview";

export default function HomePage() {
  const pattern = renderTextToGrid("CREATE\nYOUR OWN\nPATTERNS", defaultFonts[2], {
    letterSpacing: 1,
    wordSpacing: 3,
    lineSpacing: 2,
    alignment: "center"
  });

  return (
    <section className="hero-grid">
      <div className="hero-copy">
        <span className="eyebrow">Cross-stitch lettering patterns</span>
        <h1>Create beautiful cross-stitch lettering in minutes.</h1>
        <p>
          Browse a growing library of stitch alphabets, preview your text instantly, and generate perfectly aligned
          lettering ready for your next pattern.
        </p>
        <div className="button-row">
          <Link className="button primary" href="/generator">
            Create Lettering
          </Link>
          <Link className="button secondary" href="/fonts">
            Browse Alphabets
          </Link>
        </div>
      </div>

      <div className="hero-preview" aria-label="Sample stitch lettering preview">
        <div className="panel-heading">
          <span className="eyebrow">Centred lettering preview</span>
          <span className="dimension-pill">
            {pattern.width} x {pattern.height}
          </span>
        </div>
        <TextPatternPreview pattern={pattern} showGrid showFilled zoom={18} />
      </div>

      <section className="quick-links" aria-labelledby="homepage-actions-heading">
        <h2 id="homepage-actions-heading">What would you like to do?</h2>
        <Link href="/fonts">
          <strong>Browse Alphabets</strong>
          <span>Explore the available stitch alphabets.</span>
        </Link>
        <Link href="/generator">
          <strong>Create Lettering</strong>
          <span>Generate centred text for your next project.</span>
        </Link>
        <Link href="/editor">
          <strong>Edit Fonts</strong>
          <span>Create or customise stitch alphabets.</span>
        </Link>
      </section>
    </section>
  );
}
