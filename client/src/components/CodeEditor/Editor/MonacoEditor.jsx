import React from "react";
import Editor from "@monaco-editor/react";

export default function MonacoEditor({
  code = "",
  language = "javascript",
  theme = "vs-dark",
  onChange,
}) {
  return (
    <div className="monaco-wrapper">
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={code}
        theme={theme}
        onChange={onChange}
        options={{
          minimap: {
            enabled: true,
          },
          fontSize: 15,
          fontFamily: "Fira Code, Consolas, monospace",
          wordWrap: "on",
          smoothScrolling: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          cursorBlinking: "smooth",
          renderWhitespace: "selection",
          tabSize: 2,
          formatOnPaste: true,
          formatOnType: true,
          roundedSelection: true,
          padding: {
            top: 15,
          },
        }}
      />
    </div>
  );
}