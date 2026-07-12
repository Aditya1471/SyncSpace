import Editor from "@monaco-editor/react";

function App() {
  return (
    <div
      style={{
        height: "100vh",
        background: "#1e1e1e",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "12px 20px",
          color: "white",
          fontSize: "20px",
          fontWeight: "bold",
          borderBottom: "1px solid #333",
        }}
      >
        SyncSpace - Code Editor
      </div>

      <Editor
        height="100%"
        defaultLanguage="javascript"
        theme="vs-dark"
        defaultValue={`// Welcome to SyncSpace

function hello() {
  console.log("Hello SyncSpace!");
}

hello();`}
      />
    </div>
  );
}

export default App;