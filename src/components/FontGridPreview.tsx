import type { StitchFont } from "@/lib/fontTypes";
import { renderTextToGrid } from "@/lib/renderTextToGrid";
import { TextPatternPreview } from "./TextPatternPreview";

export function FontGridPreview({ font, sample = "ABC 123" }: { font: StitchFont; sample?: string }) {
  const pattern = renderTextToGrid(sample, font, {
    letterSpacing: 1,
    wordSpacing: 2,
    lineSpacing: 1,
    alignment: "left"
  });

  return <TextPatternPreview pattern={pattern} showGrid={true} showFilled={true} zoom={6} showCenterGuide={false} />;
}

