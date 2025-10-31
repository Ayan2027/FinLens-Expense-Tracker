import Expense from "../models/Expense.js";

// Add new expense
export const addExpense = async (req, res) => {
  const { title, amount, category, date } = req.body;
  try {
    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date,
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all expenses of logged-in user
export const getExpenses = async (req, res) => {
  try {
    console.log("in getExpenses")
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    console.log(expenses)
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update expense
export const updateExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    await expense.remove();
    res.json({ message: "Expense removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const expenseItemDelete=async (req,res)=> {
  const {id} =req.params;
  try{
    console.log("in backend expmese delete")
    await Expense.findByIdAndDelete(id)
    res.json({message:"deleted succ.."})
  }
  catch(err){
    console.log("error is ",err)
  }
}
