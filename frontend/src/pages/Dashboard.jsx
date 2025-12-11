
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "User" });
  const navigate = useNavigate();

  useEffect(() => {
    // 1. DIRECTLY READ THE DATA YOU JUST SAW
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    console.log("🔍 Checking Auth...");
    console.log("Token:", token);
    
    if (!token) {
      // Only kick out if there is TRULY no token
      alert("No token found! Redirecting to login...");
      navigate("/login");
    } else {
      // If token exists, show the user data
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-2xl w-full text-center">
        <h1 className="text-6xl mb-4">🏆</h1>
        <h1 className="text-4xl font-extrabold text-green-600 mb-6">
          MISSION ACCOMPLISHED!
        </h1>
        
        <p className="text-xl text-gray-700 mb-8">
          Welcome to the Telehealth Dashboard, 
          <span className="font-bold text-blue-600"> {user.name}</span>.
        </p>

        <div className="bg-gray-100 p-6 rounded-lg text-left mb-8 border border-gray-300">
          <p className="font-mono text-sm text-gray-600 mb-2">System Status:</p>
          <ul className="space-y-2">
            <li className="flex items-center text-green-700">
              ✅ Backend Connection (Render)
            </li>
            <li className="flex items-center text-green-700">
              ✅ Database Auth (MongoDB)
            </li>
            <li className="flex items-center text-green-700">
              ✅ JWT Token Storage (Local)
            </li>
          </ul>
        </div>

        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;