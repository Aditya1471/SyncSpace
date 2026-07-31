import express from "express";

import {

    createMessage,

    getRoomMessages,

    latestMessages,

    updateMessage,

    removeMessage,

    reactMessage,

    removeMessageReaction,

    searchChat,

    clearRoomChat

} from "../controllers/chatController.js";


import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();




// =================================================
// ROOM CHAT ROUTES
// =================================================


// Send Message
// POST /api/chat/:roomId
router.post(
    "/:roomId",
    protect,
    createMessage
);




// Get Room Messages
// GET /api/chat/:roomId
router.get(
    "/:roomId",
    protect,
    getRoomMessages
);




// Get Latest Messages
// GET /api/chat/:roomId/latest
router.get(
    "/:roomId/latest",
    protect,
    latestMessages
);




// Search Messages
// GET /api/chat/:roomId/search?keyword=test
router.get(
    "/:roomId/search",
    protect,
    searchChat
);





// =================================================
// MESSAGE ACTION ROUTES
// =================================================


// Edit Message
// PUT /api/chat/message/:id
router.put(
    "/message/:id",
    protect,
    updateMessage
);




// Delete Message
// DELETE /api/chat/message/:id
router.delete(
    "/message/:id",
    protect,
    removeMessage
);




// Add Reaction
// POST /api/chat/message/:id/reaction
router.post(
    "/message/:id/reaction",
    protect,
    reactMessage
);




// Remove Reaction
// DELETE /api/chat/message/:id/reaction
router.delete(
    "/message/:id/reaction",
    protect,
    removeMessageReaction
);





// =================================================
// CLEAR CHAT
// =================================================


// Delete Complete Room Chat
// DELETE /api/chat/:roomId
router.delete(
    "/:roomId",
    protect,
    clearRoomChat
);



export default router;