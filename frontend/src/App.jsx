import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import VerifyAccount from './pages/VerifyAccount';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VideoStream from './components/VideoStream';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import About from './pages/About';
import UserProfile from './pages/UserProfile';
import MedicalHistory from './pages/MedicalHistory';

// 🛑 NEW: The Guard Component
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");

  // If no token exists, redirect to login declaratively
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return element;
};
// 🛑 END NEW

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify" element={<VerifyAccount />} />
      <Route path="/login" element={<Login />} />
      
      {/* 👇 APPLY THE GUARD TO ALL PROTECTED ROUTES */}
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/video" element={<ProtectedRoute element={<VideoStream />} />} />
      <Route path="/book-appointment" element={<ProtectedRoute element={<BookAppointment />} />} />
      <Route path="/my-appointments" element={<ProtectedRoute element={<MyAppointments />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} />} />
      <Route path="/medical-history" element={<ProtectedRoute element={<MedicalHistory />} />} />
      
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;