import { Suspense } from "react";
import { EditorClient } from "./EditorClient";

export default function EditorPage() {
  return (
    <>
      <h1 className="sr-only">Font Editor</h1>
      <Suspense fallback={<div className="empty-preview" role="status" aria-live="polite">Loading editor...</div>}>
        <EditorClient />
      </Suspense>
    </>
  );
}
