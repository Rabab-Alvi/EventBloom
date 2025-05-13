import React, { useEffect, useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaImage, FaTag, FaUsers } from 'react-icons/fa';
import FallingElements from '../Homepage/FallingElements';
import GlitterButton from '../Homepage/GlitterButton';
import { useEvents } from '../../Components/EventContext';
import { useAuth } from 'C:/Users/rabab/Downloads/EventBloom/proj/src/Components/AuthContext.jsx';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { addEvent } = useEvents();
  const { user } = useAuth();
  const { getUserid } = useAuth();
  
  
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    capacity: '',
    live_flag : true
  });

  const [step, setStep] = useState(1);
  const totalSteps = 3;
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create event object with proper data format
    const orgID = getUserid(user);
  
    const newEventData = {
      name: eventData.name,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      description: eventData.description,
      capacity: eventData.capacity,
      organizer_id: await orgID,
      live_flag : true
      
    };
    
    // Add the event using context
    addEvent(newEventData);
    console.log('The user currently active : ', user);
    // Show success message
    alert('Event created successfully!');
    
    // Navigate to events page
    navigate('/events');
  };

  const renderStepIndicator = () => {
    return (
      <div className="step-indicator">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`step ${i + 1 === step ? 'active' : ''} ${i + 1 < step ? 'completed' : ''}`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    const smallerInputClass = "small-input"; // Add this class for smaller inputs

    switch (step) {
      case 1:
        return (
          <div className="form-step">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>
                <span><FaTag className="input-icon" /></span>
                Event Name
              </label>
              <input
                className={smallerInputClass} // Apply the smaller size class
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleChange}
                placeholder="Enter event name"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <span><FaCalendarAlt className="input-icon" /></span>
                Date
              </label>
              <input
                className={smallerInputClass}
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <span><FaClock className="input-icon" /></span>
                Time
              </label>
              <input
                className={smallerInputClass}
                type="time"
                name="time"
                value={eventData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h3>Location & Details</h3>
            <div className="form-group">
              <label>
                <span><FaMapMarkerAlt className="input-icon" /></span>
                Location
              </label>
              <input
                className={smallerInputClass}
                type="text"
                name="location"
                value={eventData.location}
                onChange={handleChange}
                placeholder="Enter venue or address"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <span><FaUsers className="input-icon" /></span>
                Capacity
              </label>
              <input
                className={smallerInputClass}
                type="number"
                name="capacity"
                value={eventData.capacity}
                onChange={handleChange}
                placeholder="Maximum number of attendees"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className={smallerInputClass}
                name="description"
                value={eventData.description}
                onChange={handleChange}
                placeholder="Describe your event"
                rows="4"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <h3>Media & Preview</h3>
            <div className="form-group">
              <label>
                <span><FaImage className="input-icon" /></span>
                Event Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {eventData.imagePreview && (
                <div className="image-preview">
                  <img src={eventData.imagePreview} alt="Event preview" />
                </div>
              )}
            </div>

            <div className="event-preview">
              <h4>Event Preview</h4>
              <div className="preview-card">
                {eventData.imagePreview && (
                  <div className="preview-image">
                    <img src={eventData.imagePreview} alt="Event" />
                  </div>
                )}
                <div className="preview-details">
                  <h3>{eventData.name || "Your Event Name"}</h3>
                  <p>
                    <FaCalendarAlt /> {eventData.date || "Date TBD"} at {eventData.time || "Time TBD"}
                  </p>
                  <p>
                    <FaMapMarkerAlt /> {eventData.location || "Location TBD"}
                  </p>
                  <p className="preview-description">
                    {eventData.description || "Your event description will appear here."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="create-event-container">
      <FallingElements />
      <div className="create-event-content">
        <h1>Create Your Magical Event 🌟</h1>
        <p>Fill in the details to bring your event to life</p>

        {renderStepIndicator()}

        <form className="event-form" onSubmit={step === totalSteps ? handleSubmit : (e) => e.preventDefault()}>
          {renderStepContent()}

          <div className="form-navigation">
            <div className="button-wrapper">
              {step > 1 && (
                <GlitterButton type="button" onClick={prevStep} className="prev-btn" style={{ flex: 1 }}>
                  Back
                </GlitterButton>
              )}
              {step < totalSteps ? (
                <GlitterButton type="button" onClick={nextStep} className="next-btn" style={{ flex: 1 }}>
                  Next
                </GlitterButton>
              ) : (
                <GlitterButton type="submit" className="submit-btn" style={{ flex: 1 }}>
                  Create Event
                </GlitterButton>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;