const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const roomRoutes = require("./routes/roomRoutes");

// Middleware
const errorHandler = require("./middleware/errorHandler");

// ==============================
// Connect MongoDB
// ==============================
connectDB();

const app = express();
const server = http.createServer(app);

// ==============================
// Socket.IO
// ==============================
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Make io available inside controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// ==============================
// Middlewares
// ==============================

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"]
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// ==============================
// Routes
// ==============================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to SyncSpace API 🚀"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "Healthy",
        uptime: process.uptime(),
        timestamp: new Date()
    });
});

app.use("/api/rooms", roomRoutes);

// ==============================
// 404 Route
// ==============================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// ==============================
// Error Handler
// ==============================

app.use(errorHandler);

// ==============================
// Socket Events
// ==============================

io.on("connection", (socket) => {

    console.log(`🟢 User Connected : ${socket.id}`);

    // Join Room
    socket.on("join-room", ({ roomId, username }) => {

        socket.join(roomId);

        console.log(`${username} joined ${roomId}`);

        io.to(roomId).emit("user-joined", {
            username,
            socketId: socket.id
        });

    });

    // Leave Room
    socket.on("leave-room", ({ roomId, username }) => {

        socket.leave(roomId);

        io.to(roomId).emit("user-left", {
            username
        });

    });

    // Live Code Sync
    socket.on("code-change", ({ roomId, code }) => {

        socket.to(roomId).emit("code-change", code);

    });

    // Whiteboard
    socket.on("draw", ({ roomId, drawData }) => {

        socket.to(roomId).emit("draw", drawData);

    });

    // Chat
    socket.on("send-message", ({ roomId, message, username }) => {

        io.to(roomId).emit("receive-message", {
            username,
            message,
            time: new Date()
        });

    });

    // Typing Indicator
    socket.on("typing", ({ roomId, username }) => {

        socket.to(roomId).emit("typing", username);

    });

    socket.on("stop-typing", ({ roomId }) => {

        socket.to(roomId).emit("stop-typing");

    });

    socket.on("disconnect", () => {

        console.log(`🔴 User Disconnected : ${socket.id}`);

    });

});

// ==============================
// Start Server
// ==============================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log("=========================================");
    console.log(`🚀 SyncSpace Server Started`);
    console.log(`🌍 Port        : ${PORT}`);
    console.log(`🛠 Environment : ${process.env.NODE_ENV || "development"}`);
    console.log("=========================================");

});

// ==============================
// Graceful Shutdown
// ==============================

process.on("SIGINT", async () => {

    console.log("\nShutting down server...");

    server.close(() => {

        console.log("HTTP Server Closed");

        process.exit(0);

    });

});