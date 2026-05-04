import { Suspense } from "react";
import { EditorClient } from "./EditorClient";

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="empty-preview">Loading editor...</div>}>
      <EditorClient />
    </Suspense>
  );
}
