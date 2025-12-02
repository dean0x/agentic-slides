# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A **multi-presentation slideshow template** built with React. Supports multiple independent presentations stored as JSON files, with a home page for presentation selection and a full-featured viewer with keyboard navigation.

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build to dist/
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Architecture

### Tech Stack
- React 18 + Vite 5 + React Router 7
- Tailwind CSS with Apple-inspired theme (see `tailwind.config.js`)
- Framer Motion for slide animations
- Mermaid.js for diagram rendering
- Recharts for benchmark charts
- Lucide React for icons

### File Structure
```
src/
├── App.jsx                      # Router setup with PresentationProvider
├── main.jsx                     # React entry point
├── index.css                    # Tailwind + custom styles
├── pages/
│   ├── HomePage.jsx             # Presentation selector grid
│   └── PresentationViewer.jsx   # Slide viewer with navigation
├── context/
│   └── PresentationContext.jsx  # State management for current presentation
├── presentations/
│   ├── registry.js              # List of all available presentations
│   └── intro-to-gen-ai/         # Example presentation
│       └── slides.json          # Slide data in JSON format
├── components/
│   ├── SlideRenderer.jsx        # Main slide rendering component
│   ├── BenchmarkChart.jsx       # Horizontal bar chart
│   ├── layouts/                 # Modular layout components
│   │   ├── SlideAnimations.jsx  # Framer Motion variants
│   │   ├── SlideHeader.jsx      # Title/subtitle component
│   │   ├── SlideContent.jsx     # Body content component
│   │   ├── VisualPanel.jsx      # Image/mermaid/code panel
│   │   ├── CodeBlock.jsx        # Code snippet display
│   │   └── index.js             # Barrel export
│   └── ui/
│       └── chart.jsx            # shadcn chart wrapper
├── lib/
│   ├── utils.js                 # Tailwind merge helper
│   └── icons.js                 # Icon registry for JSON resolution
├── types/
│   └── presentation.js          # Schema definitions (JSDoc)
public/
└── presentations/
    └── intro-to-gen-ai/
        └── assets/              # Images for the presentation
```

## Creating a New Presentation

### 1. Create presentation folder
```bash
mkdir -p src/presentations/my-presentation
mkdir -p public/presentations/my-presentation/assets
```

### 2. Create slides.json
```json
{
  "meta": {
    "id": "my-presentation",
    "title": "My Presentation Title",
    "subtitle": "Optional Subtitle",
    "description": "Brief description for the home page",
    "author": "Your Name",
    "date": "2025",
    "tags": ["tag1", "tag2"]
  },
  "theme": {
    "benchmarkColors": {
      "Model A": "#ff0000"
    }
  },
  "slides": [
    {
      "id": 1,
      "title": "Welcome",
      "subtitle": "Introduction",
      "content": "Opening slide content",
      "image": "intro.jpg",
      "icon": "Rocket",
      "type": "title"
    }
  ]
}
```

### 3. Register in registry.js
```javascript
// src/presentations/registry.js
export const presentations = [
  // ... existing presentations
  {
    id: 'my-presentation',
    title: 'My Presentation Title',
    subtitle: 'Optional Subtitle',
    description: 'Brief description',
    author: 'Your Name',
    date: '2025',
    tags: ['tag1', 'tag2'],
    thumbnail: '/presentations/my-presentation/thumbnail.jpg',
    loader: () => import('./my-presentation/slides.json')
  }
];
```

### 4. Add assets
Place images in `public/presentations/my-presentation/assets/` and reference them by filename in slides.json.

## Slide Types

| Type | Layout | Description |
|------|--------|-------------|
| `title` | 45% visual / 55% content | Module intro with image/mermaid |
| `list` | 40% header / 60% items | Numbered list items |
| `cards` | 40% header / 60% items | Card grid (same as list visually) |
| `code_split` | 40% header / 60% code | Code snippet display |
| `mermaid_split` | 40% header / 60% diagram | Mermaid diagram |
| `benchmark_chart` | 40% header / 60% chart | Horizontal bar chart |
| `timeline` | 40% header / 60% items | Same as list |
| `image_split` | 40% header / 60% image | Image with items |
| `image_comparison` | Compact header / side-by-side images | Two images with VS divider, click to enlarge |

## Slide Properties

```typescript
interface Slide {
  id: number;                    // Unique ID within presentation
  title: string;                 // Slide title
  subtitle?: string;             // Module/section label
  content?: string;              // Body text
  type: SlideType;               // Layout type (see above)
  icon?: string;                 // Lucide icon name (e.g., "Brain")
  items?: SlideItem[];           // For list/cards types
  code?: string;                 // For code_split type
  visualType?: 'mermaid' | 'code';  // Visual panel type
  visualContent?: string;        // Mermaid diagram or code
  image?: string;                // Image filename
  benchmarkData?: BenchmarkData[];  // For benchmark_chart type
  comparisonImages?: ComparisonImage[];  // For image_comparison type (requires 2)
}

interface SlideItem {
  title: string;
  text?: string;
  icon?: string;                 // Lucide icon name
  color?: string;                // Tailwind color class
}

interface BenchmarkData {
  model: string;
  score: string | number;
  color?: string;                // Override chart color
}

interface ComparisonImage {
  image: string;                 // Image path (relative to public folder)
  label?: string;                // Label displayed below the image
}
```

## Available Icons

Icons are resolved from `src/lib/icons.js`. Common icons include:
- Navigation: `Home`, `ChevronLeft`, `ChevronRight`, `ArrowRight`, etc.
- Content: `Brain`, `Code`, `Database`, `Search`, `Rocket`, etc.
- UI: `Play`, `Pause`, `Settings`, `Check`, `Info`, etc.

See full list in `src/lib/icons.js`.

## Navigation

- **Keyboard**: Arrow keys (left/right), Space, Enter, Backspace
- **Mouse**: Click left/right edges of screen, or use nav buttons
- **Progress bar**: Click dots to jump to specific slides

## Theme Customization

Each presentation can override theme colors in its `slides.json`:

```json
{
  "theme": {
    "colors": {
      "primary": "#0071e3",
      "text": "#1d1d1f"
    },
    "mermaid": {
      "primaryColor": "#e0e7ff"
    },
    "benchmarkColors": {
      "Model Name": "#hexcolor"
    }
  }
}
```

## Routes

- `/` - Home page with presentation grid
- `/presentation/:id` - Presentation viewer (e.g., `/presentation/intro-to-gen-ai`)
