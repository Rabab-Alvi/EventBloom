import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Events.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUserPlus, FaCheck } from 'react-icons/fa';
import GlitterButton from '../Homepage/GlitterButton';
import { useEvents } from '../../Components/EventContext';
import { useAuth } from '../../Components/AuthContext';
import FallingElements from 'C:/Users/rabab/Downloads/EventBloom/proj/src/Pages/Homepage/FallingElements.jsx'; // Import falling elements component


const Events = () => {
  const { events, registerForEvent, isRegistered } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(null);

  // Get search term from URL
    const searchParams = new URLSearchParams(location.search);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [filteredEvents, setFilteredEvents] = useState([]);

    // Update filtered events when search term or events change
      useEffect(() => {
        const filtered = events.filter(event => 
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(filtered);
      }, [searchTerm, events]);
  

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleRegister = async(eventId) => {
    if (!user) {
      navigate('/register');
      return;
    }

    registerForEvent(eventId, {
      name: user.name,
      email: user.email,
      role: user.role,
      registrationDate: new Date().toISOString()
    });

    alert('🌸 Registration successful! 🌸');
  };

  const toggleDetails = (eventId) => {
    setShowDetails(showDetails === eventId ? null : eventId);
  };


  return (
    <div className="events-container">
      <FallingElements />
      
      <h1>
        {searchTerm ? `Search: "${searchTerm}"` : 'Blossoming Events'} 🌸
      </h1>
      
      {filteredEvents.length === 0 ? (
        <div className="no-events">
          <p>No {searchTerm ? 'matching' : 'blooming'} events found! Check back soon 🌷</p>
        </div>
      ) : (
        <div className="events-horizontal-scroll">
          {filteredEvents.map(event => (
            <div key={event.id} className="event-card">
              {event.imageUrl && (
                <div className="event-image">
                  <img src={event.imageUrl} alt={event.name} />
                </div>
              )}
              
              <h3>{event.name}</h3>
              
              <div className="event-info">
                <p>
                  <FaCalendarAlt className="event-icon" /> 
                  {formatDate(event.date)}
                </p>
                
                <p>
                  <FaClock className="event-icon" /> 
                  {event.time || 'Time TBA'}
                </p>
                
                <p>
                  <FaMapMarkerAlt className="event-icon" /> 
                  {event.location}
                </p>
              </div>

              {showDetails === event.id && (
                <div className="event-details">
                  <p className="event-description">{event.description}</p>
                  {event.capacity && (
                    <p className="event-capacity">
                      {event.registrations?.length || 0}/{event.capacity} spots
                    </p>
                  )}
                </div>
              )}
              
              <div className="event-actions">
                <GlitterButton onClick={() => toggleDetails(event.id)}>
                  {showDetails === event.id ? 'Hide Details' : 'View 🌸'}
                </GlitterButton>
                
                {user && isRegistered(event.id, user.email) ? (
                  <GlitterButton className="registered-btn" disabled>
                    <FaCheck /> Registered
                  </GlitterButton>
                ) : (
                  <GlitterButton onClick={() => handleRegister(event.id)}>
                    <FaUserPlus /> Join
                  </GlitterButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;