import express from "express";


import {

    createTerminalSession,

    executeTerminalCommand,

    getTerminalHistory,

    removeTerminalHistory,

    closeTerminalSession

} from "../controllers/terminalController.js";


import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();





/*
=================================================
TERMINAL ROUTES
=================================================
*/





// Create Terminal Session
// POST /api/terminal/:roomId/session
router.post(
    "/:roomId/session",
    protect,
    createTerminalSession
);





// Execute Command
// POST /api/terminal/:roomId/execute
router.post(
    "/:roomId/execute",
    protect,
    executeTerminalCommand
);





// Get Terminal History
// GET /api/terminal/:roomId/history
router.get(
    "/:roomId/history",
    protect,
    getTerminalHistory
);





// Clear Terminal History
// DELETE /api/terminal/:roomId/history
router.delete(
    "/:roomId/history",
    protect,
    removeTerminalHistory
);





// Close Terminal Session
// DELETE /api/terminal/session/:sessionId
router.delete(
    "/session/:sessionId",
    protect,
    closeTerminalSession
);





export default router;