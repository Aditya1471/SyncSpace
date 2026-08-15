import roomSocket from "./roomSocket.js";
import chatSocket from "./chatSocket.js";
import editorSocket from "./editorSocket.js";
import cursorSocket from "./cursorSocket.js";
import presenceSocket from "./presenceSocket.js";

/*
====================================================
SYNCSPACE SOCKET HANDLER (SINGLE SOURCE OF TRUTH)
====================================================
*/

// In-memory global maps for room state
const roomsMap = new Map();
const roomMetaMap = new Map();
const pendingDisconnects = new Map();
const vaultMap = new Map();

const socketHandler = (io) => {
  console.log("Initializing SyncSpace Socket System...");

  // Optional sub-module initializers
  if (typeof roomSocket === "function") roomSocket(io, roomsMap, roomMetaMap);
  if (typeof chatSocket === "function") chatSocket(io);
  if (typeof editorSocket === "function") editorSocket(io);
  if (typeof cursorSocket === "function") cursorSocket(io);
  if (typeof presenceSocket === "function") presenceSocket(io);

  // Helper for centralized leaving & room cleanup
  const handleLeave = (roomId, username, socketId) => {
    if (!roomId || !roomsMap.has(roomId)) return;

    const activeUsers = roomsMap.get(roomId);

    if (username && activeUsers.has(username)) {
      const userObj = activeUsers.get(username);

      // Verify socketId matches to prevent race conditions during rapid reconnects
      if (userObj.socketId === socketId) {
        activeUsers.delete(username);

        const participants = Array.from(activeUsers.values());
        io.to(roomId).emit("participants-update", { participants });

        io.to(roomId).emit("chat-message", {
          username: "System",
          message: `${username} left the workspace.`,
          time: new Date().toISOString(),
          isSystem: true,
        });
      }
    }

    // Clean up all memory structures when room is completely empty
    if (activeUsers.size === 0) {
      roomsMap.delete(roomId);
      roomMetaMap.delete(roomId);
      vaultMap.delete(roomId);

      // Clear any remaining pending disconnect timers for this empty room
      for (const key of pendingDisconnects.keys()) {
        if (key.startsWith(`${roomId}:`)) {
          clearTimeout(pendingDisconnects.get(key));
          pendingDisconnects.delete(key);
        }
      }
    }
  };

  io.on("connection", (socket) => {
    console.log(`🟢 Connected: ${socket.id}`);

    /* JOIN ROOM */
    socket.on("join-room", (payload = {}) => {
      const { roomId, username, roomName } = payload;
      if (!roomId) return;

      const displayName = username?.trim() || `User_${socket.id.substring(0, 4)}`;

      socket.username = displayName;
      socket.currentRoom = roomId;
      socket.join(roomId);

      // Cancel pending disconnect cleanup if user reconnected (e.g., page refresh)
      const disconnectKey = `${roomId}:${displayName}`;
      if (pendingDisconnects.has(disconnectKey)) {
        clearTimeout(pendingDisconnects.get(disconnectKey));
        pendingDisconnects.delete(disconnectKey);
      }

      if (!roomsMap.has(roomId)) {
        roomsMap.set(roomId, new Map());
      }
      const activeUsers = roomsMap.get(roomId);
      const isReconnecting = activeUsers.has(displayName);

      // Bind the new socket ID to the active user entry
      activeUsers.set(displayName, {
        socketId: socket.id,
        username: displayName,
        joinedAt: isReconnecting ? activeUsers.get(displayName).joinedAt : new Date().toISOString(),
      });

      if (!roomMetaMap.has(roomId)) {
        roomMetaMap.set(roomId, {
          roomName: roomName || `Workspace #${roomId}`,
          createdBy: displayName,
          createdAt: new Date().toISOString(),
        });
      }

      const roomDetails = roomMetaMap.get(roomId);
      const participants = Array.from(activeUsers.values());

      socket.emit("room-details", roomDetails);
      io.to(roomId).emit("participants-update", { participants });

      if (!isReconnecting) {
        io.to(roomId).emit("chat-message", {
          username: "System",
          message: `${displayName} joined the workspace.`,
          time: new Date().toISOString(),
          isSystem: true,
        });
      }
    });

    /* GET PARTICIPANTS ROSTER REQUEST */
    socket.on("get-participants", (payload = {}) => {
      const targetRoom = payload.roomId || socket.currentRoom;
      if (targetRoom && roomsMap.has(targetRoom)) {
        const participants = Array.from(roomsMap.get(targetRoom).values());
        socket.emit("participants-update", { participants });
      } else {
        socket.emit("participants-update", { participants: [] });
      }
    });

    /* WHITEBOARD DRAWING SYNC */
    socket.on("canvas-draw", (data = {}) => {
      const targetRoom = data.roomId || data.room || socket.currentRoom;
      if (!targetRoom) return;

      const drawPayload = data.drawData || data;
      const activeUser =
        data.username ||
        data.user ||
        socket.username ||
        `User_${socket.id.substring(0, 4)}`;

      io.to(targetRoom).emit("whiteboard-activity", { user: activeUser });
      socket.to(targetRoom).emit("canvas-draw", drawPayload);
      socket.to(targetRoom).emit("whiteboard-draw", drawPayload);
    });

    socket.on("canvas-clear", (data) => {
      const targetRoom = typeof data === "string" ? data : (data?.roomId || socket.currentRoom);
      if (!targetRoom) return;

      const activeUser =
        (typeof data === "object" && (data?.username || data?.user)) ||
        socket.username ||
        `User_${socket.id.substring(0, 4)}`;

      io.to(targetRoom).emit("whiteboard-activity", { user: `${activeUser} cleared the whiteboard` });
      io.to(targetRoom).emit("canvas-clear");
      io.to(targetRoom).emit("whiteboard-clear");
    });

    /* CHAT MESSAGES */
    socket.on("chat-message", (data = {}) => {
      const targetRoom = data.roomId || socket.currentRoom;
      if (!targetRoom || !data.message) return;

      io.to(targetRoom).emit("chat-message", {
        username: data.username || socket.username || "Anonymous",
        message: data.message,
        time: data.time || new Date().toISOString(),
        isSystem: !!data.isSystem,
      });
    });

    /* FILE VAULT SHARING */
    socket.on("share-file", (payload = {}) => {
      const { roomId, fileData } = payload;
      const targetRoom = roomId || socket.currentRoom;
      if (!targetRoom || !fileData) return;

      if (!vaultMap.has(targetRoom)) {
        vaultMap.set(targetRoom, []);
      }
      vaultMap.get(targetRoom).unshift(fileData);
      io.to(targetRoom).emit("file-shared", fileData);
    });

    socket.on("sync-vault-request", (payload = {}) => {
      const targetRoom = payload.roomId || socket.currentRoom;
      if (!targetRoom) return socket.emit("vault-state-sync", []);

      const files = vaultMap.get(targetRoom) || [];
      socket.emit("vault-state-sync", files);
    });

    /* LEAVE & DISCONNECT CLEANUP */
    socket.on("leave-room", (payload = {}) => {
      const rId = payload.roomId || socket.currentRoom;
      const uName = payload.username || socket.username;

      if (rId) {
        handleLeave(rId, uName, socket.id);
        socket.leave(rId);
        if (socket.currentRoom === rId) {
          socket.currentRoom = null;
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Disconnected: ${socket.id}`);
      const rId = socket.currentRoom;
      const uName = socket.username;
      const sId = socket.id;

      if (rId && uName) {
        const disconnectKey = `${rId}:${uName}`;

        // 3-second buffer to handle page reloads without firing instant leave events
        const timer = setTimeout(() => {
          handleLeave(rId, uName, sId);
          pendingDisconnects.delete(disconnectKey);
        }, 3000);

        pendingDisconnects.set(disconnectKey, timer);
      }
    });
  });

  console.log("✅ SyncSpace Socket System Ready");
};

export default socketHandler;