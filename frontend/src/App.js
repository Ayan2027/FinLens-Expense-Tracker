import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LandingPge from "./pages/LandingPge";
import { useState} from "react";
import Navbar from "./components/Navbar";
import AddExpense from "./pages/AddExpense";

function App() {
    const [userInfo, setUserInfo] = useState(() => {
      const info = localStorage.getItem("userInfo");
      return info ? JSON.parse(info) : null;
    });

  return (
    <Router>
      <Navbar userInfo={userInfo} />
      <Routes>
        {/* Default route → Login */}
        <Route path="/" element={<LandingPge/>}/> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-expense" element={<AddExpense/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Catch-all route to redirect unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
