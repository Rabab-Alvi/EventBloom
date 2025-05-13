import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import './Animations.css'; 
import { FaHeart, FaCalendarAlt, FaTicketAlt, FaBullhorn, FaChartPie } from 'react-icons/fa';
import FallingElements from './FallingElements';
import GlitterButton from './GlitterButton';
import { useEvents } from '../../Components/EventContext';
import { useAuth } from '../../Components/AuthContext';

const HomePage = () => {
    const { events } = useEvents();
    const { user } = useAuth();
    
    // Get upcoming events (limit to 2)
    const upcomingEvents = events
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 2);
    
    useEffect(() => {
        if (!document.querySelector('meta[name="viewport"]')) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0';
            document.head.appendChild(meta);
        }
        if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Poppins:wght@300;400;600&display=swap';
            document.head.appendChild(fontLink);
        }
    }, []);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="homepage-container">
            {/* Falling Elements */}
            <FallingElements />
           
            {/* Hero Section */}
            <section className="hero-section">
                <h1>Create Magical Events, Effortlessly 🌸</h1>
                <p>Plan, Promote, and Manage Events in One Place</p>
                <div className="cta-container">
                    {user?.role.toLowerCase() === 'organizer' ? (
                        <Link to="/create-event">
                            <GlitterButton>Create Event</GlitterButton>
                        </Link>
                    ) : (
                        <Link to={user ? "/events" : "/register"}>
                            <GlitterButton>{user ? "Find Events" : "Get Started"}</GlitterButton>
                        </Link>
                    )}
                    <Link to="/events">
                        <GlitterButton>Explore Events</GlitterButton>
                    </Link>
                </div>
            </section>
            
            {/* Upcoming Events Section */}
            <section className="events-section">
                <h2>Upcoming Events 🌱</h2>
                <div className="event-grid">
                    {upcomingEvents.length > 0 ? (
                        upcomingEvents.map(event => (
                            <div key={event.id} className="event-card">
                                <h3>{event.name}</h3>
                                <p>{formatDate(event.date)} | {event.location}</p>
                                <Link to="/events">
                                    <GlitterButton>Register Now</GlitterButton>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No upcoming events. Check back soon!</p>
                    )}
                </div>
            </section>

            {/* Key Features */}
            <section className="features-section">
                <h2>Why Choose EventBloom?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <FaCalendarAlt className="feature-icon" />
                        <h3>Easy Scheduling</h3>
                        <p>Drag-and-drop calendar for seamless planning.</p>
                    </div>
                    <div className="feature-card">
                        <FaTicketAlt className="feature-icon" />
                        <h3>Secure Payments</h3>
                        <p>Integrated with Stripe/PayPal.</p>
                    </div>
                    <div className="feature-card">
                        <FaBullhorn className="feature-icon" />
                        <h3>Social Promotion</h3>
                        <p>One-click sharing to Instagram/Facebook.</p>
                    </div>
                    <div className="feature-card">
                        <FaChartPie className="feature-icon" />
                        <h3>Analytics Dashboard</h3>
                        <p>Track ticket sales and attendance.</p>
                    </div>
                </div>
            </section>

           
            {/* Testimonials Section */}
                        <section className="testimonials-section">
                            <h2>What Our Users Say</h2>
                            <p>"EventBloom saved me hours of planning!"</p>
                            <Link to="/feedback">
                                <GlitterButton>Submit Feedback</GlitterButton>
                            </Link>
                        </section>

            {/* Footer */}
            <footer className="footer">
                <a href="#faqs">FAQs</a>
                <a href="#contact">Contact</a>
                <a href="#privacy">Privacy Policy</a>
                <p>Follow us on social media!</p>
            </footer>
        </div>
    );
};

export default HomePage;