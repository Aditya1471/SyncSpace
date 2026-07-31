import { Server } from "socket.io";

let io;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🟢 Client Connected : ${socket.id}`);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);

      console.log(`${socket.id} joined ${roomId}`);

      io.to(roomId).emit("user-joined", {
        socketId: socket.id,
      });
    });

    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);

      io.to(roomId).emit("user-left", {
        socketId: socket.id,
      });
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Client Disconnected : ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized.");
  }

  return io;
};