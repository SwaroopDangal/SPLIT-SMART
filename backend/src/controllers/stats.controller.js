import mongoose from "mongoose";
import Expense from "../models/Expense.js";

export const getStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // 1️⃣ Total amount user PAID (including their own share)
    const paidResult = await Expense.aggregate([
      { $unwind: "$paidBy" },
      { $match: { "paidBy.userId": userId } },
      {
        $group: {
          _id: null,
          totalPaid: { $sum: "$paidBy.amount" },
        },
      },
    ]);

    const totalPaid = paidResult[0]?.totalPaid || 0;

    // 2️⃣ Total amount user SHOULD PAY (their share)
    const shareResult = await Expense.aggregate([
      { $unwind: "$splitAmong" },
      { $match: { "splitAmong.userId": userId } },
      {
        $group: {
          _id: null,
          totalShare: { $sum: "$splitAmong.amount" },
        },
      },
    ]);

    const totalShare = shareResult[0]?.totalShare || 0;

    // 3️⃣ Net balance (ONLY truth that matters)
    const netBalance = (totalPaid - totalShare).toFixed(2);

    res.status(200).json({
      netBalance,
      totalPaid: totalPaid.toFixed(2),
      totalShare: totalShare.toFixed(2),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting stats" });
  }
};
