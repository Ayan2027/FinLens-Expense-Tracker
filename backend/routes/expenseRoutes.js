import express from "express";
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  expenseItemDelete
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addExpense).get(protect, getExpenses);
router.route("/:id").put(protect, updateExpense).delete(protect, expenseItemDelete);


export default router;
