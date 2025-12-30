import Group from "../models/Group.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../lib/cloudinary.js";

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
