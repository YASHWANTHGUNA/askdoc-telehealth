
import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    email: "", phone: "", address: "", gender: "", dob: "", photo: "",
    // Patient Fields
    bloodGroup: "", height: "", weight: "", medicalBio: "",
    // Doctor Fields
    specialty: "", experience: "", consultationFee: "", aboutDoctor: ""
  });

  const API_URL = "https://askdoc-telehealth.onrender.com/api/v1";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setPreview(storedUser.photo !== "default" ? storedUser.photo : null);
      setFormData({
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        address: storedUser.address || "",
        gender: storedUser.gender || "",
        dob: storedUser.dob ? storedUser.dob.split('T')[0] : "",
        photo: storedUser.photo || "",
        // Patient
        bloodGroup: storedUser.bloodGroup || "",
        height: storedUser.height || "",
        weight: storedUser.weight || "",
        medicalBio: storedUser.medicalBio || "",
        // Doctor
        specialty: storedUser.specialty || "",
        experience: storedUser.experience || "",
        consultationFee: storedUser.consultationFee || "",
        aboutDoctor: storedUser.aboutDoctor || ""
      });
    }
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 70000) { alert("File too big (Max 70KB)"); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
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
      alert("Failed to update.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl">
        {/* HEADER */}
        <div className="flex items-center gap-6 mb-8 border-b pb-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-blue-100 flex items-center justify-center bg-blue-600 text-white text-3xl font-bold uppercase">
              {preview ? <img src={preview} className="h-full w-full object-cover"/> : user.name?.charAt(0)}
            </div>
            <label className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center rounded-full cursor-pointer transition-all">
              <span className="text-white opacity-0 group-hover:opacity-100 font-bold text-xs">Change</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-bold mt-2 inline-block">{user.role}</span>
          </div>
        </div>

        {/* COMMON FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div><label className="block text-gray-700 font-bold mb-2">Phone</label><input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border rounded" /></div>
            <div><label className="block text-gray-700 font-bold mb-2">Address</label><input name="address" value={formData.address} onChange={handleChange} className="w-full p-3 border rounded" /></div>
        </div>

        {/* CONDITIONAL FIELDS */}
        {user.role === 'patient' ? (
            <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-4">Patient Medical Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block font-bold mb-2">Blood Group</label><input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                    <div><label className="block font-bold mb-2">Height</label><input name="height" value={formData.height} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                    <div className="col-span-2"><label className="block font-bold mb-2">Medical Bio</label><textarea name="medicalBio" value={formData.medicalBio} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                </div>
            </div>
        ) : (
            <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-4">Doctor Professional Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold mb-2">Specialty</label>
                        <select name="specialty" value={formData.specialty} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="">Select</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="General">General Physician</option>
                        </select>
                    </div>
                    <div><label className="block font-bold mb-2">Experience (Years)</label><input name="experience" value={formData.experience} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                    <div><label className="block font-bold mb-2">Fee ($)</label><input name="consultationFee" type="number" value={formData.consultationFee} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                    <div className="col-span-2"><label className="block font-bold mb-2">About Me</label><textarea name="aboutDoctor" value={formData.aboutDoctor} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                </div>
            </div>
        )}

        <button onClick={handleSave} className="w-full mt-8 bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition">Save Profile</button>
      </div>
    </div>
  );
};

export default UserProfile;