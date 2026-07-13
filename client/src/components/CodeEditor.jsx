import Editor from "@monaco-editor/react";

function CodeEditor({ language, value, onChange }) {
  return (
    <Editor
      height="100vh"
      language={language}
      value={value}
      theme="vs-dark"
      onChange={onChange}
    />
  );
}

export default CodeEditor;