import React, { createContext, useState } from "react";
import axios from "axios";

// API base for backend
const API_URL = "http://localhost:8000/api/v1";

export const StreamContext = createContext();

export const StreamProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      if (typeof window === "undefined") return null;
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (_) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      if (typeof window === "undefined") return null;
      return localStorage.getItem("token") || null;
    } catch (_) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setToken(res.data.token);
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <StreamContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </StreamContext.Provider>
  );
};

export default StreamProvider;
