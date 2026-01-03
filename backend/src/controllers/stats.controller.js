import Expense from "../models/Expense";

export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const result1 = await Expense.aggregate([
      { $unwind: "$paidBy" },
      { $match: { "paidBy.userId": userId } },
      {
        $group: {
          _id: null,
          total: { $sum: "$paidBy.amount" },
        },
      },
      {
        $project: {
          _id: 0,
          total: { $round: ["$total", 2] },
        },
      },
    ]);

    const amountIamOwed = result1[0]?.total || 0;

    const result2 = await Expense.aggregate([
      { $unwind: "$splitAmong" },
      { $match: { "splitAmong.userId": userId } },
      {
        $group: {
          _id: null,
          total: { $sum: "$splitAmong.amount" },
        },
      },
      {
        $project: {
          _id: 0,
          total: { $round: ["$total", 2] },
        },
      },
    ]);

    const amountIowe = result2[0]?.total || 0;

    const totalBalance = amountIamOwed - amountIowe;

    res.status(200).json({
      totalBalance,
      amountIamOwed,
      amountIowe,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting stats" });
  }
};
