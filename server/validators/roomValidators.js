const { body } = require("express-validator");

exports.createRoomValidator = [

    body("roomName")
        .trim()
        .notEmpty()
        .withMessage("Room name is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Room name should be between 3 and 50 characters"),

    body("language")
        .notEmpty()
        .withMessage("Language is required"),

    body("isPrivate")
        .optional()
        .isBoolean()
        .withMessage("isPrivate must be true or false")
];