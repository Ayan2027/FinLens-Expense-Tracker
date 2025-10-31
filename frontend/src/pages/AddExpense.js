// src/pages/AddExpense.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { motion } from "framer-motion";

const AddExpense = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [userInfo, setUserInfo] = useState(() => {
    const info = localStorage.getItem("userInfo");
    return info ? JSON.parse(info) : null;
  });

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    fetchExpenses();
    // eslint-disable-next-line
  }, [userInfo, navigate]);

  const fetchExpenses = async () => {
    try {
      const token = userInfo?.token;
      const { data } = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(data);
    } catch (error) {
      console.error("fetchExpenses error:", error);
      alert("Failed to fetch expenses (check backend).");
    }
  };

  const handleAdd = async () => {
    if (!title || !amount || !category) {
      alert("Please fill all fields");
      return;
    }
    try {
      const token = userInfo?.token;
      await axios.post(
        "http://localhost:5000/api/expenses",
        { title, amount: Number(amount), category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setAmount("");
      setCategory("");
      fetchExpenses();
    } catch (error) {
      console.error("handleAdd error:", error);
      alert("Failed to add expense");
    }
  };

  const deleteExpenseItem = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      const token = userInfo?.token;
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (error) {
      console.error("deleteExpenseItem error:", error);
      alert("Failed to delete expense");
    }
  };

  const getCategoryColor = (cat) => {
    const colorMap = {
      Food: "bg-green-900/40 text-green-200",
      Travel: "bg-blue-900/40 text-blue-200",
      Shopping: "bg-purple-900/40 text-purple-200",
      Bills: "bg-yellow-900/40 text-yellow-200",
      Other: "bg-gray-700/50 text-gray-300",
    };
    return colorMap[cat] || "bg-gray-700/50 text-gray-300";
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchCategory = filter === "All" || exp.category === filter;
    const matchSearch =
      exp.title?.toLowerCase().includes(search.toLowerCase()) ?? true;
    return matchCategory && matchSearch;
  });

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100 transition-colors duration-300">

      <div className="max-w-6xl mx-auto p-6">
        {/* Add Expense Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/70 rounded-xl shadow-xl border border-gray-800 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">➕ Add New Expense</h3>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-700 bg-gray-800 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              placeholder="Amount (₹)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-700 bg-gray-800 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-700 bg-gray-800 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Category</option>
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Other</option>
            </select>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
            >
              + Add Expense
            </button>
          </div>
        </motion.div>

        {/* Expense List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/70 rounded-xl shadow-xl border border-gray-800 p-6"
        >
          <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
            <h3 className="text-lg font-semibold">Your Expenses</h3>
            <div className="flex gap-3">
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-700 bg-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-700 bg-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All</option>
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <p className="text-gray-400 text-center">No expenses found 📝</p>
          ) : (
            <ul className="space-y-3">
              {filteredExpenses.map((exp) => (
                <motion.li
                  key={exp._id}
                  whileHover={{ scale: 1.01 }}
                  className="flex justify-between items-center bg-gray-800/60 border border-gray-700 rounded-lg p-4 transition"
                >
                  <div>
                    <p className="font-semibold">{exp.title}</p>
                    <p className="text-sm text-gray-400">
                      ₹{exp.amount} •{" "}
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${getCategoryColor(
                          exp.category
                        )}`}
                      >
                        {exp.category || "Other"}
                      </span>{" "}
                      <span className="ml-2 text-xs text-gray-500">
                        {exp.createdAt
                          ? new Date(exp.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => deleteExpenseItem(exp._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition"
                  >
                    Delete
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AddExpense;
