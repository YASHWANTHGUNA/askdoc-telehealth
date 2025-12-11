import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
// 1. IMPORT THE PROVIDER
import { StreamProvider } from './StreamContext.jsx' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 2. WRAP THE APP INSIDE THE PROVIDER */}
      <StreamProvider>
        <App />
      </StreamProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
