import Activity from "../models/activity.model.js";

export const logActivity = async ({
  groupId,
  userId,
  type,
  message,
  meta = {},
}) => {
  try {
    await Activity.create({
      groupId,
      userId,
      type,
      message,
      meta,
    });
  } catch (err) {
    console.error("Activity log failed:", err.message);
  }
};
