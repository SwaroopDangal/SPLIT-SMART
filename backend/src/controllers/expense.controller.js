import Expense from "../models/Expense.js";

export const addExpense = async (req, res) => {
  try {
    const { description, amount, date, paidBy, splitAmong } = req.body;
    const userId = req.user._id;

    const expense = await Expense.create({
      description,
      amount,
      date,
      paidBy,
      splitAmong,
      createdBy: userId,
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding expense" });
  }
};
