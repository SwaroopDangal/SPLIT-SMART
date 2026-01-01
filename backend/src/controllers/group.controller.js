import Group from "../models/Group.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../lib/cloudinary.js";
import { ENV } from "../lib/env.js";
import crypto from "crypto";
import GroupInvite from "../models/GroupInvite.js";

export const createGroup = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name } = req.body;
    const photo = req.file;

    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    let profileImage;

    if (photo) {
      const uploadResult = await uploadMedia(photo.buffer);
      profileImage = uploadResult.secure_url;
    }

    const group = await Group.create({
      name,
      admin: userId,
      profileImage,
      members: [userId],
    });

    return res.status(201).json(group);
  } catch (error) {
    console.error("Create Group Error:", error);
    return res.status(500).json({ message: "Error creating group" });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await Group.find({
      $or: [{ admin: userId }, { members: userId }],
    });
    return res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting groups" });
  }
};

export const getMyRoleinGroup = async (req, res) => {
  try {
    const userId = req.user._id;
    const groupId = req.params.id;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    console.log(userId, group.admin);
    const isAdmin = group.admin.equals(userId);
    if (isAdmin) return res.status(200).json({ role: "admin", canEnter: true });
    const isMember = group.members.some((memberId) => memberId.equals(userId));

    if (isMember)
      return res.status(200).json({ role: "member", canEnter: true });

    return res.status(200).json({ role: "guest", canEnter: false });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting group role" });
  }
};

export const createInvitationLink = async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.user._id;
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const isAdmin = group.admin.equals(userId);
    if (!isAdmin) {
      return res.status(403).json({ message: "You are not an admin" });
    }

    const invite = await GroupInvite.create({
      groupId,
      token,
      expiresAt,
      createdBy: userId,
    });

    return res.status(201).json({
      invitationLink: `${ENV.CLIENT_URL}/group/${groupId}/invite/${invite.token}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating invitation link" });
  }
};

export const verifyInvitationLink = async (req, res) => {
  const groupId = req.params.groupId;
  const token = req.params.token;
  const userId = req.user._id;

  try {
    const invite = await GroupInvite.findOne({ token });
    if (!invite) {
      return res.status(404).json({ message: "Invitation link not found" });
    }
    if (invite.expiresAt < new Date()) {
      return res.status(403).json({ message: "Invitation link expired" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (group.admin.equals(userId)) {
      return res.status(403).json({ message: "You are admin" });
    }
    group.members.forEach((memberId) => {
      if (memberId.equals(userId)) {
        return res.status(403).json({ message: "You are already a member" });
      }
    });

    group.members.push(userId);
    await group.save();

    return res
      .status(200)
      .json({ message: `You are part of group ${group.name}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error verifying invitation link" });
  }
};

export const getGroupInfoById = async (req, res) => {
  const groupId = req.params.id;
  const userId = req.user._id;

  try {
    const group = await Group.findById(groupId).populate("members", "name");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some((memberId) => memberId.equals(userId));
    const isAdmin = group.admin.equals(userId);
    if (!isMember && !isAdmin) {
      return res.status(403).json({ message: "You are not part of group" });
    }

    return res.status(200).json(group);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting group info" });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const userId = req.user._id;
    const groupId = req.params.id;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (group.admin.equals(userId)) {
      await Group.findByIdAndDelete(groupId);
      return res.status(200).json({ message: "Group deleted", success: true });
    }
    return res.status(403).json({ message: "You are not an admin" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting group" });
  }
};
