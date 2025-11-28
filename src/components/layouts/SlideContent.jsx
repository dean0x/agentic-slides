import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from './SlideAnimations';

/**
 * Slide body content with optional items list
 * @param {Object} props
 * @param {string} [props.content] - Body text
 * @param {Array<{title: string, text?: string, iconComponent?: React.ComponentType}>} [props.items] - List items
 * @param {'left' | 'center'} [props.align='center'] - Text alignment
 * @param {'list' | 'cards' | 'timeline' | 'image_split'} [props.type] - Content type
 */
export function SlideContent({ content, items, align = 'center', type }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center';

  return (
    <>
      {content && (
        <motion.p
          variants={itemVariants}
          className={`text-2xl text-secondary mb-12 leading-relaxed font-medium max-w-2xl ${alignClass}`}
        >
          {content}
        </motion.p>
      )}

      {/* List / Cards / Timeline - Unified View */}
      {(type === 'list' || type === 'cards' || type === 'timeline') && items && (
        <div className="w-full max-w-xl grid grid-cols-1 gap-4">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left"
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white text-primary rounded-full font-bold text-lg shadow-sm border border-gray-100">
                {idx + 1}
              </div>
              <div>
                <h3 className="text-xl font-bold text-text">{item.title || item.text}</h3>
                {item.text && item.title && (
                  <p className="text-secondary text-base mt-1">{item.text}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Image Split Items */}
      {type === 'image_split' && items && (
        <div className="w-full max-w-xl grid grid-cols-1 gap-4">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="p-5 bg-gray-50 rounded-2xl border border-gray-100 text-left"
            >
              <h3 className="text-lg font-bold text-text mb-1">{item.title}</h3>
              <p className="text-secondary text-base">{item.text}</p>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
