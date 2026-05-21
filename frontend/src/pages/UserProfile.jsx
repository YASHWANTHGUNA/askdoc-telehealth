import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

// Pre-defined list of specialties for the searchable dropdown
const SPECIALTY_OPTIONS = [
  "Allergist", "Cardiologist", "Dentist", "Dermatologist", 
  "Endocrinologist", "Gastroenterologist", "General Physician", 
  "Gynecologist", "Neurologist", "Oncologist", "Ophthalmologist", 
  "Orthopedist", "Pediatrician", "Psychiatrist", "Radiologist", "Urologist"
];

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // ✅ NEW STATES for Searchable Dropdown
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    bloodGroup: "",
    height: "",
    weight: "",
    medicalBio: "",
    specialty: "",
    experience: "",
    consultationFee: "",
    aboutDoctor: "",
    // ✅ NEW: Availability Fields
    availableDays: [], 
    startTime: "",
    endTime: ""
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
      setPreview(storedUser.photo && storedUser.photo !== "default" ? storedUser.photo : null);

      // Parse availableDays if it comes back as a stringified array from backend
      let parsedDays = [];
      try {
        parsedDays = typeof storedUser.availableDays === "string" 
          ? JSON.parse(storedUser.availableDays) 
          : storedUser.availableDays || [];
      } catch (e) { parsedDays = []; }

      setFormData({
        phone: storedUser.phone || "",
        address: storedUser.address || "",
        bloodGroup: storedUser.bloodGroup || "",
        height: storedUser.height || "",
        weight: storedUser.weight || "",
        medicalBio: storedUser.medicalBio || "",
        specialty: storedUser.specialty || "",
        experience: storedUser.experience || "",
        consultationFee: storedUser.consultationFee || "",
        aboutDoctor: storedUser.aboutDoctor || "",
        availableDays: parsedDays,
        startTime: storedUser.startTime || "09:00",
        endTime: storedUser.endTime || "17:00",
      });

      if (storedUser.specialty) setSpecialtySearch(storedUser.specialty);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ NEW: Toggle day selection for Availability
  const toggleDay = (day) => {
    const currentDays = formData.availableDays || [];
    if (currentDays.includes(day)) {
      setFormData({ ...formData, availableDays: currentDays.filter(d => d !== day) });
    } else {
      setFormData({ ...formData, availableDays: [...currentDays, day] });
    }
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
        // Arrays need to be stringified before appending to FormData
        if (key === "availableDays") {
          uploadData.append(key, JSON.stringify(formData[key]));
        } else {
          uploadData.append(key, formData[key] || "");
        }
      });

      if (selectedFile) {
        uploadData.append("image", selectedFile);
      } else if (preview === null && user.photo !== "default") {
         uploadData.append("photo", "default");
      }

      const res = await api.patch(`/users/update-profile`, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = res.data.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setPreview(updatedUser.photo && updatedUser.photo !== "default" ? updatedUser.photo : null);

      toast.success("Profile Updated Successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setUploading(false);
    }
  };

  // Filter specialties based on search input
  const filteredSpecialties = SPECIALTY_OPTIONS.filter(s => 
    s.toLowerCase().includes(specialtySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 flex justify-center relative">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-4xl">
        
        <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 hover:text-blue-600 mb-8 font-bold text-sm transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        {/* HEADER & IDENTITY */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 pb-8 border-b border-gray-100 relative">
          <div className="relative">
            <div onClick={() => setIsMenuOpen(!isMenuOpen)} className="h-28 w-28 rounded-full overflow-hidden border-4 border-blue-50 flex items-center justify-center bg-blue-600 text-white text-4xl font-bold uppercase cursor-pointer group relative shadow-sm transition-transform hover:scale-105">
              {preview ? <img src={preview} alt="Profile" className="h-full w-full object-cover bg-white" onError={() => setPreview(null)} /> : user.name?.charAt(0)}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
            </div>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            {isMenuOpen && (
              <div className="absolute top-32 left-0 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-2 animate-fade-in-up">
                {preview && <button onClick={() => { setIsViewModalOpen(true); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">View Picture</button>}
                <button onClick={triggerFileInput} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">Change Picture</button>
                {preview && <button onClick={handleRemovePicture} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Remove Picture</button>}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-gray-500 font-medium">{user.email}</span>
              <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider">{user.role}</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">Email and role are managed by system administrators.</p>
          </div>
        </div>

        <div className="space-y-10">
          
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Primary Address</label>
                <input name="address" value={formData.address} onChange={handleChange} placeholder="Clinic or Home Address" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white" />
              </div>
            </div>
          </section>

          {user.role === "patient" ? (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">Medical Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                <div>
                  <label className="block font-bold mb-2 text-gray-700 text-sm">Blood Group</label>
                  <input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="e.g., O+" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <div>
                  <label className="block font-bold mb-2 text-gray-700 text-sm">Height / Weight</label>
                  <div className="flex gap-2">
                    <input name="height" value={formData.height} onChange={handleChange} placeholder="Height (cm)" className="w-1/2 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                    <input name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" className="w-1/2 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-bold mb-2 text-gray-700 text-sm">Medical History / Bio</label>
                  <textarea name="medicalBio" value={formData.medicalBio} onChange={handleChange} rows="4" placeholder="Briefly describe any chronic conditions or past surgeries..." className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white" />
                </div>
              </div>
            </section>
          ) : (
            <>
              {/* PROFESSIONAL CREDENTIALS */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-green-500 pl-3">Professional Credentials</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-green-50/30 p-6 rounded-xl border border-green-100">
                  
                  {/* ✅ IMPROVISED: Searchable Dropdown */}
                  <div className="relative">
                    <label className="block font-bold mb-2 text-gray-700 text-sm">Medical Specialty</label>
                    <input 
                      type="text"
                      value={specialtySearch}
                      onClick={() => setShowSpecialtyDropdown(true)}
                      onChange={(e) => {
                        setSpecialtySearch(e.target.value);
                        setFormData({...formData, specialty: e.target.value});
                        setShowSpecialtyDropdown(true);
                      }}
                      onBlur={() => setTimeout(() => setShowSpecialtyDropdown(false), 200)} // delay to allow click
                      placeholder="Search specialty..."
                      className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    />
                    {showSpecialtyDropdown && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                        {filteredSpecialties.length > 0 ? filteredSpecialties.map((spec, i) => (
                          <li 
                            key={i} 
                            onClick={() => {
                              setSpecialtySearch(spec);
                              setFormData({...formData, specialty: spec});
                              setShowSpecialtyDropdown(false);
                            }}
                            className="p-3 hover:bg-green-50 cursor-pointer text-gray-700 transition-colors"
                          >
                            {spec}
                          </li>
                        )) : (
                          <li className="p-3 text-gray-400 text-sm">No specialties found</li>
                        )}
                      </ul>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold mb-2 text-gray-700 text-sm">Experience (Years)</label>
                    <input name="experience" type="number" value={formData.experience} onChange={handleChange} placeholder="e.g. 10" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold mb-2 text-gray-700 text-sm">Consultation Fee ($)</label>
                    <input name="consultationFee" type="number" value={formData.consultationFee} onChange={handleChange} placeholder="e.g. 150" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 bg-white" />
                  </div>
                  <div className="col-span-1 md:col-span-3">
                    <label className="block font-bold mb-2 text-gray-700 text-sm">Professional Biography</label>
                    <textarea name="aboutDoctor" value={formData.aboutDoctor} onChange={handleChange} rows="4" placeholder="Highlight your education, board certifications, and treatment philosophy..." className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 resize-none bg-white" />
                  </div>
                </div>
              </section>

              {/* ✅ NEW: Availability & Time Slots */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-purple-500 pl-3">Availability & Time Slots</h2>
                <div className="bg-purple-50/30 p-6 rounded-xl border border-purple-100">
                  <div className="mb-6">
                    <label className="block font-bold mb-3 text-gray-700 text-sm">Working Days</label>
                    <div className="flex flex-wrap gap-3">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                            formData.availableDays?.includes(day) 
                            ? "bg-purple-600 text-white shadow-md" 
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-bold mb-2 text-gray-700 text-sm">Start Time</label>
                      <input 
                        type="time" 
                        name="startTime" 
                        value={formData.startTime} 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white" 
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-2 text-gray-700 text-sm">End Time</label>
                      <input 
                        type="time" 
                        name="endTime" 
                        value={formData.endTime} 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white" 
                      />
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
          <button onClick={handleSave} disabled={uploading} className="w-full md:w-auto px-10 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
            {uploading ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>
      </div>

      {isViewModalOpen && preview && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center backdrop-blur-sm transition-opacity" onClick={() => setIsViewModalOpen(false)}>
          <div className="relative max-w-2xl w-full p-4 flex flex-col items-center">
            <button className="absolute -top-12 right-4 text-white hover:text-gray-300 transition-colors" onClick={() => setIsViewModalOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <img src={preview} alt="Full Profile View" className="rounded-full h-80 w-80 md:h-96 md:w-96 object-cover border-4 border-gray-700 shadow-2xl bg-white" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;