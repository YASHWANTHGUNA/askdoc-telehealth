import { Routes, Route } from 'react-router-dom'; // Removed 'BrowserRouter as Router'
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import VerifyAccount from './pages/VerifyAccount';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VideoStream from './components/VideoStream';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import About from './pages/About';

function App() {
  return (
    // <Router> was here. We REMOVED it because main.jsx handles it now.
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify" element={<VerifyAccount />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/video" element={<VideoStream />} />
      <Route path="/book-appointment" element={<BookAppointment />} />
      <Route path="/my-appointments" element={<MyAppointments />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;