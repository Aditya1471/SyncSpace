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

// Database Connection
connectDB();

const app = express();

app.use(helmet());

app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Attach io later if controllers need it
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SyncSpace Server is running",
  });
});

// Room APIs
app.use("/api/rooms", roomRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Not Found",
  });
});

// Global Error Handler
app.use(errorHandler);

const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    socket.to(roomId).emit("user-joined", {
      username,
      socketId: socket.id,
    });

    console.log(`${username} joined ${roomId}`);
  });

  socket.on("draw", ({ roomId, drawData }) => {
    socket.to(roomId).emit("draw", drawData);
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-change", code);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT} (${process.env.NODE_ENV})`
  );
});