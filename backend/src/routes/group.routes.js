import express from "express";
import { createGroup } from "../controllers/group.controller";
import { protectRoute } from "../middleware/protectRoute";
import upload from "../lib/multer";

const router = express.Router();

router.post("/", protectRoute, upload.single("photo"), createGroup);
router.get("/", getMyGroups);

export default router;
