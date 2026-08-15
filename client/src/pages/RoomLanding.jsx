import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlus, FaSignInAlt, FaCode, FaLink } from "react-icons/fa";
import "../css/RoomLanding.css";

export default function RoomLanding() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") || "create";
  });

  // Form State
  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("syncspace_user") || "";
  });
  const [loading, setLoading] = useState(false);
  const [joinInput, setJoinInput] = useState("");

  // Auto-detect share links passed as query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paramRoomId = searchParams.get("roomId");

    if (paramRoomId) {
      setJoinInput(paramRoomId.trim().toUpperCase());
      setActiveTab("join");
    }
  }, [location]);

  // Clean room input helper
  const extractRoomId = (input) => {
    let cleaned = input.trim();
    if (cleaned.includes("/workspace/")) {
      cleaned = cleaned.split("/workspace/")[1];
    } else if (cleaned.includes("roomId=")) {
      cleaned = cleaned.split("roomId=")[1];
    }
    return cleaned.split("?")[0].split("/")[0].toUpperCase();
  };

  // Handler 1: Create Room
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim() || !username.trim()) {
      alert("Please enter a room name and your display name.");
      return;
    }

    const savedUser = username.trim();
    localStorage.setItem("syncspace_user", savedUser);

    try {
      setLoading(true);
      const generatedRoomId = "SYNC-" + Math.random().toString(36).substring(2, 7).toUpperCase();
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: generatedRoomId,
          roomName: roomName.trim(),
          createdBy: savedUser,
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate(`/workspace/${data.data.roomId}`);
      } else {
        navigate(`/workspace/${generatedRoomId}`);
      }
    } catch (error) {
      console.error("Backend error during creation, launching workspace:", error);
      const fallbackId =
        "SYNC-" + Math.random().toString(36).substring(2, 7).toUpperCase();
      navigate(`/workspace/${fallbackId}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler 2: Join Room
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!joinInput.trim() || !username.trim()) {
      alert("Please enter a Room ID or Share Link and your display name.");
      return;
    }

    const roomId = extractRoomId(joinInput);

    if (!roomId) {
      alert("Invalid Room ID or Link provided.");
      return;
    }

    localStorage.setItem("syncspace_user", username.trim());
    navigate(`/workspace/${roomId}`);
  };

  return (
    <div className="room-landing-container">
      <div className="bg-glow glow-top-left"></div>
      <div className="bg-glow glow-bottom-right"></div>

      <div className="room-card">
        {/* Header */}
        <div className="card-header">
          <div className="logo-icon-wrapper">
            <FaCode />
          </div>
          <h2>SyncSpace Portal</h2>
          <p>
            Create or join a collaborative workspace for real-time coding,
            whiteboard drawing, and live collaboration.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="form-toggle">
          <button
            className={`toggle-btn ${activeTab === "create" ? "active" : ""}`}
            onClick={() => setActiveTab("create")}
            type="button"
          >
            <FaPlus /> Create Room
          </button>
          <button
            className={`toggle-btn ${activeTab === "join" ? "active" : ""}`}
            onClick={() => setActiveTab("join")}
            type="button"
          >
            <FaSignInAlt /> Join Room
          </button>
        </div>

        {/* FORM 1: CREATE ROOM */}
        {activeTab === "create" && (
          <form onSubmit={handleCreateRoom} className="room-form">
            <div className="input-group">
              <label>Your Display Name</label>
              <input
                type="text"
                placeholder="e.g. Alex Dev"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Room Name</label>
              <input
                type="text"
                placeholder="e.g. System Design & Code Review"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              <FaPlus /> {loading ? "Creating Space..." : "Create & Enter Room"}
            </button>
          </form>
        )}

        {/* FORM 2: JOIN ROOM */}
        {activeTab === "join" && (
          <form onSubmit={handleJoinRoom} className="room-form">
            <div className="input-group">
              <label>Your Display Name</label>
              <input
                type="text"
                placeholder="e.g. Jordan Dev"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Room ID or Full Share Link</label>
              <div className="input-with-icon">
                <FaLink className="field-icon" />
                <input
                  type="text"
                  placeholder="SYNC-1234 or http://localhost:5173/workspace/SYNC-1234"
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-btn secondary">
              <FaSignInAlt /> Join Room Workspace
            </button>
          </form>
        )}
      </div>
    </div>
  );
}