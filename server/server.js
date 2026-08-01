import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

// ======================================
// Routes
// ======================================

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import editorRoutes from "./routes/editorRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import runRoutes from "./routes/runRoutes.js";
import terminalRoutes from "./routes/terminalRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

// ======================================
// Socket
// ======================================

import socketHandler from "./socket/socketHandler.js";

// ======================================
// Middleware
// ======================================

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

// ======================================
// Environment Variables
// ======================================

dotenv.config();

// ======================================
// Database Connection
// ======================================

connectDB();

// ======================================
// Express App
// ======================================

const app = express();

// ======================================
// HTTP Server
// ======================================

const server = http.createServer(app);

// ======================================
// Socket.IO Configuration
// ======================================

const io = new Server(server, {
  cors: {
    origin:
      process.env.CLIENT_URL ||
      process.env.CLIENT_ORIGIN ||
      "http://localhost:5173",

    methods: ["GET", "POST"],

    credentials: true,
  },

  transports: ["websocket", "polling"],
});

// ======================================
// Path Configuration
// ======================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/*
==========================================================
SECURITY MIDDLEWARE
==========================================================
*/

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/*
==========================================================
LOGGER
==========================================================
*/

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/*
==========================================================
CORS
==========================================================
*/

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      process.env.CLIENT_ORIGIN ||
      "http://localhost:5173",

    credentials: true,
  })
);

/*
==========================================================
BODY PARSER
==========================================================
*/

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

/*
==========================================================
STATIC FILES
==========================================================
*/

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/*
==========================================================
SOCKET.IO ACCESS IN CONTROLLERS
==========================================================
*/

app.use((req, res, next) => {
  req.io = io;
  next();
});

/*
==========================================================
HOME ROUTE
==========================================================
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 SyncSpace Backend Running",
    version: "1.0.0",
  });
});

/*
==========================================================
HEALTH CHECK
==========================================================
*/

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Healthy",
    message: "SyncSpace Server Running Successfully",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});
/*
==========================================================
API ROUTES
==========================================================
*/

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Users
app.use(
  "/api/users",
  userRoutes
);

// Rooms
app.use(
  "/api/rooms",
  roomRoutes
);

// Chat
app.use(
  "/api/chat",
  chatRoutes
);

// Collaborative Editor
app.use(
  "/api/editor",
  editorRoutes
);

// Files
app.use(
  "/api/files",
  fileRoutes
);

// Folders
app.use(
  "/api/folders",
  folderRoutes
);

// Code Runner
app.use(
  "/api/run",
  runRoutes
);

// Terminal
app.use(
  "/api/terminal",
  terminalRoutes
);

// Settings
app.use(
  "/api/settings",
  settingsRoutes
);

// Uploads
app.use(
  "/api/upload",
  uploadRoutes
);

// Activity (Git / Notifications)
app.use(
  "/api/activity",
  activityRoutes
);

/*
==========================================================
SOCKET.IO HANDLER
==========================================================
*/

socketHandler(io);

/*
==========================================================
404 HANDLER
==========================================================
*/

app.use(notFound);

/*
==========================================================
ERROR HANDLER
==========================================================
*/

app.use(errorHandler);
/*
==========================================================
SERVER CONFIGURATION
==========================================================
*/

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.clear();

  console.log(`
==========================================================
🚀 SyncSpace Backend Server Started Successfully
==========================================================

🌐 Server URL        : http://localhost:${PORT}
📡 API Health        : http://localhost:${PORT}/api/health

🛢 Database          : MongoDB Connected
⚡ Socket.IO         : Enabled
🔐 Authentication    : Enabled
👤 Users             : Enabled
🏠 Rooms             : Enabled
💬 Chat              : Enabled
📝 Collaborative IDE : Enabled
📁 File Explorer     : Enabled
📂 Folder Manager    : Enabled
▶ Code Runner        : Enabled
⌨ Terminal           : Enabled
⚙ Settings          : Enabled
📤 File Upload       : Enabled
📊 Activity API      : Enabled

==========================================================
 Ready to accept connections...
==========================================================
`);
});

/*
==========================================================
GRACEFUL SHUTDOWN
==========================================================
*/

process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down SyncSpace Server...");
  server.close(() => {
    console.log("✅ HTTP Server Closed");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("\n🛑 SIGTERM Received...");
  server.close(() => {
    console.log("✅ Server Stopped");
    process.exit(0);
  });
});

/*
==========================================================
UNCAUGHT ERROR HANDLING
==========================================================
*/

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection");
  console.error(err);
});

/*
==========================================================
EXPORTS
==========================================================
*/

export default app;