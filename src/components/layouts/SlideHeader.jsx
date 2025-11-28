import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from './SlideAnimations';

/**
 * Slide header component with title and subtitle
 * @param {Object} props
 * @param {string} props.title - Slide title
 * @param {string} [props.subtitle] - Subtitle/module label
 * @param {'left' | 'center'} [props.align='center'] - Text alignment
 * @param {string} [props.defaultSubtitle] - Fallback subtitle
 */
export function SlideHeader({ title, subtitle, align = 'center', defaultSubtitle }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center';

  return (
    <motion.div variants={itemVariants} className={`mb-10 ${alignClass}`}>
      <h2 className="text-primary text-sm font-bold tracking-[0.2em] uppercase mb-4 opacity-70">
        {subtitle || defaultSubtitle || 'Presentation'}
      </h2>
      <h1 className="text-5xl xl:text-7xl font-bold text-text leading-[1.1] tracking-tight">
        {title}
      </h1>
    </motion.div>
  );
}
