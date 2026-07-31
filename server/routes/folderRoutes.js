import express from "express";


import {

    create,

    getContent,

    getTree,

    rename,

    remove,

    move,

    check

} from "../controllers/folderController.js";


import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();





// =================================================
// FOLDER ROUTES
// =================================================





// Create Folder
// POST /api/folders/:roomId
router.post(
    "/:roomId",
    protect,
    create
);





// Get Folder Content
// GET /api/folders/:roomId/content?folderPath=src
router.get(
    "/:roomId/content",
    protect,
    getContent
);





// Get Complete Folder Tree
// GET /api/folders/:roomId/tree
router.get(
    "/:roomId/tree",
    protect,
    getTree
);





// Rename Folder
// PUT /api/folders/:roomId/rename
router.put(
    "/:roomId/rename",
    protect,
    rename
);





// Delete Folder
// DELETE /api/folders/:roomId
router.delete(
    "/:roomId",
    protect,
    remove
);





// Move Folder
// PUT /api/folders/:roomId/move
router.put(
    "/:roomId/move",
    protect,
    move
);





// Check Folder Exists
// GET /api/folders/:roomId/check?folderPath=src
router.get(
    "/:roomId/check",
    protect,
    check
);





export default router;