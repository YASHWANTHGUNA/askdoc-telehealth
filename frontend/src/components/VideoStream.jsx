import React, { useEffect, useState } from 'react';
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  StreamTheme,
  SpeakerLayout,
  CallControls,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ Added useLocation for context passing
import api from '../api/axiosInstance'; // ✅ Added api instance for saving clinical notes
import toast from 'react-hot-toast'; // ✅ Added professional notifications

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

const VideoStream = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Extracts routing state sent from Dashboard "Join" button
  
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);
  const [authData, setAuthData] = useState(null);

  // In-call clinical workspace states
  const [sessionNotes, setSessionNotes] = useState("");
  const [activeTab, setActiveTab] = useState("notes");
  const [isSaving, setIsSaving] = useState(false); // Tracks notes database submission loading state

  // Extract the specific appointment ID passed from the dashboard
  const appointmentId = location.state?.appointmentId;

  // 1. Get Auth Data
  useEffect(() => {
    const userString = localStorage.getItem("user");
    const streamToken = localStorage.getItem("streamToken");
    
    if (!userString || !streamToken) {
        toast.error("Video session error: Missing authentication data. Please log in again.");
        navigate('/login');
        return;
    }
    
    const user = JSON.parse(userString);
    setAuthData({ user, streamToken });
  }, [navigate]);

  // 2. Initialize the Video Client
  useEffect(() => {
    if (!authData || client) return;

    try {
        const myClient = new StreamVideoClient({
            apiKey,
            user: {
                id: authData.user.id || authData.user._id,
                name: authData.user.name,
                image: authData.user.photo || undefined,
            },
            token: authData.streamToken,
        });
        setClient(myClient);

        return () => {
            myClient.disconnectUser();
            setClient(null);
        };
    } catch (e) {
        console.error("Stream Client Initialization Failed:", e);
        setError("Could not initialize video client. Check API Key or Token.");
    }
  }, [authData]);

  // 3. Create/Join the Call
  useEffect(() => {
    if (!client || call) return;

    const myCall = client.call('default', 'telehealth_demo_room');

    myCall.join({ create: true })
      .then(() => setCall(myCall))
      .catch((err) => {
        console.error("Failed to join call", err);
        setError("Failed to join call. Check your network or permissions.");
      });

    return () => {
      if (myCall) {
        // ✅ FIXED: Safely catch and discard the double-leave promise rejection on component unmount
        myCall.leave().catch((err) => console.log("Call teardown handled cleanly:", err.message));
      }
    };
  }, [client]);

  // 4. Submit Clinical Notes to MongoDB Pipeline
  const handleSaveNotes = async () => {
    if (!appointmentId) {
      toast.error("Cannot save: No active appointment context found. Did you join from the dashboard?");
      return;
    }
    if (!sessionNotes.trim()) {
      toast.error("Notes field cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);
      // Dispatch content directly to our new controller endpoint
      await api.patch(`/appointments/${appointmentId}/notes`, { notes: sessionNotes });
      toast.success("Notes successfully committed to electronic patient record!");
    } catch (err) {
      console.error("Clinical notes submission failure:", err);
      toast.error(err.response?.data?.message || "Failed to submit clinical notes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!authData) return <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">Checking Authentication...</div>;
  if (error) return <div className="h-screen flex items-center justify-center bg-gray-50 text-red-600 font-bold">Video Error: {error}</div>;
  if (!client || !call) return <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
    <p>Establishing secure connection...</p>
  </div>;

  return (
    <div className="h-screen w-screen bg-gray-100 flex overflow-hidden font-sans">
      
      {/* ========================================== */}
      {/* LEFT: MAIN VIDEO AREA (70% width on desktop) */}
      {/* ========================================== */}
      <div className={`flex flex-col relative transition-all duration-300 ${authData.user.role === 'doctor' ? 'w-full lg:w-8/12 xl:w-3/4' : 'w-full'} bg-gray-950`}>
        
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <StreamTheme>
              
              {/* Top Status Bar Over Video */}
              <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-start pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-lg pointer-events-auto flex items-center gap-2 border border-white/10">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium tracking-wide">Secure Telehealth Session</span>
                </div>
                <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 opacity-70">
                  End-to-End Encrypted
                </div>
              </div>

              {/* Core Video Player */}
              <div className="flex-1 w-full h-full pt-16 pb-24 px-4 flex items-center justify-center">
                <SpeakerLayout />
              </div>
              
              {/* Bottom Controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-gray-700 shadow-2xl">
                <CallControls onLeave={() => navigate('/dashboard')} />
              </div>

            </StreamTheme>
          </StreamCall>
        </StreamVideo>
      </div>

      {/* ========================================== */}
      {/* RIGHT: CLINICAL SIDEBAR (Only for Doctors)   */}
      {/* ========================================== */}
      {authData.user.role === 'doctor' && (
        <div className="hidden lg:flex flex-col w-4/12 xl:w-1/4 bg-white border-l border-gray-200 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] z-20">
          
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-800">Clinical Workspace</h2>
            <p className="text-sm text-gray-500 mt-1">Session ID: {appointmentId ? appointmentId.slice(-6).toUpperCase() : 'DEMO-123'}</p>
          </div>

          {/* Sidebar Tabs */}
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveTab("notes")}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Consultation Notes
            </button>
            <button 
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Patient Details
            </button>
          </div>

          {/* Sidebar Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
            {activeTab === 'notes' ? (
              <div className="h-full flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Live Session Notes</label>
                <textarea 
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Type symptoms, diagnosis, or prescription notes here during the call..."
                  className="flex-1 w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none shadow-inner bg-white text-gray-700 text-sm leading-relaxed"
                />
                <button 
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="mt-4 w-full bg-blue-50 text-blue-700 border border-blue-200 py-3 rounded-xl font-bold hover:bg-blue-100 transition-colors text-sm disabled:opacity-50"
                >
                  {isSaving ? "Saving to Record..." : "Save to Patient Record"}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                  <p className="text-sm font-medium text-gray-800 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Patient in Call
                  </p>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-50 pb-2">Quick Reference</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-500">Context Object:</span> 
                      <span className="font-mono text-xs text-blue-600 font-bold">{appointmentId ? "Active ID Loaded" : "None"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Target ID:</span> 
                      <span className="font-mono text-[10px] text-gray-600 bg-gray-100 px-1 rounded">{appointmentId || 'Demo Mode'}</span>
                    </li>
                  </ul>
                </div>
                <p className="text-xs text-gray-400 text-center mt-4">Full medical history accessible from dashboard.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default VideoStream;