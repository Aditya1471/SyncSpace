import { createContext, useContext, useMemo, useState } from "react";

const EditorContext = createContext(null);

export function EditorProvider({ children }) {
  const [files, setFiles] = useState([
    {
      id: "1",
      name: "App.jsx",
      language: "javascript",
      content: `export default function App() {
  return <h1>Welcome to SyncSpace</h1>;
}`,
      path: ["SyncSpace", "src", "App.jsx"],
      modified: false,
    },
  ]);

  const [activeFileId, setActiveFileId] = useState("1");

  const [openTabs, setOpenTabs] = useState(["1"]);

  const [terminalOpen, setTerminalOpen] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [problems, setProblems] = useState([]);

  const [output, setOutput] = useState("");

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const activeFile = useMemo(
    () => files.find((file) => file.id === activeFileId),
    [files, activeFileId]
  );

  const openFile = (id) => {
    setActiveFileId(id);

    setOpenTabs((tabs) =>
      tabs.includes(id) ? tabs : [...tabs, id]
    );
  };

  const closeTab = (id) => {
    setOpenTabs((tabs) => tabs.filter((tab) => tab !== id));

    if (activeFileId === id) {
      const remaining = openTabs.filter((tab) => tab !== id);
      setActiveFileId(remaining[0] || null);
    }
  };

  const updateFileContent = (id, content) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id
          ? {
              ...file,
              content,
              modified: true,
            }
          : file
      )
    );
  };

  const addFile = (file) => {
    setFiles((prev) => [...prev, file]);
  };

  const deleteFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
    closeTab(id);
  };

  const renameFile = (id, newName) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id
          ? {
              ...file,
              name: newName,
            }
          : file
      )
    );
  };

  const saveFile = () => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === activeFileId
          ? {
              ...file,
              modified: false,
            }
          : file
      )
    );
  };

  const value = {
    files,
    activeFile,
    activeFileId,
    openTabs,
    terminalOpen,
    sidebarOpen,
    problems,
    output,
    commandPaletteOpen,

    setFiles,
    setActiveFileId,
    setOpenTabs,
    setTerminalOpen,
    setSidebarOpen,
    setProblems,
    setOutput,
    setCommandPaletteOpen,

    openFile,
    closeTab,
    updateFileContent,
    addFile,
    deleteFile,
    renameFile,
    saveFile,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error(
      "useEditorContext must be used inside EditorProvider"
    );
  }

  return context;
}