
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const doctors = [
  { name: "Dr. Sarah Smith", specialty: "Cardiologist", image: "❤️" },
  { name: "Dr. John Doe", specialty: "Dentist", image: "🦷" },
  { name: "Dr. Emily Stone", specialty: "Dermatologist", image: "🧴" },
];

const BookAppointment = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleBook = async (doctor) => {
    try {
      await axios.post("https://askdoc-telehealth.onrender.com/api/v1/appointments/book", {
        patientId: user.id, // We get this from local storage
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date: new Date() // For now, just books for "Now"
      });
      alert(`Booked with ${doctor.name}!`);
      navigate("/dashboard");
    } catch (err) {
      alert("Booking failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Choose a Specialist</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {doctors.map((doc, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-6xl mb-4">{doc.image}</div>
            <h3 className="text-xl font-bold">{doc.name}</h3>
            <p className="text-gray-500 mb-4">{doc.specialty}</p>
            <button 
              onClick={() => handleBook(doc)}
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookAppointment;