/**
 * Presentation Registry
 *
 * Central registry of all available presentations.
 * Each presentation is lazy-loaded from its folder.
 */

/**
 * @typedef {Object} PresentationEntry
 * @property {string} id - Unique presentation ID (URL slug)
 * @property {string} title - Display title
 * @property {string} [subtitle] - Subtitle
 * @property {string} [description] - Brief description
 * @property {string} [author] - Author name
 * @property {string} [date] - Creation/update date
 * @property {string} [thumbnail] - Thumbnail image path
 * @property {string[]} [tags] - Tags for filtering
 * @property {() => Promise<{default: import('@/types/presentation').Presentation}>} loader - Async loader
 */

/**
 * Registry of all presentations
 * @type {PresentationEntry[]}
 */
export const presentations = [
  {
    id: 'gen-ai-hackathon',
    title: 'Gen AI Hackathon Education Session',
    subtitle: 'Curriculum',
    description: 'Comprehensive introduction to Gen AI concepts including LLMs, prompt engineering, RAG, tool use, MCP, and agents.',
    author: 'Education Team',
    date: '2025',
    tags: ['ai', 'llm', 'rag', 'agents', 'mcp', 'hackathon'],
    thumbnail: '/presentations/gen-ai-hackathon/assets/intro_slide.jpg',
    loader: () => import('./gen-ai-hackathon/slides.json')
  }
];

/**
 * Find presentation by ID
 * @param {string} id - Presentation ID
 * @returns {PresentationEntry | undefined}
 */
export function findPresentation(id) {
  return presentations.find(p => p.id === id);
}

/**
 * Filter presentations by tag
 * @param {string} tag - Tag to filter by
 * @returns {PresentationEntry[]}
 */
export function filterByTag(tag) {
  return presentations.filter(p => p.tags?.includes(tag));
}

/**
 * Get all unique tags
 * @returns {string[]}
 */
export function getAllTags() {
  const tags = new Set();
  presentations.forEach(p => {
    p.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}
