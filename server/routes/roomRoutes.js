import express from "express";

import validateRoom from "../middleware/validateRoom.js";

import {
  createRoom,
  getRooms,
  getRoomById,
  deleteRoom,
  updateRoom,
  joinRoom,
  leaveRoom,
  getActiveRooms,
  deactivateRoom,
} from "../controllers/roomController.js";

const router = express.Router();

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

export default router;