import roomSocket from "./roomSocket.js";
import chatSocket from "./chatSocket.js";
import editorSocket from "./editorSocket.js";
import cursorSocket from "./cursorSocket.js";
import presenceSocket from "./presenceSocket.js";

/*
====================================================
SYNCSPACE SOCKET HANDLER (ACCURATE USER ATTRIBUTION)
====================================================
*/

const roomsMap = new Map();
const roomMetaMap = new Map();
const pendingDisconnects = new Map();

const socketHandler = (io) => {
  console.log("Initializing SyncSpace Socket System...");

  roomSocket(io, roomsMap, roomMetaMap);
  chatSocket(io);
  editorSocket(io);
  cursorSocket(io);
  presenceSocket(io);

  io.on("connection", (socket) => {
    console.log(`🟢 Connected: ${socket.id}`);

    /* JOIN ROOM */
    socket.on("join-room", ({ roomId, username, roomName }) => {
      if (!roomId) return;

      const displayName = username || `User_${socket.id.substring(0, 4)}`;

      // Attach username directly to socket instance
      socket.username = displayName;
      socket.currentRoom = roomId;

      socket.join(roomId);

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

      activeUsers.set(displayName, {
        socketId: socket.id,
        username: displayName,
        joinedAt: isReconnecting ? activeUsers.get(displayName).joinedAt : new Date().toISOString(),
      });

      if (!roomMetaMap.has(roomId)) {
        roomMetaMap.set(roomId, {
          roomName: roomName || `Room #${roomId}`,
          createdBy: displayName,
          createdAt: new Date().toISOString(),
        });
      }

      const roomDetails = roomMetaMap.get(roomId);
      const participants = Array.from(activeUsers.values());

      socket.emit("room-details", roomDetails);
      socket.emit("participants-update", { participants });
      socket.to(roomId).emit("participants-update", { participants });

      if (!isReconnecting) {
        io.to(roomId).emit("chat-message", {
          username: "System",
          message: `${displayName} joined the workspace.`,
          time: new Date().toISOString(),
          isSystem: true,
        });
      }
    });

    /* GET PARTICIPANTS ROSTER */
    socket.on("get-participants", ({ roomId }) => {
      const targetRoom = roomId || socket.currentRoom;
      if (roomsMap.has(targetRoom)) {
        const participants = Array.from(roomsMap.get(targetRoom).values());
        socket.emit("participants-update", { participants });
      } else {
        socket.emit("participants-update", { participants: [] });
      }
    });

    /* 
    ========================================
    WHITEBOARD EVENTS (ACCURATE USER LOGGING)
    ========================================
    */
    socket.on("canvas-draw", (data) => {
      const targetRoom = data.roomId || data.room || socket.currentRoom;
      const drawPayload = data.drawData || data;

      // Detect exact drawer username
      const activeUser =
        data.username ||
        data.user ||
        socket.username ||
        `User_${socket.id.substring(0, 4)}`;

      // Broadcast exact user activity to all subscribers in the room
      io.to(targetRoom).emit("whiteboard-activity", { user: activeUser });
      socket.to(targetRoom).emit("canvas-draw", drawPayload);
      socket.to(targetRoom).emit("whiteboard-draw", drawPayload);
    });

    socket.on("canvas-clear", (data) => {
      const targetRoom = typeof data === "string" ? data : (data?.roomId || socket.currentRoom);
      const activeUser =
        (typeof data === "object" && (data.username || data.user)) ||
        socket.username ||
        `User_${socket.id.substring(0, 4)}`;

      io.to(targetRoom).emit("whiteboard-activity", { user: `${activeUser} cleared the whiteboard` });
      io.to(targetRoom).emit("canvas-clear");
      io.to(targetRoom).emit("whiteboard-clear");
    });

    /* CHAT MESSAGES */
    socket.on("chat-message", (data) => {
      io.to(data.roomId).emit("chat-message", {
        username: data.username || socket.username,
        message: data.message,
        time: data.time || new Date().toISOString(),
        isSystem: !!data.isSystem,
      });
    });

    /* FILE SHARING */
    socket.on("share-file", ({ roomId, fileData }) => {
      io.to(roomId).emit("file-shared", fileData);
    });

    /* CLEANUP AND LEAVE HANDLERS */
    const handleLeave = (roomId, username, socketId) => {
      if (roomsMap.has(roomId)) {
        const activeUsers = roomsMap.get(roomId);

        if (username && activeUsers.has(username)) {
          const userObj = activeUsers.get(username);
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

        if (activeUsers.size === 0) {
          roomsMap.delete(roomId);
        }
      }
    };

    socket.on("leave-room", ({ roomId }) => {
      const rId = roomId || socket.currentRoom;
      handleLeave(rId, socket.username, socket.id);
      socket.leave(rId);
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Disconnected: ${socket.id}`);
      const rId = socket.currentRoom;
      const uName = socket.username;
      const sId = socket.id;

      if (rId && uName) {
        const disconnectKey = `${rId}:${uName}`;

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