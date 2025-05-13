import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Components/AuthContext';
import { EventProvider } from './Components/EventContext';
import './App.css';

// Page Components
import Homepage from "./Pages/Homepage/Homepage";
import RegistrationForm from "./Pages/RegistrationForm/RegistrationForm";
import LoginForm from "./Pages/LoginForm/LoginForm";
import CreateEvent from "./Pages/CreateEvent/CreateEvent";
import Events from "./Pages/Events/Events";
import SubmitFeedback from "./Pages/SubmitFeedback/SubmitFeedback";
import CalendarPage from "./Pages/CalendarPage/CalendarPage"; // Import the CalendarPage component

// Components
import Navigation from "./Components/Navigation";

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <div className="app-container">
            <Navigation />
            
            <div className="page-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/events" element={<Events />} />
                <Route path="/feedback" element={<SubmitFeedback />} />
                <Route path="/calendar" element={<CalendarPage />} /> 
                <Route path="/create-event" element={<CreateEvent />} />
              
              </Routes>
            </div>
          </div>
        </Router>
      </EventProvider>
    </AuthProvider>
  );
}

// Protected Route Component
const ProtectedRoute = ({ role, children }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  
  return children;
};

export default App;