import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "User", role: "patient" });
  const [apptCount, setApptCount] = useState(0);
  const navigate = useNavigate();
  const API_URL = "https://askdoc-telehealth.onrender.com/api/v1";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
    } else {
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // FETCH APPOINTMENTS COUNT
        axios.get(`${API_URL}/appointments/my-appointments/${parsedUser.id}`)
          .then(res => setApptCount(res.data.data.length))
          .catch(err => console.log(err));
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6"><h1 className="text-2xl font-bold text-blue-600">AskDoc+</h1></div>
        <nav className="mt-6 px-4 space-y-2">
          <Link to="/dashboard" className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">Dashboard</Link>
          <Link to="/video" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Video Call</Link>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 mt-8">Logout</button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div><h1 className="text-2xl font-bold">Hello, {user.name} 👋</h1></div>
          <Link to="/profile">
            <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
              {user.name.charAt(0)}
            </div>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-blue-800 font-bold mb-2">Find a Doctor</h3>
            <Link to="/book-appointment"><button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Search Doctors</button></Link>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
            <h3 className="text-purple-800 font-bold mb-2">My Appointments</h3>
            <p className="text-4xl font-bold text-purple-600 mb-2">{apptCount}</p>
            <Link to="/my-appointments" className="text-purple-700 underline font-bold text-sm">View Schedule</Link>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <h3 className="text-green-800 font-bold mb-2">Medical History</h3>
            <Link to="/medical-history" className="text-green-700 underline font-bold text-sm">View Records</Link>
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-8 text-white flex justify-between items-center">
          <div><h2 className="text-2xl font-bold">Telehealth Session</h2><p>Start a secure video call.</p></div>
          <Link to="/video" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold">Start Video Call</Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;