import React, { useEffect, useState, useRef, useCallback } from "react";
import MonacoEditor, { loader } from "@monaco-editor/react";
import {
  FaRegFileCode,
  FaSearch,
  FaCodeBranch,
  FaPlay,
  FaPuzzlePiece,
  FaCog,
  FaBell,
  FaTerminal,
  FaTrash,
  FaChevronRight,
  FaFileMedical,
  FaFolderOpen,
  FaFileUpload,
  FaDownload,
  FaShieldAlt,
  FaLayerGroup,
  FaFolderPlus,
  FaFolder,
  FaTimes,
  FaTerminal as FaConsoleIcon
} from "react-icons/fa";
import axios from "axios";
import "./CodeEditorPage.css";

loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs"
  }
});

export default function CodeEditorPage() {
  /* ================================================
                      STATES
  ================================================ */
  const [activePanel, setActivePanel] = useState("explorer");

  const [files, setFiles] = useState([
    {
      id: "1",
      name: "main.js",
      path: "main.js",
      folder: "src",
      content: '// Welcome to SyncSpace IDE\nconsole.log("SyncSpace Engine Initialized.");\n\nconst greet = (name) => `Hello, ${name}!`;\nconsole.log(greet("Developer"));',
      language: "javascript"
    },
    {
      id: "2",
      name: "interactive.py",
      path: "interactive.py",
      folder: "src",
      content: '# Standard Python input() - Works in Terminal automatically!\nname = input("Enter your name: ")\nprint(f"Hello, {name}!")\n\nage = int(input("Enter your age: "))\nprint(f"Next year you will be {age + 1} years old.")',
      language: "python"
    }
  ]);

  const [folders, setFolders] = useState(["src", "public"]);

  const [activeFileId, setActiveFileId] = useState("2");
  const [code, setCode] = useState(files[1].content);
  const [language, setLanguage] = useState(files[1].language);

  const [gitCount, setGitCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  const [output, setOutput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("⚡ SyncSpace Execution Environment Ready\nType CLI commands or click 'Run' to execute scripts...\n");
  const [command, setCommand] = useState("");
  const [status, setStatus] = useState("System Ready");
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);

  // Terminal Input Bridge Resolver
  const inputResolverRef = useRef(null);

  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [selectedFolderForFile, setSelectedFolderForFile] = useState("root");

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const terminalRef = useRef(null);
  const pyodideRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const api = axios.create({ baseURL: API_URL });

  api.interceptors.request.use(
    (config) => {
      try {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch (err) {}
      return config;
    },
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const resGit = await api.get("/api/activity/git");
        if (resGit?.data) setGitCount(resGit.data.changedFiles || 0);
      } catch (e) {
        setGitCount(0);
      }

      try {
        const resNotify = await api.get("/api/activity/notifications");
        if (resNotify?.data) setNotificationCount(resNotify.data.count || 0);
      } catch (e) {
        setNotificationCount(0);
      }
    };
    fetchActivity();
  }, []);

  const detectLanguage = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "js": case "jsx": return "javascript";
      case "ts": case "tsx": return "typescript";
      case "py": return "python";
      case "html": case "htm": return "html";
      case "css": return "css";
      case "json": return "json";
      case "cpp": case "c": case "cc": case "hpp": return "cpp";
      case "java": return "java";
      case "php": return "php";
      case "sql": return "sql";
      case "md": return "markdown";
      default: return "plaintext";
    }
  };

  /* ================================================
     FAST NON-BLOCKING FILE & FOLDER IMPORT
  ================================================ */
  const readFileAsync = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result || "");
      reader.onerror = () => resolve("");
      reader.readAsText(file);
    });
  };

  const handleImportFiles = async (e) => {
    const importedFiles = Array.from(e.target.files);
    if (!importedFiles.length) return;

    setStatus(`Importing ${importedFiles.length} file(s)...`);

    // Process files in non-blocking chunk promises
    const newFileObjects = await Promise.all(
      importedFiles.map(async (file) => {
        const content = await readFileAsync(file);
        return {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          path: file.name,
          folder: "",
          content,
          language: detectLanguage(file.name)
        };
      })
    );

    setFiles((prev) => [...prev, ...newFileObjects]);
    if (newFileObjects.length > 0) selectFile(newFileObjects[0]);
    setStatus(`Imported ${newFileObjects.length} file(s) instantly.`);
    e.target.value = null;
  };

  const handleImportFolder = async (e) => {
    const importedFiles = Array.from(e.target.files);
    if (!importedFiles.length) return;

    setStatus(`Processing folder structure (${importedFiles.length} files)...`);
    const newFoldersSet = new Set(folders);

    const parsedFiles = await Promise.all(
      importedFiles.map(async (file) => {
        const relativePath = file.webkitRelativePath || file.name;
        const pathParts = relativePath.split("/");

        if (pathParts.length > 1) {
          const folderPath = pathParts.slice(0, pathParts.length - 1).join("/");
          newFoldersSet.add(folderPath);
        }

        const content = await readFileAsync(file);
        const fileName = pathParts[pathParts.length - 1];
        const folderName = pathParts.length > 1 ? pathParts.slice(0, pathParts.length - 1).join("/") : "";

        return {
          id: `${Date.now()}-${Math.random()}`,
          name: fileName,
          path: relativePath,
          folder: folderName,
          content,
          language: detectLanguage(fileName)
        };
      })
    );

    setFolders(Array.from(newFoldersSet));
    setFiles((prev) => [...prev, ...parsedFiles]);
    setStatus(`Folder imported successfully (${parsedFiles.length} files).`);
    e.target.value = null;
  };

  /* ================================================
            FOLDER & FILE MANAGEMENT
  ================================================ */
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
      content: `# ${name}\n`,
      language: detectedLang
    };

    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setCode(newFile.content);
    setLanguage(detectedLang);
    setStatus(`Created ${newFile.name}`);
    setNewFileName("");
    setShowFileModal(false);
  };

  const selectFile = (file) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content: code } : f))
    );
    setActiveFileId(file.id);
    setCode(file.content);
    setLanguage(detectLanguage(file.name));
    setStatus(`Active: ${file.name}`);
  };

  const deleteFile = (e, id) => {
    e.stopPropagation();
    if (files.length <= 1) {
      alert("At least one file must remain active.");
      return;
    }
    const filtered = files.filter((f) => f.id !== id);
    setFiles(filtered);
    if (activeFileId === id) selectFile(filtered[0]);
  };

  const handleCodeChange = (newCode) => {
    const value = newCode || "";
    setCode(value);
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content: value } : f))
    );
  };

  const saveFileToCustomLocation = useCallback(async () => {
    const activeFile = files.find((f) => f.id === activeFileId);
    if (!activeFile) return;

    if ("showSaveFilePicker" in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: activeFile.name,
          types: [
            {
              description: "Source Code File",
              accept: { "text/plain": [`.${activeFile.name.split(".").pop()}`] }
            }
          ]
        });
        const writable = await handle.createWritable();
        await writable.write(code);
        await writable.close();
        setStatus(`Saved to ${handle.name}`);
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }

    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatus(`Exported ${activeFile.name}`);
  }, [files, activeFileId, code]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveFileToCustomLocation();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveFileToCustomLocation]);

  /* ================================================
      PYTHON TERMINAL ENGINE (AUTOMATIC ASYNC INPUT)
  ================================================ */
  useEffect(() => {
    if (!document.getElementById("pyodide-script") && !window.loadPyodide) {
      const script = document.createElement("script");
      script.id = "pyodide-script";
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const loadPyodideEngine = async () => {
    if (pyodideRef.current) return pyodideRef.current;

    let attempts = 0;
    while (!window.loadPyodide && attempts < 15) {
      await new Promise((res) => setTimeout(res, 300));
      attempts++;
    }

    if (window.loadPyodide) {
      setIsPyodideLoading(true);
      setStatus("Initializing WebAssembly Python Engine...");
      pyodideRef.current = await window.loadPyodide();

      // Terminal bridge callback
      window.__getTerminalInput = (promptText) => {
        return new Promise((resolve) => {
          setTerminalOutput((prev) => `${prev}${promptText}`);
          if (terminalRef.current) terminalRef.current.focus();
          inputResolverRef.current = resolve;
        });
      };

      setIsPyodideLoading(false);
      setStatus("Python Engine Ready");
      return pyodideRef.current;
    }
    return null;
  };

  const handleTerminalSubmit = () => {
    if (!command.trim() && !inputResolverRef.current) return;

    const currentVal = command;
    setCommand("");

    // Resolve active Python input() request from terminal
    if (inputResolverRef.current) {
      setTerminalOutput((prev) => `${prev}${currentVal}\n`);
      const resolve = inputResolverRef.current;
      inputResolverRef.current = null;
      resolve(currentVal);
      return;
    }

    setTerminalOutput((prev) => `${prev}\n$ ${currentVal}\n[Command registered]`);
  };

  const runCode = async () => {
    setStatus("Running Pipeline...");
    setOutput("");

    // 1. JavaScript Engine
    if (language === "javascript") {
      const logs = [];
      const customConsole = {
        log: (...args) => logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : a)).join(" ")),
        error: (...args) => logs.push("[Error] " + args.join(" ")),
        warn: (...args) => logs.push("[Warn] " + args.join(" "))
      };

      try {
        const runFn = new Function("console", code);
        runFn(customConsole);
        setOutput(logs.join("\n") || "✔ Executed successfully.");
        setStatus("Execution Succeeded");
      } catch (err) {
        setOutput(err.toString());
        setStatus("Execution Error");
      }
      return;
    }

    // 2. Python Engine (Transparently converts input() -> await input())
    if (language === "python") {
      try {
        const pyodide = await loadPyodideEngine();
        if (!pyodide) {
          setOutput("Python engine loading... Please click Run again in a moment.");
          return;
        }

        setTerminalOutput((prev) => `${prev}\n--- Executing Python Script ---\n`);

        await pyodide.runPythonAsync(`
import sys
import js

async def custom_input(prompt=""):
    result = await js.__getTerminalInput(str(prompt))
    return str(result)

__builtins__.input = custom_input
        `);

        pyodide.runPython(`
import io
sys.stdout = io.StringIO()
        `);

        // Transform synchronous input(...) calls to await input(...)
        const transformedCode = code.replace(/(?<!await\s+)input\s*\(/g, "await input(");

        await pyodide.runPythonAsync(transformedCode);

        const stdout = pyodide.runPython("sys.stdout.getvalue()");
        setOutput(stdout || "✔ Python execution complete.");
        setTerminalOutput((prev) => `${prev}--- Execution Finished ---\n`);
        setStatus("Execution Succeeded");
      } catch (err) {
        setOutput(err.toString());
        setTerminalOutput((prev) => `${prev}\n[Python Exception] ${err.toString()}\n`);
        setStatus("Execution Error");
      }
      return;
    }

    // 3. Fallback to Server Runner
    try {
      const response = await api.post("/api/run", { language, code });
      setOutput(response.data.output || response.data.message || "Executed on backend server.");
      setStatus("Backend Executed");
    } catch (err) {
      setOutput(`Server Output: ${err.response?.data?.error || err.message}`);
      setStatus("Execution Failed");
    }
  };

  return (
    <div className="syncspace-editor-root">
      <input type="file" ref={fileInputRef} onChange={handleImportFiles} multiple style={{ display: "none" }} />
      <input type="file" ref={folderInputRef} onChange={handleImportFolder} webkitdirectory="true" directory="true" style={{ display: "none" }} />

      {/* ACTIVITY BAR */}
      <aside className="syncspace-activity-bar">
        <div className="activity-brand" title="SyncSpace IDE">
          <div className="brand-logo-mark">S</div>
        </div>

        <nav className="activity-nav-top">
          <button
            className={`activity-btn ${activePanel === "explorer" ? "active" : ""}`}
            onClick={() => setActivePanel("explorer")}
            title="Explorer"
          >
            <FaRegFileCode />
          </button>
          <button
            className={`activity-btn ${activePanel === "search" ? "active" : ""}`}
            onClick={() => setActivePanel("search")}
            title="Search"
          >
            <FaSearch />
          </button>
          <button
            className={`activity-btn ${activePanel === "git" ? "active" : ""}`}
            onClick={() => setActivePanel("git")}
            title="Source Control"
          >
            <FaCodeBranch />
            {gitCount > 0 && <span className="activity-badge">{gitCount}</span>}
          </button>
          <button
            className={`activity-btn ${activePanel === "run" ? "active" : ""}`}
            onClick={() => setActivePanel("run")}
            title="Run & Debug"
          >
            <FaPlay />
          </button>
        </nav>

        <div className="activity-nav-bottom">
          <button
            className={`activity-btn ${activePanel === "notifications" ? "active" : ""}`}
            onClick={() => setActivePanel("notifications")}
            title="Notifications"
          >
            <FaBell />
            {notificationCount > 0 && <span className="activity-badge alert">{notificationCount}</span>}
          </button>
          <button
            className={`activity-btn ${activePanel === "settings" ? "active" : ""}`}
            onClick={() => setActivePanel("settings")}
            title="Settings"
          >
            <FaCog />
          </button>
        </div>
      </aside>

      {/* SIDEBAR PANEL */}
      <aside className="syncspace-sidebar">
        {activePanel === "explorer" && (
          <div className="sidebar-container">
            <div className="sidebar-title-bar">
              <div className="title-left">
                <FaLayerGroup className="sidebar-icon" />
                <span>EXPLORER</span>
              </div>
              <div className="title-actions">
                <button onClick={() => setShowFileModal(true)} title="New File"><FaFileMedical /></button>
                <button onClick={() => setShowFolderModal(true)} title="New Folder"><FaFolderPlus /></button>
                <button onClick={() => fileInputRef.current.click()} title="Import Files"><FaFileUpload /></button>
                <button onClick={() => folderInputRef.current.click()} title="Import Local Directory"><FaFolderOpen /></button>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="section-label">WORKSPACE STRUCTURE</div>
              
              <div className="file-tree">
                {folders.map((folder) => (
                  <div key={folder} className="folder-node">
                    <div className="folder-row">
                      <FaFolder className="folder-icon" />
                      <span className="folder-name">{folder}</span>
                    </div>
                    <div className="folder-children">
                      {files
                        .filter((f) => f.folder === folder)
                        .map((file) => (
                          <div
                            key={file.id}
                            className={`file-row ${file.id === activeFileId ? "active" : ""}`}
                            onClick={() => selectFile(file)}
                          >
                            <span className="file-row-main">
                              <span className="file-ext-tag">{file.name.split(".").pop()}</span>
                              <span className="file-row-name">{file.name}</span>
                            </span>
                            <button
                              className="file-remove-btn"
                              onClick={(e) => deleteFile(e, file.id)}
                              title="Delete file"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}

                <div className="root-files">
                  {files
                    .filter((f) => !f.folder)
                    .map((file) => (
                      <div
                        key={file.id}
                        className={`file-row ${file.id === activeFileId ? "active" : ""}`}
                        onClick={() => selectFile(file)}
                      >
                        <span className="file-row-main">
                          <span className="file-ext-tag">{file.name.split(".").pop()}</span>
                          <span className="file-row-name">{file.name}</span>
                        </span>
                        <button
                          className="file-remove-btn"
                          onClick={(e) => deleteFile(e, file.id)}
                          title="Delete file"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activePanel === "search" && (
          <div className="sidebar-container">
            <div className="sidebar-title-bar"><span>SEARCH</span></div>
            <div className="sidebar-padding">
              <input placeholder="Search keywords..." className="sidebar-input" />
            </div>
          </div>
        )}
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="syncspace-main">
        {/* WORKSPACE TOOLBAR */}
        <header className="workspace-toolbar">
          <div className="tab-strip">
            {files.map((file) => (
              <div
                key={file.id}
                className={`tab-item ${file.id === activeFileId ? "active" : ""}`}
                onClick={() => selectFile(file)}
              >
                <FaRegFileCode className="tab-file-icon" />
                <span className="tab-label">{file.name}</span>
                {files.length > 1 && (
                  <button className="tab-close" onClick={(e) => deleteFile(e, file.id)}>
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="toolbar-controls">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="toolbar-select"
            >
              <option value="javascript">JavaScript (.js)</option>
              <option value="python">Python (.py)</option>
              <option value="typescript">TypeScript (.ts)</option>
              <option value="html">HTML (.html)</option>
              <option value="css">CSS (.css)</option>
              <option value="json">JSON (.json)</option>
              <option value="cpp">C++ (.cpp)</option>
              <option value="java">Java (.java)</option>
            </select>

            <button
              className="btn-primary"
              onClick={runCode}
              disabled={isPyodideLoading}
            >
              <FaPlay /> {isPyodideLoading ? "Loading..." : "Run"}
            </button>

            <button
              className="btn-secondary"
              onClick={saveFileToCustomLocation}
              title="Save to local device"
            >
              <FaDownload /> Save As
            </button>
          </div>
        </header>

        {/* WORKSPACE PANELS SPLIT */}
        <div className="editor-workspace-split">
          <div className="editor-pane">
            <MonacoEditor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={handleCodeChange}
              options={{
                fontSize: 13.5,
                fontFamily: "'Fira Code', 'Consolas', monospace",
                minimap: { enabled: true },
                automaticLayout: true,
                padding: { top: 12 },
                smoothScrolling: true,
                cursorBlinking: "smooth",
                renderLineHighlight: "all"
              }}
            />
          </div>

          <div className="bottom-pane">
            <div className="panel-box">
              <div className="panel-box-header">
                <span className="panel-box-title"><FaConsoleIcon /> CONSOLE OUTPUT</span>
                <button className="panel-box-action" onClick={() => setOutput("")}>
                  Clear
                </button>
              </div>
              <div className="panel-box-content">
                <pre>{output || "Output ready. Click 'Run' to execute."}</pre>
              </div>
            </div>

            <div className="panel-box">
              <div className="panel-box-header">
                <span className="panel-box-title"><FaTerminal /> TERMINAL</span>
                <button
                  className="panel-box-action"
                  onClick={() => setTerminalOutput("Terminal Cleared.\n")}
                >
                  <FaTrash />
                </button>
              </div>
              <div className="panel-box-content terminal-display">
                <pre>{terminalOutput}</pre>
                <div className="terminal-input-line">
                  <FaChevronRight className="terminal-arrow" />
                  <input
                    ref={terminalRef}
                    value={command}
                    placeholder="Type CLI response here..."
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleTerminalSubmit();
                    }}
                    className="terminal-field"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATUS FOOTER */}
        <footer className="workspace-footer">
          <div className="footer-item"><FaShieldAlt /> System Active</div>
          <div className="footer-item">UTF-8</div>
          <div className="footer-item highlight">{language.toUpperCase()}</div>
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
              placeholder="Folder Name (e.g., utils)"
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
              placeholder="File Name (e.g., app.py, script.js)"
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