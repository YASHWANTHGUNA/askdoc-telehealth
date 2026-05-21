
import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // ✅ NEW: Tracks which doctor profile is open
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get(`/users/doctors`);
        setDoctors(res.data.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleBook = async (doctor) => {
    try {
      setIsLoading(true); 
      await api.post(`/appointments/book`, {
        doctorId: doctor._id,
        doctorName: doctor.name,
        specialty: doctor.specialty || "General",
        date: new Date()
      });
      toast.success(`Booked with Dr. ${doctor.name}!`); 
      setSelectedDoctor(null); // Close modal if open
      navigate("/dashboard");
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("Booking failed"); 
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      
      {/* HEADER WITH BACK BUTTON */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           {/* ✅ NEW: Back to Dashboard Button */}
           <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 hover:text-blue-600 font-bold text-sm transition-colors group mb-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
             </svg>
             Back to Dashboard
           </button>
           <h1 className="text-3xl font-bold text-blue-700">Book a Consultation</h1>
           <p className="text-gray-500 mt-1">Select a specialist and schedule your visit.</p>
        </div>
      </div>

      {/* DOCTORS GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {doctors.map((doc) => (
          <div key={doc._id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
            <div className="h-24 w-24 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center overflow-hidden border border-blue-100">
               {doc.photo && doc.photo !== "default" ? (
                  <img src={doc.photo} alt="Doc" className="h-full w-full object-cover"/>
               ) : (
                  <span className="text-3xl">👨‍⚕️</span>
               )}
            </div>
            
            <div className="text-center flex-grow">
                <h3 className="text-xl font-bold text-gray-800">Dr. {doc.name}</h3>
                <p className="text-blue-600 font-medium text-sm mt-1 bg-blue-50 inline-block px-3 py-1 rounded-full">{doc.specialty || "General Physician"}</p>
                <p className="text-gray-800 font-bold mt-4 text-lg">${doc.consultationFee || "50"} <span className="text-sm font-normal text-gray-500">/ session</span></p>
            </div>

            {/* ✅ NEW: Dual Action Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <button 
                onClick={() => setSelectedDoctor(doc)}
                className="w-full bg-gray-50 text-gray-700 border border-gray-200 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                View Profile
              </button>
              <button 
                onClick={() => handleBook(doc)}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Booking..." : "Book Now"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ NEW: DOCTOR PROFILE MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedDoctor(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white flex gap-6 items-center relative">
              <button onClick={() => setSelectedDoctor(null)} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white/30 shrink-0">
                 {selectedDoctor.photo && selectedDoctor.photo !== "default" ? (
                    <img src={selectedDoctor.photo} alt="Doc" className="h-full w-full object-cover"/>
                 ) : (
                    <span className="text-4xl text-blue-600">👨‍⚕️</span>
                 )}
              </div>
              <div>
                <h2 className="text-3xl font-bold">Dr. {selectedDoctor.name}</h2>
                <p className="text-blue-100 font-medium mt-1">{selectedDoctor.specialty || "General Physician"}</p>
                <div className="mt-3 flex gap-3 flex-wrap">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                    ⭐ {selectedDoctor.experience ? `${selectedDoctor.experience} Yrs Exp` : "Verified Specialist"}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                    💰 ${selectedDoctor.consultationFee || "50"} / session
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-100 pb-2">Professional Biography</h3>
              <p className="text-gray-600 leading-relaxed text-sm mb-8">
                {selectedDoctor.aboutDoctor || "This doctor has not provided a biography yet, but is a fully certified specialist vetted by the AskDoc platform."}
              </p>

              <h3 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">Schedule & Availability</h3>
              {selectedDoctor.availableDays && selectedDoctor.availableDays.length > 0 ? (
                <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                    {selectedDoctor.availableDays.map(day => (
                        <span key={day} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-bold border border-purple-100">
                            {day}
                        </span>
                    ))}
                    </div>
                    <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
                       🕒 Working Hours: <span className="text-gray-800 font-bold bg-gray-100 px-2 py-1 rounded">{selectedDoctor.startTime || "09:00"} - {selectedDoctor.endTime || "17:00"}</span>
                    </p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">Standard platform hours apply (Mon-Fri, 9:00 AM - 5:00 PM).</p>
              )}

              {/* Modal Actions */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-4">
                <button onClick={() => setSelectedDoctor(null)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleBook(selectedDoctor)} disabled={isLoading} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50">
                  {isLoading ? "Booking..." : "Book Appointment Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookAppointment;