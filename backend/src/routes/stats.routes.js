import express from "express";
import { getStats } from "../controllers/stats.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getStats);

export default router;
