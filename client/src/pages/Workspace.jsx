import { useState } from "react";
import Whiteboard from "../components/Whiteboard/Whiteboard";
import CodeEditor from "../components/CodeEditor";
import "../App.css";

function Workspace() {
  const [code, setCode] = useState(`// Welcome to SyncSpace

function hello() {
  console.log("Hello SyncSpace!");
}

hello();`);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">SyncSpace Workspace</div>
        <div className="status">
          🟢 Collaborative Session Active (Port 5000)
        </div>
      </header>

      <div className="split-screen-layout">
        {/* Whiteboard */}
        <div className="panel whiteboard-panel">
          <div className="panel-title">Interactive Whiteboard</div>

          <div className="canvas-container">
            <Whiteboard />
          </div>
        </div>

        {/* Code Editor */}
        <div className="panel editor-panel">
          <div className="panel-title">Collaborative Code Editor</div>

          <div className="editor-container">
            <CodeEditor
              language="javascript"
              value={code}
              onChange={setCode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workspace;