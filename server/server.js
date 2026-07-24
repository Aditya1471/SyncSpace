import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";

// Socket Handler
import socketHandler from "./socket/socketHandler.js";

// Middleware
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

// ===============================
// Database Connection
// ===============================
connectDB();

const app = express();

// ===============================
// Create HTTP Server
// ===============================
const server = http.createServer(app);

// ===============================
// Socket.io Setup
// ===============================
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || process.env.CLIENT_ORIGIN || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ===============================
// Security Middleware
// ===============================
app.use(helmet());

// ===============================
// Logger
// ===============================
app.use(morgan("dev"));

// ===============================
// CORS
// ===============================
app.use(
  cors({
    origin: process.env.CLIENT_URL || process.env.CLIENT_ORIGIN || "*",
    credentials: true,
  })
);

// ===============================
// Body Parser
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// In-Memory Room Data Store
// ===============================
// Structure: roomId -> { roomName, createdBy, code, chatHistory: [], participants: Map(socketId -> username) }
export const rooms = new Map();

// ===============================
// Make Socket.io & Rooms available on req
// ===============================
app.use((req, res, next) => {
  req.io = io;
  req.rooms = rooms;
  next();
});

// ===============================
// Home & Health Routes
// ===============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 SyncSpace Backend Running Successfully",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Healthy",
    message: "SyncSpace Server Running",
  });
});

// ===============================
// API Routes
// ===============================

// Authentication
app.use("/api/auth", authRoutes);

// Rooms REST API
app.post("/api/rooms", (req, res) => {
  const { roomId, roomName, createdBy } = req.body;
  if (!roomId || !roomName) {
    return res.status(400).json({
      success: false,
      message: "Room ID and Room Name are required.",
    });
  }

  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      roomName,
      createdBy: createdBy || "Anonymous",
      code: "// Welcome to SyncSpace Collaborative Workspace\n// Upload a file or start typing to sync live...\n",
      chatHistory: [],
      participants: new Map(),
    });
  }

  return res.status(201).json({
    success: true,
    data: {
      roomId,
      roomName,
      createdBy,
    },
  });
});

app.get("/api/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found.",
    });
  }

  return res.json({
    success: true,
    data: {
      roomId,
      roomName: room.roomName,
      createdBy: room.createdBy,
      participantsCount: room.participants.size,
    },
  });
});

app.post("/api/rooms/:roomId/leave", (req, res) => {
  const { roomId } = req.params;
  const { username } = req.body;

  const room = rooms.get(roomId);
  if (room) {
    for (const [socketId, user] of room.participants.entries()) {
      if (user === username) {
        room.participants.delete(socketId);
        break;
      }
    }
  }

  return res.json({ success: true });
});

// ===============================
// Socket Handler Integration
// ===============================
// Passes 'io' and the shared 'rooms' map to your modular socket handler
socketHandler(io, rooms);

// ===============================
// 404 Route
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// ===============================
// Global Error Handler
// ===============================
app.use(errorHandler);

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
==========================================
🚀 SyncSpace Backend Started Successfully
==========================================
🌐 Port       : ${PORT}
🛢️ Database   : MongoDB
⚡ Socket.io  : Running
🔐 Auth       : Enabled
🏠 Rooms      : Enabled
💬 Chat       : Enabled
🎨 Whiteboard : Enabled
==========================================
`);
});