import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// ✅ FORCE THE CORRECT RENDER URL
const API_URL = "https://askdoc-telehealth.onrender.com/api/v1";

const VerifyAccount = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(""); // We will get this from the previous page
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-fill email if passed from SignUp page
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Using the Render URL instead of localhost
      const res = await axios.post(`${API_URL}/users/verifyOTP`, {
        email,
        otp,
      });

      if (res.data.status === "success") {
        alert("Verification Successful! Logging you in...");
        // Redirect to Dashboard or Login
        navigate("/login"); 
      }
    } catch (err) {
      console.error("Verification Error:", err);
      setError(err.response?.data?.message || "Verification failed. Check OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Verify Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Check your Render Logs for the 6-digit code.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="email"
            placeholder="Your Email"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            required
            maxLength="6"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none text-center text-2xl tracking-widest"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyAccount;