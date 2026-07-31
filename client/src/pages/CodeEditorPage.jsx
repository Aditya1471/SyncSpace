import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import "../components/CodeEditor/CodeEditor.css";

// Providers
import { EditorProvider } from "../components/CodeEditor/Context/EditorContext";
import { ThemeProvider } from "../components/CodeEditor/Context/ThemeContext";

// Layout
import Layout from "../components/CodeEditor/Layout/Layout";
import ActivityBar from "../components/CodeEditor/ActivityBar/ActivityBar";
import Explorer from "../components/CodeEditor/Explorer/Explorer";
import EditorLayout from "../components/CodeEditor/Layout/EditorLayout";
import BottomPanel from "../components/CodeEditor/Layout/BottomPanel";
import StatusBar from "../components/CodeEditor/Layout/StatusBar";

// Editor Components
import Breadcrumb from "../components/CodeEditor/Breadcrumb/Breadcrumb";
import Minimap from "../components/CodeEditor/Minimap/Minimap";

// Bottom Panels
import Terminal from "../components/CodeEditor/Terminal/Terminal";
import OutputConsole from "../components/CodeEditor/Output/OutputConsole";
import Problems from "../components/CodeEditor/Problems/Problems";

// Side Panels
import SearchPanel from "../components/CodeEditor/Search/SearchPanel";
import GitPanel from "../components/CodeEditor/Git/GitPanel";

// Overlay Components
import CommandPalette from "../components/CodeEditor/CommandPalette/CommandPalette";
import Settings from "../components/CodeEditor/Settings/Settings";

export default function CodeEditorPage() {
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("roomId");

  useEffect(() => {
    document.title = roomId
      ? `SyncSpace • ${roomId}`
      : "SyncSpace Code Editor";
  }, [roomId]);

  return (
    <EditorProvider roomId={roomId}>
      <ThemeProvider>
        <div className="syncspace-editor-page">

          <Layout>

            {/* Activity Bar */}
            <ActivityBar />

            {/* Explorer */}
            <Explorer />

            {/* Main Workspace */}
            <div className="editor-workspace">

              {/* Editor */}
              <div className="editor-container">

                <Breadcrumb />

                <EditorLayout />

              </div>

              {/* Right Minimap */}
              <Minimap />

            </div>

            {/* Bottom Terminal */}
            <BottomPanel>

              <Terminal />

              <OutputConsole />

              <Problems />

            </BottomPanel>

          </Layout>

          {/* Floating Panels */}

          <SearchPanel />

          <GitPanel />

          <CommandPalette />

          <Settings />

          {/* Status Bar */}

          <StatusBar />

        </div>
      </ThemeProvider>
    </EditorProvider>
  );
}