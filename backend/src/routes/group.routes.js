import express from "express";
import { createGroup, getMyGroups } from "../controllers/group.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.post("/", protectRoute, upload.single("photo"), createGroup);
router.get("/", protectRoute, getMyGroups);

export default router;
