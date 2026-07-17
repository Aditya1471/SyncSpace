const express = require("express");

const router = express.Router();

const validateRoom = require("../middleware/validateRoom");

const {
  createRoom,
  getRooms,
  getRoomById,
  deleteRoom,
  updateRoom,
  joinRoom,
  leaveRoom,
  getActiveRooms,
  deactivateRoom,
} = require("../controllers/roomController");

/*
=========================================
Room CRUD APIs
=========================================
*/

// Create Room
router.post("/", validateRoom, createRoom);

// Get All Rooms
router.get("/", getRooms);

// Get Active Rooms
router.get("/active", getActiveRooms);

// Get Single Room
router.get("/:roomId", getRoomById);

// Update Room
router.put("/:roomId", updateRoom);

// Delete Room
router.delete("/:roomId", deleteRoom);

/*
=========================================
Socket Ready APIs
=========================================
*/

// Join Room
router.post("/:roomId/join", joinRoom);

// Leave Room
router.post("/:roomId/leave", leaveRoom);

// Deactivate Room
router.patch("/:roomId/deactivate", deactivateRoom);

module.exports = router;