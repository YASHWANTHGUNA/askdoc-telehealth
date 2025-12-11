import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { StreamProvider } from "./StreamContext"; // Import this

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <StreamProvider>
        {" "}
        {/* ✅ Wrap App in StreamProvider */}
        <App />
      </StreamProvider>
    </BrowserRouter>
  </React.StrictMode>
);
