import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";
import "../css/RoomWorkspace.css";

import { 
  Users, Code2, Palette, LogOut, 
  Sparkles, Activity, Wifi, Trash2, Copy, Check, Link2, Monitor, ShieldCheck,
  MessageSquare, FolderUp, FileCode, Send, Download, Paperclip, FileText, Zap
} from "lucide-react";

const SOCKET_URL = import.meta.env?.VITE_SOCKET_URL || "http://localhost:5000";

export default function RoomWorkspace() {
  const { roomId } = useParams();

  // User & Room State
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active Tab State: 'editor' | 'whiteboard' | 'chat' | 'files'
  const [activeTab, setActiveTab] = useState("editor"); 
  const [activityFeed, setActivityFeed] = useState([]);
  
  // VS Code Editor State
  const [code, setCode] = useState(
    "// Welcome to SyncSpace Pro Real-Time Workspace\n// Collaborative socket sync enabled...\n\nfunction initializeEngine() {\n  console.log('SyncEngine initialized dynamically');\n}\n\ninitializeEngine();"
  );
  const [isPeerTyping, setIsPeerTyping] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Chat Interface State
  const [messages, setMessages] = useState([
    { id: 1, sender: "System", text: "Encrypted connection established in #" + roomId, time: "10:00 AM", isSystem: true },
    { id: 2, sender: "Alex Dev", text: "Hey! Ready to work on the design architecture.", time: "10:01 AM", isSystem: false },
  ]);
  const [chatInput, setChatInput] = useState("");

  // File Vault State
  const [sharedFiles] = useState([
    { id: 1, name: "architecture-v2.png", size: "2.4 MB", sender: "Alex Dev", time: "10:05 AM", type: "image" },
    { id: 2, name: "database-schema.sql", size: "14 KB", sender: "Jordan Dev", time: "10:12 AM", type: "code" },
  ]);

  // Canvas State
  const [brushColor, setBrushColor] = useState("#3b82f6");
  const [lineWidth, setLineWidth] = useState(3);

  // Refs
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  // Toast Helper
  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    const timer = setTimeout(() => setToastMsg(""), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Activity Log Helper
  const addActivityLog = useCallback((text, type) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setActivityFeed((prev) => [
      { id: `${Date.now()}-${Math.random()}`, text, type, time: timestamp },
      ...prev.slice(0, 24),
    ]);
  }, []);

  // Canvas Handlers
  const drawOnCanvas = useCallback((x, y, type, color = brushColor, width = lineWidth) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;

    if (type === "start") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (type === "draw") {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }, [brushColor, lineWidth]);

  const clearCanvasLocally = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Socket Real-Time Setup
  useEffect(() => {
    const storedUser = localStorage.getItem("syncspace_user") || `User_${Math.floor(1000 + Math.random() * 9000)}`;
    setUsername(storedUser);

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.emit("join-room", { roomId, username: storedUser });

    socket.on("participants-update", ({ participants: updatedList }) => {
      setParticipants(updatedList);
    });

    socket.on("code-update", (updatedCode) => setCode(updatedCode));

    socket.on("code-activity", ({ user }) => {
      if (user !== storedUser) {
        setIsPeerTyping(`${user} is editing...`);
        const timer = setTimeout(() => setIsPeerTyping(""), 2000);
        return () => clearTimeout(timer);
      }
    });

    socket.on("canvas-draw", (drawData) => {
      drawOnCanvas(drawData.x, drawData.y, drawData.type, drawData.color, drawData.width);
    });

    socket.on("canvas-clear", () => {
      clearCanvasLocally();
      addActivityLog("Canvas cleared by peer", "canvas");
    });

    return () => {
      socket.emit("leave-room", { roomId });
      socket.off("participants-update");
      socket.off("code-update");
      socket.off("code-activity");
      socket.off("canvas-draw");
      socket.off("canvas-clear");
      socket.disconnect();
    };
  }, [roomId, addActivityLog, drawOnCanvas, clearCanvasLocally]);

  useEffect(() => {
    if (activeTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  const handleCopyAccessLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast("Shareable link copied to clipboard");
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (socketRef.current) {
      socketRef.current.emit("code-change", { roomId, code: newCode });
      socketRef.current.emit("code-typing", { roomId, user: username });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: username,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSystem: false,
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: (e.clientX - rect.left) * (canvas.width / rect.width),
      offsetY: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e) => {
    isDrawing.current = true;
    const { offsetX, offsetY } = getCanvasCoordinates(e);
    drawOnCanvas(offsetX, offsetY, "start", brushColor, lineWidth);
    socketRef.current?.emit("canvas-draw", { 
      roomId, 
      drawData: { x: offsetX, y: offsetY, type: "start", color: brushColor, width: lineWidth } 
    });
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const { offsetX, offsetY } = getCanvasCoordinates(e);
    drawOnCanvas(offsetX, offsetY, "draw", brushColor, lineWidth);
    socketRef.current?.emit("canvas-draw", { 
      roomId, 
      drawData: { x: offsetX, y: offsetY, type: "draw", color: brushColor, width: lineWidth } 
    });
  };

  const stopDrawing = () => { isDrawing.current = false; };

  const handleClearCanvas = () => {
    clearCanvasLocally();
    socketRef.current?.emit("canvas-clear", { roomId });
  };

  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="premium-workspace">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="premium-toast">
          <Sparkles size={16} className="text-cyan" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <aside className="premium-sidebar">
        <div className="sidebar-top">
          
          {/* Header Branding */}
          <div className="brand-header">
            <div className="brand-logo">
              <Zap size={18} />
            </div>
            <div className="brand-title">
              <h2>SyncSpace</h2>
              <span className="badge-pro"><ShieldCheck size={10} /> ENTERPRISE</span>
            </div>
          </div>

          {/* Access Link Box */}
          <div className="share-box">
            <div className="share-header">
              <Link2 size={12} className="text-cyan" />
              <span>ROOM ACCESS KEY</span>
            </div>
            <button onClick={handleCopyAccessLink} className="share-btn">
              <span className="room-id-tag">#{roomId}</span>
              {copiedLink ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
            </button>
          </div>

          {/* ACTIVE MEMBERS ROSTER */}
          <div className="roster-section">
            <div className="roster-header">
              <Users size={13} className="text-cyan" />
              <span>LIVE ACTIVE MEMBERS ({participants.length})</span>
            </div>

            <div className="roster-list">
              {participants.length === 0 ? (
                <p className="empty-text">Connecting to room channel...</p>
              ) : (
                participants.map((member) => (
                  <div key={member.socketId} className="roster-card">
                    <div className="roster-info">
                      <div className="avatar">
                        {member.username ? member.username.charAt(0).toUpperCase() : "U"}
                      </div>
                      <span className="username">
                        {member.username}
                        {member.username === username && <span className="you-tag">(You)</span>}
                      </span>
                    </div>
                    <span className="status-dot"></span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* LIVE WORKSPACE LOGS */}
          <div className="activity-section">
            <div className="activity-header">
              <Activity size={13} className="text-indigo" />
              <span>REAL-TIME AUDIT LOG</span>
            </div>
            <div className="activity-feed">
              {activityFeed.length === 0 ? (
                <p className="empty-text">Listening for workspace actions...</p>
              ) : (
                activityFeed.map((log) => (
                  <div key={log.id} className="feed-item">
                    <div className="feed-meta">
                      <span className="feed-type">{log.type}</span>
                      <span className="feed-time">{log.time}</span>
                    </div>
                    <span className="feed-text">{log.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Exit Workspace */}
        <div className="sidebar-bottom">
          <Link to="/roomlanding" className="exit-btn">
            <LogOut size={14} /> Exit Workspace
          </Link>
        </div>
      </aside>

      {/* CENTER WORKSPACE */}
      <main className="premium-main">
        
        {/* Header Navigation Bar */}
        <header className="workspace-header">
          <div className="nav-tabs">
            <button
              onClick={() => setActiveTab("editor")}
              className={`nav-btn ${activeTab === "editor" ? "active" : ""}`}
            >
              <Code2 size={14} /> IDE Editor
            </button>

            <button
              onClick={() => setActiveTab("whiteboard")}
              className={`nav-btn ${activeTab === "whiteboard" ? "active" : ""}`}
            >
              <Palette size={14} /> Whiteboard
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`nav-btn ${activeTab === "chat" ? "active" : ""}`}
            >
              <MessageSquare size={14} /> Live Chat
            </button>

            <button
              onClick={() => setActiveTab("files")}
              className={`nav-btn ${activeTab === "files" ? "active" : ""}`}
            >
              <FolderUp size={14} /> File Vault
            </button>
          </div>

          {/* Peer Activity Indicator */}
          <div className="header-status">
            {isPeerTyping && (
              <span className="typing-indicator">
                <Monitor size={12} /> {isPeerTyping}
              </span>
            )}
            <div className="sync-badge">
              <Wifi size={13} className="pulse-icon" />
              <span>LIVE SOCKET</span>
            </div>
          </div>
        </header>

        {/* Dynamic Main Content Panel */}
        <div className="workspace-stage">
          
          {/* TAB 1: VS Code Dark Theme Editor */}
          {activeTab === "editor" && (
            <div className="vscode-editor">
              <div className="editor-tab-bar">
                <div className="active-tab-file">
                  <FileCode size={14} className="text-cyan" />
                  <span>index.js</span>
                </div>
                <span className="lang-tag">JavaScript ES6</span>
              </div>

              <div className="editor-body">
                <div className="line-numbers">
                  {lineNumbers.map((num) => (
                    <span key={num}>{num}</span>
                  ))}
                </div>

                <textarea
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="// Type code here..."
                  className="code-input"
                  spellCheck="false"
                />
              </div>

              <div className="editor-statusbar">
                <div className="status-left">
                  <span>Ln {lineCount}, Col 1</span>
                  <span>UTF-8</span>
                </div>
                <span>SyncSpace Engine v2.4</span>
              </div>
            </div>
          )}

          {/* TAB 2: Canvas Whiteboard */}
          {activeTab === "whiteboard" && (
            <div className="whiteboard-container">
              <div className="canvas-toolbar">
                <div className="toolbar-group">
                  <span className="tool-label">BRUSH COLOR</span>
                  {["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#ffffff"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      className={`color-swatch ${brushColor === color ? "selected" : ""}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="divider" />

                <div className="toolbar-group">
                  <span className="tool-label">SIZE</span>
                  {[2, 4, 8].map((size) => (
                    <button
                      key={size}
                      onClick={() => setLineWidth(size)}
                      className={`size-btn ${lineWidth === size ? "active" : ""}`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>

                <div className="divider" />

                <button onClick={handleClearCanvas} className="clear-btn">
                  <Trash2 size={13} /> Clear Board
                </button>
              </div>

              <canvas
                ref={canvasRef}
                width={1200}
                height={800}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="canvas-surface"
              />
            </div>
          )}

          {/* TAB 3: Real-Time Chat Panel */}
          {activeTab === "chat" && (
            <div className="chat-container">
              <div className="chat-header">
                <h3><MessageSquare size={16} className="text-cyan" /> Secure Room Channel</h3>
                <span>Socket Synced</span>
              </div>

              <div className="chat-messages">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-wrapper ${
                      msg.isSystem ? "system" : msg.sender === username ? "outgoing" : "incoming"
                    }`}
                  >
                    {msg.isSystem ? (
                      <span className="system-pill">{msg.text}</span>
                    ) : (
                      <div className="chat-bubble">
                        <div className="bubble-meta">
                          <span className="sender">{msg.sender}</span>
                          <span className="time">{msg.time}</span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <input
                  type="text"
                  placeholder="Send a message to room members..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="send-btn">
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: File Sharing Panel */}
          {activeTab === "files" && (
            <div className="files-container">
              <div className="vault-header">
                <h3><FolderUp size={18} className="text-cyan" /> Room File Vault</h3>
                <p>Upload and distribute assets across room participants.</p>
              </div>

              <div className="dropzone">
                <Paperclip size={24} className="text-cyan mb-2" />
                <p>Click to browse or drop project assets here</p>
                <span>Supports source code, design mockups & documentation up to 50MB</span>
              </div>

              <div className="file-list-section">
                <h4>ACTIVE VAULT FILES ({sharedFiles.length})</h4>
                <div className="file-grid">
                  {sharedFiles.map((file) => (
                    <div key={file.id} className="file-card">
                      <div className="file-icon">
                        {file.type === "code" ? <FileCode size={18} /> : <FileText size={18} />}
                      </div>
                      <div className="file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-meta">{file.size} • {file.sender}</span>
                      </div>
                      <button className="download-btn">
                        <Download size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}