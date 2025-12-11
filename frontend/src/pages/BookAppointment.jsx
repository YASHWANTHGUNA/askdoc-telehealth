import React, { useState, useEffect } from "react";
import { useStream } from "../StreamContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookAppointment = () => {
  const { authToken } = useStream();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/appointments/all-doctors",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setDoctors(response.data.data.doctors);
      } catch (err) {
        setError("Failed to fetch doctors.");
        console.error(err);
      }
    };

    if (authToken) {
      fetchDoctors();
    }
  }, [authToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedDoctor || !appointmentDate) {
      setError("Please select a doctor and a date.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/v1/appointments",
        {
          doctor: selectedDoctor,
          appointmentDate,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSuccess("Appointment booked successfully!");
      setSelectedDoctor("");
      setAppointmentDate("");
    } catch (err) {
      setError("Failed to book appointment.");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Book an Appointment</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="doctor" className="block text-gray-700 font-bold mb-2">
            Select Doctor
          </label>
          <select
            id="doctor"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="appointmentDate"
            className="block text-gray-700 font-bold mb-2"
          >
            Select Date and Time
          </label>
          <input
            type="datetime-local"
            id="appointmentDate"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Book Appointment
        </button>
      </form>
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-5 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default BookAppointment;
