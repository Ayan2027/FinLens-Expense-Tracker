import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) navigate("/");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a] relative overflow-hidden">
      {/* Background glowing shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.4),transparent_70%),radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.3),transparent_70%)] blur-3xl"
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
            Welcome Back 👋
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full bg-[#1e1e1e]/70 border border-gray-700 rounded-lg p-3 pl-10 text-gray-200 placeholder-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Email Address"
            />
            <label
              htmlFor="email"
              className="absolute left-10 -top-2.5 bg-[#111] text-gray-400 text-xs px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:bg-transparent"
            >
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full bg-[#1e1e1e]/70 border border-gray-700 rounded-lg p-3 pl-10 text-gray-200 placeholder-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-10 -top-2.5 bg-[#111] text-gray-400 text-xs px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:bg-transparent"
            >
              Password
            </label>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0px 0px 20px rgba(99,102,241,0.4)" }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Sign In
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 font-medium hover:underline hover:text-indigo-300"
          >
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
