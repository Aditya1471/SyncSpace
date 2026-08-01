import express from "express";
import {
  getGitStatus,
  getNotifications,
} from "../controllers/activityController.js";

const router = express.Router();

// GET /api/activity/git
router.get("/git", getGitStatus);

// GET /api/activity/notifications
router.get("/notifications", getNotifications);

export default router;