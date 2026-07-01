import Link from "next/link";
import { defaultFonts } from "@/lib/fonts";
import { renderTextToGrid } from "@/lib/renderTextToGrid";
import { TextPatternPreview } from "@/components/TextPatternPreview";

export default function HomePage() {
  const previewFont = defaultFonts.find((font) => font.name === "Block Needle 5x7") ?? defaultFonts[0];
  const pattern = renderTextToGrid("CREATE\nYOUR OWN\nPATTERNS", previewFont, {
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
        <h2 id="homepage-actions-heading">How it works</h2>
        <Link href="/fonts">
          <span className="step-number">1</span>
          <strong>Choose an alphabet</strong>
          <span>Browse stitch alphabets and select a lettering style.</span>
        </Link>
        <Link href="/generator">
          <span className="step-number">2</span>
          <strong>Add your text</strong>
          <span>Enter your wording and preview centred multi-line lettering.</span>
        </Link>
        <Link href="/generator">
          <span className="step-number">3</span>
          <strong>Export your pattern</strong>
          <span>Generate a clean pattern ready to print and stitch.</span>
        </Link>
      </section>
    </section>
  );
}
