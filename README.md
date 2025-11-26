# Gen AI Hackathon Education Session

A modern, interactive slideshow presentation application built with React for teaching Gen AI concepts. Features 69 professionally designed slides covering LLM fundamentals, prompt engineering, APIs, RAG, tool use, MCP, and agents.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **69 Interactive Slides** - Comprehensive curriculum covering the Gen AI stack
- **5 Layout Types** - Title slides, lists, code examples, diagrams, and benchmark charts
- **Benchmark Comparisons** - Interactive horizontal bar charts comparing Claude Opus 4.5, GPT-5.1, Gemini 3 Pro, and more
- **Code Highlighting** - Beautiful code blocks with overlay scrollbars
- **Mermaid Diagrams** - Interactive architecture and flow diagrams
- **Smooth Animations** - Powered by Framer Motion
- **Keyboard Navigation** - Arrow keys and spacebar for seamless presentation
- **Apple-Inspired Design** - Clean, modern UI with Tailwind CSS

## 📚 Curriculum Coverage

1. **Foundations** - LLMs, tokens, context windows, model landscape, benchmarks
2. **Prompt Engineering** - Core principles, techniques, best practices
3. **Structured Output** - JSON mode, schema enforcement, Zod validation
4. **Working with APIs** - Parameters, streaming, production concerns
5. **RAG** - Chunking, embeddings, vector databases, retrieval strategies
6. **Tool Use** - Function calling, common patterns
7. **MCP** - Model Context Protocol, primitives, pre-built servers
8. **Agents** - Architecture, agentic loops, planning patterns, frameworks

## 🚀 Quick Start

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

The app will open at `http://localhost:5173`

## 🎮 Controls

- **Arrow Left** - Previous slide
- **Arrow Right** - Next slide
- **Spacebar** - Next slide

## 🏗️ Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui + Recharts** - Chart components
- **Framer Motion** - Animation library
- **Mermaid.js** - Diagram rendering
- **Lucide React** - Icon library

## 📁 Project Structure

```
src/
├── App.jsx                  # Main app with keyboard navigation
├── main.jsx                 # React entry point
├── index.css                # Global styles and custom scrollbars
├── data/
│   └── slides.js            # All 69 slides data
├── lib/
│   └── utils.js             # Utility functions
├── components/
│   ├── Slide.jsx            # Slide renderer with 5 layout types
│   ├── BenchmarkChart.jsx   # Horizontal bar chart component
│   └── ui/
│       └── chart.jsx        # shadcn chart components
└── assets/                  # Images for title slides
```

## 🎨 Slide Types

The presentation supports 5 layout types:

1. **Intro** (`type: 'title'`) - 45% visual, 55% content
2. **Standard** (`type: 'list' | 'cards' | 'timeline'`) - 40% header, 60% items
3. **Code** (`type: 'code_split'`) - 40% header, 60% code block
4. **Mermaid** (`type: 'mermaid_split'`) - 40% header, 60% diagram
5. **Benchmark** (`type: 'benchmark_chart'`) - 40% header, 60% chart

## 🔧 Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📊 Benchmark Data

The presentation includes official benchmark comparisons from:
- **SWE-bench Verified** - Real-world GitHub issue resolution
- **AIME 2025** - Advanced math reasoning
- **GPQA Diamond** - PhD-level reasoning
- **MMLU-Pro** - Multi-domain knowledge across 57 subjects
- **ARC-AGI-2** - Abstract reasoning and pattern recognition

All data sourced from official model provider documentation.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new slides or modules
- Improve existing content
- Fix bugs or typos
- Enhance styling

## 📄 License

MIT License - feel free to use this for your own Gen AI education sessions!

## 🙏 Acknowledgments

- Built with [Claude Code](https://claude.com/claude-code)
- Inspired by Apple's design language
- Benchmark data from Anthropic, OpenAI, Google, Alibaba, DeepSeek, and Moonshot

---

**Built for the Gen AI Hackathon Education Session**
