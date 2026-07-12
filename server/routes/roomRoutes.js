const express = require("express");

const router = express.Router();

const {
    createRoom,
    getRooms,
    getRoom,
    deleteRoom
} = require("../controllers/roomController");

const { body, validationResult } = require("express-validator");

const validateRoom = [

    body("roomId")
        .notEmpty()
        .withMessage("Room ID is required"),

    body("roomName")
        .notEmpty()
        .withMessage("Room Name is required"),

    body("createdBy")
        .notEmpty()
        .withMessage("Creator is required"),

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

router.post("/", validateRoom, createRoom);

router.get("/", getRooms);

router.get("/:roomId", getRoom);

router.delete("/:roomId", deleteRoom);

module.exports = router;