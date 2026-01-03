import express from "express";
import {
  addExpense,
  deleteExpense,
  getAllExpensesOfAGroup,
} from "../controllers/expense.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, addExpense);
router.get("/:id", protectRoute, getAllExpensesOfAGroup);
router.delete("/:id", protectRoute, deleteExpense);

export default router;
