import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    gender: "",
    dob: "",
  });

  // Load user data on startup
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        phone: storedUser.phone || "",
        address: storedUser.address || "",
        gender: storedUser.gender || "",
        dob: storedUser.dob ? storedUser.dob.split('T')[0] : "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.patch("https://askdoc-telehealth.onrender.com/api/v1/users/update-profile", {
        userId: user.id,
        ...formData
      });
      
      // Update Local Storage with new data
      const updatedUser = { ...user, ...res.data.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Profile Updated Successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-bold">
              {user.role}
            </span>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 border-b pb-2">Personal Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" type="text" placeholder="+1 234 567 890" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
            <input name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" type="text" placeholder="City, Country" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
            <input name="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 border rounded" type="date" />
          </div>
        </div>

        <button onClick={handleSave} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default UserProfile;