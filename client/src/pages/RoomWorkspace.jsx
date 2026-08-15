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
  Crown, Clock, Hash, Folder, UserCheck, UserX
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

  // SEPARATED USER LISTS
  const [onlineParticipants, setOnlineParticipants] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
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
  const [socketInstance, setSocketInstance] = useState(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const drawTimerRef = useRef(null);
  const lastLogTimeRef = useRef(0);

  // Toast Helper
  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    const timer = setTimeout(() => setToastMsg(""), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Activity Log Helper
  const addActivityLog = useCallback((text, type) => {
    const now = Date.now();
    if (type === "whiteboard" && now - lastLogTimeRef.current < 2000) {
      return; 
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
  // SOCKET CONNECTION & ACCURATE USER SYNCHRONIZATION
  // ----------------------------------------------------
  useEffect(() => {
    // 1. ISOLATE & PERSIST USER IDENTITY PER TAB
    let storedUser = sessionStorage.getItem(`syncspace_user_${roomId}`);
    if (!storedUser) {
      const globalUser = localStorage.getItem("syncspace_user");
      storedUser = globalUser || `User_${Math.floor(1000 + Math.random() * 9000)}`;
      sessionStorage.setItem(`syncspace_user_${roomId}`, storedUser);
    }
    setUsername(storedUser);

    // 2. INITIALIZE SOCKET CONNECTION
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
    });
    socketRef.current = socket;
    setSocketInstance(socket);

    const handleConnect = () => {
      // Always re-emit join with current session identity on load or refresh
      socket.emit("join-room", { 
        roomId, 
        username: storedUser,
        roomName: `Workspace #${roomId}` 
      });
      socket.emit("get-participants", { roomId });
      socket.emit("sync-vault-request", { roomId });
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

    // 3. RECEIVE SEPARATED ROSTER UPDATES (ONLINE & ALL-TIME)
    socket.on("participants-update", (data) => {
      if (data) {
        if (Array.isArray(data.online)) setOnlineParticipants(data.online);
        if (Array.isArray(data.all)) setAllParticipants(data.all);
        
        // Fallback for flat array responses
        if (Array.isArray(data.participants)) {
          setOnlineParticipants(data.participants);
          setAllParticipants(data.participants);
        } else if (Array.isArray(data)) {
          setOnlineParticipants(data);
          setAllParticipants(data);
        }
      }
    });

    // PEER TYPING IN CODE EDITOR
    socket.on("code-activity", ({ user }) => {
      if (user && user !== storedUser) {
        setIsPeerTyping(`${user} is editing code...`);
        const timer = setTimeout(() => setIsPeerTyping(""), 2000);
        return () => clearTimeout(timer);
      }
    });

    // WHITEBOARD DRAWING SYNC
    socket.on("whiteboard-activity", ({ user }) => {
      if (user) {
        const isSelf = user === storedUser;
        const displayName = isSelf ? `${user} (You)` : user;
        setLastDrawUser(displayName);
        
        addActivityLog(`${user} updated the whiteboard`, "whiteboard");

        if (drawTimerRef.current) clearTimeout(drawTimerRef.current);
        drawTimerRef.current = setTimeout(() => {
          setLastDrawUser("");
        }, 3000);
      }
    });

    // LIVE CHAT & SYSTEM MESSAGES
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

      if (newMsg.isSystem) {
        addActivityLog(newMsg.message, "system");
      } else {
        addActivityLog(`${newMsg.username} sent a message`, "chat");
      }
    });

    // FILE & FOLDER VAULT SYNC
    socket.on("vault-state-sync", (files) => {
      setSharedFiles(files);
    });

    socket.on("file-shared", (fileData) => {
      setSharedFiles((prev) => [fileData, ...prev]);
      addActivityLog(`${fileData.sender} shared ${fileData.isFolder ? 'folder' : 'file'} "${fileData.name}"`, "file");
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("room-details");
      socket.off("participants-update");
      socket.off("code-activity");
      socket.off("whiteboard-activity");
      socket.off("chat-message");
      socket.off("vault-state-sync");
      socket.off("file-shared");
      socket.disconnect();
    };
  }, [roomId, addActivityLog]);

  // Auto-scroll chat window
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

  const handleLeaveButtonClick = () => {
    const confirmLeave = window.confirm(`Are you sure you want to leave ${roomDetails.roomName}?`);
    if (confirmLeave) {
      if (socketRef.current) {
        socketRef.current.emit("leave-room", { roomId, username });
        socketRef.current.disconnect();
      }
      sessionStorage.removeItem(`syncspace_user_${roomId}`);
      navigate("/roomlanding");
    }
  };

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

  const handleDownload = (file) => {
  if (!file.fileData && !file.content) {
    showToast("Download unavailable for this file");
    return;
  }

  const link = document.createElement("a");

  link.href = file.fileData || file.content;

  link.download = file.name.split("/").pop();

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};

const isUserOnline = (username) => {
  return onlineParticipants?.some(
    (user) => user.username === username
  );
};

  const handleFileSelect = (e, isFolderUpload = false) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    files.forEach((file) => {

      const relativePath = file.webkitRelativePath || file.name;

      const isCode = file.name.match(
        /\.(js|jsx|ts|tsx|py|java|html|css|sql|json)$/i
      );

      const reader = new FileReader();

      reader.onload = () => {

        const fileData = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,

          name: relativePath,

          size: `${(file.size / 1024).toFixed(1)} KB`,

          sender: username || "You",

          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          }),

          type: isCode ? "code" : "text",

          isFolder: isFolderUpload,

          fileData: reader.result,

          content: reader.result
        };


        if (socketRef.current) {

          socketRef.current.emit("share-file", {
            roomId,
            fileData
          });

        }

      };


      reader.readAsDataURL(file);

    });

  };

  return (
    <div className="premium-workspace">
      {toastMsg && (
        <div className="premium-toast">
          <Sparkles size={16} className="text-cyan" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* LEFT SIDEBAR ROSTER */}
      <aside className="premium-sidebar">
        <div className="sidebar-top">
          <div className="brand-header">
            <div className="brand-logo"><Zap size={18} /></div>
            <div className="brand-title">
              <h2 title={roomDetails.roomName}>{roomDetails.roomName}</h2>
              <span className="badge-pro"><ShieldCheck size={10} /> ENTERPRISE</span>
            </div>
          </div>

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

          {/* TWO SEPARATE ROSTER SECTIONS: ONLINE & ALL MEMBERS */}
          <div className="roster-section">
            <div className="roster-header">
              <UserCheck size={13} className="text-emerald" />
              <span>ONLINE MEMBERS ({onlineParticipants.length})</span>
            </div>

            <div className="roster-list" style={{ maxHeight: "150px", overflowY: "auto" }}>
              {onlineParticipants.length === 0 ? (
                <p className="empty-text">Connecting to room...</p>
              ) : (
                onlineParticipants.map((member) => {
                  const nameToDisplay = typeof member === "object" ? member.username : member;
                  const socketId = typeof member === "object" ? member.socketId : null;
                  const isSelf = nameToDisplay === username;
                  const isAdmin = nameToDisplay === roomDetails.createdBy;

                  return (
                    <div key={socketId || `online-${nameToDisplay}`} className="roster-card">
                      <div className="roster-info">
                        <div className="avatar">
                          {nameToDisplay ? nameToDisplay.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="username">
                          {nameToDisplay}
                          {isSelf && <span className="you-tag"> (You)</span>}
                          {isAdmin && (
                            <span className="admin-tag">
                              <Crown size={10} /> Admin
                            </span>
                          )}
                        </span>
                      </div>
                      <span className="status-dot online"></span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="roster-section" style={{ marginTop: "15px" }}>
            <div className="roster-header">
              <Users size={13} className="text-cyan" />
              <span>ALL ROOM MEMBERS ({allParticipants.length})</span>
            </div>

            <div className="roster-list" style={{ maxHeight: "150px", overflowY: "auto" }}>
              {allParticipants.length === 0 ? (
                <p className="empty-text">No users recorded yet...</p>
              ) : (
                allParticipants.map((member) => {
                  const nameToDisplay = typeof member === "object" ? member.username : member;
                  const onlineStatus = isUserOnline(nameToDisplay);
                  const isSelf = nameToDisplay === username;
                  const isAdmin = nameToDisplay === roomDetails.createdBy;

                  return (
                    <div key={`all-${nameToDisplay}`} className={`roster-card ${!onlineStatus ? "offline-card" : ""}`}>
                      <div className="roster-info">
                        <div className="avatar" style={{ opacity: onlineStatus ? 1 : 0.5 }}>
                          {nameToDisplay ? nameToDisplay.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="username" style={{ opacity: onlineStatus ? 1 : 0.6 }}>
                          {nameToDisplay}
                          {isSelf && <span className="you-tag"> (You)</span>}
                          {isAdmin && (
                            <span className="admin-tag">
                              <Crown size={10} /> Admin
                            </span>
                          )}
                        </span>
                      </div>
                      <span className={`status-dot ${onlineStatus ? "online" : "offline"}`}></span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="activity-section" style={{ marginTop: "15px" }}>
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

        <div className="sidebar-bottom">
          <button onClick={handleLeaveButtonClick} className="exit-btn">
            <LogOut size={14} /> Leave Workspace
          </button>
        </div>
      </aside>

      {/* CENTER MAIN WORKSPACE */}
      <main className="premium-main">
        <header className="workspace-header">
          <div className="nav-tabs">
            <button onClick={() => navigate("/dashboard")} className="nav-btn">🏠 Home</button>
            <button onClick={() => setActiveTab("editor")} className={`nav-btn ${activeTab === "editor" ? "active" : ""}`}><Code2 size={14} /> Code IDE</button>
            <button onClick={() => setActiveTab("whiteboard")} className={`nav-btn ${activeTab === "whiteboard" ? "active" : ""}`}><Palette size={14} /> Whiteboard</button>
            <button onClick={() => setActiveTab("chat")} className={`nav-btn ${activeTab === "chat" ? "active" : ""}`}><MessageSquare size={14} /> Live Chat</button>
            <button onClick={() => setActiveTab("files")} className={`nav-btn ${activeTab === "files" ? "active" : ""}`}><FolderUp size={14} /> File Vault</button>
          </div>

          <div className="header-status">
            {isPeerTyping && <span className="typing-indicator"><Monitor size={12} /> {isPeerTyping}</span>}
            <div className="sync-badge"><Wifi size={13} className="pulse-icon" /><span>LIVE SOCKET</span></div>
          </div>
        </header>

        <div className="workspace-stage">
          {/* PERSISTENT CODE EDITOR (Keeps socket listeners mounted across tab changes) */}
          <div 
            className="code-editor-page-wrapper" 
            style={{ 
              display: activeTab === "editor" ? "block" : "none", 
              height: "100%", 
              width: "100%" 
            }}
          >
            <CodeEditorPage 
                socket={socketInstance} 
                roomId={roomId} 
                currentUser={username} 
            />
          </div>

          {/* PERSISTENT WHITEBOARD */}
          <div 
            style={{ 
              display: activeTab === "whiteboard" ? "block" : "none", 
              height: "100%", 
              width: "100%", 
              position: "relative" 
            }}
          >
            {lastDrawUser && (
              <div className="whiteboard-author-badge" style={{ position: "absolute", top: 16, right: 16, zIndex: 20, background: "rgba(15, 23, 42, 0.9)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.4)", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", pointerEvents: "none" }}>
                <Palette size={14} className="text-cyan" /> 
                <span>Drawing by: <strong>{lastDrawUser}</strong></span>
              </div>
            )}
            <Whiteboard socket={socketRef.current} roomId={roomId} currentUser={username} />
          </div>

          {/* LIVE CHAT TAB */}
          {activeTab === "chat" && (
            <div className="chat-container">
              <div className="chat-header">
                <h3><MessageSquare size={16} className="text-cyan" /> {roomDetails.roomName} Channel</h3>
                <span>Socket Synced</span>
              </div>
              <div className="chat-messages">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message-wrapper ${msg.isSystem ? "system" : msg.sender === username ? "outgoing" : "incoming"}`}>
                    {msg.isSystem ? <span className="system-pill">{msg.text}</span> : (
                      <div className="chat-bubble">
                        <div className="bubble-meta"><span className="sender">{msg.sender}</span><span className="time">{msg.time}</span></div>
                        <p>{msg.text}</p>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <input type="text" placeholder="Send a message..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
                <button type="submit" className="send-btn"><Send size={14} /></button>
              </form>
            </div>
          )}

          {/* FILE VAULT TAB */}
          {activeTab === "files" && (
            <div className="files-container">
              <div className="vault-header">
                <h3><FolderUp size={18} className="text-cyan" /> Room File & Directory Vault</h3>
                <p>Upload and distribute assets across participants.</p>
              </div>
              <div className="upload-options" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <button className="nav-btn active" onClick={() => fileInputRef.current?.click()}><Paperclip size={14} /> Upload Files</button>
                <button className="nav-btn active" onClick={() => folderInputRef.current?.click()}><Folder size={14} /> Upload Folder</button>
              </div>
              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={(e) => handleFileSelect(e, false)} multiple />
              <input type="file" ref={folderInputRef} style={{ display: "none" }} onChange={(e) => handleFileSelect(e, true)} webkitdirectory="true" directory="true" multiple />
              <div className="file-list-section">
                <h4>ACTIVE VAULT ITEMS ({sharedFiles.length})</h4>
                <div className="file-grid">
                  {sharedFiles.map((file) => (
                    <div key={file.id} className="file-card">
                      <div className="file-icon">
                        {file.isFolder 
                          ? <Folder size={18} className="text-gold" /> 
                          : (file.type === "code" 
                              ? <FileCode size={18} /> 
                              : <FileText size={18} />
                            )
                        }
                      </div>

                      <div className="file-info">
                        <span 
                          className="file-name"
                          title={file.name}
                        >
                          {file.name}
                        </span>

                        <span className="file-meta">
                          {file.size} • {file.sender}
                        </span>
                      </div>

                      <button
                        className="download-btn"
                        onClick={() => handleDownload(file)}
                        title="Download file"
                      >
                        <Download size={16}/>
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