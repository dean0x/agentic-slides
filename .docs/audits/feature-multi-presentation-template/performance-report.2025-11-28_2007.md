# Performance Audit Report

**Branch**: feature/multi-presentation-template
**Base**: main
**Date**: 2025-11-28 20:07
**Files Analyzed**: 40 files changed
**Lines Changed**: +3,156 / -68

---

## Summary

This branch introduces a major architectural refactor from a single-presentation app to a multi-presentation template. The changes include React Router integration, a new context-based state management system, JSON-based slide data, and modular component architecture.

**Performance Score**: 5/10

**Primary Concerns**:
1. **Bundle size is critically large** (1.45 MB main bundle, 424 KB gzipped)
2. **Mermaid.js imported synchronously** in multiple components
3. **Dead code not removed** (old Slide.jsx and slides.js still in bundle)
4. **Image assets unoptimized** (14 MB total, several 2+ MB PNGs)
5. **Missing React.memo on components that receive stable props**

---

## Issues Found

### CRITICAL - Issues in Your Changes (BLOCKING)

#### 1. Mermaid.js Bundle Not Code-Split

**File**: `/workspace/agentic-slides/src/components/SlideRenderer.jsx:3`
**File**: `/workspace/agentic-slides/src/components/layouts/VisualPanel.jsx:3`

- **Problem**: Mermaid.js (~500KB+ uncompressed) is imported statically at the top level of components that render on every slide. Since it's imported in both `SlideRenderer.jsx` AND `VisualPanel.jsx`, it's duplicated in the dependency graph.
- **Impact**: All 1.45 MB of the main bundle must be downloaded before ANY slide can render. On a 3G connection, this is 10+ seconds to first paint.
- **Code**:
  ```javascript
  // SlideRenderer.jsx:3
  import mermaid from 'mermaid';
  
  // VisualPanel.jsx:3
  import mermaid from 'mermaid';
  ```
- **Root Cause**: Synchronous import even though Mermaid is only needed for `mermaid_split` and `title` slides with `visualType: 'mermaid'`.
- **Recommendation**: Dynamic import Mermaid only when a mermaid diagram is actually needed:
  ```javascript
  // Lazy load mermaid only when needed
  const renderMermaidDiagram = async (content, elementRef, slideId) => {
    const mermaid = await import('mermaid');
    mermaid.default.initialize({ startOnLoad: false, theme: 'base' });
    const { svg } = await mermaid.default.render(`mermaid-${slideId}`, content);
    elementRef.current.innerHTML = svg;
  };
  ```
- **Expected Improvement**: Initial bundle reduced by ~500KB. Mermaid loaded only when visiting slides that use diagrams.

#### 2. Mermaid Reinitialized on Every Render

**File**: `/workspace/agentic-slides/src/components/layouts/VisualPanel.jsx:38`
**File**: `/workspace/agentic-slides/src/components/SlideRenderer.jsx:45`

- **Problem**: `mermaid.initialize()` is called inside `useEffect` on every slide change. This is expensive and unnecessary - Mermaid only needs to be initialized once.
- **Impact**: Each slide transition triggers full Mermaid reinitialization, causing jank and CPU spikes.
- **Code**:
  ```javascript
  // SlideRenderer.jsx:43-61
  useEffect(() => {
    if (layout === 'mermaid_split' && mermaidRef.current && slide.visualContent) {
      mermaid.initialize({  // Called EVERY time slide changes
        startOnLoad: false,
        theme: 'base',
        // ...config
      });
      // ...render
    }
  }, [slide.id, slide.visualContent, layout, theme.mermaid]);
  ```
- **Recommendation**: Initialize Mermaid once globally (in a module or at app startup), then only call `mermaid.render()` per diagram.
- **Expected Improvement**: Eliminate repeated initialization overhead (~50-100ms per slide with diagrams).

---

### HIGH - Issues in Your Changes (Should Fix)

#### 3. Dead Code Still in Bundle

**Files**: 
- `/workspace/agentic-slides/src/components/Slide.jsx` (359 lines)
- `/workspace/agentic-slides/src/data/slides.js` (1,159 lines)

- **Problem**: The old `Slide.jsx` and `slides.js` files are still in the codebase. While they may not be directly imported by the new code, they:
  1. Import `mermaid` (third instance)
  2. Import 27 icons from lucide-react
  3. Contain all 69 slide definitions with inline images
- **Impact**: If ANY code path imports these (even transitively), they bloat the bundle. Even if tree-shaken, they add cognitive overhead and maintenance burden.
- **Code**:
  ```javascript
  // src/components/Slide.jsx:3
  import mermaid from 'mermaid';  // THIRD import of mermaid
  
  // src/data/slides.js:1
  import { Terminal, Brain, Layers, Code, Cpu, Image, Share2, ... } from 'lucide-react';
  ```
- **Recommendation**: Delete these files immediately:
  ```bash
  rm src/components/Slide.jsx
  rm src/data/slides.js
  ```
