import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from './SlideAnimations';

/**
 * Code block component for displaying code snippets
 * @param {Object} props
 * @param {string} props.code - Code content
 * @param {string} [props.language='javascript'] - Code language
 */
export function CodeBlock({ code, language = 'javascript' }) {
  return (
    <motion.div
      variants={itemVariants}
      className="w-full h-full flex items-center justify-center p-12"
    >
      <div className="w-full bg-[#1e1e1e] p-8 rounded-2xl shadow-xl font-mono text-lg text-white overflow-hidden border border-gray-800 text-left">
        <pre className="overflow-x-auto custom-scrollbar">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </motion.div>
  );
}
