import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast"; // ✅ Added toast

const MedicalHistory = () => {
  const [records, setRecords] = useState([]);
  const [newCondition, setNewCondition] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch History
  useEffect(() => {
    if (user) {
      api.get(`/medical-history`)
        .then(res => setRecords(res.data.data))
        .catch(err => console.log(err));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add Record
  const handleAdd = async () => {
    try {
      const res = await api.post("/medical-history", {
        condition: newCondition,
        description: newDesc
      });
      setRecords([...records, res.data.data]); // Update list instantly
      setNewCondition("");
      setNewDesc("");
      toast.success("Record added successfully!"); // ✅ Replaced alert
    } catch (err) {
      console.error("Error adding record:", err);
      toast.error("Error adding record"); // ✅ Replaced alert
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-8">Medical History</h1>

        {/* ADD NEW FORM */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h3 className="font-bold text-lg mb-4">Add New Record</h3>
          <div className="flex gap-4">
            <input 
              className="border p-2 rounded flex-1" 
              placeholder="Condition (e.g. Allergy)" 
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
            />
            <input 
              className="border p-2 rounded flex-2" 
              placeholder="Description / Notes" 
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <button onClick={handleAdd} className="bg-green-600 text-white px-6 rounded font-bold hover:bg-green-700 transition">
              Add
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {records.map((rec) => (
            <div key={rec._id} className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{rec.condition}</h3>
                <p className="text-gray-600">{rec.description}</p>
              </div>
              <span className="text-sm text-gray-400">
                {new Date(rec.date).toLocaleDateString()}
              </span>
            </div>
          ))}
          {/* ✅ Empty State */}
          {records.length === 0 && (
            <p className="text-center text-gray-500 mt-8">No medical records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;