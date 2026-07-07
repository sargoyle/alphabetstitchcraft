import type { StitchFont } from "@/lib/fontTypes";
import { buildFontPreviewSample } from "@/lib/fontPreviewSample";
import { renderTextToGrid } from "@/lib/renderTextToGrid";
import { TextPatternPreview } from "./TextPatternPreview";

export function FontGridPreview({ font, sample }: { font: StitchFont; sample?: string }) {
  const pattern = renderTextToGrid(sample ?? buildFontPreviewSample(font), font, {
    letterSpacing: 1,
    wordSpacing: 2,
    lineSpacing: 1,
    alignment: "left"
  });

  return <TextPatternPreview pattern={pattern} showGrid={true} showFilled={true} zoom={6} showCenterGuide={false} />;
}