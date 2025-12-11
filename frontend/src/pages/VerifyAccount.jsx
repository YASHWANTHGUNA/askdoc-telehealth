import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get the email passed from the SignUp page (or empty string if accessed directly)
  const emailFromSignup = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(emailFromSignup); // Allow user to edit email if needed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Send OTP to Backend
      const res = await axios.post("http://localhost:8000/api/v1/users/verifyOTP", {
        email,
        otp
      });

      // 2. If success, redirect to Login
      if (res.data.status === "success") {
        alert("Account verified! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Verify Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Check your email for the 6-digit code.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="otp" className="sr-only">OTP Code</label>
              <input
                id="otp"
                type="text"
                required
                maxLength="6"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm tracking-widest text-center text-2xl"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyAccount;