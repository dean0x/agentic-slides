import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import mermaid from 'mermaid';
import { BenchmarkChart } from './BenchmarkChart';
import {
  containerVariants,
  itemVariants,
  SlideHeader,
  SlideContent,
  VisualPanel,
  CodeBlock
} from './layouts';
import { usePresentation } from '@/context/PresentationContext';

/**
 * Determines the layout type based on slide properties
 * @param {import('@/types/presentation').Slide} slide
 * @returns {'intro' | 'standard' | 'code' | 'mermaid_split' | 'benchmark_chart'}
 */
function getLayoutType(slide) {
  if (slide.type === 'title') return 'intro';
  if (slide.type === 'code_split') return 'code';
  if (slide.type === 'mermaid_split') return 'mermaid_split';
  if (slide.type === 'benchmark_chart') return 'benchmark_chart';
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
  const mermaidRef = useRef(null);

  const layout = getLayoutType(slide);

  // Initialize mermaid for split layout
  useEffect(() => {
    if (layout === 'mermaid_split' && mermaidRef.current && slide.visualContent) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: theme.mermaid,
        flowchart: {
          useMaxWidth: true,
          htmlLabels: false,
          curve: 'basis',
          padding: 20,
          nodeSpacing: 50,
          rankSpacing: 50
        },
        graph: {
          useMaxWidth: true,
          htmlLabels: false
        }
      });

      const renderMermaid = async () => {
        try {
          const { svg } = await mermaid.render(`mermaid-split-${slide.id}`, slide.visualContent);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;
          }
        } catch (err) {
          console.error('Mermaid rendering error:', err);
        }
      };

      renderMermaid();
    }
  }, [slide.id, slide.visualContent, layout, theme.mermaid]);

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
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div
                    ref={mermaidRef}
                    className="w-full h-full flex justify-center items-center"
                    style={{ transform: 'scale(0.95)', maxHeight: '100%' }}
                  />
                </div>
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

        {/* Footer / Progress */}
        <div className={`absolute bottom-10 right-12 font-medium text-xs tracking-widest ${layout === 'code' ? 'text-white/30' : 'text-secondary/30'}`}>
          {currentIndex + 1} / {totalSlides}
        </div>

      </div>
    </div>
  );
}
