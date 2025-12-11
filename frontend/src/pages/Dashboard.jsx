import React, { useState, useEffect } from "react";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";
import { useStream } from "../StreamContext";
import { useNavigate } from "react-router-dom";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

const Dashboard = () => {
  const { user, authToken, streamToken, logout, loading } = useStream();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);

  // 1. Initialize Chat Client (SAFE MODE)
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    // Only initialize when we have a logged-in user and a token
    if (!user || !streamToken) return;

    const client = new StreamChat(apiKey, {
      baseURL: "https://chat-proxy-mumbai.stream-io-api.com",
      timeout: 6000,
    });

    let mounted = true;

    (async () => {
      try {
        await client.connectUser(
          { id: user.id, name: user.name, image: user.image },
          streamToken
        );

        if (mounted) setChatClient(client);
      } catch (err) {
        console.error("Failed to connect chat client:", err);
      }
    })();

    return () => {
      mounted = false;
      // disconnect safely
      if (client) client.disconnectUser().catch(() => {});
      setChatClient(null);
    };
  }, [user, streamToken]);

  // 2. Setup Channel
  useEffect(() => {
    // Only run if the client is fully connected and user exists
    if (!chatClient || !user) return;

    const setupChannel = async () => {
      try {
        const newChannel = chatClient.channel(
          "messaging",
          `medical-notes-${user.id}`,
          {
            name: "My Medical Notes",
            members: [user.id],
          }
        );
        await newChannel.watch();
        setChannel(newChannel);
      } catch (err) {
        console.error("Error creating channel:", err);
      }
    };

    setupChannel();
  }, [chatClient, user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // 4. Redirect if not logged in (run as an effect to respect hooks rules)
  useEffect(() => {
    if (!loading && (!user || !authToken)) navigate("/login");
  }, [loading, user, authToken]);

  // 3. Loading State
  if (loading) return <div className="text-center mt-20">Loading User...</div>;

  if (!user || !authToken) return null;

  // 5. Wait for Chat Client
  if (!chatClient || !channel)
    return <div className="text-center mt-20">Initializing Chat...</div>;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">AskDoc Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium">
            Hello, {user.name} ({user.role})
          </span>
          {user.role === "patient" && (
            <>
              <button
                onClick={() => navigate("/book-appointment")}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-sm"
              >
                Book Appointment
              </button>
              <button
                onClick={() => navigate("/my-appointments")}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition shadow-sm"
              >
                My Appointments
              </button>
            </>
          )}
          {user.role === "doctor" && (
            <button
              onClick={() => navigate("/my-appointments")}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition shadow-sm"
            >
              View Appointments
            </button>
          )}
          <button
            onClick={() => navigate("/video")}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition shadow-sm"
          >
            Start Video Call
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition shadow-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Chat Area */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <Chat client={chatClient} theme="messaging light">
            <Channel channel={channel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
