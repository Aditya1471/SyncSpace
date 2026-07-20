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
    origin: process.env.CLIENT_URL || process.env.CLIENT_ORIGIN,
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
    origin: process.env.CLIENT_URL || process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

// ===============================
// Body Parser
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Make Socket.io available
// ===============================

app.use((req, res, next) => {
  req.io = io;
  next();
});

// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 SyncSpace Backend Running Successfully",
  });
});

// ===============================
// Health Route
// ===============================

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

// Rooms

// ===============================
// Socket Handler
// ===============================

socketHandler(io);

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
🎨 Whiteboard : Enabled
==========================================
`);
});