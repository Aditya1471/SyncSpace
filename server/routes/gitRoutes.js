import express from "express";


import {

    initializeGit,

    status,

    add,

    remove,

    createCommit,

    history,

    currentBranch,

    branches,

    createNewBranch,

    checkout,

    removeBranch,

    diff,

    gitCheck

} from "../controllers/gitController.js";


import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();





// =================================================
// GIT ROUTES
// =================================================





// Check Git Installation
// GET /api/git/check
router.get(
    "/check",
    protect,
    gitCheck
);





// Initialize Repository
// POST /api/git/:roomId/init
router.post(
    "/:roomId/init",
    protect,
    initializeGit
);





// Git Status
// GET /api/git/:roomId/status
router.get(
    "/:roomId/status",
    protect,
    status
);





// Add File
// POST /api/git/:roomId/add
router.post(
    "/:roomId/add",
    protect,
    add
);





// Remove File From Stage
// DELETE /api/git/:roomId/remove
router.delete(
    "/:roomId/remove",
    protect,
    remove
);





// Create Commit
// POST /api/git/:roomId/commit
router.post(
    "/:roomId/commit",
    protect,
    createCommit
);





// Commit History
// GET /api/git/:roomId/history
router.get(
    "/:roomId/history",
    protect,
    history
);





// Current Branch
// GET /api/git/:roomId/branch
router.get(
    "/:roomId/branch",
    protect,
    currentBranch
);





// Get All Branches
// GET /api/git/:roomId/branches
router.get(
    "/:roomId/branches",
    protect,
    branches
);





// Create New Branch
// POST /api/git/:roomId/branch
router.post(
    "/:roomId/branch",
    protect,
    createNewBranch
);





// Checkout Branch
// PUT /api/git/:roomId/checkout
router.put(
    "/:roomId/checkout",
    protect,
    checkout
);





// Delete Branch
// DELETE /api/git/:roomId/branch
router.delete(
    "/:roomId/branch",
    protect,
    removeBranch
);





// Git Diff
// GET /api/git/:roomId/diff
router.get(
    "/:roomId/diff",
    protect,
    diff
);





export default router;