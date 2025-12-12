
import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from 'date-fns';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const API_URL = "https://askdoc-telehealth.onrender.com/api/v1";

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user || !user.id) return;
      try {
        const res = await axios.get(`${API_URL}/appointments/my-appointments/${user.id}`);
        setAppointments(res.data.data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user.id]);

  if (loading) return <div className="p-8 text-center">Loading appointments...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-700 mb-8">My Scheduled Appointments</h1>

        {appointments.length === 0 ? (
          <div className="bg-white p-6 rounded-xl text-center shadow-md">
            <p className="text-lg text-gray-600">You currently have no upcoming appointments.</p>
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
                    {format(new Date(appt.date), 'MMM do, yyyy')}
                  </p>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full mt-1 inline-block ${appt.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {appt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;