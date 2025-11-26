import React, { useState, useEffect } from 'react';
import { Slide } from './components/Slide';
import { slides } from './data/slides';

function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-background min-h-screen text-white">
      <Slide 
        slide={slides[currentSlideIndex]} 
        currentSlideIndex={currentSlideIndex} 
        totalSlides={slides.length} 
      />
    </div>
  );
}

export default App;
