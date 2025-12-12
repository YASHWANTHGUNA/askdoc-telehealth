
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const API_URL = "https://askdoc-telehealth.onrender.com/api/v1";

  // 👇 FETCH REAL DOCTORS
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/doctors`);
        setDoctors(res.data.data);
      } catch (err) {
        console.log("Error fetching doctors");
      }
    };
    fetchDoctors();
  }, []);

  const handleBook = async (doctor) => {
    try {
      await axios.post(`${API_URL}/appointments/book`, {
        patientId: user.id,
        doctorName: doctor.name, // Saves your name!
        specialty: doctor.specialty || "General",
        date: new Date()
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
      
      {doctors.length === 0 ? (
        <p className="text-gray-500">No doctors found. (Sign up as a doctor to appear here!)</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="h-24 w-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                 {doc.photo && doc.photo !== "default" ? (
                    <img src={doc.photo} alt="Doc" className="h-full w-full object-cover"/>
                 ) : (
                    <span className="text-3xl">👨‍⚕️</span>
                 )}
              </div>
              
              <h3 className="text-xl font-bold">{doc.name}</h3>
              <p className="text-blue-600 font-medium">{doc.specialty || "General Physician"}</p>
              <p className="text-gray-500 text-sm mt-2">{doc.aboutDoctor || "Available for consultation"}</p>
              <p className="text-gray-800 font-bold mt-2">Fee: ${doc.consultationFee || "50"}</p>

              <button 
                onClick={() => handleBook(doc)}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookAppointment;