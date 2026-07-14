const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        // Unique Room ID
        roomId: {
            type: String,
            required: [true, "Room ID is required"],
            unique: true,
            trim: true,
            uppercase: true,
            minlength: 4,
            maxlength: 20
        },

        // Room Name
        roomName: {
            type: String,
            required: [true, "Room name is required"],
            trim: true,
            minlength: 3,
            maxlength: 50
        },

        // Room Creator / Host
        createdBy: {
            type: String,
            required: [true, "Creator is required"],
            trim: true
        },

        // Programming Language
        language: {
            type: String,
            default: "javascript",
            enum: [
                "javascript",
                "typescript",
                "python",
                "java",
                "cpp",
                "c",
                "csharp",
                "go",
                "php",
                "rust"
            ]
        },

        // Public or Private Room
        isPrivate: {
            type: Boolean,
            default: false
        },

        // Password (optional)
        password: {
            type: String,
            default: null
        },

        // Connected Users
        participants: {
            type: [String],
            default: []
        },

        // Maximum Users Allowed
        maxParticipants: {
            type: Number,
            default: 10,
            min: 2,
            max: 100
        },

        // Room Status
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        },

        // Last Activity
        lastActivity: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Automatically update last activity before saving
roomSchema.pre("save", function (next) {
    this.lastActivity = new Date();
    next();
});

// Virtual field for participant count
roomSchema.virtual("participantCount").get(function () {
    return this.participants.length;
});

// Include virtuals in JSON responses
roomSchema.set("toJSON", {
    virtuals: true
});

roomSchema.set("toObject", {
    virtuals: true
});

module.exports = mongoose.model("Room", roomSchema);