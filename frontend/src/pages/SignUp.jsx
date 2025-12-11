import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ FORCE THE CORRECT RENDER URL (No more localhost!)
const API_URL = "https://askdoc-telehealth.onrender.com/api/v1";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🚀 Sending Request to:", API_URL); // Debug Log

      const res = await axios.post(`${API_URL}/users/signup`, {
        name,
        email,
        password,
        passwordConfirm,
        role,
      });

      if (res.data.status === "success") {
        alert("Account Created Successfully! Please Login.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError(
        err.response?.data?.message || "Connection failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create your account
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none bg-white"
          >
           <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
