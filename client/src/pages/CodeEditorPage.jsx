import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import MonacoEditor, { loader } from "@monaco-editor/react";
import {
  FaRegFileCode,
  FaSearch,
  FaCodeBranch,
  FaPlay,
  FaCog,
  FaBell,
  FaFileMedical,
  FaFolderOpen,
  FaFileUpload,
  FaDownload,
  FaShieldAlt,
  FaLayerGroup,
  FaFolderPlus,
  FaFolder,
  FaFolderOpen as FaFolderOpenIcon,
  FaChevronRight,
  FaChevronDown,
  FaTimes,
  FaTerminal as FaConsoleIcon,
  FaTerminal,
  FaSpinner,
  FaTrash
} from "react-icons/fa";
import axios from "axios";
import { io } from "socket.io-client";
import "./CodeEditorPage.css";

loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs"
  }
});

const INITIAL_FILES = [
  {
    id: "1",
    name: "Main.java",
    path: "src/Main.java",
    folder: "src",
    content: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Server Java Execution!");\n        int a = 15;\n        int b = 25;\n        System.out.println("Sum = " + (a + b));\n    }\n}',
    language: "java"
  },
  {
    id: "2",
    name: "main.py",
    path: "src/main.py",
    folder: "src",
    content: 'import sys\n\nprint("Hello from Backend Python Runner!")\nprint(f"Python Version: {sys.version}")\n\nfor i in range(1, 4):\n    print(f"Processing item {i}")',
    language: "python"
  },
  {
    id: "3",
    name: "main.cpp",
    path: "src/main.cpp",
    folder: "src",
    content: '#include <iostream>\n\nint main() {\n    std::cout << "Hello from Server C++ Execution!" << std::endl;\n    return 0;\n}',
    language: "cpp"
  }
];

