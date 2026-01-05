import express from "express";
import {
  addExpense,
  deleteExpense,
  getAllExpensesOfAGroup,
  settleAllExpensesOfAGroup,
} from "../controllers/expense.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, addExpense);
router.get("/:id", protectRoute, getAllExpensesOfAGroup);
router.delete("/:groupId/settle", protectRoute, settleAllExpensesOfAGroup);
router.delete("/:groupId/:id", protectRoute, deleteExpense);

export default router;
