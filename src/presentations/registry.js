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
    id: 'intro-to-gen-ai',
    title: 'Intro to Gen AI',
    subtitle: 'Foundations',
    description: 'Comprehensive introduction to Gen AI concepts including LLMs, prompt engineering, RAG, tool use, MCP, and agents.',
    author: 'Education Team',
    date: '2025',
    tags: ['ai', 'llm', 'rag', 'agents', 'mcp'],
    thumbnail: '/presentations/intro-to-gen-ai/assets/intro_slide.jpg',
    loader: () => import('./intro-to-gen-ai/slides.json')
  },
  {
    id: 'agentic-sdlc',
    title: 'Agentic SDLC',
    subtitle: 'AI-Powered Software Development',
    description: 'How AI agents are transforming the software development lifecycle - from requirements to deployment.',
    author: 'Engineering Team',
    date: '2025',
    tags: ['ai', 'sdlc', 'agents', 'development', 'automation'],
    thumbnail: null,
    loader: () => import('./agentic-sdlc/slides.json')
  },
  {
    id: 'claude-vs-cursor',
    title: 'Claude Code vs Cursor',
    subtitle: "A Technical Leader's Guide",
    description: 'Comprehensive comparison for enterprise decision-makers - security, architecture, economics, and long-term strategy.',
    author: 'Engineering Team',
    date: '2025',
    tags: ['ai', 'tools', 'cursor', 'claude', 'development', 'enterprise', 'security'],
    thumbnail: null,
    loader: () => import('./claude-vs-cursor/slides.json')
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
