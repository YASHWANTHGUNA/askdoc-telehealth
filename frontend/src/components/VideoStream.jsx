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
import { useStream } from '../StreamContext';

const VideoStream = () => {
  const navigate = useNavigate();
  const { user, streamToken: token, loading } = useStream();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);

  // Get API Key from your .env file
  const apiKey = import.meta.env.VITE_STREAM_API_KEY;

  // 1. Initialize the Video Client
  useEffect(() => {
    if (!user || !token || loading) return;

    const myClient = new StreamVideoClient({
      apiKey,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
      token,
    });

    setClient(myClient);

    return () => {
      myClient.disconnectUser();
      setClient(null);
    };
  }, [user, token, loading]);

  // 2. Create/Join a default Call
  useEffect(() => {
    if (!client) return;

    // We use a hardcoded ID "default_call" for this demo
    // In a real app, you'd generate a unique ID for each appointment
    const myCall = client.call('default', 'telehealth_demo_room');

    myCall.join({ create: true })
      .then(() => setCall(myCall))
      .catch((err) => console.error("Failed to join call", err));

    return () => {
      if (myCall) {
        myCall.leave();
      }
    };
  }, [client]);

  if (loading) return <div className="text-center mt-20">Loading User...</div>;
  if (!client || !call) return <div className="text-center mt-20">Setting up Camera...</div>;

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