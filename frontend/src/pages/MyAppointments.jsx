import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { format } from 'date-fns';

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  
 useEffect(() => {
    const fetchAppointments = async () => {
      const userId = user?.id || user?._id; 

      if (!userId) {
        setLoading(false);
        return; 
      }
      
      try {
        const response = await api.get(`/appointments/my-appointments`);
        setAppointments(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to fetch appointments. Check server logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []); 

  if (loading) return <div className="p-8 text-center text-lg">Loading appointments...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-700 mb-8">My Scheduled Appointments</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {/* ✅ Empty State updated */}
        {appointments.length === 0 ? (
          <div className="bg-white p-6 rounded-xl text-center shadow-md">
            <p className="text-center text-gray-500">No appointments booked yet.</p>
            <Link to="/book-appointment" className="text-blue-600 font-bold mt-2 inline-block underline">
              Book your first consultation.
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div key={appt._id} className="bg-white p-6 rounded-xl border-l-4 border-purple-500 shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Consultation with {appt.doctorName}
                  </h3>
                  <p className="text-gray-600">{appt.specialty} Specialist</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">
                    {format(new Date(appt.date), 'MMM do, yyyy @ h:mm a')}
                  </p>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full mt-1 inline-block ${appt.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {appt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button
         onClick={() => navigate("/dashboard")}
         className="mt-8 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default MyAppointments;