import express from "express";


import multer from "multer";


import {

    uploadSingle,

    uploadMultipleFiles,

    removeUpload,

    getUploadDetails

} from "../controllers/uploadController.js";


import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();





/*
=================================================
MULTER CONFIGURATION
=================================================
*/


const storage =
multer.memoryStorage();



const upload =
multer({

    storage,

    limits:{

        fileSize:
        50 * 1024 * 1024   // 50MB

    }

});





/*
=================================================
UPLOAD ROUTES
=================================================
*/





// Upload Single File
// POST /api/upload
router.post(
    "/",
    protect,
    upload.single("file"),
    uploadSingle
);





// Upload Multiple Files
// POST /api/upload/multiple
router.post(
    "/multiple",
    protect,
    upload.array("files",10),
    uploadMultipleFiles
);





// Get Upload Information
// GET /api/upload/:fileName
router.get(
    "/:fileName",
    protect,
    getUploadDetails
);





// Delete Uploaded File
// DELETE /api/upload/:fileName
router.delete(
    "/:fileName",
    protect,
    removeUpload
);





export default router;