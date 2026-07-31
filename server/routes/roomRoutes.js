import express from "express";

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


import { protect } from "../middleware/authMiddleware.js";

import validateRoom from "../middleware/validateRoom.js";


const router = express.Router();





/*
=================================================
ROOM MANAGEMENT ROUTES
=================================================
*/


// Create Room
// POST /api/rooms
router.post(
  "/",
  protect,
  validateRoom,
  createRoom
);




// Get All Rooms
// GET /api/rooms
router.get(
  "/",
  protect,
  getRooms
);




// Get Active Rooms
// GET /api/rooms/active
router.get(
  "/active",
  protect,
  getActiveRooms
);




// Get Single Room
// GET /api/rooms/:roomId
router.get(
  "/:roomId",
  protect,
  getRoomById
);




// Update Room
// PUT /api/rooms/:roomId
router.put(
  "/:roomId",
  protect,
  updateRoom
);




// Delete Room
// DELETE /api/rooms/:roomId
router.delete(
  "/:roomId",
  protect,
  deleteRoom
);





/*
=================================================
COLLABORATION ROUTES
(Socket.IO Ready)
=================================================
*/


// Join Room
// POST /api/rooms/:roomId/join
router.post(
  "/:roomId/join",
  protect,
  joinRoom
);




// Leave Room
// POST /api/rooms/:roomId/leave
router.post(
  "/:roomId/leave",
  protect,
  leaveRoom
);




// Deactivate Room
// PATCH /api/rooms/:roomId/deactivate
router.patch(
  "/:roomId/deactivate",
  protect,
  deactivateRoom
);



export default router;