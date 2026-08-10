import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "../css/RoomWorkspace.css";

// Components & Page Imports
import Whiteboard from "../components/Whiteboard/Whiteboard";
import CodeEditorPage from "../pages/CodeEditorPage";

import { 
  Users, Code2, Palette, LogOut, 
  Sparkles, Activity, Wifi, Copy, Check, Link2, Monitor, ShieldCheck,
  MessageSquare, FolderUp, FileCode, Send, Download, Paperclip, FileText, Zap,
  Crown, Clock, Hash
} from "lucide-react";

const SOCKET_URL = import.meta.env?.VITE_SOCKET_URL || "http://localhost:5000";

export default function RoomWorkspace() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Active User & Room Metadata State
  const [username, setUsername] = useState("");
  const [roomDetails, setRoomDetails] = useState({
    roomName: `Room #${roomId}`,
    createdBy: "Loading...",
    createdAt: null,
  });
  const [participants, setParticipants] = useState([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active Tab State: 'editor' | 'whiteboard' | 'chat' | 'files'
  const [activeTab, setActiveTab] = useState("editor"); 
  const [activityFeed, setActivityFeed] = useState([]);

  // Peer & Activity Tracking State
  const [isPeerTyping, setIsPeerTyping] = useState("");
  const [lastDrawUser, setLastDrawUser] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Chat Interface State
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // File Vault State
  const [sharedFiles, setSharedFiles] = useState([]);

  // Refs
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const drawTimerRef = useRef(null);
  const lastLogTimeRef = useRef(0);

  // Toast Helper
  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    const timer = setTimeout(() => setToastMsg(""), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Activity Log Helper with 2-second rate-limiting for continuous draw strokes
  const addActivityLog = useCallback((text, type) => {
    const now = Date.now();
    if (type === "whiteboard" && now - lastLogTimeRef.current < 2000) {
      return; // Throttle repetitive draw logs
    }
    if (type === "whiteboard") {
      lastLogTimeRef.current = now;
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setActivityFeed((prev) => [
      { id: `${Date.now()}-${Math.random()}`, text, type, time: timestamp },
      ...prev.slice(0, 24),
    ]);
  }, []);

  // ----------------------------------------------------
  // BROWSER BACK BUTTON & UNLOAD PROTECTION (NATIVE POPUP)
  // ----------------------------------------------------
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave the workspace?";
      return e.returnValue;
    };

    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      const confirmLeave = window.confirm(
        "Are you sure you want to go back? You will be disconnected from the active workspace."
      );
      if (confirmLeave) {
        if (socketRef.current) {
          socketRef.current.emit("leave-room", { roomId, username });
          socketRef.current.disconnect();
        }
        navigate("/roomlanding");
      } else {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [roomId, username, navigate]);

  // ----------------------------------------------------
  // REAL-TIME SOCKET CONNECTION & ROSTER SYNC
  // ----------------------------------------------------
  useEffect(() => {
    let storedUser = localStorage.getItem("syncspace_user");
    if (!storedUser) {
      storedUser = `User_${Math.floor(1000 + Math.random() * 9000)}`;
      localStorage.setItem("syncspace_user", storedUser);
    }
    setUsername(storedUser);

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    const handleConnect = () => {
      socket.emit("join-room", { 
        roomId, 
        username: storedUser,
        roomName: `Workspace #${roomId}` 
      });
      socket.emit("get-participants", { roomId });
    };

    socket.on("connect", handleConnect);

    socket.on("room-details", (data) => {
      if (data) {
        setRoomDetails({
          roomName: data.roomName || `Room #${roomId}`,
          createdBy: data.createdBy || "System Admin",
          createdAt: data.createdAt ? new Date(data.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null,
        });
      }
    });

    socket.on("participants-update", ({ participants: updatedList }) => {
      if (Array.isArray(updatedList)) {
        setParticipants(updatedList);
      }
    });

    socket.on("code-activity", ({ user }) => {
      if (user && user !== storedUser) {
        setIsPeerTyping(`${user} is editing code...`);
        const timer = setTimeout(() => setIsPeerTyping(""), 2000);
        return () => clearTimeout(timer);
      }
    });

    // RECEIVE ACCURATE WHITEBOARD USERNAME FROM SOCKET
    socket.on("whiteboard-activity", ({ user }) => {
      if (user) {
        const isSelf = user === storedUser;
        const displayName = isSelf ? `${user} (You)` : user;
        setLastDrawUser(displayName);
        
        // Log accurately with the real username
        addActivityLog(`${user} updated the whiteboard`, "whiteboard");

        if (drawTimerRef.current) clearTimeout(drawTimerRef.current);
        drawTimerRef.current = setTimeout(() => {
          setLastDrawUser("");
        }, 3000);
      }
    });

    socket.on("chat-message", (newMsg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          sender: newMsg.username,
          text: newMsg.message,
          time: newMsg.time ? new Date(newMsg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isSystem: !!newMsg.isSystem,
        }
      ]);

      if (!newMsg.isSystem) {
        addActivityLog(`${newMsg.username} sent a message`, "chat");
      }
    });

    socket.on("file-shared", (fileData) => {
      setSharedFiles((prev) => [fileData, ...prev]);
      addActivityLog(`${fileData.sender} shared ${fileData.name}`, "file");
    });

    socket.on("room-ended", () => {
      alert("The workspace session has been closed by the host.");
      navigate("/roomlanding");
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("room-details");
      socket.off("participants-update");
      socket.off("code-activity");
      socket.off("whiteboard-activity");
      socket.off("chat-message");
      socket.off("file-shared");
      socket.off("room-ended");
      socket.disconnect();
    };
  }, [roomId, addActivityLog, navigate]);

  // Auto-scroll chat window
  useEffect(() => {
    if (activeTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  // Copy Access Link Handler
  const handleCopyAccessLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast("Shareable link copied to clipboard");
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Explicit Leave Button Trigger with Popup Confirmation
  const handleLeaveButtonClick = () => {
    const confirmLeave = window.confirm(
      `Are you sure you want to leave ${roomDetails.roomName}? Unsaved active changes will be lost.`
    );
    
    if (confirmLeave) {
      if (socketRef.current) {
        socketRef.current.emit("leave-room", { roomId, username });
        socketRef.current.disconnect();
      }
      navigate("/roomlanding");
    }
  };

  // Immediate local drawing trigger
  const handleLocalDraw = () => {
    if (!username) return;
    setLastDrawUser(`${username} (You)`);
    addActivityLog(`${username} updated the whiteboard`, "whiteboard");

    if (drawTimerRef.current) clearTimeout(drawTimerRef.current);
    drawTimerRef.current = setTimeout(() => {
      setLastDrawUser("");
    }, 3000);
  };

  // Chat Sender
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (socketRef.current) {
      socketRef.current.emit("chat-message", {
        roomId,
        username,
        message: chatInput.trim(),
        time: new Date().toISOString(),
      });
    }

    setChatInput("");
  };

  // File Upload Handler
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach((file, index) => {
      let sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      if (file.size > 1024 * 1024) {
        sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      }

      const isCode = file.name.match(/\.(js|jsx|ts|tsx|py|java|html|css|sql|json)$/i);

      const fileData = {
        id: `file-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        size: sizeStr,
        sender: username || "You",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: isCode ? "code" : "text",
      };

      if (socketRef.current) {
        socketRef.current.emit("share-file", { roomId, fileData });
      }
    });

    showToast(`Shared ${files.length} file(s) with room`);
  };

  return (
    <div className="premium-workspace">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="premium-toast">
          <Sparkles size={16} className="text-cyan" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* LEFT SIDEBAR ROSTER */}
      <aside className="premium-sidebar">
        <div className="sidebar-top">
          
          {/* Header Branding */}
          <div className="brand-header">
            <div className="brand-logo">
              <Zap size={18} />
            </div>
            <div className="brand-title">
              <h2 title={roomDetails.roomName}>{roomDetails.roomName}</h2>
              <span className="badge-pro"><ShieldCheck size={10} /> ENTERPRISE</span>
            </div>
          </div>

          {/* Room Creation Info */}
          <div className="room-metadata-card">
            <div className="meta-item">
              <Crown size={14} className="text-gold" />
              <span>Created by: <strong>{roomDetails.createdBy}</strong></span>
            </div>
            {roomDetails.createdAt && (
              <div className="meta-item">
                <Clock size={12} className="text-cyan" />
                <span>Created at: {roomDetails.createdAt}</span>
              </div>
            )}
          </div>

          {/* Access Key Share Box */}
          <div className="share-box">
            <div className="share-header">
              <Link2 size={12} className="text-cyan" />
              <span>ROOM ACCESS KEY</span>
            </div>
            <button onClick={handleCopyAccessLink} className="share-btn">
              <span className="room-id-tag"><Hash size={12} />#{roomId}</span>
              {copiedLink ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
            </button>
          </div>

          {/* ACTIVE MEMBERS ROSTER */}
          <div className="roster-section">
            <div className="roster-header">
              <Users size={13} className="text-cyan" />
              <span>CONNECTED MEMBERS ({participants.length})</span>
            </div>

            <div className="roster-list">
              {participants.length === 0 ? (
                <p className="empty-text">Fetching workspace members...</p>
              ) : (
                participants.map((member) => {
                  const isAdmin = member.username === roomDetails.createdBy;
                  const isSelf = member.username === username;
                  return (
                    <div key={member.socketId || member.username} className="roster-card">
                      <div className="roster-info">
                        <div className="avatar">
                          {member.username ? member.username.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="username">
                          {member.username}
                          {isSelf && <span className="you-tag"> (You)</span>}
                          {isAdmin && (
                            <span className="admin-tag">
                              <Crown size={10} /> Admin
                            </span>
                          )}
                        </span>
                      </div>
                      <span className="status-dot"></span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* REAL-TIME WORKSPACE AUDIT LOG */}
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

        {/* Leave Workspace Button */}
        <div className="sidebar-bottom">
          <button onClick={handleLeaveButtonClick} className="exit-btn">
            <LogOut size={14} /> Leave Workspace
          </button>
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
              <Code2 size={14} /> Code IDE
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

          {/* Status Bar */}
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

        {/* Workspace Stage */}
        <div className="workspace-stage">
          
          {/* TAB 1: CODE EDITOR PAGE */}
          {activeTab === "editor" && (
            <div className="code-editor-page-wrapper" style={{ height: "100%", width: "100%" }}>
              <CodeEditorPage socket={socketRef.current} roomId={roomId} currentUser={username} />
            </div>
          )}

          {/* TAB 2: CANVAS WHITEBOARD WITH ACTIVE DRAWER OVERLAY */}
          <div 
            style={{ display: activeTab === "whiteboard" ? "block" : "none", height: "100%", width: "100%", position: "relative" }}
            onMouseDown={handleLocalDraw}
          >
            {/* FLOATING DRAWER BADGE SHOWING USERNAME */}
            {lastDrawUser && (
              <div 
                className="whiteboard-author-badge" 
                style={{ 
                  position: "absolute", 
                  top: 16, 
                  right: 16, 
                  zIndex: 20, 
                  background: "rgba(15, 23, 42, 0.9)", 
                  color: "#38bdf8", 
                  border: "1px solid rgba(56, 189, 248, 0.4)",
                  padding: "8px 14px", 
                  borderRadius: "8px", 
                  fontSize: "13px", 
                  fontWeight: "600",
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  pointerEvents: "none"
                }}
              >
                <Palette size={14} className="text-cyan" /> 
                <span>Drawing by: <strong>{lastDrawUser}</strong></span>
              </div>
            )}
            <Whiteboard socket={socketRef.current} roomId={roomId} currentUser={username} />
          </div>

          {/* TAB 3: REAL-TIME CHAT PANEL */}
          {activeTab === "chat" && (
            <div className="chat-container">
              <div className="chat-header">
                <h3><MessageSquare size={16} className="text-cyan" /> {roomDetails.roomName} Channel</h3>
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

          {/* TAB 4: FILE SHARING VAULT */}
          {activeTab === "files" && (
            <div className="files-container">
              <div className="vault-header">
                <h3><FolderUp size={18} className="text-cyan" /> Room File Vault</h3>
                <p>Upload and distribute assets across room participants.</p>
              </div>

              <div className="dropzone" onClick={() => fileInputRef.current?.click()}>
                <Paperclip size={24} className="text-cyan mb-2" />
                <p>Click to browse or drop project assets here</p>
                <span>Supports source code, design mockups & documentation up to 50MB</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                  multiple
                />
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