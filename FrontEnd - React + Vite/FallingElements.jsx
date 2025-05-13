import React, { useEffect, useState } from 'react';
import './Animations.css';

const FallingElements = () => {
  const [elements, setElements] = useState([]);

  const generateFlower = () => ({
    id: Math.random().toString(36).substring(2, 9),
    side: Math.random() > 0.5 ? 'left' : 'right',
    size: 0.5 + Math.random() * 2, // Random size between 0.5rem and 2.5rem
    speed: 5 + Math.random() * 10, // Random speed between 5-15s
    offset: Math.random() * 20 - 10 + '%', // Horizontal position variation
    delay: Math.random() * 5 // Staggered animation start
  });

  useEffect(() => {
    // Create initial flowers
    const initialFlowers = Array(10).fill().map(generateFlower);
    setElements(initialFlowers);

    // Add new flowers periodically
    const interval = setInterval(() => {
      setElements(prev => [...prev.slice(-15), generateFlower()]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {elements.map(flower => (
        <div
          key={flower.id}
          className="falling-flower"
          style={{
            [flower.side]: `calc(${flower.offset} + 5%)`,
            fontSize: `${flower.size}rem`,
            animation: `fall ${flower.speed}s linear ${flower.delay}s infinite`,
            opacity: 0.8
          }}
        >
          <div className="flower-animation">🌸</div>
        </div>
      ))}
    </>
  );
};

export default FallingElements;