- **Expected Improvement**: Eliminates dead code risk, simplifies maintenance.

#### 4. Duplicate Mermaid Import Across Components

**Files**:
- `/workspace/agentic-slides/src/components/SlideRenderer.jsx:3`
- `/workspace/agentic-slides/src/components/layouts/VisualPanel.jsx:3`

- **Problem**: Mermaid is imported in both `SlideRenderer.jsx` (for mermaid_split layout) AND `VisualPanel.jsx` (for title slides with mermaid visuals). This creates architectural confusion about where mermaid rendering should live.
- **Impact**: Harder to refactor, potential for inconsistent behavior.
- **Recommendation**: Consolidate mermaid rendering into a single component (e.g., `MermaidDiagram.jsx`) that handles all mermaid rendering with lazy loading.
- **Expected Improvement**: Single source of truth for mermaid logic, easier to optimize.

#### 5. SlideRenderer Not Memoized

**File**: `/workspace/agentic-slides/src/components/SlideRenderer.jsx:36`

- **Problem**: `SlideRenderer` is a heavy component that renders the entire slide. It receives `slide`, `currentIndex`, `totalSlides` as props. When parent state changes (e.g., `showControls` in `NavigationOverlay`), this could trigger unnecessary re-renders.
- **Impact**: Potential frame drops during hover/mouse movement (NavigationOverlay updates `showControls` on mousemove).
- **Code**:
  ```javascript
  export function SlideRenderer({ slide, currentIndex, totalSlides, defaultSubtitle }) {
    // No memo wrapper
  ```
- **Recommendation**: 
  ```javascript
  export const SlideRenderer = React.memo(function SlideRenderer({ ... }) {
    // ...
  });
  ```
- **Expected Improvement**: Avoid re-renders when unrelated state changes.

#### 6. NavigationOverlay Creates New Timeout on Every Mouse Move

**File**: `/workspace/agentic-slides/src/pages/PresentationViewer.jsx:128-142`

- **Problem**: The `handleMouseMove` callback creates a new timeout on every mouse move without debouncing. On rapid mouse movement, this creates and clears dozens of timeouts per second.
- **Impact**: Minor GC pressure, potential jank on lower-end devices.
- **Code**:
  ```javascript
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(timeout);  // Clears previous
    timeout = setTimeout(() => setShowControls(false), 3000);  // Creates new
  };
  ```
- **Recommendation**: Use a debounced/throttled handler, or use CSS for the auto-hide behavior:
  ```javascript
  // Option 1: Debounce
  const handleMouseMove = useMemo(
    () => debounce(() => {
      setShowControls(true);
      // Hide after 3s of no movement
    }, 100),
    []
  );
  ```
- **Expected Improvement**: Reduced callback frequency from 60/sec to ~10/sec.

---

### MEDIUM - Issues in Code You Touched (Should Optimize)

#### 7. Large Icon Registry Loaded Eagerly

**File**: `/workspace/agentic-slides/src/lib/icons.js:7-101`

- **Problem**: The icons registry imports 78 icons from lucide-react at module load time, even though most slides only use 2-3 icons.
- **Impact**: All 78 icon components are included in the initial bundle. Lucide icons tree-shake well, but only if you import individually in components.
- **Code**:
  ```javascript
  import {
    Terminal, Brain, Layers, Code, Cpu, Share2, Network, Server,
    // ... 70+ more icons
  } from 'lucide-react';
  ```
- **Recommendation**: Consider lazy loading icons or using a smaller subset. Alternatively, accept this tradeoff for runtime flexibility.
- **Expected Improvement**: ~20-30KB bundle reduction if optimized.

#### 8. processSlides Creates New Objects on Every Presentation Load

**File**: `/workspace/agentic-slides/src/context/PresentationContext.jsx:35-68`

- **Problem**: `processSlides` creates new objects for every slide and every item on every presentation load. This is fine for initial load, but could be optimized.
- **Impact**: Minor - only runs once per presentation load, not on every slide change.
- **Code**:
  ```javascript
  function processSlides(slides, basePath) {
    return slides.map(slide => {
      const processed = { ...slide };  // New object per slide
      // ...
      if (slide.items) {
        processed.items = slide.items.map(item => ({ ...item }));  // New objects per item
      }
      return processed;
    });
  }
  ```
- **Recommendation**: This is acceptable for now. Would only matter with 1000+ slides.
- **Expected Improvement**: N/A - acceptable pattern.

---

### LOW - Pre-existing Issues (Not Blocking, Informational)

#### 9. Images Not Optimized or Lazy Loaded

**Directory**: `/workspace/agentic-slides/public/presentations/gen-ai-hackathon/assets/`

- **Problem**: 18 images totaling 14 MB, with several 2+ MB PNGs:
  - `agentic-loop.png`: 2.2 MB
  - `agents.png`: 2.2 MB  
  - `let-build.png`: 2.2 MB
