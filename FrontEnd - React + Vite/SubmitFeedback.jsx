import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SubmitFeedback.css';
import { FaStar, FaHeart } from 'react-icons/fa';
import GlitterButton from '../Homepage/GlitterButton';
import FallingElements from 'C:/Users/rabab/Downloads/EventBloom/proj/src/Pages/Homepage/FallingElements.jsx'; // Import falling elements component


const SubmitFeedback = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rating: 0,
        feedback: '',
        isPublic: false
    });
    
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleRatingClick = (rating) => {
        setFormData(prevData => ({
            ...prevData,
            rating
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        console.log('Submitting feedback:', formData);
        try{
            const response=await fetch("http://localhost:8080/api/feedback", {
              method : "POST",
              headers : {"Content-type": "application/json"},
              body: JSON.stringify(formData)
          });
            const data=await response.json();
            console.log("Feedback submitted: ",data);
           
            navigate("/")
      
          } catch(error){
              console.log("Error submiting feedback",error.message);
              setIsSubmitted(false);
          }
    
          setIsSubmitted(true);
        
        // Reset form after submission
        setFormData({
            name: '',
            email: '',
            rating: 0,
            feedback: '',
            isPublic: false
        });
       
    };
    
    if (isSubmitted) {
        return (
            <div className="feedback-page-container">
              
                <div className="feedback-success">
                    <div className="success-icon">
                        <FaHeart className="heart-icon" />
                    </div>
                    <h2>Thank You for Your Feedback!</h2>
                    <p>We appreciate you taking the time to share your thoughts with us.</p>
                    <Link to="/">
                        <GlitterButton>Return to Home</GlitterButton>
                    </Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="feedback-page-container">
               {/* Falling elements background */}
               <FallingElements />
            <div className="feedback-form-wrapper">
                <h1>We Value Your Feedback 💭</h1>
                <p className="feedback-subtitle">Your thoughts help us bloom into something even better!</p>
                
                <form className="feedback-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your name"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    
                    <div className="form-group rating-group">
                        <label>How would you rate your experience?</label>
                        <div className="star-rating">
                            {[...Array(5)].map((_, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <FaStar
                                        key={ratingValue}
                                        className={`star-icon ${ratingValue <= (hoverRating || formData.rating) ? 'filled' : ''}`}
                                        onClick={() => handleRatingClick(ratingValue)}
                                        onMouseEnter={() => setHoverRating(ratingValue)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="feedback">Your Feedback</label>
                        <textarea
                            id="feedback"
                            name="feedback"
                            value={formData.feedback}
                            onChange={handleChange}
                            required
                            placeholder="Please share your thoughts, suggestions, or experiences..."
                            rows="5"
                        />
                    </div>
                    
                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            id="isPublic"
                            name="isPublic"
                            checked={formData.isPublic}
                            onChange={handleChange}
                        />
                        <label htmlFor="isPublic">Allow us to share your feedback publicly</label>
                    </div>
                    
                    <div className="form-actions">
                        <GlitterButton type="submit">Submit Feedback</GlitterButton>
                        <Link to="/" className="cancel-link">Cancel</Link>
                    </div>
                </form>
            </div>
            
            
        </div>
    );
};

export default SubmitFeedback;