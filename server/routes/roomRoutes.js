const express = require("express");
const { body, validationResult } = require("express-validator");

const router = express.Router();

const {
    createRoom,
    getRooms,
    getRoom,
    updateRoom,
    deleteRoom,
    joinRoom,
    leaveRoom
} = require("../controllers/roomController");

/*
|--------------------------------------------------------------------------
| Validation Middleware
|--------------------------------------------------------------------------
*/

const validateRoom = [

    body("roomId")
        .trim()
        .notEmpty()
        .withMessage("Room ID is required")
        .isLength({ min: 3, max: 20 })
        .withMessage("Room ID must be between 3 and 20 characters"),

    body("roomName")
        .trim()
        .notEmpty()
        .withMessage("Room Name is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Room Name must be between 3 and 50 characters"),

    body("createdBy")
        .trim()
        .notEmpty()
        .withMessage("Creator is required"),

    body("language")
        .optional()
        .isString()
        .withMessage("Language must be a string"),

    body("isPrivate")
        .optional()
        .isBoolean()
        .withMessage("isPrivate must be true or false"),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        next();

    }

];

const validateJoinLeave = [

    body("userId")
        .trim()
        .notEmpty()
        .withMessage("User ID is required"),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        next();

    }

];

/*
|--------------------------------------------------------------------------
| Room Routes
|--------------------------------------------------------------------------
*/

// Create Room
router.post("/", validateRoom, createRoom);

// Get All Rooms
router.get("/", getRooms);

// Get Single Room
router.get("/:roomId", getRoom);

// Update Room
router.put("/:roomId", updateRoom);

// Join Room
router.post("/:roomId/join", validateJoinLeave, joinRoom);

// Leave Room
router.post("/:roomId/leave", validateJoinLeave, leaveRoom);

// Delete Room
router.delete("/:roomId", deleteRoom);

module.exports = router;