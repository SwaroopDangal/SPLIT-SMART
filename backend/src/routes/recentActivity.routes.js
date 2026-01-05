import express from "express";
import { getUserRecentActivities } from "../controllers/recentActivity.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/recentActivities", protectRoute, getUserRecentActivities);

export default router;
