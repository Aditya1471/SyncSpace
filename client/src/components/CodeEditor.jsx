import Editor from "@monaco-editor/react";

function CodeEditor({ language, value, onChange }) {
  return (
    <Editor
    // TODO: Integrate Yjs shared document
// TODO: Connect Y-WebSocket provider
// TODO: Synchronize editor content using Yjs
// TODO: Show remote user cursors and presence
      height="100%"
      language={language}
      value={value}
      theme="vs-dark"
      onChange={onChange}// TODO: Bind onChange with Yjs document updates
      options={{
        minimap: { enabled: false },
        fontSize: 16,
        automaticLayout: true,
        scrollBeyondLastLine: false,
      }}
    />
  );
}

export default CodeEditor;