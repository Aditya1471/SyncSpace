const Room = require("../models/Room");

/**
 * @desc    Create a new room
 * @route   POST /api/rooms
 * @access  Private/Public
 */
exports.createRoom = async (req, res, next) => {
    try {
        const { roomId, roomName, createdBy, language, isPrivate } = req.body;

        if (!roomId || !roomName || !createdBy) {
            return res.status(400).json({
                success: false,
                message: "roomId, roomName and createdBy are required."
            });
        }

        const roomExists = await Room.findOne({ roomId });

        if (roomExists) {
            return res.status(409).json({
                success: false,
                message: "Room already exists."
            });
        }

        const room = await Room.create({
            roomId,
            roomName,
            createdBy,
            language: language || "javascript",
            isPrivate: isPrivate || false,
            participants: [createdBy]
        });

        // Socket.io Event
        if (req.io) {
            req.io.emit("room-created", room);
        }

        return res.status(201).json({
            success: true,
            message: "Room created successfully.",
            data: room
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all rooms
 * @route   GET /api/rooms
 * @access  Public
 */
exports.getRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single room
 * @route   GET /api/rooms/:roomId
 * @access  Public
 */
exports.getRoom = async (req, res, next) => {
    try {
        const room = await Room.findOne({
            roomId: req.params.roomId
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: room
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Join room
 * @route   POST /api/rooms/:roomId/join
 * @access  Public
 */
exports.joinRoom = async (req, res, next) => {
    try {
        const { userId } = req.body;

        const room = await Room.findOne({
            roomId: req.params.roomId
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found."
            });
        }

        if (room.participants.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "User already joined this room."
            });
        }

        room.participants.push(userId);

        await room.save();

        if (req.io) {
            req.io.to(room.roomId).emit("user-joined", {
                roomId: room.roomId,
                userId,
                participants: room.participants.length
            });
        }

        return res.status(200).json({
            success: true,
            message: "Joined room successfully.",
            data: room
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Leave room
 * @route   POST /api/rooms/:roomId/leave
 * @access  Public
 */
exports.leaveRoom = async (req, res, next) => {
    try {
        const { userId } = req.body;

        const room = await Room.findOne({
            roomId: req.params.roomId
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found."
            });
        }

        room.participants = room.participants.filter(
            (id) => id.toString() !== userId
        );

        await room.save();

        if (req.io) {
            req.io.to(room.roomId).emit("user-left", {
                roomId: room.roomId,
                userId,
                participants: room.participants.length
            });
        }

        return res.status(200).json({
            success: true,
            message: "Left room successfully.",
            data: room
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update room
 * @route   PUT /api/rooms/:roomId
 * @access  Public
 */
exports.updateRoom = async (req, res, next) => {
    try {
        const room = await Room.findOne({
            roomId: req.params.roomId
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found."
            });
        }

        room.roomName = req.body.roomName || room.roomName;
        room.language = req.body.language || room.language;
        room.isPrivate =
            req.body.isPrivate !== undefined
                ? req.body.isPrivate
                : room.isPrivate;

        await room.save();

        if (req.io) {
            req.io.emit("room-updated", room);
        }

        return res.status(200).json({
            success: true,
            message: "Room updated successfully.",
            data: room
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete room
 * @route   DELETE /api/rooms/:roomId
 * @access  Public
 */
exports.deleteRoom = async (req, res, next) => {
    try {
        const room = await Room.findOne({
            roomId: req.params.roomId
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found."
            });
        }

        await room.deleteOne();

        if (req.io) {
            req.io.emit("room-deleted", {
                roomId: room.roomId
            });
        }

        return res.status(200).json({
            success: true,
            message: "Room deleted successfully."
        });

    } catch (error) {
        next(error);
    }
};