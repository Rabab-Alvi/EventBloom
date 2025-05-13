import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { useAuth } from 'C:/Users/rabab/Downloads/EventBloom/proj/src/Components/AuthContext.jsx';
import GlitterButton from '../Homepage/GlitterButton';
import FallingElements from 'C:/Users/rabab/Downloads/EventBloom/proj/src/Pages/Homepage/FallingElements.jsx';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    
    try {
      const response = await fetch(`http://localhost:8080/api/user/${email}/${password}`);
      console.log("Fetch response status:", response.status);
  
      if (!response.ok) {
        throw new Error(`User Not Found, response: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Fetched user:", data); // Debug log
      login(data);
      const role=data.role?.toLowerCase();
      console.log("Fetched user role:", role);
      navigate(role === 'ORGANIZER'? '/create-event' : '/');
      //navigate('/')
      
  
    } catch (error) {
      console.error("Error fetching user:", error.message);
      setFormData({ email: '', password: '' });  // Clear input fields
      setError('Incorrect username or password');
    }
  };
  

  return (
    <div className="login-page">
      <FallingElements />
      
      <div className="login-container">
        <h2>Welcome Back</h2>
        
        <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="submit-container">
            <GlitterButton type="submit">
              Login
            </GlitterButton>
          </div>

          <p className="register-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;