// src/pages/Landing.js
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ChartBarIcon, WalletIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const features = [
  {
    icon: <WalletIcon className="w-12 h-12 text-indigo-400" />,
    title: "Track Expenses",
    description: "Monitor daily, weekly, and monthly expenses effortlessly in one place.",
  },
  {
    icon: <ChartBarIcon className="w-12 h-12 text-green-400" />,
    title: "Visual Insights",
    description: "Analyze your spending habits with modern, interactive charts and graphs.",
  },
  {
    icon: <ShieldCheckIcon className="w-12 h-12 text-pink-400" />,
    title: "Secure & Private",
    description: "Your data is encrypted and fully private, ensuring complete peace of mind.",
  },
];

const gradientColors = ["from-indigo-500 to-pink-500", "from-green-400 to-blue-500", "from-purple-500 to-indigo-400"];

const Landing = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [currentGradient, setCurrentGradient] = useState(0);

  useEffect(() => {
    const info = localStorage.getItem("userInfo");
    if (info) setUserInfo(JSON.parse(info));

    const interval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradientColors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Common header buttons (Dashboard / Add Expense)
  const HeaderButtons = () => (
    <motion.div className="flex gap-4 flex-wrap justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}>
      {userInfo ? (
        <>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300"
          >
            Go to Dashboard
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/add-expense")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300"
          >
            Add Expense
          </motion.button>
        </>
      ) : (
        <>
          <Link
            to="/register"
            className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-xl shadow-xl transition-all duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="border border-gray-600 hover:border-gray-400 text-gray-300 font-semibold px-8 py-4 rounded-xl transition-all duration-300"
          >
            Login
          </Link>
        </>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen text-gray-100 bg-gray-950 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div className={`absolute inset-0 -z-10 bg-gradient-to-br ${gradientColors[currentGradient]} transition-all duration-2000`}></motion.div>

      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400 mb-6"
        >
          {userInfo ? `Welcome Back, ${userInfo.name.split(" ")[0]}!` : "Smart Expense Tracker"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10"
        >
          {userInfo
            ? "Access your dashboard to track, manage, and optimize your expenses efficiently."
            : "Take control of your finances with a modern, intuitive dashboard. Track your spending, analyze habits, and make smarter financial decisions."}
        </motion.p>

        <HeaderButtons />
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-center border border-gray-800 transition-all duration-300"
            >
              <div className="mb-6 flex justify-center">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-base">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!userInfo && (
        <section className="py-20 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold mb-6">
            Ready to take control of your finances?
          </motion.h2>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <Link
              to="/register"
              className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-xl shadow-xl transition-all duration-300"
            >
              Get Started Now
            </Link>
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-6 text-center text-gray-400">
        &copy; {new Date().getFullYear()} FinLens. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
