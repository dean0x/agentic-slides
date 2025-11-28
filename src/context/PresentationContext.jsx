import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { DEFAULT_THEME } from '@/types/presentation';
import { resolveIcon } from '@/lib/icons';

/**
 * @typedef {import('@/types/presentation').Presentation} Presentation
 * @typedef {import('@/types/presentation').Slide} Slide
 * @typedef {import('@/types/presentation').PresentationTheme} PresentationTheme
 */

/**
 * @typedef {Object} PresentationContextValue
 * @property {Presentation | null} presentation - Current presentation
 * @property {Slide | null} currentSlide - Current slide
 * @property {number} currentIndex - Current slide index
 * @property {number} totalSlides - Total number of slides
 * @property {PresentationTheme} theme - Merged theme (defaults + overrides)
 * @property {(index: number) => void} goToSlide - Navigate to specific slide
 * @property {() => void} nextSlide - Go to next slide
 * @property {() => void} prevSlide - Go to previous slide
 * @property {(presentation: Presentation, basePath: string) => void} loadPresentation - Load a presentation
 * @property {string} basePath - Base path for assets
 * @property {boolean} isLoading - Loading state
 * @property {string | null} error - Error message
 */

const PresentationContext = createContext(null);

/**
 * Processes slides to resolve icon references and image paths
 * @param {Slide[]} slides - Raw slides from JSON
 * @param {string} basePath - Base path for assets
 * @returns {Slide[]} Processed slides
 */
function processSlides(slides, basePath) {
  return slides.map(slide => {
    const processed = { ...slide };

    // Resolve slide icon
    if (typeof slide.icon === 'string') {
      processed.iconComponent = resolveIcon(slide.icon);
    }

    // Resolve image path
    if (slide.image && typeof slide.image === 'string') {
      // If it's already a full URL or absolute path, keep it
      if (slide.image.startsWith('http') || slide.image.startsWith('/')) {
        processed.imagePath = slide.image;
      } else {
        // Otherwise, prepend the base path
        processed.imagePath = `${basePath}/assets/${slide.image}`;
      }
    }

    // Process items with icons
    if (slide.items) {
      processed.items = slide.items.map(item => {
        const processedItem = { ...item };
        if (typeof item.icon === 'string') {
          processedItem.iconComponent = resolveIcon(item.icon);
        }
        return processedItem;
      });
    }

    return processed;
  });
}

/**
 * Merges default theme with presentation-specific overrides
 * @param {PresentationTheme | undefined} overrides - Theme overrides
 * @returns {PresentationTheme}
 */
function mergeTheme(overrides) {
  if (!overrides) return DEFAULT_THEME;

  return {
    colors: { ...DEFAULT_THEME.colors, ...overrides.colors },
    mermaid: { ...DEFAULT_THEME.mermaid, ...overrides.mermaid },
    benchmarkColors: { ...DEFAULT_THEME.benchmarkColors, ...overrides.benchmarkColors }
  };
}

export function PresentationProvider({ children }) {
  const [presentation, setPresentation] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [basePath, setBasePath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPresentation = useCallback((data, path) => {
    setIsLoading(true);
    setError(null);

    try {
      // Process slides with resolved icons and images
      const processedSlides = processSlides(data.slides, path);

      setPresentation({
        ...data,
        slides: processedSlides
      });
      setBasePath(path);
      setCurrentIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const goToSlide = useCallback((index) => {
    if (!presentation) return;
    const clampedIndex = Math.max(0, Math.min(index, presentation.slides.length - 1));
    setCurrentIndex(clampedIndex);
  }, [presentation]);

  const nextSlide = useCallback(() => {
    if (!presentation) return;
    setCurrentIndex(prev => Math.min(prev + 1, presentation.slides.length - 1));
  }, [presentation]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const theme = useMemo(() => {
    return mergeTheme(presentation?.theme);
  }, [presentation?.theme]);

  const currentSlide = presentation?.slides?.[currentIndex] || null;
  const totalSlides = presentation?.slides?.length || 0;

  const value = useMemo(() => ({
    presentation,
    currentSlide,
    currentIndex,
    totalSlides,
    theme,
    goToSlide,
    nextSlide,
    prevSlide,
    loadPresentation,
    basePath,
    isLoading,
    error
  }), [
    presentation,
    currentSlide,
    currentIndex,
    totalSlides,
    theme,
    goToSlide,
    nextSlide,
    prevSlide,
    loadPresentation,
    basePath,
    isLoading,
    error
  ]);

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
}

/**
 * Hook to access presentation context
 * @returns {PresentationContextValue}
 */
export function usePresentation() {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
}

/**
 * Hook for keyboard navigation
 */
export function usePresentationKeyboard() {
  const { nextSlide, prevSlide } = usePresentation();

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'Backspace':
          e.preventDefault();
          prevSlide();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);
}
