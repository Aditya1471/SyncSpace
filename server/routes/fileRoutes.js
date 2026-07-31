import express from "express";


import {

    create,

    getAllFiles,

    getFile,

    update,

    remove,

    rename,

    move,

    search

} from "../controllers/fileController.js";


import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();





// =================================================
// FILE ROUTES
// =================================================





// Create New File
// POST /api/files/:roomId
router.post(
    "/:roomId",
    protect,
    create
);





// Get All Workspace Files
// GET /api/files/:roomId
router.get(
    "/:roomId",
    protect,
    getAllFiles
);





// Read Specific File
// GET /api/files/:roomId/:filePath
router.get(
    "/:roomId/:filePath",
    protect,
    getFile
);





// Update File Content
// PUT /api/files/:roomId
router.put(
    "/:roomId",
    protect,
    update
);





// Delete File
// DELETE /api/files/:roomId
router.delete(
    "/:roomId",
    protect,
    remove
);





// Rename File
// PUT /api/files/:roomId/rename
router.put(
    "/:roomId/rename",
    protect,
    rename
);





// Move File
// PUT /api/files/:roomId/move
router.put(
    "/:roomId/move",
    protect,
    move
);





// Search Files
// GET /api/files/:roomId/search?query=test
router.get(
    "/:roomId/search",
    protect,
    search
);





export default router;