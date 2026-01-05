import Activity from "../models/activity.model.js";
import Group from "../models/group.model.js";

export const getUserRecentActivities = async (req, res) => {
  const userId = req.user._id;

  // 1. Find groups user belongs to
  const groups = await Group.find({ members: userId }, { _id: 1 });

  const groupIds = groups.map((g) => g._id);

  // 2. Fetch recent activities from those groups
  const activities = await Activity.find({
    groupId: { $in: groupIds },
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "name")
    .populate("groupId", "name");

  res.json(activities);
};