- **Impact**: On mobile or slow connections, these images cause significant load times for individual slides.
- **Current State**:
  ```jsx
  // VisualPanel.jsx:102-106
  <img
    src={imagePath}
    alt="Slide Visual"
    className="w-full h-full object-cover"
  />  // No loading="lazy", no srcset, no optimization
  ```
- **Recommendation**:
  1. Convert large PNGs to WebP (~70% size reduction)
  2. Add `loading="lazy"` to defer off-screen image loading
  3. Consider generating responsive srcsets for different screen sizes
- **Expected Improvement**: 70%+ reduction in image transfer size.

#### 10. BenchmarkChart Recalculates Data on Every Render

**File**: `/workspace/agentic-slides/src/components/BenchmarkChart.jsx:29-46`

- **Problem**: `chartData` and `chartConfig` are computed inline on every render.
- **Impact**: Minor - Recharts may handle this internally, but it's not optimal.
- **Code**:
  ```javascript
  const chartData = data.map(item => ({...}));  // Computed every render
  const chartConfig = data.reduce((acc, item) => {...}, {});  // Computed every render
  ```
- **Recommendation**: Wrap in `useMemo`:
  ```javascript
  const chartData = useMemo(() => data.map(...), [data, colorMap]);
  const chartConfig = useMemo(() => data.reduce(...), [data, colorMap]);
  ```
- **Expected Improvement**: Marginal - saves microseconds per render.

#### 11. Animation Variants Defined Inline in Components

**Files**:
- `/workspace/agentic-slides/src/pages/HomePage.jsx:7-25`
- `/workspace/agentic-slides/src/components/layouts/SlideAnimations.jsx`

- **Problem**: Animation variant objects are defined at module scope, which is good. However, some animation props are still passed inline:
  ```javascript
  <motion.div
    initial={{ opacity: 0, y: -20 }}  // Object created every render
    animate={{ opacity: 1, y: 0 }}     // Object created every render
  ```
- **Impact**: Creates new objects on every render, potentially triggering Framer Motion diffs.
- **Recommendation**: Extract all animation configs to constants.
- **Expected Improvement**: Marginal - framer-motion likely handles this internally.

---

## Merge Recommendation

**BLOCK MERGE** - Critical performance issues in your changes:

1. **1.45 MB bundle is unacceptable** for a slideshow app. The main culprit is Mermaid.js being imported synchronously.
2. **Dead code** (old Slide.jsx and slides.js) must be removed to ensure clean architecture.

---

## Optimization Priority

### Fix Before Merge (Blocking):

1. **Lazy-load Mermaid.js** - Dynamic import only when a mermaid diagram is needed
2. **Delete dead code** - Remove `src/components/Slide.jsx` and `src/data/slides.js`
3. **Consolidate Mermaid handling** - Single component for all mermaid rendering

### Optimize While You're Here (High Value):

4. **Add React.memo to SlideRenderer** - Prevent unnecessary re-renders
5. **Debounce NavigationOverlay mouse handler** - Reduce callback frequency
6. **Initialize Mermaid once** - Move initialization out of useEffect

### Future Work (Separate PRs):

7. **Optimize images** - Convert to WebP, add lazy loading
8. **Consider Vite code splitting** - Manual chunks for large dependencies
9. **Add performance monitoring** - Track Time to Interactive and bundle size in CI

---

## Bundle Analysis Summary

| Chunk | Size | Gzipped | Notes |
|-------|------|---------|-------|
| `index.js` (main) | 1,448 KB | 424 KB | **CRITICAL** - too large |
| `cytoscape.esm.js` | 442 KB | 142 KB | Mermaid dependency |
| `treemap.js` | 330 KB | 80 KB | Mermaid dependency |
| `katex.js` | 262 KB | 77 KB | Mermaid math support |
| Various mermaid diagrams | ~600 KB | ~200 KB | Code-split but still loaded |
| `slides.json` | 30 KB | 10 KB | Presentation data |

**Total downloadable on first visit**: ~500 KB gzipped (good) but must wait for 424 KB main chunk

---

## Asset Analysis

| Image | Size | Format | Recommendation |
|-------|------|--------|----------------|
| `agentic-loop.png` | 2.2 MB | PNG | Convert to WebP (~400 KB) |
| `agents.png` | 2.2 MB | PNG | Convert to WebP (~400 KB) |
| `let-build.png` | 2.2 MB | PNG | Convert to WebP (~400 KB) |
| `network.png` | 772 KB | PNG | Convert to WebP (~150 KB) |
| `hero.png` | 704 KB | PNG | Convert to WebP (~140 KB) |
| Others (14 files) | 4.4 MB | Mixed | Optimize individually |

**Total potential savings**: ~10 MB (70% reduction)

---

*Report generated by Performance Audit Agent*
*Reviewed: 40 changed files, 3,156 lines added*
