import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BenchmarkChart } from './BenchmarkChart';
import {
  containerVariants,
  itemVariants,
  SlideHeader,
  SlideContent,
  VisualPanel,
  CodeBlock,
  MermaidDiagram
} from './layouts';
import { usePresentation } from '@/context/PresentationContext';
import { X } from 'lucide-react';

/**
 * Determines the layout type based on slide properties
 * @param {import('@/types/presentation').Slide} slide
 * @returns {'intro' | 'standard' | 'code' | 'mermaid_split' | 'benchmark_chart' | 'image_comparison'}
 */
function getLayoutType(slide) {
  if (slide.type === 'title') return 'intro';
  if (slide.type === 'code_split') return 'code';
  if (slide.type === 'mermaid_split') return 'mermaid_split';
  if (slide.type === 'benchmark_chart') return 'benchmark_chart';
  if (slide.type === 'image_comparison') return 'image_comparison';
  return 'standard';
}

/**
 * SlideRenderer - Renders a single slide with appropriate layout
 * @param {Object} props
 * @param {import('@/types/presentation').Slide} props.slide - Slide data
 * @param {number} props.currentIndex - Current slide index
 * @param {number} props.totalSlides - Total slides count
 * @param {string} [props.defaultSubtitle] - Default subtitle for presentation
 */
