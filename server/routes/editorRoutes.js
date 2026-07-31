import express from "express";


import {

    openEditorFile,

    saveEditorFile,

    updateEditorCode,

    autoSaveEditor,

    getEditor,

    changeLanguage,

    changeTheme,

    activeFile,

    removeEditorFile

} from "../controllers/editorController.js";


import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();





// =================================================
// EDITOR ROUTES
// =================================================




// Open File
// GET /api/editor/:roomId/file/:fileId
router.get(
    "/:roomId/file/:fileId",
    protect,
    openEditorFile
);





// Save File
// POST /api/editor/:roomId/save
router.post(
    "/:roomId/save",
    protect,
    saveEditorFile
);





// Update Code
// PUT /api/editor/:roomId/code
router.put(
    "/:roomId/code",
    protect,
    updateEditorCode
);





// Auto Save
// POST /api/editor/:roomId/autosave
router.post(
    "/:roomId/autosave",
    protect,
    autoSaveEditor
);





// Get Editor State
// GET /api/editor/:roomId/state
router.get(
    "/:roomId/state",
    protect,
    getEditor
);





// Change Programming Language
// PUT /api/editor/:roomId/language
router.put(
    "/:roomId/language",
    protect,
    changeLanguage
);





// Change Editor Theme
// PUT /api/editor/:roomId/theme
router.put(
    "/:roomId/theme",
    protect,
    changeTheme
);





// Get Current Active File
// GET /api/editor/:roomId/active
router.get(
    "/:roomId/active",
    protect,
    activeFile
);





// Delete Editor File
// DELETE /api/editor/:roomId/file/:fileId
router.delete(
    "/:roomId/file/:fileId",
    protect,
    removeEditorFile
);





export default router;