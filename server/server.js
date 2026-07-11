const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

// Initialize database connection
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // default Vite dev port
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Basic API check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'SyncSpace Server is running smoothly' });
});

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join Room event
  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`User ${username} (${socket.id}) joined room: ${roomId}`);
    
    // Broadcast to other users in the room
    socket.to(roomId).emit('user-joined', { username, socketId: socket.id });
  });

  // Handle drawings (Whiteboard sync)
  socket.on('draw', ({ roomId, drawData }) => {
    socket.to(roomId).emit('draw', drawData);
  });

  // Handle code changes (Code editor sync)
  socket.on('code-change', ({ roomId, code }) => {
    socket.to(roomId).emit('code-change', code);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Run Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`SyncSpace server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
