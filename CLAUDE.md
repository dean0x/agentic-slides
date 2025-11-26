# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based slideshow presentation application for a Gen AI Hackathon education session. The app displays 69 slides covering LLM fundamentals, prompt engineering, APIs, RAG, tool use, MCP, and agents.

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build to dist/
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Architecture

### Tech Stack
- React 18 + Vite 5
- Tailwind CSS with Apple-inspired theme (see `tailwind.config.js` for custom colors)
- shadcn/ui with Recharts for benchmark charts
- Framer Motion for slide animations
- Mermaid.js for diagram rendering
- Lucide React for icons

### File Structure
```
src/
├── App.jsx                  # Main app with keyboard navigation (arrow keys/space)
├── main.jsx                 # React entry point
├── index.css                # Tailwind + custom scrollbar styles (overlay scrollbars for code)
├── data/slides.js           # All 69 slides as array of objects
├── lib/
│   └── utils.js             # shadcn utility functions (cn helper)
├── components/
│   ├── Slide.jsx            # Single slide renderer with 5 layout types
│   ├── BenchmarkChart.jsx   # Horizontal bar chart for benchmark comparisons
│   └── ui/
│       └── chart.jsx        # shadcn chart components (ChartContainer, ChartTooltip)
└── assets/                  # Images for title slides (.jpg, .png)
```

### Slide Data Model (`src/data/slides.js`)
Each slide object has:
- `id`, `title`, `subtitle`, `content` - basic metadata
  - `subtitle` - module-specific label (e.g., "Foundations", "Prompt Engineering", "RAG", "MCP", "Agents", "Agentic Loops")
- `type` - determines layout: `title`, `list`, `cards`, `code_split`, `mermaid_split`, `image_split`, `timeline`, `benchmark_chart`
- `items` - array for list/card content with `{title, text, icon?, color?}`
- `code` - code snippet for code_split type
- `visualType` + `visualContent` - for mermaid diagrams or code blocks on title slides
- `image` - imported image reference for title slides
- `icon` - Lucide icon component
- `benchmarkData` - array for benchmark_chart type with `{model, score}` objects

### Layout System (`src/components/Slide.jsx`)
The Slide component determines layout from slide type:
- **intro** (`type: 'title'`) - 45% visual panel left, 55% content right
- **standard** (`type: 'list'|'cards'|'timeline'`) - 40% header left, 60% items right
- **code** (`type: 'code_split'`) - 40% header left, 60% dark code block right with overlay scrollbar
- **mermaid_split** - 40% header left, 60% Mermaid diagram right
- **benchmark_chart** - 40% header left, 60% horizontal bar chart right (using shadcn/Recharts)

### Navigation
- Arrow keys (left/right) and Space for slide navigation
- Keyboard handler in `App.jsx` useEffect hook
- Slide index state: `currentSlideIndex`
