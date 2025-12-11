import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// 1. IMPORT THE API URL FROM CONTEXT OR DEFINE IT
// Since we want to keep it simple, let's use the same URL logic
const API_URL = "https://askdoc-telehealth.onrender.com/api/v1";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 2. USE THE CORRECT RENDER URL HERE
      const res = await axios.post(`${API_URL}/users/signup`, {
        name,
        email,
        password,
        passwordConfirm,
        role
      });

      if (res.data.status === "success") {
        // Redirect to Verification Page or Login
        navigate("/verify"); 
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create your account</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
             <select 
               value={role} 
               onChange={(e) => setRole(e.target.value)}
               className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500 bg-white"
             >
               <option value="user">Patient</option>
               <option value="doctor">Doctor</option>
             </select>
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

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
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;