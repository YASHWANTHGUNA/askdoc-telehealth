
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "Doctor" });
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Verify Auth
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
    } else {
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">AskDoc+</h1>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <Link to="/dashboard" className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
            Dashboard
          </Link>
          <Link to="/my-appointments" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
            Appointments
          </Link>
          <Link to="/video" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
            Video Consultation
          </Link>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mt-8">
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hello, {user.name} 👋</h1>
            <p className="text-gray-500">Here is your daily overview</p>
          </div>
          <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
        </header>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Total Patients</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">1,240</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Appointments</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">8</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Video Sessions</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">3</p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="bg-blue-600 rounded-2xl p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready for Consultation?</h2>
            <p className="text-blue-100">Start a secure video call with your patient now.</p>
          </div>
          <Link to="/video" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
            Start Video Call
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;