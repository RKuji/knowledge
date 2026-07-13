"use client";

import { useId, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export function DocContentField({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const editorId = useId();
  const [value, setValue] = useState(defaultValue);

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Editor
        id={editorId}
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        initialValue={defaultValue}
        onEditorChange={(content) => setValue(content)}
        init={{
          height: 320,
          menubar: false,
          plugins: "lists link table code",
          toolbar:
            "undo redo | blocks | bold italic | bullist numlist | link table | code",
          content_css: "/styles/doc-content.css",
          body_class: "doc-content",
        }}
      />
    </>
  );
}
