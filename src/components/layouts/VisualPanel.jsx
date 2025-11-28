import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import mermaid from 'mermaid';
import { visualPanelVariants } from './SlideAnimations';

/**
 * Visual panel for displaying images, mermaid diagrams, or code
 * @param {Object} props
 * @param {number} props.slideId - Unique slide ID for keying
 * @param {'mermaid' | 'code' | undefined} [props.visualType] - Type of visual
 * @param {string} [props.visualContent] - Content for mermaid/code
 * @param {string} [props.imagePath] - Resolved image path
 * @param {string} [props.title] - Fallback title for placeholder
 * @param {Object} [props.mermaidTheme] - Custom mermaid theme
 */
export function VisualPanel({
  slideId,
  visualType,
  visualContent,
  imagePath,
  title = '',
  mermaidTheme
}) {
  const mermaidRef = useRef(null);

  useEffect(() => {
    if (visualType === 'mermaid' && mermaidRef.current) {
      const defaultTheme = {
        primaryColor: '#e0e7ff',
        primaryTextColor: '#1e293b',
        primaryBorderColor: '#818cf8',
        lineColor: '#64748b',
        secondaryColor: '#f1f5f9',
        tertiaryColor: '#ffffff',
        fontSize: '13px'
      };

      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: { ...defaultTheme, ...mermaidTheme },
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

      // Render mermaid diagram
      const renderMermaid = async () => {
        try {
          const { svg } = await mermaid.render(`mermaid-${slideId}`, visualContent);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;
          }
        } catch (err) {
          console.error('Mermaid rendering error:', err);
        }
      };

      renderMermaid();
    }
  }, [slideId, visualType, visualContent, mermaidTheme]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={visualPanelVariants}
      className="z-10 w-full h-full flex items-center justify-center"
      key={`visual-${slideId}`}
    >
      {visualType === 'mermaid' ? (
        <div className="w-full h-full flex items-center justify-center p-8">
          <div
            ref={mermaidRef}
            className="w-full h-full flex justify-center items-center"
            style={{ transform: 'scale(0.95)', maxHeight: '100%' }}
          />
        </div>
      ) : visualType === 'code' ? (
        <div className="w-full h-full flex items-center justify-center p-12">
          <div className="w-full bg-[#1e1e1e] p-6 rounded-2xl shadow-xl font-mono text-xs xl:text-sm text-white overflow-hidden border border-gray-800 text-left relative">
            <div className="flex gap-1.5 mb-4 absolute top-4 left-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <pre className="mt-6 overflow-x-auto custom-scrollbar">
              <code className="language-javascript">{visualContent}</code>
            </pre>
          </div>
        </div>
      ) : imagePath ? (
        <img
          src={imagePath}
          alt="Slide Visual"
          className="w-full h-full object-cover"
        />
      ) : (
        <PlaceholderVisual title={title} />
      )}
    </motion.div>
  );
}

function PlaceholderVisual({ title }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-12">
      <div className="w-full aspect-square max-w-lg bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2rem] shadow-inner flex items-center justify-center relative overflow-hidden ring-1 ring-black/5">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
        <div className="text-9xl font-bold text-blue-900/10 tracking-tighter z-10">
          {title?.substring(0, 1) || '?'}
        </div>
      </div>
    </div>
  );
}
