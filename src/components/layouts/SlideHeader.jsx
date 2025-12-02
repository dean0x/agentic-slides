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
 * @param {boolean} [props.compact=false] - Use compact sizing for comparison layouts
 */
export function SlideHeader({ title, subtitle, align = 'center', defaultSubtitle, compact = false }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center';
  const marginClass = compact ? 'mb-4' : 'mb-10';
  const subtitleClass = compact
    ? 'text-primary text-xs font-bold tracking-[0.2em] uppercase mb-2 opacity-70'
    : 'text-primary text-sm font-bold tracking-[0.2em] uppercase mb-4 opacity-70';
  const titleClass = compact
    ? 'text-3xl xl:text-4xl font-bold text-text leading-[1.1] tracking-tight'
    : 'text-5xl xl:text-7xl font-bold text-text leading-[1.1] tracking-tight';

  return (
    <motion.div variants={itemVariants} className={`${marginClass} ${alignClass}`}>
      <h2 className={subtitleClass}>
        {subtitle || defaultSubtitle || 'Presentation'}
      </h2>
      <h1 className={titleClass}>
        {title}
      </h1>
    </motion.div>
  );
}
