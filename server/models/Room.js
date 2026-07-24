import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: [true, "Room ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, "Room ID must be at least 3 characters"],
      maxlength: [20, "Room ID cannot exceed 20 characters"],
    },

    roomName: {
      type: String,
      required: [true, "Room Name is required"],
      trim: true,
      minlength: [3, "Room Name must be at least 3 characters"],
      maxlength: [50, "Room Name cannot exceed 50 characters"],
    },

    createdBy: {
      type: String,
      required: [true, "Creator is required"],
      trim: true,
      maxlength: [50, "Creator name is too long"],
    },

    participants: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast room lookup
roomSchema.index({ roomId: 1 });

const Room = mongoose.model("Room", roomSchema);

export default Room;