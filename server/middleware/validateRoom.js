const { body, validationResult } = require("express-validator");

const validateRoom = [

  body("roomId")
    .trim()
    .notEmpty()
    .withMessage("Room ID is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Room ID must be between 3 and 20 characters")
    .matches(/^[A-Za-z0-9_-]+$/)
    .withMessage("Room ID must contain only letters, numbers, '_' or '-'"),

  body("roomName")
    .trim()
    .notEmpty()
    .withMessage("Room Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Room Name must be between 3 and 50 characters"),

  body("createdBy")
    .trim()
    .notEmpty()
    .withMessage("Creator is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Creator name must be between 2 and 50 characters"),

  (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: errors.array(),
      });

    }

    next();
  },

];

module.exports = validateRoom;