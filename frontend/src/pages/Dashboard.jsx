
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { format, isToday } from "date-fns";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "User", role: "patient" });
  const [apptCount, setApptCount] = useState(0);
  
  const [doctorStats, setDoctorStats] = useState({ 
    totalPatients: 0, 
    totalAppointments: 0, 
    todaysAppointments: 0,
    upcomingAppointments: 0 
  });

  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("today");
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
    } else {
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        if (parsedUser.role === 'patient') {
          api.get(`/appointments/my-appointments`)
            .then(res => {
              setApptCount(res.data.data.length);
              setAppointments(res.data.data); 
            })
            .catch(err => console.log(err));
        } else {
            // DOCTOR: Fetch Stats
            api.get(`/appointments/doctor-stats`)
              .then(res => setDoctorStats(res.data.data))
              .catch(err => console.log(err));

            // DOCTOR: Fetch full appointments array
            api.get(`/appointments`)
              .then(res => setAppointments(res.data.data))
              .catch(err => console.log(err));
        }
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ UPDATED: Added Chronological Sorting
  const getFilteredAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const filtered = appointments.filter((appt) => {
      const apptDate = new Date(appt.date);
      if (activeTab === "today") {
        return apptDate >= today && apptDate < tomorrow;
      } else {
        return apptDate >= tomorrow || appt.status === "upcoming";
      }
    });

    // Sort strictly by time (earliest first)
    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Checks if an appointment is starting within 15 mins or currently happening
  const isJoinable = (apptDate) => {
    const timeToAppt = new Date(apptDate).getTime() - new Date().getTime();
    const minutesToAppt = timeToAppt / (1000 * 60);
    return minutesToAppt <= 15 && minutesToAppt >= -60;
  };

  // ✅ NEW: Doctor action to mark appointment as completed instantly without refresh
  const handleMarkCompleted = async (apptId) => {
    try {
      await api.patch(`/appointments/${apptId}/status`, { status: "completed" });
      
      // Instantly update the local state to remove it from the 'upcoming' flow
      setAppointments(prev => prev.map(appt => 
        appt._id === apptId ? { ...appt, status: "completed" } : appt
      ));
      
      toast.success("Appointment marked as completed!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update appointment status.");
    }
  };

  // =========================================
  // PATIENT VIEW
  // =========================================
  const PatientView = () => {
    const upcomingAppts = appointments
      .filter(appt => appt.status === 'upcoming')
      .sort((a, b) => new Date(a.date) - new Date(b.date));
      
    const nextAppointment = upcomingAppts.length > 0 ? upcomingAppts[0] : null;
    const isApptToday = nextAppointment ? isToday(new Date(nextAppointment.date)) : false;

    return (
      <div className="space-y-8 animate-fade-in mb-8">
        {nextAppointment ? (
          <div className={`rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center shadow-lg transition-all ${isApptToday ? 'bg-gradient-to-r from-blue-600 to-cyan-500' : 'bg-gray-800'}`}>
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <span className="uppercase tracking-widest text-xs font-bold opacity-80 mb-2 block">
                {isApptToday ? "🔴 Action Required Today" : "Upcoming Consultation"}
              </span>
              <h2 className="text-3xl font-bold mb-1">Dr. {nextAppointment.doctorName}</h2>
              <p className="text-lg opacity-90">{nextAppointment.specialty} Specialist</p>
              <div className="mt-4 flex items-center justify-center md:justify-start gap-2 bg-black/20 w-max px-4 py-2 rounded-full text-sm font-medium">
                🗓️ {format(new Date(nextAppointment.date), 'MMM do, yyyy')} @ {format(new Date(nextAppointment.date), 'h:mm a')}
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/video', { state: { appointmentId: nextAppointment._id } })}
              className={`px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-transform hover:scale-105 ${isApptToday ? 'bg-white text-blue-600' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
            >
              {isApptToday ? "Join Video Call" : "Prepare for Call"}
            </button>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="text-4xl mb-4">👋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">You're all caught up!</h2>
            <p className="text-gray-500 mb-6 max-w-md">You have no upcoming consultations. If you are feeling unwell, book an appointment with one of our specialists.</p>
            <Link to="/book-appointment" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-blue-700 transition">
              Book a Consultation
            </Link>
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/book-appointment" className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-blue-200 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🩺</div>
            <h4 className="font-bold text-gray-800">Find a Doctor</h4>
            <p className="text-sm text-gray-500 mt-1">Browse specialists and book</p>
          </Link>
          <Link to="/medical-history" className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-green-200 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📋</div>
            <h4 className="font-bold text-gray-800">Medical Records</h4>
            <p className="text-sm text-gray-500 mt-1">View your health history</p>
          </Link>
          <Link to="/my-appointments" className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-purple-200 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📅</div>
            <h4 className="font-bold text-gray-800">All Appointments</h4>
            <p className="text-sm text-gray-500 mt-1">Manage scheduled visits</p>
          </Link>
        </div>
      </div>
    );
  };

  // =========================================
  // DOCTOR VIEW
  // =========================================
  const DoctorView = () => {
    const filteredAppointments = getFilteredAppointments();
    
    // Identify the absolute next upcoming appointment for today to highlight it
    const todayUpcoming = filteredAppointments.filter(appt => appt.status === 'upcoming' && isToday(new Date(appt.date)));
    const nextImmediateApptId = todayUpcoming.length > 0 ? todayUpcoming[0]._id : null;

    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">Today's Consultations</p>
            <p className="text-2xl font-bold text-blue-600">{doctorStats.todaysAppointments}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">Upcoming</p>
            <p className="text-2xl font-bold text-gray-800">{doctorStats.upcomingAppointments}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">Total Patients</p>
            <p className="text-2xl font-bold text-gray-800">{doctorStats.totalPatients}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">Total Appointments</p>
            <p className="text-2xl font-bold text-gray-800">{doctorStats.totalAppointments}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("today")}
              className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${
                activeTab === "today" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Today's Schedule
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${
                activeTab === "upcoming" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Upcoming Appointments
            </button>
          </div>

          <div>
            {filteredAppointments.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-medium">
                No appointments found for {activeTab === "today" ? "today" : "the future"}.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {filteredAppointments.map((appt) => {
                  const isNext = appt._id === nextImmediateApptId && activeTab === "today";
                  
                  return (
                    <li key={appt._id} className={`p-6 flex flex-col md:flex-row justify-between md:items-center transition-colors ${isNext ? 'bg-blue-50/40 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}>
                      <div className="mb-4 md:mb-0">
                        {isNext && <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider mb-1 block">🔴 Next Appointment</span>}
                        <p className="font-bold text-gray-800 text-lg">
                          {appt.patientId?.name || "Patient"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(appt.date), 'MMM do, yyyy')} at {format(new Date(appt.date), 'h:mm a')}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          appt.status === 'upcoming' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {appt.status}
                        </span>
                        
                        {/* ✅ UPDATED: Added Mark Completed Button & Contextual Actions */}
                        {appt.status === 'upcoming' && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleMarkCompleted(appt._id)}
                              className="border border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                            >
                              ✓ Done
                            </button>

                            {activeTab === "today" && isJoinable(appt.date) && (
                              <button 
                                onClick={() => navigate('/video', { state: { appointmentId: appt._id } })}
                                className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-green-700 transition-colors animate-pulse"
                              >
                                Join Call
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-8 text-white flex justify-between items-center mt-8 shadow-sm">
          <div><h2 className="text-2xl font-bold">Telehealth Session</h2><p className="text-blue-100 mt-1">Start a secure video call.</p></div>
          <Link to="/video" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">Start Video Call</Link>
        </div>
      </>
    );
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
          <div>
            <h1 className="text-2xl font-bold">Hello, {user.name} 👋</h1>
            <p className="text-gray-500">{user.role === 'patient' ? "Manage your health journey." : "Here is your daily overview."}</p>
          </div>
          <Link to="/profile">
            <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer overflow-hidden border border-gray-300">
              {user.photo && user.photo !== "default" ? <img src={user.photo} className="h-full w-full object-cover" /> : user.name.charAt(0)}
            </div>
          </Link>
        </header>

        {user.role === 'patient' ? <PatientView /> : <DoctorView />}

      </main>
    </div>
  );
};

export default Dashboard;