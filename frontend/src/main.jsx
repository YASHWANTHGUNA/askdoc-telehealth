import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StreamProvider } from './contexts/StreamContext';

// Notice: No <StrictMode> tags anymore
createRoot(document.getElementById('root')).render(
  <StreamProvider>
    <App />
  </StreamProvider>
)
