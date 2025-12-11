import React, { useState, useEffect } from "react";
import { useStream } from "../StreamContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { authToken } = useStream();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/appointments",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setAppointments(response.data.data.appointments);
      } catch (err) {
        setError("Failed to fetch appointments.");
        console.error(err);
      }
    };

    if (authToken) {
      fetchAppointments();
    }
  }, [authToken]);

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">My Appointments</h1>
      {error && <p className="text-red-500">{error}</p>}
      {appointments.length === 0 ? (
        <p>You have no appointments.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <li key={appointment._id} className="py-4">
              <p>
                <strong>Doctor:</strong> {appointment.doctor.name}
              </p>
              <p>
                <strong>Patient:</strong> {appointment.patient.name}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(appointment.appointmentDate).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {appointment.status}
              </p>
            </li>
          ))}
        </ul>
      )}
       <button
        onClick={() => navigate("/dashboard")}
        className="mt-5 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default MyAppointments;
