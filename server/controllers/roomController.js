import Room from "../models/Room.js";
import asyncHandler from "../utils/asyncHandler.js";

/*
=================================================
Create Room
POST /api/rooms
=================================================
*/

export const createRoom = asyncHandler(async (req, res) => {
  const { roomId, roomName, createdBy } = req.body;

  const existingRoom = await Room.findOne({
    roomId: roomId.toUpperCase(),
  });

  if (existingRoom) {
    return res.status(409).json({
      success: false,
      message: "Room already exists",
    });
  }

  const room = await Room.create({
    roomId: roomId.toUpperCase(),
    roomName,
    createdBy,
    participants: [],
    isActive: true,
    lastActivity: new Date(),
  });

  console.log(`Room Created : ${room.roomId}`);

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: room,
  });
});

/*
=================================================
Get All Rooms
GET /api/rooms
=================================================
*/

export const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms,
  });
});

/*
=================================================
Get Room By RoomId
GET /api/rooms/:roomId
=================================================
*/

export const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findOne({
    roomId: req.params.roomId.toUpperCase(),
  });

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }

  res.status(200).json({
    success: true,
    data: room,
  });
});

/*
=================================================
Delete Room
DELETE /api/rooms/:roomId
=================================================
*/

export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findOne({
    roomId: req.params.roomId.toUpperCase(),
  });

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }

  await Room.deleteOne({
    roomId: room.roomId,
  });

  console.log(`Room Deleted : ${room.roomId}`);

  res.status(200).json({
    success: true,
    message: "Room deleted successfully",
  });
});

/*
=================================================
Join Room
(Socket.IO Ready)
=================================================
*/

export const joinRoom = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const room = await Room.findOne({
    roomId: req.params.roomId.toUpperCase(),
  });

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }

  if (!room.participants.includes(username)) {
    room.participants.push(username);
  }

  room.lastActivity = new Date();

  await room.save();

  res.status(200).json({
    success: true,
    message: `${username} joined the room`,
    participants: room.participants,
  });
});

/*
=================================================
Leave Room
(Socket.IO Ready)
=================================================
*/

export const leaveRoom = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const room = await Room.findOne({
    roomId: req.params.roomId.toUpperCase(),
  });

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }

  room.participants = room.participants.filter(
    (user) => user !== username
  );

  room.lastActivity = new Date();

  await room.save();

  res.status(200).json({
    success: true,
    message: `${username} left the room`,
    participants: room.participants,
  });
});

/*
=================================================
Update Room Name
PUT /api/rooms/:roomId
=================================================
*/

export const updateRoom = asyncHandler(async (req, res) => {
  const { roomName } = req.body;

  const room = await Room.findOne({
    roomId: req.params.roomId.toUpperCase(),
  });

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }

  room.roomName = roomName;
  room.lastActivity = new Date();

  await room.save();

  res.status(200).json({
    success: true,
    message: "Room updated successfully",
    data: room,
  });
});

/*
=================================================
Get Active Rooms
=================================================
*/

export const getActiveRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({
    isActive: true,
  }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms,
  });
});

/*
=================================================
Deactivate Room
=================================================
*/

export const deactivateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findOne({
    roomId: req.params.roomId.toUpperCase(),
  });

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }

  room.isActive = false;
  room.lastActivity = new Date();

  await room.save();

  res.status(200).json({
    success: true,
    message: "Room deactivated successfully",
    data: room,
  });
});