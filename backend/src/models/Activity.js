import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["EXPENSE_ADDED", "EXPENSE_DELETED", "GROUP_SETTLED"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    meta: {
      type: Object, // optional extra data
    },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
