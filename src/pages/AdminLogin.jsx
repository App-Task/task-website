import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const apiURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${apiURL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("isAdmin", "true"); // ✅ persist session
        if (onLoginSuccess) onLoginSuccess();
        navigate("/admin/dashboard"); // ✅ go to dashboard
      } else {
        setError(data.error || "Incorrect password");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <img src={logo} alt="Admin Panel" className="w-32 h-32 mb-6" />
      <h2 className="text-2xl font-bold text-[#213729] mb-4">Admin Login</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
        />
        <button
          type="submit"
          className="w-full bg-[#215432] text-white p-3 rounded-md font-semibold hover:bg-[#1a2d21]"
        >
          Login
        </button>
        {error && (
          <p className="text-red-600 text-center text-sm font-medium">{error}</p>
        )}
      </form>
    </div>
  );
}
