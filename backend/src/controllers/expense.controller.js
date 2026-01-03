import Expense from "../models/Expense.js";
import Group from "../models/Group.js";

export const addExpense = async (req, res) => {
  try {
    const { description, amount, date, paidBy, splitAmong, groupId } = req.body;
    const clerkId = req.user.clerkId;

    const expense = await Expense.create({
      description,
      groupId,
      amount,
      date,
      paidBy,
      splitAmong,
      createdBy: clerkId,
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding expense" });
  }
};

export const getAllExpensesOfAGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!group.members.some((memberId) => memberId.equals(userId))) {
      return res.status(403).json({ message: "You are not part of group" });
    }

    const expenses = await Expense.find({
      groupId,
    }).populate("paidBy.userId", "name");

    return res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting expenses" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const userId = req.user.clerkId;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    if (expense.createdBy !== userId) {
      return res.status(403).json({ message: "You are not the creator" });
    }

    await Expense.findByIdAndDelete(expenseId);

    return res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting expense" });
  }
};
