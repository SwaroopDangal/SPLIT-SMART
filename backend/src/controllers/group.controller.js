import Group from "../models/Group";
import { deleteMediaFromCloudinary, uploadMedia } from "../lib/cloudinary.js";

export const createGroup = async (req, res) => {
  try {
    const userId = req.user._id;
    const photo = req.file;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    let photoPic;
    if (photo) {
      photoPic = await uploadMedia(photo.buffer);
    }

    const group = await Group.create({
      name,
      admin: userId,
      profileImage: photoPic?.secure_url,
    });

    return res.status(201).json(group);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating group" });
  }
};
