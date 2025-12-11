import React, { createContext, useContext, useState, useEffect } from "react";

const StreamContext = createContext();

export const StreamProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [streamToken, setStreamToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check Local Storage on App Load
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("streamToken"); // We saved this in Login.jsx!

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setStreamToken(storedToken);
    }
    setLoading(false);
  }, []);

  return (
    <StreamContext.Provider value={{ user, streamToken, loading }}>
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = () => {
  return useContext(StreamContext);
};
