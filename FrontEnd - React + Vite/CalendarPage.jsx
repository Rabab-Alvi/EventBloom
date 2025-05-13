
import React, { useState } from 'react';
import { useEvents } from 'C:/Users/rabab/Downloads/EventBloom/proj/src/Components/EventContext.jsx';
import { format, parseISO, isBefore, isAfter, isSameDay } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'C:/Users/rabab/Downloads/EventBloom/proj/src/Pages/CalendarPage/CalendarPage.css';
import FallingElements from 'C:/Users/rabab/Downloads/EventBloom/proj/src/Pages/Homepage/FallingElements.jsx';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';
import 'react-calendar/dist/Calendar.css';


const CalendarPage = () => {
  const { events, registerForEvent, isRegistered } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);

  const getEventStatus = (date) => {
    const today = new Date();
    return events.filter(event => {
        console.log("Fetched events:", date);

      const eventDate = parseISO(event.date);
      return format(eventDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    }).map(event => {
      const eventDate = parseISO(event.date);
      let status = 'upcoming';
      if (isBefore(eventDate, today)) status = 'completed';
      else if (isSameDay(eventDate, today)) status = 'ongoing';
      return { ...event, status };
    });
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dailyEvents = getEventStatus(date);
    return dailyEvents.length > 0 && (
      <div className="day-events">
        {dailyEvents.map(event => (
          <div key={event.id} className={`event-marker ${event.status}`} />
        ))}
      </div>
    );
  };

  const handleDateClick = (value) => {
    setSelectedDate(value);
    const dateEvents = getEventStatus(value);
    setSelectedEvents(dateEvents);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleRegister = (eventId) => {
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

  return (
    <div className="calendar-container">
      <FallingElements />
      <h1>Event Calendar 🌸</h1>
      <div className="calendar-wrapper">
        <div className="calendar-content">
          <div className="calendar-left">
            <Calendar
              tileContent={tileContent}
              className="bloom-calendar"
              onChange={handleDateClick}
              value={selectedDate}
            />
            <div className="calendar-legend">
              <div className="legend-item">
                <span className="legend-marker upcoming" /> Upcoming
              </div>
              <div className="legend-item">
                <span className="legend-marker ongoing" /> Ongoing
              </div>
              <div className="legend-item">
                <span className="legend-marker completed" /> Completed
              </div>
            </div>
          </div>
          
          <div className="calendar-right">
            <div className="selected-date">
              <h2>{formatDate(selectedDate)}</h2>
              {selectedEvents.length === 0 ? (
                <div className="no-events-message">
                  <p>No events on this date 🌷</p>
                </div>
              ) : (
                <div className="date-events">
                  {selectedEvents.map(event => (
                    <div key={event.id} className={`date-event-card ${event.status}`}>
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
                      
                      <div className="event-description">
                        <p>{event.description}</p>
                      </div>
                      
                      {user && isRegistered(event.id, user.email) ? (
                        <button className="registered-btn event-btn" disabled>
                          Registered ✓
                        </button>
                      ) : (
                        <button 
                          className="register-btn event-btn"
                          onClick={() => handleRegister(event.id)}
                        >
                          Register for Event <FaUserPlus />
                        </button>
                      )}
                      
                      <div className="event-status-badge">
                        {event.status === 'upcoming' && 'Upcoming'}
                        {event.status === 'ongoing' && 'Happening Now'}
                        {event.status === 'completed' && 'Completed'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;