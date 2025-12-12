
import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    email: "", // Added Email
    phone: "",
    address: "",
    gender: "",
    dob: "",
    bloodGroup: "", // New
    height: "",     // New
    weight: "",     // New
    medicalBio: ""  // New
  });

  const API_URL = "https://askdoc-telehealth.onrender.com/api/v1";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        address: storedUser.address || "",
        gender: storedUser.gender || "",
        dob: storedUser.dob ? storedUser.dob.split('T')[0] : "",
        bloodGroup: storedUser.bloodGroup || "",
        height: storedUser.height || "",
        weight: storedUser.weight || "",
        medicalBio: storedUser.medicalBio || ""
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.patch(`${API_URL}/users/update-profile`, {
        userId: user.id,
        ...formData
      });
      
      const updatedUser = { ...user, ...res.data.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Profile Updated Successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl">
        {/* HEADER */}
        <div className="flex items-center gap-6 mb-8 border-b pb-6">
          <div className="h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold uppercase">
            {user.name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-bold mt-2 inline-block">
              {user.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* SECTION 1: CONTACT INFO */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email (Read Only)</label>
                <input 
                  name="email" 
                  value={formData.email} 
                  disabled 
                  className="w-full p-3 border rounded bg-gray-100 text-gray-500 cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                <input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="+91 98765 43210" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                <input 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Street, City, State" 
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PERSONAL DETAILS */}
          <div className="md:col-span-2 mt-4">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border rounded">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
                <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="w-full p-3 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full p-3 border rounded">
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: MEDICAL SNAPSHOT */}
          <div className="md:col-span-2 mt-4">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Medical Snapshot</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Height (cm)</label>
                <input name="height" value={formData.height} onChange={handleChange} className="w-full p-3 border rounded" placeholder="175" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Weight (kg)</label>
                <input name="weight" value={formData.weight} onChange={handleChange} className="w-full p-3 border rounded" placeholder="70" />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Current Medical Conditions / Allergies</label>
              <textarea 
                name="medicalBio" 
                value={formData.medicalBio} 
                onChange={handleChange} 
                rows="3"
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="E.g., Diabetic, Peanut Allergy, Asthma..." 
              />
            </div>
          </div>

        </div>

        <button onClick={handleSave} className="w-full mt-8 bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg">
          Save Profile Changes
        </button>
      </div>
    </div>
  );
};

export default UserProfile;