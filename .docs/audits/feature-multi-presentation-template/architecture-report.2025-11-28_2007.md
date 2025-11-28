# Architecture Audit Report

**Branch**: feature/multi-presentation-template
**Base**: main
**Date**: 2025-11-28 20:07
**Scope**: Major refactor from single-presentation app to multi-presentation template

---

## Summary

The refactor introduces a significant architectural improvement: moving from a monolithic single-presentation app to a modular, multi-presentation template. The new architecture adds React Router, Context API for state management, JSON-based slide data, and modular layout components.

**Key Changes**:
- Added React Router for `/` (home) and `/presentation/:id` routes
- Introduced `PresentationContext` for centralized state management
- Migrated slides from JS module with imports to JSON with string-based icon references
- Split monolithic `Slide.jsx` (359 lines) into modular components under `layouts/`
- Added presentation registry pattern with dynamic imports
- Moved assets from `src/assets/` to `public/presentations/{id}/assets/`

**Overall Assessment**: Well-structured refactor with some critical dead code and duplication issues that should be addressed before merge.

---

## Issues Found

### CRITICAL (blocking)

#### C1. Dead Code: Old Slide.jsx Still Present (BLOCKING)
**File**: `/workspace/agentic-slides/src/components/Slide.jsx`
**Lines**: 1-359 (entire file)

The old `Slide.jsx` component (359 lines) still exists alongside the new `SlideRenderer.jsx` (303 lines). This creates significant maintenance risk:

- Both files contain nearly identical layout logic
- Both initialize mermaid.js separately
- No imports reference `Slide.jsx` in the new architecture
- Confuses developers about which component to modify

**Evidence**: `Slide.jsx` is never imported in the new flow - `PresentationViewer.jsx` uses `SlideRenderer`:
```javascript
// PresentationViewer.jsx:6
import { SlideRenderer } from '@/components/SlideRenderer';
```

**Recommendation**: Delete `/workspace/agentic-slides/src/components/Slide.jsx` entirely.

---

#### C2. Dead Code: Old slides.js Data Still Present (BLOCKING)
**File**: `/workspace/agentic-slides/src/data/slides.js`
**Lines**: 1-35468 (entire file)

The old JS-based slides data with direct icon imports remains:
```javascript
import { Terminal, Brain, Layers, Code, ... } from 'lucide-react';
import introImg from '../assets/intro_slide.jpg';
// ...
export const slides = [...]
```

The new architecture uses JSON-based slides loaded dynamically:
```javascript
// registry.js:35
loader: () => import('./gen-ai-hackathon/slides.json')
```

**Impact**: 
- ~35KB of dead code
- Old asset imports from `src/assets/` which is also duplicated

**Recommendation**: Delete `/workspace/agentic-slides/src/data/slides.js` after confirming migration is complete.

---

#### C3. Duplicate Assets Directory (BLOCKING)
**Directories**: 
- `/workspace/agentic-slides/src/assets/` (old location, 13.6MB)
- `/workspace/agentic-slides/public/presentations/gen-ai-hackathon/assets/` (new location, 13.6MB)

Both directories contain identical files (same byte sizes). The old `src/assets/` is referenced only by the dead `slides.js`.

**Recommendation**: Delete `/workspace/agentic-slides/src/assets/` after removing `slides.js`.

---

### HIGH (should fix)

#### H1. Duplicate Mermaid Initialization Logic
**Files**: 
- `/workspace/agentic-slides/src/components/SlideRenderer.jsx` (lines 43-61)
- `/workspace/agentic-slides/src/components/layouts/VisualPanel.jsx` (lines 26-69)

Both components contain nearly identical mermaid initialization code:

**SlideRenderer.jsx:45-60**:
```javascript
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: theme.mermaid,
  flowchart: { useMaxWidth: true, htmlLabels: false, curve: 'basis', padding: 20, nodeSpacing: 50, rankSpacing: 50 },
  graph: { useMaxWidth: true, htmlLabels: false }
});
```

**VisualPanel.jsx:38-54**:
```javascript
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: { ...defaultTheme, ...mermaidTheme },
  flowchart: { useMaxWidth: true, htmlLabels: false, curve: 'basis', padding: 20, nodeSpacing: 50, rankSpacing: 50 },
  graph: { useMaxWidth: true, htmlLabels: false }
});
```

**Problems**:
- DRY violation
- `VisualPanel` defines its own `defaultTheme` instead of using `DEFAULT_THEME` from `types/presentation.js`
- Both call `mermaid.initialize` on every render with slightly different theme handling

**Recommendation**: Extract mermaid initialization to a dedicated hook or utility:
```javascript
// src/lib/mermaid.js
export function initMermaid(theme) {
  mermaid.initialize({ /* config */ });
}
```

---