export function SlideRenderer({ slide, currentIndex, totalSlides, defaultSubtitle }) {
  const { theme } = usePresentation();
  const [enlargedImage, setEnlargedImage] = useState(null);

  const layout = getLayoutType(slide);

  // Close lightbox on Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && enlargedImage) {
      setEnlargedImage(null);
    }
  }, [enlargedImage]);

  useEffect(() => {
    if (enlargedImage) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [enlargedImage, handleKeyDown]);

  return (
    <div className="h-screen w-full bg-[#F5F5F7] text-text overflow-hidden flex items-center justify-center p-6 xl:p-12">
      {/* Main Slide Wrapper */}
      <div className="w-full max-w-[95vw] h-full max-h-[95vh] bg-white rounded-[2.5rem] shadow-2xl flex overflow-hidden ring-1 ring-black/5 relative">

        {/* INTRO LAYOUT */}
        {layout === 'intro' && (
          <>
            {/* LEFT: Visuals (45%) */}
            <div className="w-[45%] h-full bg-gray-50 flex items-center justify-center relative border-r border-gray-100 overflow-hidden">
              <VisualPanel
                slideId={slide.id}
                visualType={slide.visualType}
                visualContent={slide.visualContent}
                imagePath={slide.imagePath}
                title={slide.title}
                mermaidTheme={theme.mermaid}
              />
            </div>
            {/* RIGHT: Content (55%) */}
            <div className="w-[55%] h-full flex flex-col justify-center p-16 xl:p-24 relative text-center items-center">
              <motion.div
                className="w-full max-w-3xl mx-auto flex flex-col items-center"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={`content-${slide.id}`}
              >
                <SlideHeader
                  title={slide.title}
                  subtitle={slide.subtitle}
                  align="center"
                  defaultSubtitle={defaultSubtitle}
                />
                <SlideContent
                  content={slide.content}
                  items={slide.items}
                  align="center"
                  type={slide.type}
                />
              </motion.div>
            </div>
          </>
        )}

        {/* STANDARD LAYOUT */}
        {layout === 'standard' && (
          <>
            {/* LEFT: Header (40%) */}
            <div className="w-[40%] h-full flex flex-col justify-center p-16 xl:p-20 relative bg-gray-50 border-r border-gray-100">
              <motion.div
                className="w-full flex flex-col items-start text-left"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={`header-${slide.id}`}
              >
                <SlideHeader
                  title={slide.title}
                  subtitle={slide.subtitle}
                  align="left"
                  defaultSubtitle={defaultSubtitle}
                />
              </motion.div>
            </div>
            {/* RIGHT: Body + Items (60%) */}
            <div className="w-[60%] h-full flex flex-col justify-center p-16 xl:p-24 relative overflow-y-auto">
              <motion.div
                className="w-full flex flex-col items-start text-left"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={`body-${slide.id}`}
              >
                <SlideContent
                  content={slide.content}
                  items={slide.items}
                  align="left"
                  type={slide.type}
                />
              </motion.div>
            </div>
          </>
        )}

        {/* CODE LAYOUT */}
        {layout === 'code' && (
          <>
            {/* LEFT: Header + Content (40%) */}
            <div className="w-[40%] h-full flex flex-col justify-center p-16 xl:p-20 relative bg-gray-50 border-r border-gray-100">
              <motion.div
                className="w-full flex flex-col items-start text-left"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={`header-${slide.id}`}
              >
                <SlideHeader
                  title={slide.title}
                  subtitle={slide.subtitle}
                  align="left"
                  defaultSubtitle={defaultSubtitle}
                />
                <motion.p
                  variants={itemVariants}
                  className="text-xl text-secondary mt-8 leading-relaxed font-medium"
                >
                  {slide.content}
                </motion.p>
              </motion.div>
            </div>
            {/* RIGHT: Code Block (60%) */}
            <div className="w-[60%] h-full flex flex-col justify-center p-8 relative bg-[#1e1e1e]">
              <motion.div
                className="w-full h-full flex items-center justify-center"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={`code-${slide.id}`}
              >
                <CodeBlock code={slide.code} />
              </motion.div>
            </div>
          </>
        )}

        {/* MERMAID SPLIT LAYOUT */}
        {layout === 'mermaid_split' && (
          <>
            {/* LEFT: Header + Content (40%) */}
            <div className="w-[40%] h-full flex flex-col justify-center p-16 xl:p-20 relative bg-gray-50 border-r border-gray-100">
              <motion.div
                className="w-full flex flex-col items-start text-left"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={`header-${slide.id}`}
              >
                <SlideHeader
                  title={slide.title}
                  subtitle={slide.subtitle}
                  align="left"
                  defaultSubtitle={defaultSubtitle}
                />
                <motion.p
                  variants={itemVariants}
                  className="text-xl text-secondary mt-8 leading-relaxed font-medium"
                >
                  {slide.content}
                </motion.p>
              </motion.div>
            </div>
            {/* RIGHT: Mermaid Block (60%) */}
            <div className="w-[60%] h-full flex flex-col justify-center p-8 relative bg-white">
              <motion.div
                className="w-full h-full flex items-center justify-center"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={`mermaid-${slide.id}`}
              >
                <MermaidDiagram
                  slideId={`split-${slide.id}`}
                  content={slide.visualContent}
                  theme={theme.mermaid}
                />
              </motion.div>
            </div>
          </>
        )}

        {/* BENCHMARK CHART LAYOUT */}
        {layout === 'benchmark_chart' && (
          <>
            {/* LEFT: Header + Content (40%) */}
            <div className="w-[40%] h-full flex flex-col justify-center p-16 xl:p-20 relative bg-gray-50 border-r border-gray-100">
              <motion.div
                className="w-full flex flex-col items-start text-left"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={`header-${slide.id}`}
              >
                <SlideHeader
                  title={slide.title}
                  subtitle={slide.subtitle}
                  align="left"
                  defaultSubtitle={defaultSubtitle}
                />
                <motion.p
                  variants={itemVariants}
                  className="text-xl text-secondary mt-8 leading-relaxed font-medium"
                >
                  {slide.content}
                </motion.p>
              </motion.div>
            </div>
            {/* RIGHT: Chart Block (60%) */}
            <div className="w-[60%] h-full flex flex-col justify-center relative bg-white">
              <motion.div
                className="w-full h-full flex items-center justify-center"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={`chart-${slide.id}`}
              >
                <BenchmarkChart
                  data={slide.benchmarkData}
                  colorMap={theme.benchmarkColors}
                />
              </motion.div>
            </div>
          </>
        )}

        {/* IMAGE COMPARISON LAYOUT */}
        {layout === 'image_comparison' && (
          <div className="w-full h-full flex flex-col p-10 xl:p-14">
            {/* Compact Header */}
            <motion.div
              className="flex-shrink-0 text-center mb-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key={`header-${slide.id}`}
            >
              <SlideHeader
                title={slide.title}
                subtitle={slide.subtitle}
                align="center"
                defaultSubtitle={defaultSubtitle}
                compact={true}
              />
              {slide.content && (
                <motion.p
                  variants={itemVariants}
                  className="text-lg text-secondary mt-3 leading-relaxed font-medium max-w-3xl mx-auto"
                >
                  {slide.content}
                </motion.p>
              )}
            </motion.div>

            {/* Images Comparison Area */}
            <motion.div
              className="flex-1 flex gap-6 min-h-0"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key={`images-${slide.id}`}
            >
              {/* First Image */}
              <motion.div
                className="flex-1 flex flex-col min-w-0"
                variants={itemVariants}
              >
                <button
                  onClick={() => setEnlargedImage(slide.comparisonImages?.[0])}
                  className="flex-1 bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center p-4 cursor-zoom-in hover:border-gray-300 hover:shadow-md transition-all group"
                >
                  <img
                    src={slide.comparisonImages?.[0]?.image}
                    alt={slide.comparisonImages?.[0]?.label || 'Comparison image 1'}
                    className="max-w-full max-h-full object-contain rounded-lg group-hover:scale-[1.02] transition-transform"
                  />
                </button>
                {slide.comparisonImages?.[0]?.label && (
                  <div className="mt-3 text-center">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm">
                      {slide.comparisonImages[0].label}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* VS Divider */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="w-px h-full bg-gray-200 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 text-xs font-bold text-gray-400 rounded">
                    VS
                  </span>
                </div>
              </div>

              {/* Second Image */}
              <motion.div
                className="flex-1 flex flex-col min-w-0"
                variants={itemVariants}
              >
                <button
                  onClick={() => setEnlargedImage(slide.comparisonImages?.[1])}
                  className="flex-1 bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center p-4 cursor-zoom-in hover:border-gray-300 hover:shadow-md transition-all group"
                >
                  <img
                    src={slide.comparisonImages?.[1]?.image}
                    alt={slide.comparisonImages?.[1]?.label || 'Comparison image 2'}
                    className="max-w-full max-h-full object-contain rounded-lg group-hover:scale-[1.02] transition-transform"
                  />
                </button>
                {slide.comparisonImages?.[1]?.label && (
                  <div className="mt-3 text-center">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm">
                      {slide.comparisonImages[1].label}
                    </span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* Footer / Progress */}
        <div className={`absolute bottom-10 right-12 font-medium text-xs tracking-widest ${layout === 'code' ? 'text-white/30' : 'text-secondary/30'}`}>
          {currentIndex + 1} / {totalSlides}
        </div>

      </div>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {enlargedImage && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm cursor-zoom-out"
              onClick={() => setEnlargedImage(null)}
            />

            {/* Close button - separate layer */}
            <button
              onClick={() => setEnlargedImage(null)}
              className="fixed top-6 right-6 z-[60] p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Enlarged image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-none"
            >
              <div
                className="max-w-[90vw] max-h-[90vh] p-4 pointer-events-auto cursor-zoom-out"
                onClick={() => setEnlargedImage(null)}
              >
                <img
                  src={enlargedImage.image}
                  alt={enlargedImage.label || 'Enlarged image'}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
                {enlargedImage.label && (
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/10 text-white font-semibold text-base">
                      {enlargedImage.label}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Hint text */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[55] text-white/50 text-sm pointer-events-none">
              Click anywhere or press Esc to close
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
