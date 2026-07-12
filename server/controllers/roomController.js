const Room = require("../models/Room");


// Create Room

exports.createRoom = async (req, res) => {

    try {

        const { roomId, roomName, createdBy } = req.body;

        const roomExists = await Room.findOne({ roomId });

        if (roomExists) {
            return res.status(400).json({
                success: false,
                message: "Room already exists"
            });
        }

        const room = await Room.create({
            roomId,
            roomName,
            createdBy
        });

        res.status(201).json({
            success: true,
            data: room
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};




// Get All Rooms

exports.getRooms = async (req, res) => {

    try {

        const rooms = await Room.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};




// Get Single Room

exports.getRoom = async (req, res) => {

    try {

        const room = await Room.findOne({
            roomId: req.params.roomId
        });

        if (!room) {

            return res.status(404).json({
                success: false,
                message: "Room not found"
            });

        }

        res.status(200).json({
            success: true,
            data: room
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};




// Delete Room

exports.deleteRoom = async (req, res) => {

    try {

        const room = await Room.findOne({
            roomId: req.params.roomId
        });

        if (!room) {

            return res.status(404).json({
                success: false,
                message: "Room not found"
            });

        }

        await room.deleteOne();

        res.status(200).json({
            success: true,
            message: "Room deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};