#### H2. Inconsistent Props Interface Between SlideRenderer and VisualPanel
**Files**:
- `/workspace/agentic-slides/src/components/SlideRenderer.jsx` (line 37)
- `/workspace/agentic-slides/src/components/layouts/VisualPanel.jsx` (line 16)

`SlideRenderer` fetches theme from context:
```javascript
const { theme } = usePresentation();
```

But then passes only `mermaidTheme` to `VisualPanel`:
```javascript
<VisualPanel
  mermaidTheme={theme.mermaid}
  ...
/>
```

`VisualPanel` then has its own fallback default theme:
```javascript
const defaultTheme = {
  primaryColor: '#e0e7ff',
  // ...
};
mermaid.initialize({ themeVariables: { ...defaultTheme, ...mermaidTheme } });
```

**Problem**: Inconsistent theme source - `VisualPanel` should receive the full merged theme or use context directly.

**Recommendation**: Either have `VisualPanel` use `usePresentation()` directly, or pass the fully merged theme.

---

#### H3. Presentation Registry Duplicates Data
**Files**:
- `/workspace/agentic-slides/src/presentations/registry.js` (lines 26-36)
- `/workspace/agentic-slides/src/presentations/gen-ai-hackathon/slides.json` (lines 2-10)

Metadata is duplicated in both registry and JSON:

**registry.js**:
```javascript
{
  id: 'gen-ai-hackathon',
  title: 'Gen AI Hackathon Education Session',
  subtitle: 'Curriculum',
  description: '...',
  author: 'Education Team',
  date: '2025',
  tags: ['ai', 'llm', 'rag', 'agents', 'mcp', 'hackathon'],
}
```

**slides.json**:
```json
{
  "meta": {
    "id": "gen-ai-hackathon",
    "title": "Gen AI Hackathon Education Session",
    "subtitle": "Curriculum",
    "description": "...",
    "author": "Education Team",
    "date": "2025",
    "tags": ["ai", "llm", "rag", "agents", "mcp", "hackathon"]
  }
}
```

**Problem**: Single source of truth violation. Changes must be made in two places.

**Recommendation**: Have registry dynamically extract metadata from loaded JSON:
```javascript
export const presentations = [
  {
    id: 'gen-ai-hackathon',
    loader: () => import('./gen-ai-hackathon/slides.json'),
    // Minimal info for listing before load
    thumbnail: '/presentations/gen-ai-hackathon/thumbnail.jpg',
  }
];

// Then extract meta after load in HomePage
```

Or generate registry from JSON files at build time.

---

#### H4. Context Value Object Recreated on Every Render
**File**: `/workspace/agentic-slides/src/context/PresentationContext.jsx` (lines 135-161)

The context value is memoized, but the dependency array is extensive:
```javascript
const value = useMemo(() => ({
  presentation, currentSlide, currentIndex, totalSlides, theme,
  goToSlide, nextSlide, prevSlide, loadPresentation, basePath, isLoading, error
}), [
  presentation, currentSlide, currentIndex, totalSlides, theme,
  goToSlide, nextSlide, prevSlide, loadPresentation, basePath, isLoading, error
]);
```

**Problem**: `currentSlide` changes on every slide navigation, causing full context value recreation. Components that only need `theme` will still re-render.

**Recommendation**: Consider splitting into multiple contexts or using context selectors:
- `PresentationDataContext` (presentation, slides, theme) - rarely changes
- `NavigationContext` (currentIndex, goToSlide, nextSlide, prevSlide) - changes per slide

---

### MEDIUM (should fix)

#### M1. Error Handling Inconsistency
**Files**:
- `/workspace/agentic-slides/src/context/PresentationContext.jsx` (lines 96-110)
- `/workspace/agentic-slides/src/pages/PresentationViewer.jsx` (lines 31-48)

Context uses try/catch and sets error state:
```javascript
try {
  const processedSlides = processSlides(data.slides, path);
  setPresentation({ ...data, slides: processedSlides });
} catch (err) {
  setError(err.message);
}
```

But PresentationViewer has its own separate error state:
```javascript
const [loadError, setLoadError] = useState(null);
// ... later
} catch (err) {
  setLoadError(`Failed to load presentation: ${err.message}`);
}
```

**Problem**: Two separate error states (`error` from context, `loadError` from component) that are both checked in rendering:
```javascript
if (loadError || error) { /* show error UI */ }
```

**Recommendation**: Consolidate error handling in context only. Remove local `loadError` state.

---

#### M2. Navigation Keyboard Hook Could Cause Memory Leaks
**File**: `/workspace/agentic-slides/src/context/PresentationContext.jsx` (lines 185-214)

The `usePresentationKeyboard` hook adds/removes event listeners:
```javascript
export function usePresentationKeyboard() {
  const { nextSlide, prevSlide } = usePresentation();

  React.useEffect(() => {
    const handleKeyDown = (e) => { /* ... */ };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);
}
```

