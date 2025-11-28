# Agentic Slides

A **multi-presentation slideshow template** built with React. Create and host multiple independent presentations with a home page for selection and a full-featured viewer with keyboard navigation.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Multi-Presentation Support** - Host unlimited presentations, each as a JSON file
- **Home Page Gallery** - Browse and select presentations with thumbnails and tags
- **6 Layout Types** - Title slides, lists, code examples, diagrams, benchmark charts, and image splits
- **Lazy-Loaded Diagrams** - Mermaid.js loads on-demand to reduce bundle size
- **Benchmark Charts** - Interactive horizontal bar charts with customizable colors
- **Code Highlighting** - Clean code blocks with syntax styling
- **Smooth Animations** - Powered by Framer Motion
- **Keyboard Navigation** - Arrow keys, spacebar, and progress bar
- **Apple-Inspired Design** - Clean, modern UI with Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/dean0x/agentic-slides.git
cd agentic-slides

# Install dependencies
npm install

# Start development server
npm run dev
```

The app opens at `http://localhost:5173`

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build to dist/
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run test     # Run tests in watch mode
npm run test:run # Run tests once
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
| `cards` | 40% header / 60% items | Card grid layout |
| `code_split` | 40% header / 60% code | Code snippet display |
| `mermaid_split` | 40% header / 60% diagram | Mermaid diagram |
| `benchmark_chart` | 40% header / 60% chart | Horizontal bar chart |
| `image_split` | 40% header / 60% image | Image with items |

## Navigation

- **Arrow Keys** - Previous/next slide
- **Spacebar / Enter** - Next slide
- **Backspace** - Previous slide
- **Progress Bar** - Click dots to jump to slides

## Project Structure

```
src/
├── App.jsx                      # Router setup with PresentationProvider
├── main.jsx                     # React entry point
├── index.css                    # Tailwind + custom styles
├── pages/
│   ├── HomePage.jsx             # Presentation selector grid
│   └── PresentationViewer.jsx   # Slide viewer with navigation
├── context/
│   └── PresentationContext.jsx  # State management
├── presentations/
│   ├── registry.js              # List of all presentations
│   └── gen-ai-hackathon/        # Example presentation
│       └── slides.json          # Slide data
├── components/
│   ├── SlideRenderer.jsx        # Main slide rendering
│   ├── BenchmarkChart.jsx       # Bar chart component
│   └── layouts/                 # Modular layout components
│       ├── MermaidDiagram.jsx   # Lazy-loaded Mermaid
│       ├── SlideHeader.jsx      # Title/subtitle
│       ├── SlideContent.jsx     # Body content
│       ├── VisualPanel.jsx      # Image/mermaid/code panel
│       └── CodeBlock.jsx        # Code display
├── lib/
│   ├── utils.js                 # Tailwind merge helper
│   └── icons.js                 # Icon registry
└── test/
    └── setup.js                 # Vitest setup
public/
└── presentations/
    └── gen-ai-hackathon/
        └── assets/              # Presentation images
```

## Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool and dev server
- **React Router 7** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Mermaid.js** - Diagrams (lazy-loaded)
- **Recharts** - Chart components
- **Lucide React** - Icons
- **Vitest** - Testing framework

## Routes

- `/` - Home page with presentation grid
- `/presentation/:id` - Presentation viewer (e.g., `/presentation/gen-ai-hackathon`)

## License

MIT License - feel free to use for your own presentations!

## Acknowledgments

- Built with [Claude Code](https://claude.com/claude-code)
- Inspired by Apple's design language
