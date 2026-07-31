import express from "express";


import {
    executeCode
} from "../controllers/runController.js";


import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();





/*
=================================================
CODE EXECUTION ROUTES
=================================================
*/


// Run Code
// POST /api/run
router.post(
    "/",
    protect,
    executeCode
);





export default router;