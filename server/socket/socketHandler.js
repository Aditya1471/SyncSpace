// server/socket/socketHandler.js

const rooms = {};

const socketHandler = (io) => {

  io.on("connection", (socket) => {

    console.log(`🟢 User Connected: ${socket.id}`);

    // ==========================
    // JOIN ROOM
    // ==========================
    socket.on("join-room", ({ roomId, username }) => {

      if (!roomId) return;

      socket.join(roomId);

      socket.roomId = roomId;
      socket.username = username;

      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }

      // avoid duplicates
      const exists = rooms[roomId].find(
        user => user.socketId === socket.id
      );

      if (!exists) {
        rooms[roomId].push({
          socketId: socket.id,
          username
        });
      }

      console.log(`${username} joined room ${roomId}`);

      io.to(roomId).emit("participants-update", {
        participants: rooms[roomId],
        totalUsers: rooms[roomId].length
      });

    });

    // ==========================
    // LEAVE ROOM
    // ==========================
    socket.on("leave-room", ({ roomId }) => {

      if (!rooms[roomId]) return;

      rooms[roomId] = rooms[roomId].filter(
        user => user.socketId !== socket.id
      );

      socket.leave(roomId);

      io.to(roomId).emit("participants-update", {
        participants: rooms[roomId],
        totalUsers: rooms[roomId].length
      });

    });

    // ==========================
    // CODE
    // ==========================
    socket.on("code-change", ({ roomId, code }) => {

      socket.to(roomId).emit("code-update", code);

    });

    socket.on("code-typing", ({ roomId, user }) => {

      socket.to(roomId).emit("code-activity", {
        user
      });

    });

    // ==========================
    // WHITEBOARD
    // ==========================
    socket.on("canvas-draw", ({ roomId, drawData }) => {

      socket.to(roomId).emit("canvas-draw", drawData);

    });

    socket.on("canvas-clear", ({ roomId }) => {

      socket.to(roomId).emit("canvas-clear");

    });

    // ==========================
    // CHAT
    // ==========================
    socket.on("chat-message", ({ roomId, username, message }) => {

      io.to(roomId).emit("chat-message", {
        username,
        message,
        time: new Date()
      });

    });

    // ==========================
    // DISCONNECT
    // ==========================
    socket.on("disconnect", () => {

      console.log(`🔴 User Disconnected: ${socket.id}`);

      const roomId = socket.roomId;

      if (!roomId) return;

      if (!rooms[roomId]) return;

      rooms[roomId] = rooms[roomId].filter(
        user => user.socketId !== socket.id
      );

      io.to(roomId).emit("participants-update", {
        participants: rooms[roomId],
        totalUsers: rooms[roomId].length
      });

      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }

    });

  });

};

export default socketHandler;