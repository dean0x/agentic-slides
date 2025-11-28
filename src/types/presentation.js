/**
 * Presentation Schema Types
 *
 * This file documents the JSON schema for presentations.
 * All types are documented via JSDoc for editor support.
 */

/**
 * @typedef {'title' | 'list' | 'cards' | 'code_split' | 'mermaid_split' | 'image_split' | 'timeline' | 'benchmark_chart'} SlideType
 */

/**
 * @typedef {Object} SlideItem
 * @property {string} title - Item title
 * @property {string} [text] - Item description
 * @property {string} [icon] - Lucide icon name (e.g., "Brain", "Code")
 * @property {string} [color] - Tailwind color class (e.g., "text-blue-400")
 */

/**
 * @typedef {Object} BenchmarkDataPoint
 * @property {string} model - Model name
 * @property {string | number} score - Score value
 * @property {string} [color] - Optional custom color for this bar
 */

/**
 * @typedef {Object} Slide
 * @property {number} id - Unique slide ID within presentation
 * @property {string} title - Slide title
 * @property {string} [subtitle] - Module/section label
 * @property {string} [content] - Body text/description
 * @property {SlideType} type - Layout type
 * @property {string} [icon] - Lucide icon name for slide
 * @property {SlideItem[]} [items] - List/card items
 * @property {string} [code] - Code snippet for code_split type
 * @property {'mermaid' | 'code'} [visualType] - Type of visual content
 * @property {string} [visualContent] - Mermaid diagram or code content
 * @property {string} [image] - Image filename (relative to presentation assets)
 * @property {BenchmarkDataPoint[]} [benchmarkData] - Data for benchmark charts
 */

/**
 * @typedef {Object} ThemeColors
 * @property {string} [background] - Background color
 * @property {string} [surface] - Surface/card color
 * @property {string} [primary] - Primary accent color
 * @property {string} [secondary] - Secondary text color
 * @property {string} [text] - Main text color
 * @property {string} [accent] - Accent/highlight color
 */

/**
 * @typedef {Object} MermaidTheme
 * @property {string} [primaryColor] - Primary node color
 * @property {string} [primaryTextColor] - Text on primary nodes
 * @property {string} [primaryBorderColor] - Border on primary nodes
 * @property {string} [lineColor] - Connection lines
 * @property {string} [secondaryColor] - Secondary node color
 * @property {string} [tertiaryColor] - Tertiary node color
 */

/**
 * @typedef {Object} PresentationTheme
 * @property {ThemeColors} [colors] - Color overrides
 * @property {MermaidTheme} [mermaid] - Mermaid diagram theme
 * @property {Object<string, string>} [benchmarkColors] - Model name to color mapping
 */

/**
 * @typedef {Object} PresentationMeta
 * @property {string} id - Unique presentation identifier (URL slug)
 * @property {string} title - Presentation title
 * @property {string} [subtitle] - Presentation subtitle
 * @property {string} [description] - Brief description for listing
 * @property {string} [author] - Author name
 * @property {string} [date] - Presentation date
 * @property {string} [thumbnail] - Thumbnail image filename
 * @property {string[]} [tags] - Tags for filtering/search
 */

/**
 * @typedef {Object} Presentation
 * @property {PresentationMeta} meta - Presentation metadata
 * @property {PresentationTheme} [theme] - Theme customizations
 * @property {Slide[]} slides - Array of slides
 */

export const SLIDE_TYPES = [
  'title',
  'list',
  'cards',
  'code_split',
  'mermaid_split',
  'image_split',
  'timeline',
  'benchmark_chart'
];

export const DEFAULT_THEME = {
  colors: {
    background: '#FFFFFF',
    surface: '#F5F5F7',
    primary: '#0071e3',
    secondary: '#86868b',
    text: '#1d1d1f',
    accent: '#ff3b30',
  },
  mermaid: {
    primaryColor: '#e0e7ff',
    primaryTextColor: '#1e293b',
    primaryBorderColor: '#818cf8',
    lineColor: '#64748b',
    secondaryColor: '#f1f5f9',
    tertiaryColor: '#ffffff',
  },
  benchmarkColors: {}
};
