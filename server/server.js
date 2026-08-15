import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";
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
// Path Configuration & Setup
// ======================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ======================================
// Dynamic CORS Origin Evaluator
// ======================================
const allowedOrigins = (
  process.env.CLIENT_URL ||
  process.env.CLIENT_ORIGIN ||
  "http://localhost:5173,http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isOriginAllowed = (origin, callback) => {
  // Allow requests with no origin (like mobile apps, curl, server-to-server)
  if (!origin) return callback(null, true);
  
  if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
    return callback(null, true);
  }
  
  return callback(new Error(`CORS Policy: Origin ${origin} not allowed.`));
};

// ======================================
// Express App & Server Initialization
// ======================================
const app = express();
const server = http.createServer(app);

// ======================================
// Socket.IO Configuration
// ======================================
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => isOriginAllowed(origin, callback),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
});

/*
==========================================================
SECURITY & UTILITY MIDDLEWARE
==========================================================
*/
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false, // Prevents issues with inline canvas/media rendering
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: (origin, callback) => isOriginAllowed(origin, callback),
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/*
==========================================================
STATIC FILES & CONTEXT INJECTION
==========================================================
*/
app.use("/uploads", express.static(uploadsDir));

// Attach socket context to controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

/*
==========================================================
BASE & HEALTH ROUTES
==========================================================
*/
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 SyncSpace Backend Engine Running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Healthy",
    message: "SyncSpace Server Running Successfully",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

/*
==========================================================
API ROUTES
==========================================================
*/
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/editor", editorRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/run", runRoutes);
app.use("/api/terminal", terminalRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/activity", activityRoutes);

/*
==========================================================
SOCKET.IO HANDLER INITIALIZATION
==========================================================
*/
socketHandler(io);

/*
==========================================================
ERROR HANDLING MIDDLEWARE
==========================================================
*/
app.use(notFound);
app.use(errorHandler);

/*
==========================================================
SERVER BOOTSTRAP WITH DB VERIFICATION
==========================================================
*/
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Ensure DB connection is established before listening
    await connectDB();

    server.listen(PORT, () => {
      if (process.env.NODE_ENV !== "production") {
        console.clear();
      }

      console.log(`
==========================================================
🚀 SyncSpace Backend Server Started Successfully
==========================================================

🌐 Server URL        : http://localhost:${PORT}
📡 API Health        : http://localhost:${PORT}/api/health
⚡ Environment       : ${process.env.NODE_ENV || "development"}

🛢 Database          : Connected
⚡ Socket.IO         : Enabled & Bound
🔐 Authentication    : Mounted (/api/auth)
👤 Users             : Mounted (/api/users)
🏠 Rooms             : Mounted (/api/rooms)
💬 Chat              : Mounted (/api/chat)
📝 Collaborative IDE : Mounted (/api/editor)
📁 File Explorer     : Mounted (/api/files)
📂 Folder Manager    : Mounted (/api/folders)
▶ Code Runner        : Mounted (/api/run)
⌨ Terminal          : Mounted (/api/terminal)
⚙ Settings          : Mounted (/api/settings)
📤 File Upload       : Mounted (/api/upload)
📊 Activity API      : Mounted (/api/activity)

==========================================================
 Ready to accept connections...
==========================================================
`);
    });
  } catch (error) {
    console.error("❌ Failed to initialize database connection:", error.message);
    process.exit(1);
  }
};

startServer();

/*
==========================================================
GRACEFUL SHUTDOWN & UNCAUGHT ERROR HANDLING
==========================================================
*/
const shutdown = (signal) => {
  console.log(`\n🛑 ${signal} received. Closing SyncSpace HTTP server...`);
  server.close(() => {
    console.log("✅ HTTP and Socket.IO server closed successfully.");
    process.exit(0);
  });

  // Force shutdown if connections do not drain within 10s
  setTimeout(() => {
    console.error("⚠️ Forced shutdown due to lingering connections.");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Promise Rejection:", reason);
});

export default app;