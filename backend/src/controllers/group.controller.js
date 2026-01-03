import Group from "../models/Group.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../lib/cloudinary.js";
import { ENV } from "../lib/env.js";
import crypto from "crypto";
import GroupInvite from "../models/GroupInvite.js";
import fs from "fs/promises";
import Expense from "../models/Expense.js";

export const createGroup = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name } = req.body;
    const photo = req.file;

    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    let profileImage;
    let publicId;

    if (photo) {
      const uploadResult = await uploadMedia(photo.path);
      profileImage = uploadResult.secure_url;
      publicId = uploadResult.public_id;

      // ✅ Delete local file from /uploads
      await fs.unlink(photo.path);
    }

    const group = await Group.create({
      name,
      admin: userId,
      profileImage,
      members: [userId],
      publicId,
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
    const existingInvite = await GroupInvite.findOne({ groupId }).sort({
      createdAt: -1,
    });
    if (existingInvite && existingInvite.expiresAt > new Date()) {
      return res.status(201).json({
        invitationLink: `${ENV.CLIENT_URL}/group/${groupId}/invite/${existingInvite.token}`,
      });
    }
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
    if (!group.admin.equals(userId)) {
      return res.status(403).json({ message: "You are not an admin" });
    }
    // ✅ 1. Delete group image from Cloudinary

    if (group?.publicId) {
      await deleteMediaFromCloudinary(group.publicId);
    }
    // ✅ 2. Delete related invites
    await GroupInvite.deleteMany({ groupId });

    // ✅ 3. Delete group
    await Group.findByIdAndDelete(groupId);

    return res.status(200).json({
      message: "Group deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting group" });
  }
};

export const getGroupExpensesAndSettlements = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId).populate(
      "members",
      "name profileImage"
    );
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!group.members.some((memberId) => memberId.equals(userId))) {
      return res.status(403).json({ message: "You are not part of group" });
    }

    const expenses = await Expense.find({
      groupId,
    })
      .populate("paidBy.userId", "name profileImage")
      .populate("splitAmong.userId", "name profileImage");

    const memberMap = new Map();
    group.members.forEach((member) => {
      memberMap.set(member._id.toString(), {
        id: member._id,
        name: member.name,
        avatar: member.avatar,
        totalPaid: 0,
        totalOwed: 0,
      });
    });
    let totalExpenses = 0;
    expenses.forEach((expense) => {
      totalExpenses += expense.amount;

      expense.paidBy.forEach((paidBy) => {
        const user = memberMap.get(paidBy.userId.toString());
        if (user) user.totalPaid += paidBy.amount;
      });
      expense.splitAmong.forEach((splitAmong) => {
        const user = memberMap.get(splitAmong.userId.toString());
        if (user) user.totalOwed += splitAmong.amount;
      });
    });

    //compute balance and status
    const members = Array.from(
      memberMap.values().map((m) => {
        const balance = m.totalPaid - m.totalOwed;
        return {
          ...m,
          balance,
          status: balance > 0 ? "owed" : "owes",
        };
      })
    );

    //settlement algorithm
    const creditors = members
      .filter((m) => m.balance > 0)
      .map((m) => ({ ...m }));

    const debtors = members
      .filter((m) => m.balance < 0)
      .map((m) => ({ ...m, balance: Math.abs(m.balance) }));

    //generate settlements
    let settlements = [];
    let i = 0;
    let j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: +amount.toFixed(2),
      });
      debtor.balance -= amount;
      creditor.balance -= amount;

      if (debtor.balance === 0) i++;
      if (creditor.balance === 0) j++;
    }

    const groupBalance = {
      groupName: group.name,
      totalExpenses: +totalExpenses.toFixed(2),
      members,
      settlements,
    };
    return res.status(200).json(groupBalance);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting expenses" });
  }
};
