
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';
import { FaHome, FaCalendarPlus, FaCalendarAlt, FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa'; // Changed FaSearch to FaCalendarAlt
import { useAuth } from './AuthContext';



const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="nav-container">
      <div className="nav-logo">
        <Link to="/">
          <span className="logo-icon">🌸</span>
          <span className="logo-text">EventBloom</span>
        </Link>
      </div>

      {/* Desktop Search */}
      <form className="nav-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">
          <FaSearch /> {/* Search icon remains same */}
        </button>
      </form>

      <div className="menu-toggle" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
      
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <FaHome className="nav-icon" />
            <span>Home</span>
          </Link>
        </li>

        {/* Changed Explore to Event Calendar */}
        <li>
          <Link to="/calendar" onClick={() => setMenuOpen(false)}>
            <FaCalendarAlt className="nav-icon" /> {/* Changed icon */}
            <span>Event Calendar</span> {/* Changed text */}
          </Link>
        </li>

        {/* Login/Profile Section (unchanged) */}
        <li>
          {user ? (
            <div className="profile-dropdown" onClick={() => setMenuOpen(false)}>
              <div className="user-info">
                <FaUser className="nav-icon" />
                <span className="username">{user.name || user.email}</span>
              </div>
              <div className="dropdown-content">
                <button onClick={logout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <FaUser className="nav-icon" />
              <span>Login</span>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
