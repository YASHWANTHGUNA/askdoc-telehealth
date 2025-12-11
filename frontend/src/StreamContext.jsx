import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
//This is the correct line
const API_URL = "https://askdoc-telehealth.onrender.com/api/v1";
// ✅ 2. CACHE BUSTER LOG (This forces a new file build)
console.log("🔥 APP RELOADED - V1.5 - Target URL:", API_URL);

export const StreamContext = createContext();

export const StreamProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check for existing session on page load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Try to fetch the stream token using the cookie (if user is already logged in)
        const res = await axios.get(`${API_URL}/stream/get-token`, {
          withCredentials: true,
        });

        if (res.data?.user && res.data?.token) {
          setUser(res.data.user);
          setToken(res.data.token);
        }
      } catch (error) {
        console.log("Not logged in or session expired");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // 2. Login Function (Connects UI to Backend)
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${API_URL}/users/login`,
        { email, password },
        { withCredentials: true } // IMPORTANT: This sets the httpOnly cookie
      );

      if (res.data.status === "success") {
        setUser(res.data.user);

        // CRITICAL: We save the 'streamToken' specifically for video/chat
        setToken(res.data.streamToken);

        return { success: true };
      }
    } catch (error) {
      console.error("Login error", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // 3. Logout Function
  const logout = async () => {
    try {
      await axios.post(
        `${API_URL}/users/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <StreamContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </StreamContext.Provider>
  );
};

// 4. Export the Custom Hook (This was the cause of your last error!)
export const useStream = () => useContext(StreamContext);
