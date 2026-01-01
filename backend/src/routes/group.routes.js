import express from "express";
import {
  createGroup,
  createInvitationLink,
  deleteGroup,
  getGroupInfoById,
  getMyGroups,
  getMyRoleinGroup,
  verifyInvitationLink,
} from "../controllers/group.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.post("/", protectRoute, upload.single("photo"), createGroup);
router.get("/", protectRoute, getMyGroups);
router.get("/", protectRoute, getMyGroups);
router.get("/:id", protectRoute, getGroupInfoById);
router.get("/:id/role", protectRoute, getMyRoleinGroup);

router.get("/:groupId/invite", protectRoute, createInvitationLink);

router.get("/:groupId/invite/:token", protectRoute, verifyInvitationLink);
router.delete("/:id", protectRoute, deleteGroup);

export default router;