**Problem**: Dependencies include `nextSlide` and `prevSlide` which are `useCallback` wrapped. If they change, the effect re-runs, adding/removing listeners. The callbacks are stable (no deps that change), but the pattern is fragile.

**Recommendation**: Consider using a ref for the callbacks to avoid effect re-runs:
```javascript
const nextSlideRef = useRef(nextSlide);
useEffect(() => { nextSlideRef.current = nextSlide; }, [nextSlide]);
```

---

#### M3. No TypeScript - Using JSDoc Only
**Files**: All `.jsx` files

The codebase uses JSDoc for type documentation:
```javascript
/**
 * @typedef {import('@/types/presentation').Presentation} Presentation
 * @typedef {import('@/types/presentation').Slide} Slide
 */
```

**Problem**: JSDoc provides documentation but no compile-time type checking. Type errors can slip through.

**Recommendation**: Consider migrating to TypeScript for this refactor, or at minimum enable TypeScript checking via `// @ts-check` comments.

---

#### M4. Hardcoded Strings and Magic Values
**Files**: Multiple

Examples:
- `/workspace/agentic-slides/src/pages/PresentationViewer.jsx:42`: `const basePath = '/presentations/${id}';`
- `/workspace/agentic-slides/src/context/PresentationContext.jsx:51`: `processed.imagePath = '${basePath}/assets/${slide.image}';`

**Recommendation**: Extract path patterns to constants:
```javascript
// src/lib/constants.js
export const PATHS = {
  presentations: '/presentations',
  assets: (presentationId) => `/presentations/${presentationId}/assets`,
};
```

---

### LOW/INFO (not blocking)

#### L1. PresentationCard Component in Wrong File
**File**: `/workspace/agentic-slides/src/pages/HomePage.jsx` (lines 154-239)

`PresentationCard` is defined inline within `HomePage.jsx` (85 lines). As the home page grows, this should be extracted.

**Recommendation**: Extract to `/workspace/agentic-slides/src/components/PresentationCard.jsx` for reusability.

---

#### L2. NavigationOverlay Component in Wrong File  
**File**: `/workspace/agentic-slides/src/pages/PresentationViewer.jsx` (lines 124-246)

`NavigationOverlay` (122 lines) is defined within the viewer page. Should be its own component.

**Recommendation**: Extract to `/workspace/agentic-slides/src/components/NavigationOverlay.jsx`.

---

#### L3. Icon Registry is Manually Maintained
**File**: `/workspace/agentic-slides/src/lib/icons.js`

The icon registry manually imports and exports ~80 icons. Adding new icons requires modifying this file.

**Recommendation**: Consider dynamic import pattern or build-time generation. Low priority since icon set is relatively stable.

---

#### L4. No Loading State for Initial Registry Display
**File**: `/workspace/agentic-slides/src/pages/HomePage.jsx`

The `presentations` array is imported synchronously from registry, but each presentation's actual content is lazy-loaded. There's no loading skeleton for the initial grid.

**Recommendation**: Minor UX improvement - add skeleton cards during initial load.

---

## Architecture Score

| Category | Score | Notes |
|----------|-------|-------|
| Separation of Concerns | 7/10 | Good split, but dead code remains |
| State Management | 8/10 | Context usage is sound, minor optimization opportunities |
| Code Organization | 6/10 | Dead files, some inline components |
| DRY Principle | 6/10 | Mermaid init duplicated, registry/JSON duplication |
| Extensibility | 9/10 | Adding new presentations is straightforward |
| Type Safety | 5/10 | JSDoc only, no compile-time checks |

**Overall Architecture Score: 6.8/10**

---

## Merge Recommendation

**BLOCK** - Critical issues must be resolved before merge:

1. **Delete dead code**: Remove `src/components/Slide.jsx`, `src/data/slides.js`, and `src/assets/`
2. **Verify no regressions**: Ensure removal doesn't break anything (check all imports)
3. **Consider fixing H1**: Mermaid duplication is error-prone

After addressing critical issues: **APPROVED WITH CONDITIONS** - High priority items (H1-H4) should be addressed in a follow-up PR.

---

## Files to Delete Before Merge

```bash
# Dead code - must delete
rm /workspace/agentic-slides/src/components/Slide.jsx
rm /workspace/agentic-slides/src/data/slides.js
rm -rf /workspace/agentic-slides/src/assets/
```

---

## Recommended Follow-up PRs

1. **Mermaid Refactor**: Extract mermaid initialization to shared utility
2. **Context Split**: Separate navigation and presentation data contexts for performance
3. **TypeScript Migration**: Add type checking
4. **Component Extraction**: Move inline components to separate files
