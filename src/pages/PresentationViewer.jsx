import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { findPresentation } from '@/presentations/registry';
import { usePresentation, usePresentationKeyboard } from '@/context/PresentationContext';
import { SlideRenderer } from '@/components/SlideRenderer';
import { Home, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

export function PresentationViewer() {
  const { id } = useParams();
  const [loadError, setLoadError] = useState(null);

  const {
    presentation,
    currentSlide,
    currentIndex,
    totalSlides,
    loadPresentation,
    nextSlide,
    prevSlide,
    goToSlide,
    isLoading,
    error
  } = usePresentation();

  // Enable keyboard navigation
  usePresentationKeyboard();

  // Load presentation on mount or when ID changes
  useEffect(() => {
    async function load() {
      const entry = findPresentation(id);

      if (!entry) {
        setLoadError(`Presentation "${id}" not found`);
        return;
      }

      try {
        const module = await entry.loader();
        const basePath = `/presentations/${id}`;
        loadPresentation(module.default || module, basePath);
        setLoadError(null);
      } catch (err) {
        console.error('Failed to load presentation:', err);
        setLoadError(`Failed to load presentation: ${err.message}`);
      }
    }

    load();
  }, [id, loadPresentation]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#F5F5F7] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-secondary">Loading presentation...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (loadError || error) {
    return (
      <div className="h-screen w-full bg-[#F5F5F7] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 max-w-lg text-center shadow-xl"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-4">Unable to Load Presentation</h2>
          <p className="text-secondary mb-8">{loadError || error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  // No presentation loaded yet
  if (!presentation || !currentSlide) {
    return null;
  }

  return (
    <div className="relative">
      {/* Slide Content */}
      <SlideRenderer
        slide={currentSlide}
        currentIndex={currentIndex}
        totalSlides={totalSlides}
        defaultSubtitle={presentation.meta?.subtitle}
      />

      {/* Navigation Overlay */}
      <NavigationOverlay
        currentIndex={currentIndex}
        totalSlides={totalSlides}
        onPrev={prevSlide}
        onNext={nextSlide}
        onGoTo={goToSlide}
        presentationTitle={presentation.meta?.title}
      />
    </div>
  );
}

function NavigationOverlay({ currentIndex, totalSlides, onPrev, onNext, onGoTo, presentationTitle }) {
  const [showControls, setShowControls] = useState(false);

  // Show controls on mouse movement
  useEffect(() => {
    let timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : -20 }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/30 to-transparent pointer-events-none z-50"
      >
        <div className="h-full px-6 flex items-center justify-between pointer-events-auto">
          <Link
            to="/"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Home</span>
          </Link>

          <span className="text-white/60 text-sm font-medium truncate max-w-md">
            {presentationTitle}
          </span>

          <div className="w-20"></div>
        </div>
      </motion.div>

      {/* Side Navigation Buttons */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls && currentIndex > 0 ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="fixed left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-50 disabled:opacity-0"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-text" />
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls && currentIndex < totalSlides - 1 ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        onClick={onNext}
        disabled={currentIndex === totalSlides - 1}
        className="fixed right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-50 disabled:opacity-0"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-text" />
      </motion.button>

      {/* Bottom Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
          {/* Mini slide dots */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalSlides, 20) }).map((_, i) => {
              const slideIndex = totalSlides > 20
                ? Math.round((i / 19) * (totalSlides - 1))
                : i;

              return (
                <button
                  key={i}
                  onClick={() => onGoTo(slideIndex)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    slideIndex === currentIndex
                      ? 'bg-primary w-4'
                      : slideIndex < currentIndex
                      ? 'bg-primary/40'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${slideIndex + 1}`}
                />
              );
            })}
          </div>

          <div className="w-px h-4 bg-gray-200 mx-2"></div>

          <span className="text-sm text-secondary font-medium tabular-nums">
            {currentIndex + 1} / {totalSlides}
          </span>
        </div>
      </motion.div>

      {/* Click zones for navigation */}
      <div
        className="fixed left-0 top-0 w-1/4 h-full cursor-w-resize z-40 opacity-0"
        onClick={onPrev}
      />
      <div
        className="fixed right-0 top-0 w-1/4 h-full cursor-e-resize z-40 opacity-0"
        onClick={onNext}
      />
    </>
  );
}
