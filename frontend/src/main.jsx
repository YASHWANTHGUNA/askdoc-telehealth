 // frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { StreamProvider } from "./contexts/StreamContext";
import { Toaster } from "react-hot-toast"; // ✅ Added Toaster import

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* ✅ Added Toaster globally */}
      <Toaster position="top-right" />
      <StreamProvider>
        <App />
      </StreamProvider>
    </BrowserRouter>
  </React.StrictMode>
);
