import React, { useState, useEffect, useRef } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [preview, setPreview] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
    photo: "",
    bloodGroup: "",
    height: "",
    weight: "",
    medicalBio: "",
    specialty: "",
    experience: "",
    consultationFee: "",
    aboutDoctor: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
      setPreview(
        storedUser.photo && storedUser.photo !== "default"
          ? storedUser.photo
          : null
      );

      setFormData({
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        address: storedUser.address || "",
        gender: storedUser.gender || "",
        dob: storedUser.dob ? storedUser.dob.split("T")[0] : "",
        photo: storedUser.photo || "",
        bloodGroup: storedUser.bloodGroup || "",
        height: storedUser.height || "",
        weight: storedUser.weight || "",
        medicalBio: storedUser.medicalBio || "",
        specialty: storedUser.specialty || "",
        experience: storedUser.experience || "",
        consultationFee: storedUser.consultationFee || "",
        aboutDoctor: storedUser.aboutDoctor || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large. Max size is 10MB.");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setIsMenuOpen(false); 
  };

  const handleRemovePicture = () => {
    setPreview(null);
    setSelectedFile(null);
    setFormData({ ...formData, photo: "default" }); 
    setIsMenuOpen(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
    setIsMenuOpen(false);
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      const uploadData = new FormData();

      Object.keys(formData).forEach((key) => {
        uploadData.append(key, formData[key] || "");
      });

      if (selectedFile) {
        uploadData.append("image", selectedFile);
      }

      const res = await api.patch(`/users/update-profile`, uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = res.data.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // 👇 THE FIX: Cleanly handles the "default" string so it sets to null!
      setPreview(updatedUser.photo && updatedUser.photo !== "default" ? updatedUser.photo : null);

      toast.success("Profile Updated Successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center relative">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl">

        <div className="flex items-center gap-6 mb-8 border-b pb-6 relative">
          
          <div className="relative">
            <div
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-24 w-24 rounded-full overflow-hidden border-4 border-blue-100 flex items-center justify-center bg-blue-600 text-white text-3xl font-bold uppercase cursor-pointer group relative shadow-sm transition-transform hover:scale-105"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="h-full w-full object-cover bg-white"
                  // 👇 THE FIX: If the image URL is broken, immediately switch back to the letter icon
                  onError={() => setPreview(null)} 
                />
              ) : (
                user.name?.charAt(0)
              )}

              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />

            {isMenuOpen && (
              <div className="absolute top-28 left-0 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-2 animate-fade-in-up">
                {preview && (
                  <button
                    onClick={() => {
                      setIsViewModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    View Picture
                  </button>
                )}
                <button
                  onClick={triggerFileInput}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  Change Picture
                </button>
                {preview && (
                  <button
                    onClick={handleRemovePicture}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Remove Picture
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-bold mt-2 inline-block">
              {user.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {user.role === "patient" ? (
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h2 className="text-lg font-bold mb-4 text-blue-900">Patient Medical Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-2 text-gray-700">Blood Group</label>
                <input
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold mb-2 text-gray-700">Height</label>
                <input
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-bold mb-2 text-gray-700">Medical Bio</label>
                <textarea
                  name="medicalBio"
                  value={formData.medicalBio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <h2 className="text-lg font-bold mb-4 text-green-900">Doctor Professional Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-2 text-gray-700">Specialty</label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  <option value="">Select</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="General">General Physician</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-2 text-gray-700">Experience (Years)</label>
                <input
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block font-bold mb-2 text-gray-700">Fee ($)</label>
                <input
                  name="consultationFee"
                  type="number"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-bold mb-2 text-gray-700">About Me</label>
                <textarea
                  name="aboutDoctor"
                  value={formData.aboutDoctor}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={uploading}
          className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {isViewModalOpen && preview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center backdrop-blur-sm transition-opacity"
          onClick={() => setIsViewModalOpen(false)} 
        >
          <div className="relative max-w-2xl w-full p-4 flex flex-col items-center">
            <button 
              className="absolute -top-12 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setIsViewModalOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={preview} 
              alt="Full Profile View" 
              className="rounded-full h-80 w-80 md:h-96 md:w-96 object-cover border-4 border-gray-700 shadow-2xl bg-white"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;