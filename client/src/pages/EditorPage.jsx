import { useState } from "react";
import CodeEditor from "../components/CodeEditor";

function EditorPage() {
// TODO: Replace local state with Yjs shared document
  const [code, setCode] = useState("// Start coding...");

  return (
    <CodeEditor
      language="javascript"
      value={code}
      onChange={setCode}
    />
  );
}

export default EditorPage;