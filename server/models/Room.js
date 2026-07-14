const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
{
    roomId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    roomName: {
        type: String,
        required: true,
        trim: true
    },

    createdBy: {
        type: String,
        required: true
    },

    participants: {
        type: [String],
        default: []
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Room", roomSchema);