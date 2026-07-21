// socket/socketHandler.js

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🟢 User Connected: ${socket.id}`);

    // ==========================
    // Join Room
    // ==========================
    socket.on("join-room", ({ roomId, username }) => {
      socket.join(roomId);

      socket.to(roomId).emit("user-joined", {
        username,
        socketId: socket.id,
      });

      console.log(`${username} joined room ${roomId}`);
    });

    // ==========================
    // Leave Room
    // ==========================
    socket.on("leave-room", ({ roomId, username }) => {
      socket.leave(roomId);

      socket.to(roomId).emit("user-left", {
        username,
        socketId: socket.id,
      });

      console.log(`${username} left room ${roomId}`);
    });

    // ==========================
    // Whiteboard Drawing
    // ==========================
    socket.on("draw", ({ roomId, drawData }) => {
      socket.to(roomId).emit("draw", drawData);
    });

    // ==========================
    // Clear Whiteboard
    // ==========================
    socket.on("clear-board", (roomId) => {
      socket.to(roomId).emit("clear-board");
    });

    // ==========================
    // Code Synchronization
    // ==========================
    socket.on("code-change", ({ roomId, code }) => {
      socket.to(roomId).emit("code-change", code);
    });

    // ==========================
    // Language Change
    // ==========================
    socket.on("language-change", ({ roomId, language }) => {
      socket.to(roomId).emit("language-change", language);
    });

    // ==========================
    // Cursor Position
    // ==========================
    socket.on("cursor-change", ({ roomId, cursor }) => {
      socket.to(roomId).emit("cursor-change", cursor);
    });

    // ==========================
    // Chat Messages
    // ==========================
    socket.on("chat-message", ({ roomId, username, message }) => {
      io.to(roomId).emit("chat-message", {
        username,
        message,
        time: new Date(),
      });
    });

    // ==========================
    // User Disconnect
    // ==========================
    socket.on("disconnect", () => {
      console.log(`🔴 User Disconnected: ${socket.id}`);
    });
  });
};

export default socketHandler;