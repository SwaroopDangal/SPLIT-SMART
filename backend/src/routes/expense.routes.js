import express from "express";
import { addExpense, getAllExpensesOfAGroup } from "../controllers/expense.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, addExpense);
router.get("/:id", protectRoute, getAllExpensesOfAGroup);

export default router;
