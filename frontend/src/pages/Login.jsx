import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ FORCE THE CORRECT RENDER URL
const API_URL = "https://askdoc-telehealth.onrender.com/api/v1";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ 1. Send Login Request to Render
      const res = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      if (res.data.status === "success") {
        // 1. Save all necessary tokens
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // 🛑 CRITICAL: SAVE THE STREAM TOKEN
        if (res.data.streamToken) {
            localStorage.setItem("streamToken", res.data.streamToken); // <-- ADD THIS LINE!
        }

        alert("Login Successful!");
        window.location.href = "/dashboard"; 
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message || "Login failed. Check your email/password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none"
              placeholder="doctor@askdoc.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;