const FolderTreeNode = React.memo(({ node, activeFileId, onSelectFile, onDeleteFile, onRunFile, isRunning, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!node) return null;

  const folderEntries = Object.entries(node.children || {});
  const filesList = node.files || [];

  return (
    <div className="tree-branch">
      {node.name !== "root" && (
        <div
          className="vscode-folder-row"
          onClick={() => setIsOpen((prev) => !prev)}
          style={{ paddingLeft: `${level * 14 + 10}px` }}
        >
          <span className="tree-arrow">
            {isOpen ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
          </span>
          {isOpen ? (
            <FaFolderOpenIcon className="vscode-folder-icon open" />
          ) : (
            <FaFolder className="vscode-folder-icon" />
          )}
          <span className="vscode-folder-name">{node.name}</span>
        </div>
      )}

      {(isOpen || node.name === "root") && (
        <div className="vscode-tree-container">
          {folderEntries.map(([folderName, subNode]) => (
            <FolderTreeNode
              key={folderName}
              node={subNode}
              activeFileId={activeFileId}
              onSelectFile={onSelectFile}
              onDeleteFile={onDeleteFile}
              onRunFile={onRunFile}
              isRunning={isRunning}
              level={level + 1}
            />
          ))}

          {filesList.map((file) => {
            const extParts = file.name.split(".");
            const ext = extParts.length > 1 ? extParts.pop() : "file";

            return (
              <div
                key={file.id}
                className={`file-row ${file.id === activeFileId ? "active" : ""}`}
                style={{ paddingLeft: `${(level + 1) * 14 + 10}px` }}
                onClick={() => onSelectFile(file.id)}
              >
                <span className="file-row-main">
                  <span className={`file-ext-tag ext-${ext}`}>{ext}</span>
                  <span className="file-row-name">{file.name}</span>
                </span>
                
                <div className="file-row-actions">
                  <button
                    className="file-action-btn run-btn"
                    onClick={(e) => onRunFile(e, file)}
                    disabled={isRunning}
                    title={`Run ${file.name}`}
                  >
                    <FaPlay size={9} />
                  </button>
                  <button
                    className="file-action-btn delete-btn"
                    onClick={(e) => onDeleteFile(e, file.id)}
                    title="Close file"
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default function CodeEditorPage({ roomId = "default-room" }) {
  const [activePanel, setActivePanel] = useState("explorer");
  const [files, setFiles] = useState(INITIAL_FILES);
  const [folders, setFolders] = useState(["src"]);
  const [activeFileId, setActiveFileId] = useState("1");

  const [output, setOutput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState(
    "⚡ SyncSpace IDE connected to Execution Engine.\nPress 'Run' on any file to compile & execute...\n"
  );
  const [status, setStatus] = useState("System Ready");
  const [isRunning, setIsRunning] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [selectedFolderForFile, setSelectedFolderForFile] = useState("root");

  const activeFile = useMemo(() => {
    return files.find((f) => f.id === activeFileId) || files[0] || null;
  }, [files, activeFileId]);

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const socketRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    socketRef.current = io(API_URL, {
      transports: ["websocket", "polling"],
      auth: {
        token: localStorage.getItem("token") || localStorage.getItem("authToken")
      }
    });

    const socket = socketRef.current;
    socket.emit("join-room", { roomId });

    socket.on("code-change", ({ filePath, content }) => {
      console.log("RECEIVED CODE:", {
        filePath,
        content
      });
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.path === filePath
            ? { ...file, content }
            : file
        )
      );
    });

    socket.on("file-created", (newFile) => {
      setFiles((prevFiles) => {
        if (prevFiles.some((f) => f.id === newFile.id)) return prevFiles;
        return [...prevFiles, newFile];
      });
    });

    socket.on("file-deleted", ({ fileId }) => {
      setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
    });

    socket.on("execution-result", ({ fileId, output: resOutput, isError }) => {
      const targetFile = files.find((f) => f.id === fileId);
      const filename = targetFile ? targetFile.name : "File";
      
      setOutput(resOutput);
      setTerminalOutput((prev) =>
        `${prev}\n--- [${isError ? "FAILED" : "SUCCESS"}] Remote Execution: ${filename} ---\n${resOutput}\n`
      );
    });

    return () => {
      socket.off("code-change");
      socket.off("file-created");
      socket.off("file-deleted");
      socket.off("execution-result");
      socket.disconnect();
    };
  }, [API_URL, roomId]);

  const fileTreeRoot = useMemo(() => {
    const root = { name: "root", type: "folder", children: {}, files: [] };

    files.forEach((file) => {
      const parts = file.path ? file.path.split("/") : [file.name];
      let current = root;

      for (let i = 0; i < parts.length - 1; i++) {
        const folderName = parts[i];
        if (!current.children[folderName]) {
          current.children[folderName] = {
            name: folderName,
            type: "folder",
            children: {},
            files: []
          };
        }
        current = current.children[folderName];
      }
      current.files.push(file);
    });

    return root;
  }, [files]);

  const detectLanguage = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    const map = {
      js: "javascript", jsx: "javascript",
      ts: "typescript", tsx: "typescript",
      py: "python", java: "java",
      cpp: "cpp", c: "c", cc: "cpp", hpp: "cpp", h: "c",
      html: "html", htm: "html",
      css: "css", json: "json", sql: "sql", md: "markdown"
    };
    return map[ext] || "plaintext";
  };

  const isTextFile = (filename) => {
    const binaryExtensions = [
      "class", "pyc", "exe", "dll", "so", "o", "obj",
      "png", "jpg", "jpeg", "gif", "zip", "jar", "pdf", "ico"
    ];
    const ext = filename.split(".").pop().toLowerCase();
    return !binaryExtensions.includes(ext);
  };

  const readFileAsync = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result || "");
      reader.onerror = () => resolve("");
      reader.readAsText(file);
    });
  };

  const handleImportFiles = async (e) => {
    setIsLoading(true);
    setLoadingText("Initializing upload...");
    setLoadingProgress(0);

    const rawFiles = Array.from(e.target.files || []);
    const importedFiles = rawFiles.filter((f) => isTextFile(f.name));

    if (!importedFiles.length) {
      setIsLoading(false);
      return;
    }

    const newFileObjects = [];
    for (let i = 0; i < importedFiles.length; i++) {
      const file = importedFiles[i];
      const content = await readFileAsync(file);
      const newFile = {
        id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        path: file.name,
        folder: "",
        content,
        language: detectLanguage(file.name)
      };
      newFileObjects.push(newFile);

      if (socketRef.current) {
        socketRef.current.emit("file-created", { roomId, file: newFile });
      }

      setLoadingProgress(Math.round(((i + 1) / importedFiles.length) * 100));
    }

    setFiles((prev) => [...prev, ...newFileObjects]);
    if (newFileObjects.length > 0) setActiveFileId(newFileObjects[0].id);
    setStatus(`Imported ${newFileObjects.length} file(s).`);
    e.target.value = "";
    setIsLoading(false);
  };

  const handleImportFolder = async (e) => {
    setIsLoading(true);
    setLoadingText("Analyzing directory structure...");
    setLoadingProgress(1);

    await new Promise((resolve) => setTimeout(resolve, 10));

    const rawFiles = Array.from(e.target.files || []);
    const importedFiles = rawFiles.filter((f) => isTextFile(f.name));

    if (!importedFiles.length) {
      setIsLoading(false);
      return;
    }

    const newFoldersSet = new Set();
    const parsedFiles = [];
    const totalCount = importedFiles.length;

    for (let i = 0; i < totalCount; i++) {
      const file = importedFiles[i];
      const relativePath = file.webkitRelativePath || file.name;
      const pathParts = relativePath.split("/");

      if (pathParts.length > 1) {
        const folderPath = pathParts.slice(0, pathParts.length - 1).join("/");
        newFoldersSet.add(folderPath);
      }

      const content = await readFileAsync(file);
      const fileName = pathParts[pathParts.length - 1];
      const folderName = pathParts.length > 1 ? pathParts.slice(0, pathParts.length - 1).join("/") : "";

      const newFile = {
        id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        name: fileName,
        path: relativePath,
        folder: folderName,
        content,
        language: detectLanguage(fileName)
      };

      parsedFiles.push(newFile);

      if (socketRef.current) {
        socketRef.current.emit("file-created", { roomId, file: newFile });
      }

      if (i % 15 === 0 || i === totalCount - 1) {
        setLoadingProgress(Math.round(((i + 1) / totalCount) * 100));
        setLoadingText(`Reading files (${i + 1}/${totalCount})...`);
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    if (parsedFiles.length > 0) {
      setFolders(Array.from(newFoldersSet));
      setFiles(parsedFiles);
      setActiveFileId(parsedFiles[0].id);
      setStatus(`Loaded directory tree with ${parsedFiles.length} files.`);
    }

    e.target.value = "";
    setIsLoading(false);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const formatted = newFolderName.trim().replace(/\s+/g, "_");
    if (!folders.includes(formatted)) {
      setFolders((prev) => [...prev, formatted]);
      setStatus(`Folder '${formatted}' created`);
    }
    setNewFolderName("");
    setShowFolderModal(false);
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    const name = newFileName.trim();
    const detectedLang = detectLanguage(name);
    const targetFolder = selectedFolderForFile === "root" ? "" : selectedFolderForFile;

    const newFile = {
      id: Date.now().toString(),
      name,
      path: targetFolder ? `${targetFolder}/${name}` : name,
      folder: targetFolder,
      content: `// ${name}\n`,
      language: detectedLang
    };

    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setStatus(`Created file ${newFile.name}`);

    if (socketRef.current) {
      socketRef.current.emit("file-created", { roomId, file: newFile });
    }

    setNewFileName("");
    setShowFileModal(false);
  };

  const handleCodeChange = (newCode = "") => {
    console.log("EDITOR CHANGED", newCode);
    if (!activeFile) return;

    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.id === activeFile.id ? { ...f, content: newCode } : f))
    );

    if (socketRef.current) {
      console.log("SENDING CODE:", {
        roomId,
        filePath: activeFile.path,
        content: newCode
      });
      socketRef.current.emit("code-change", {
        roomId,
        filePath: activeFile.path,
        content: newCode
      });
    }
  };

  const deleteFile = (e, id) => {
    e.stopPropagation();
    if (files.length <= 1) {
      alert("At least one file must remain open.");
      return;
    }
    const filtered = files.filter((f) => f.id !== id);
    setFiles(filtered);

    if (socketRef.current) {
      socketRef.current.emit("file-deleted", { roomId, fileId: id });
    }

    if (activeFileId === id && filtered.length > 0) {
      setActiveFileId(filtered[0].id);
    }
  };

  const exportCurrentFile = useCallback(async () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatus(`Exported ${activeFile.name}`);
  }, [activeFile]);

  const runCodeOnBackend = async (targetFile = activeFile) => {
    if (!targetFile) return;

    if (targetFile.id !== activeFileId) {
      setActiveFileId(targetFile.id);
    }

    setIsRunning(true);
    setStatus(`Executing ${targetFile.name}...`);
    setOutput(`Running ${targetFile.name} process on server...`);

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");

      const response = await axios.post(
        `${API_URL}/api/run`,
        {
          language: targetFile.language,
          code: targetFile.content,
          filename: targetFile.name
        },
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
          timeout: 10000
        }
      );

      const isSuccess = response.data.success;
      const resOutput = isSuccess
        ? response.data.output || "Execution completed with no output."
        : response.data.error || "Compilation/Runtime Error";

      setOutput(resOutput);
      setTerminalOutput(
        (prev) => `${prev}\n--- [${isSuccess ? "SUCCESS" : "FAILED"}] ${targetFile.name} (${targetFile.language}) ---\n${resOutput}\n`
      );
      setStatus(isSuccess ? "Execution Complete" : "Execution Failed");

      if (socketRef.current) {
        socketRef.current.emit("execution-result", {
          roomId,
          fileId: targetFile.id,
          output: resOutput,
          isError: !isSuccess
        });
      }
    } catch (error) {
      let errText = "Backend execution server unreachable.";
      if (error.response?.data?.error) {
        errText = error.response.data.error;
      } else if (error.code === "ERR_NETWORK") {
        errText = `Network Error: Cannot connect to backend server at ${API_URL}.`;
      } else if (error.message) {
        errText = error.message;
      }

      setOutput(`Backend Execution Error:\n${errText}`);
      setTerminalOutput((prev) => `${prev}\n[SERVER ERROR] ${errText}\n`);
      setStatus("Server Unreachable");
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunFileClick = (e, file) => {
    e.stopPropagation();
    runCodeOnBackend(file);
  };

  return (
    <div className="syncspace-editor-root">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-card">
            <FaSpinner className="spinner-icon spinning" />
            <h3 className="loading-title">Syncing Workspace</h3>
            <p className="loading-subtitle">{loadingText}</p>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${loadingProgress}%` }}></div>
            </div>
            <span className="progress-percentage">{loadingProgress}%</span>
          </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleImportFiles} multiple style={{ display: "none" }} />
      <input type="file" ref={folderInputRef} onChange={handleImportFolder} webkitdirectory="true" directory="true" style={{ display: "none" }} />

      {/* ACTIVITY BAR */}
      <aside className="syncspace-activity-bar">
        <div className="brand-logo-mark" title="SyncSpace IDE">S</div>
        <nav className="activity-nav-top">
          <button className={`activity-btn ${activePanel === "explorer" ? "active" : ""}`} onClick={() => setActivePanel("explorer")} title="Explorer"><FaRegFileCode /></button>
          <button className={`activity-btn ${activePanel === "search" ? "active" : ""}`} onClick={() => setActivePanel("search")} title="Search"><FaSearch /></button>
          <button className={`activity-btn ${activePanel === "git" ? "active" : ""}`} onClick={() => setActivePanel("git")} title="Source Control"><FaCodeBranch /></button>
          <button className="activity-btn" onClick={() => runCodeOnBackend()} title="Run Active File"><FaPlay /></button>
        </nav>
        <div className="activity-nav-bottom">
          <button className="activity-btn" title="Notifications"><FaBell /></button>
          <button className="activity-btn" title="Settings"><FaCog /></button>
        </div>
      </aside>

      {/* SIDEBAR EXPLORER */}
      <aside className="syncspace-sidebar">
        {activePanel === "explorer" && (
          <div className="sidebar-container">
            <div className="sidebar-title-bar">
              <div className="title-left">
                <FaLayerGroup />
                <span>EXPLORER</span>
              </div>
              <div className="title-actions">
                <button onClick={() => setShowFileModal(true)} title="New File"><FaFileMedical /></button>
                <button onClick={() => setShowFolderModal(true)} title="New Folder"><FaFolderPlus /></button>
                <button onClick={() => fileInputRef.current.click()} title="Import Files"><FaFileUpload /></button>
                <button onClick={() => folderInputRef.current.click()} title="Open Local Directory"><FaFolderOpen /></button>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="section-label">WORKSPACE STRUCTURE</div>
              <div className="vscode-tree-root">
                <FolderTreeNode
                  node={fileTreeRoot}
                  activeFileId={activeFile?.id}
                  onSelectFile={(id) => setActiveFileId(id)}
                  onDeleteFile={deleteFile}
                  onRunFile={handleRunFileClick}
                  isRunning={isRunning}
                />
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="syncspace-main">
        <header className="workspace-toolbar">
          <div className="tab-strip">
            {files.map((file) => (
              <div
                key={file.id}
                className={`tab-item ${file.id === activeFile?.id ? "active" : ""}`}
                onClick={() => setActiveFileId(file.id)}
              >
                <FaRegFileCode className="tab-file-icon" />
                <span className="tab-label">{file.name}</span>
                <button
                  className="tab-run-btn"
                  onClick={(e) => handleRunFileClick(e, file)}
                  disabled={isRunning}
                  title={`Run ${file.name}`}
                >
                  <FaPlay size={9} />
                </button>
                {files.length > 1 && (
                  <button className="tab-close" onClick={(e) => deleteFile(e, file.id)}>×</button>
                )}
              </div>
            ))}
          </div>

          <div className="toolbar-controls">
            <button className="btn-primary" onClick={() => runCodeOnBackend()} disabled={isRunning || !activeFile}>
              <FaPlay /> {isRunning ? "Running..." : "Run Active"}
            </button>
            <button className="btn-secondary" onClick={exportCurrentFile} disabled={!activeFile} title="Export current file">
              <FaDownload /> Export
            </button>
          </div>
        </header>

        <div className="editor-workspace-split">
          <div className="editor-pane">
            <MonacoEditor
              height="100%"
              theme="vs-dark"
              language={activeFile ? activeFile.language : "plaintext"}
              value={activeFile ? activeFile.content : ""}
              onMount={() => {
                console.log("MONACO LOADED");
              }}
              onChange={handleCodeChange}
              options={{
                readOnly: false,
                fontSize: 13.5,
                fontFamily: "'Fira Code', 'Consolas', monospace",
                minimap: { enabled: true },
                automaticLayout: true,
                padding: { top: 12 },
                smoothScrolling: true,
                cursorBlinking: "smooth"
              }}
            />
          </div>

          <div className="bottom-pane">
            <div className="panel-box">
              <div className="panel-box-header">
                <span className="panel-box-title"><FaConsoleIcon /> CONSOLE OUTPUT</span>
                <button className="panel-box-action" onClick={() => setOutput("")}>Clear</button>
              </div>
              <div className="panel-box-content">
                <pre>{output || "Click 'Run' on any file to execute code."}</pre>
              </div>
            </div>

            <div className="panel-box">
              <div className="panel-box-header">
                <span className="panel-box-title"><FaTerminal /> EXECUTION HISTORY</span>
                <button className="panel-box-action" onClick={() => setTerminalOutput("")}>
                  <FaTrash />
                </button>
              </div>
              <div className="panel-box-content terminal-display">
                <pre>{terminalOutput}</pre>
              </div>
            </div>
          </div>
        </div>

        <footer className="workspace-footer">
          <div className="footer-item"><FaShieldAlt /> Backend ({API_URL})</div>
          <div className="footer-item highlight">{activeFile?.language ? activeFile.language.toUpperCase() : "PLAINTEXT"}</div>
          <div className="footer-item status-text">{status}</div>
        </footer>
      </main>

      {/* CREATE FOLDER MODAL */}
      {showFolderModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Create Folder</h3>
            <input
              type="text"
              placeholder="Folder Name (e.g. src)"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="modal-input"
            />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowFolderModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateFolder}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE FILE MODAL */}
      {showFileModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Create File</h3>
            <input
              type="text"
              placeholder="File Name (e.g. App.java, test.py)"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="modal-input"
            />
            <select
              value={selectedFolderForFile}
              onChange={(e) => setSelectedFolderForFile(e.target.value)}
              className="modal-select"
            >
              <option value="root">Root Directory</option>
              {folders.map((f) => (
                <option key={f} value={f}>/{f}</option>
              ))}
            </select>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowFileModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateFile}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}