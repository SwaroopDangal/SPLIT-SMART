import express from "express";
import { addExpense } from "../controllers/expense.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, addExpense);

export default router;
