import React, { createContext, useContext, useState, useEffect } from 'react';


const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/event');
        console.log("Fetch response status:", response.status);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched events:", data); // Debug log
        setEvents(data);
      
      } catch (error) {
        console.error("Error fetching events:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const addEvent = async (eventData) => {
    try {
      console.log("Sending event data:", eventData);
      const response = await fetch('http://localhost:8080/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const newEvent = await response.json();
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      console.error("Error adding event:", err);
      throw err;
    }
  };

  const registerForEvent = async (eventId, userData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/event/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const updatedEvent = await response.json();
      setEvents(prev =>
        prev.map(e => (e.id === updatedEvent.id || e.event_id === updatedEvent.id || 
                       e.id === updatedEvent.event_id || e.event_id === updatedEvent.event_id 
                       ? updatedEvent : e))
      );
      return updatedEvent;
    } catch (err) {
      console.error("Error registering:", err);
      throw err;
    }
  };

  const isRegistered = (eventId, userEmail) => {
    const event = events.find(event => event.id === eventId || event.event_id === eventId);
    if (!event || !event.registrations) return false;
    return event.registrations.some(reg => reg.email === userEmail);
  };

  return (
    <EventContext.Provider value={{ 
      events, 
      loading, 
      error,
      addEvent, 
      registerForEvent, 
      isRegistered 
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);