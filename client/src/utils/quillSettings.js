import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

function QuillEditor({ defaultValue, value, onChange }) {
  const quillRef = useRef(null);
  const quill = useRef(null);

  useEffect(() => {
    if (!quill.current) {
      quill.current = new Quill(quillRef.current, {
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike"],
              ["link", { image: customImageHandler }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ direction: "rtl" }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ["clean"],
            ],
            handlers: {
              image: customImageHandler,
            },
          },
        },
        theme: "snow",
      });

      // Set the initial value of the Quill editor
      if (defaultValue) {
        quill.current.clipboard.dangerouslyPasteHTML(defaultValue);
      }

      quill.current.on("text-change", handleTextChange);
    }

    // Update the value of the Quill editor
    if (value && quill.current && quill.current.getText() !== value) {
      quill.current.setText(value);
    } //eslint-disable-next-line
  }, [defaultValue, value]);

  function customImageHandler() {
    const range = quill.current.getSelection();
    const url = prompt("Adicione a URL da imagem:");

    if (!url) return;

    quill.current.insertEmbed(range.index, "image", url, Quill.sources.USER);
  }

  function handleTextChange() {
    const html = quillRef.current.children[0].innerHTML;
    onChange(html);
  }

  return (
    <div className="quill-editor-container">
      <div ref={quillRef} />
    </div>
  );
}

export default QuillEditor;
