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
import { useNavigate } from 'react-router-dom';
// import { useStream } from '../StreamContext'; // ❌ REMOVE THIS IMPORT

// Note: VITE_STREAM_API_KEY is embedded in the build by Vercel/Vite
const apiKey = import.meta.env.VITE_STREAM_API_KEY;

const VideoStream = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);
  const [authData, setAuthData] = useState(null);

  // 1. Get Auth Data directly from LocalStorage
  useEffect(() => {
    const userString = localStorage.getItem("user");
    const streamToken = localStorage.getItem("streamToken");
    
    if (!userString || !streamToken) {
        // If data is missing, redirect
        alert("Video session error: Missing authentication data. Please log in again.");
        navigate('/login');
        return;
    }
    
    // Parse data and save it to state
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
                // 👇 CRITICAL FIX: Ensure Stream gets a valid ID from EITHER property
                id: authData.user.id || authData.user._id, 
                // 👆 END CRITICAL FIX
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

    // Use a fixed call ID for demonstration
    const myCall = client.call('default', 'telehealth_demo_room');

    myCall.join({ create: true })
      .then(() => setCall(myCall))
      .catch((err) => {
        console.error("Failed to join call", err);
        setError("Failed to join call. Check your network or permissions.");
      });

    return () => {
      if (myCall) {
        myCall.leave();
      }
    };
  }, [client]);

  if (!authData) return <div className="text-center mt-20 p-8">Checking Authentication...</div>;
  if (error) return <div className="text-center mt-20 p-8 text-red-600 font-bold">Video Error: {error}</div>;
  if (!client || !call) return <div className="text-center mt-20 p-8">Setting up Video Session...</div>;

  return (
    <div className="h-screen w-screen bg-gray-900 text-white">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <StreamTheme>
            <div className="h-full flex flex-col">
              {/* Video Area */}
              <div className="flex-1 flex justify-center items-center overflow-hidden">
                <SpeakerLayout />
              </div>
              
              {/* Controls (Mute, Camera, Leave) */}
              <div className="flex justify-center py-6 bg-gray-800">
                <CallControls onLeave={() => navigate('/dashboard')} />
              </div>
            </div>
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
    </div>
  );
};

export default VideoStream;