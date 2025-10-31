// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState("");
  const [savedBudget, setSavedBudget] = useState(
    parseFloat(localStorage.getItem("budget")) || 0
  );

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

  const handleSaveBudget = () => {
    if (!budget) return alert("Enter a valid budget!");
    localStorage.setItem("budget", budget);
    setSavedBudget(parseFloat(budget));
    setBudget("");
  };

  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const remaining = savedBudget - totalExpense;
  const spentPercent =
    savedBudget > 0 ? Math.min((totalExpense / savedBudget) * 100, 100) : 0;

  const progressColor =
    spentPercent >= 100
      ? "bg-red-600"
      : spentPercent >= 80
      ? "bg-orange-500"
      : "bg-green-500";

  const categoryTotals = expenses.reduce((acc, curr) => {
    const cat = curr.category || "Other";
    acc[cat] = (acc[cat] || 0) + Number(curr.amount || 0);
    return acc;
  }, {});

  const topCategory =
    Object.keys(categoryTotals).length > 0
      ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const monthlyData = (() => {
    const now = new Date();
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("default", { month: "short" });
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      months.push({ label, key, total: 0 });
    }
    expenses.forEach((exp) => {
      if (!exp.createdAt) return;
      const d = new Date(exp.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const m = months.find((mm) => mm.key === key);
      if (m) m.total += Number(exp.amount || 0);
    });
    return months.map((m) => ({ month: m.label, total: m.total }));
  })();

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"];

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100 transition-colors duration-300">


      <div className="max-w-6xl mx-auto p-6">
        {/* Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            { title: "Total Expenses", value: `₹${totalExpense}`, color: "from-blue-500 to-indigo-600" },
            { title: "Top Category", value: topCategory, color: "from-emerald-500 to-green-600" },
            { title: "Remaining Budget", value: `₹${remaining}`, color: "from-pink-500 to-rose-600" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className={`bg-gradient-to-r ${item.color} p-5 rounded-xl shadow-lg`}
            >
              <h3 className="text-sm font-medium opacity-90">{item.title}</h3>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Budget Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/70 backdrop-blur-md rounded-xl shadow-xl p-6 mb-8 border border-gray-800"
        >
          <h3 className="text-xl font-semibold mb-4">💰 Monthly Budget Tracker</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            <input
              type="number"
              placeholder="Enter monthly budget (₹)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="border border-gray-700 bg-gray-800 rounded-lg p-3 w-48 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleSaveBudget}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Save Budget
            </button>
          </div>

          {savedBudget > 0 && (
            <>
              <p className="text-sm mb-2">
                Total: ₹{savedBudget} | Spent: ₹{totalExpense} | Remaining: ₹{remaining}
              </p>
              <div className="w-full bg-gray-800 rounded-full h-4">
                <div
                  className={`${progressColor} h-4 rounded-full`}
                  style={{ width: `${spentPercent}%` }}
                ></div>
              </div>
            </>
          )}
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/70 rounded-xl p-6 shadow-xl border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-3">📊 Category Breakdown</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {chartData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center">No data yet 📉</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/70 rounded-xl p-6 shadow-xl border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-3">📈 Monthly Spending Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
