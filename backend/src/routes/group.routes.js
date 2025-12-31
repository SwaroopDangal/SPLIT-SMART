import express from "express";
import {
  createGroup,
  getMyGroups,
  getMyRoleinGroup,
} from "../controllers/group.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.post("/", protectRoute, upload.single("photo"), createGroup);
router.get("/", protectRoute, getMyGroups);
router.get("/", protectRoute, getMyGroups);
router.get("/:id/role", protectRoute, getMyRoleinGroup);

router.get("/:groupId/invite", createInvitationLink);

router.get("/:groupId/invite/:token", verifyInvitationLink);

export default router;
