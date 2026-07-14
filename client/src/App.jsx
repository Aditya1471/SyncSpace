import { useState } from "react";
import CodeEditor from "./components/CodeEditor";

function App() {
  const [code, setCode] = useState("// Start coding...");

  return (
    <CodeEditor
      language="javascript"
      value={code}
      onChange={setCode}
    />
  );
}

export default App;