const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const roomRoutes = require("./routes/roomRoutes");

// Middleware
const errorHandler = require("./middleware/errorHandler");

// Connect Database
connectDB();

const app = express();

// ======================
// Middleware
// ======================
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ======================
// API Routes
// ======================

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "SyncSpace Server is running smoothly",
  });
});

// Room APIs
app.use("/api/rooms", roomRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// Global Error Handler
app.use(errorHandler);

// ======================
// HTTP Server
// ======================
const server = http.createServer(app);

// ======================
// Socket.IO
// ======================
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join Room
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    console.log(`${username} joined ${roomId}`);

    socket.to(roomId).emit("user-joined", {
      username,
      socketId: socket.id,
    });
  });

  // Whiteboard Drawing
  socket.on("draw", ({ roomId, drawData }) => {
    socket.to(roomId).emit("draw", drawData);
  });

  // Code Sync
  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-change", code);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `🚀 SyncSpace Server running on port ${PORT} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
});