import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import CreateTrip from './create-trip';
import Navbar from './components/custom/Header';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ViewTrip from './view-trip';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/CreateTrip" element={<CreateTrip />} />
          <Route path="/view-trip/:tripId" element={<ViewTrip />} />
        </Routes>
      </GoogleOAuthProvider>
    </Router>
  </StrictMode>
);
