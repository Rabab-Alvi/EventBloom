import React, { useRef, useState } from 'react';
import './Animations.css';

const GlitterButton = ({ children, className, onClick, ...rest }) => {
  const buttonRef = useRef(null);
  const [glitters, setGlitters] = useState([]);

  const createGlitter = (e) => {
    if (!buttonRef.current) return;
    
    // Get button dimensions and position
    const rect = buttonRef.current.getBoundingClientRect();
    
    // Create multiple glitter particles on mousemove
    const particles = [];
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: Math.random().toString(36).substring(2, 9),
        left: e.clientX - rect.left + (Math.random() * 20 - 10),
        top: e.clientY - rect.top + (Math.random() * 20 - 10),
        size: Math.random() * 3 + 2,
        duration: Math.random() * 0.5 + 0.5,
        color: `hsl(${Math.random() * 60 + 300}, 100%, 70%)`,
      });
    }
    
    setGlitters(prev => [...prev, ...particles]);
    
    // Clean up glitters after animation
    setTimeout(() => {
      setGlitters(prev => prev.filter(g => !particles.some(p => p.id === g.id)));
    }, 1000);
  };

  return (
    <button
      ref={buttonRef}
      className={`cta-button ${className || ''}`}
      onMouseMove={createGlitter}
      onClick={onClick}
      {...rest}
    >
      {children}
      
      {glitters.map(glitter => (
        <span
          key={glitter.id}
          className="glitter-effect"
          style={{
            left: `${glitter.left}px`,
            top: `${glitter.top}px`,
            width: `${glitter.size}px`,
            height: `${glitter.size}px`,
            background: glitter.color,
            animation: `sparkle ${glitter.duration}s linear forwards`
          }}
        />
      ))}
    </button>
  );
};

export default GlitterButton;