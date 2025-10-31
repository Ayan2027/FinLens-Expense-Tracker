// src/components/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ userInfo }) => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-gray-900 dark:bg-gray-900 border-b border-gray-800 w-full">
      <Link to="/">
        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">💰 FinLens</h2>
      </Link>

      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5 text-yellow-400" />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-300" />
          )}
        </button>

        {/* Profile Button */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-2 rounded-lg transition"
        >
          <UserCircleIcon className="w-8 h-8 text-white" />
          <span className="text-gray-100">{userInfo?.name?.split(" ")[0] || "User"}</span>
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-4 mt-8 w-48 bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <Link
                to="/dashboard"
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-3 text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-600 transition"
              >
                Dashboard
              </Link>
              
              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-3 text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-600 transition"
              >
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-gray-100 hover:bg-red-600 transition"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
