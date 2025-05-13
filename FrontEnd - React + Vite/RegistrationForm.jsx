import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegistrationForm.css';
import { useAuth } from 'C:/Users/rabab/Downloads/EventBloom/proj/src/Components/AuthContext.jsx';
import GlitterButton from '../Homepage/GlitterButton';
import FallingElements from 'C:/Users/rabab/Downloads/EventBloom/proj/src/Pages/Homepage/FallingElements.jsx'; // Import falling elements component

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'attendee',
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString() 
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add registration logic here
    console.log(formData);
    login(formData);
    navigate(formData.role === 'organizer' ? '/create-event' : '/events');
    try{
      const response=await fetch("http://localhost:8080/api/user", {
        method : "POST",
        headers : {"Content-type": "application/json"},
        body: JSON.stringify(formData)
    });
      const data=await response.json();
      console.log("User created: ",data);
      navigate("/")

    } catch(error){
        console.log("Error creating user",error.message);
    }
  };

  return (
    <div className="registration-page">
      {/* Falling elements background */}
      <FallingElements />
      
      {/* Registration form container */}
      <div className="registration-container">
        <h2>Join EventBloom</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Role Selection Buttons */}
          <div className="role-buttons">
            <button
              type="button"
              className={formData.role === 'attendee' ? 'active' : ''}
              onClick={() => setFormData({ ...formData, role: 'attendee' })}
            >
              Attendee
            </button>
            <button
              type="button"
              className={formData.role === 'organizer' ? 'active' : ''}
              onClick={() => setFormData({ ...formData, role: 'organizer' })}
            >
              Organizer
            </button>
          </div>

          {/* Submit Button */}
          <div className="submit-container">
            <GlitterButton type="submit">
              Register
            </GlitterButton>
          </div>

          {/* Login Link */}
          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;