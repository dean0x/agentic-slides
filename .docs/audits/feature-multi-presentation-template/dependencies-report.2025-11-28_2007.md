# Dependencies Audit Report

**Branch**: feature/multi-presentation-template  
**Base**: main  
**Date**: 2025-11-28 20:07  
**Auditor**: Claude (automated)

---

## Summary

| Category | Count | Status |
|----------|-------|--------|
| Critical Issues | 0 | PASS |
| High Issues | 0 | PASS |
| Medium Issues | 2 | REVIEW |
| Low/Info Issues | 12 | INFO |
| Security Vulnerabilities | 2 (moderate) | PRE-EXISTING |
| Unused Dependencies | 0 | PASS |
| License Issues | 0 | PASS |

**Dependencies Score**: 7/10

**Merge Recommendation**: APPROVED WITH CONDITIONS

---

## Issues Found

### Critical (blocking)

None.

### High/Medium (should fix)

#### 1. [MEDIUM] Node.js Version Requirement - react-router-dom@7.9.6

**Category**: Your Changes (BLOCKING consideration)

**Issue**: The newly added `react-router-dom@7.9.6` requires Node.js >= 20.0.0

```json
// package.json (added in this branch)
"react-router-dom": "^7.9.6"

// react-router-dom engines requirement
"engines": {
  "node": ">=20.0.0"
}
```

**Current Status**: COMPATIBLE (Node.js v20.19.4 detected)

**Risk**: Deployment environments must ensure Node.js 20+ is available. This is stricter than other dependencies.

**Recommendation**: 
- Add `"engines": { "node": ">=20.0.0" }` to package.json to make requirement explicit
- Document Node.js version requirement in README

---

#### 2. [MEDIUM] Bundle Size Warning - Main Chunk Exceeds 500 kB

**Category**: Pre-existing (not blocking)

**Issue**: Build produces a main bundle of 1.45 MB (424 KB gzipped):

```
dist/assets/index-BLeMzPXs.js  1,448.23 kB | gzip: 424.54 kB
```

**Contributing Factors**:
- mermaid.js with multiple diagram types (~15+ chunks)
- cytoscape.esm.js (442 KB)
- katex.js (262 KB)
- recharts/d3 ecosystem (330+ KB)

**Impact**: The new `react-router-dom` adds approximately 4 MB to node_modules but minimal impact to bundle (tree-shaking applies).

**Recommendation**:
- Consider code-splitting with dynamic imports for mermaid diagrams
- Use `build.rollupOptions.output.manualChunks` for better chunk distribution

---

### Low/Info (pre-existing or minor)

#### 3. [INFO] Security Vulnerabilities - Pre-existing

**npm audit** reports 2 moderate vulnerabilities (pre-existing, not introduced by this branch):

| Package | Severity | Issue | Fix |
|---------|----------|-------|-----|
| esbuild | Moderate | GHSA-67mh-4wv8-2f99 - Dev server CORS bypass | Vite 7.x |
| vite | Moderate | Inherits esbuild vulnerability | Vite 7.x |

**Note**: These are **development-only** vulnerabilities affecting the dev server. Production builds are NOT affected.

**Advisory**: https://github.com/advisories/GHSA-67mh-4wv8-2f99

**Fix available**: Upgrade to Vite 7.x (breaking change)

---

#### 4. [INFO] Outdated Dependencies - Pre-existing

The following packages have newer major versions available:

| Package | Current | Latest | Breaking Changes |
|---------|---------|--------|------------------|
| vite | 5.4.21 | 7.2.4 | Major version |
| tailwindcss | 3.4.18 | 4.1.17 | Major version |
| framer-motion | 11.18.2 | 12.23.24 | Major version |
| eslint | 8.57.1 | 9.39.1 | Major version |
| lucide-react | 0.300.0 | 0.555.0 | API changes |
| react | 18.3.1 | 19.2.0 | Major version |
| react-dom | 18.3.1 | 19.2.0 | Major version |

**Minor/Patch Updates Available**:
| Package | Current | Wanted |
|---------|---------|--------|
| recharts | 3.5.0 | 3.5.1 |

**Recommendation**: Update recharts to 3.5.1 (patch, safe). Major upgrades should be done in separate PRs.

---

#### 5. [INFO] New Dependencies Added - Your Changes

| Package | Version | Size (node_modules) | License |
|---------|---------|---------------------|---------|
| react-router-dom | 7.9.6 | 28 KB | MIT |
| react-router | 7.9.6 | 4.0 MB | MIT |
| cookie | 1.1.1 | ~8 KB | MIT |
| set-cookie-parser | 2.7.2 | ~12 KB | MIT |

**Total Addition**: ~4.1 MB to node_modules

**Usage Verification**: All new dependencies are actively used:
- `/workspace/agentic-slides/src/App.jsx` - BrowserRouter, Routes, Route, Navigate
- `/workspace/agentic-slides/src/pages/HomePage.jsx` - Link
- `/workspace/agentic-slides/src/pages/PresentationViewer.jsx` - useParams, useNavigate, Link

---

#### 6. [INFO] Dependency Utilization Check - All Used

All production dependencies are actively imported:

| Dependency | Import Count | Files |
|------------|--------------|-------|
| react-router-dom | 3 | App.jsx, HomePage.jsx, PresentationViewer.jsx |
| framer-motion | 8 | Multiple components |
| lucide-react | 4 | slides.js, icons.js, pages |
| mermaid | 3 | SlideRenderer, VisualPanel, Slide |
| recharts | 2 | BenchmarkChart, chart.jsx |
| clsx | 1 | utils.js |
| tailwind-merge | 1 | utils.js |

**Result**: No unused dependencies detected.

---

#### 7. [INFO] License Compatibility - PASS

All dependencies use permissive licenses:

| License | Packages |
|---------|----------|
| MIT | react, react-dom, react-router-dom, react-router, cookie, set-cookie-parser, framer-motion, lucide-react, mermaid, recharts, clsx, tailwind-merge, tailwindcss, vite |
| ISC | Some transitive dependencies |
| Apache-2.0 | Some transitive dependencies |

**Result**: All licenses compatible with commercial and open-source use.

---

#### 8. [INFO] Peer Dependency Compatibility - PASS

`react-router-dom@7.9.6` peer dependencies:
- `react: >=18` - Satisfied (18.3.1 installed)
- `react-dom: >=18` - Satisfied (18.3.1 installed)

---

## Dependency Diff: main vs feature/multi-presentation-template

```diff
 {
-  "name": "gen-ai-slideshow",
+  "name": "slideshow-template",
-  "version": "0.0.0",
+  "version": "1.0.0",
   "dependencies": {
     "clsx": "^2.1.1",
     "framer-motion": "^11.0.0",
     "lucide-react": "^0.300.0",
     "mermaid": "^11.12.1",
     "react": "^18.2.0",
     "react-dom": "^18.2.0",
+    "react-router-dom": "^7.9.6",
     "recharts": "^3.5.0",
     "tailwind-merge": "^3.4.0"
   }
 }
```

**Changes**:
1. Package renamed from `gen-ai-slideshow` to `slideshow-template`
2. Version bumped from `0.0.0` to `1.0.0`
3. Added `react-router-dom@^7.9.6` (new dependency)

---

## Recommendations

### Immediate (before merge)

1. **Add Node.js engine requirement** to package.json:
   ```json
   "engines": {
     "node": ">=20.0.0"
   }
   ```

2. **Update recharts** to 3.5.1 (patch version, safe):
   ```bash
   npm update recharts
   ```

### Short-term (follow-up PR)

3. **Consider code-splitting** for mermaid diagrams to reduce initial bundle size:
   ```javascript
   // Dynamic import example
   const MermaidDiagram = lazy(() => import('./MermaidDiagram'));
   ```

### Long-term (maintenance)

4. **Plan Vite 7.x upgrade** to resolve security advisories (requires testing, breaking changes)

5. **Plan React 19 upgrade** when ecosystem stabilizes (many dependencies need updates)

6. **Consider lucide-react update** (0.300.0 -> 0.555.0) - may require icon name changes

---

## Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| Node.js version incompatibility | Low | Document requirement, CI checks |
| Bundle size growth | Low | Tree-shaking effective, minimal impact |
| Security vulnerabilities | Low | Dev-only, production not affected |
| Breaking changes from updates | Medium | Avoid major version updates in this PR |

---

## Conclusion

The dependency changes in this branch are **well-justified and properly implemented**:

- `react-router-dom` is actively used for routing in 3 files
- All new dependencies have MIT licenses
- Peer dependency requirements are satisfied
- No security vulnerabilities introduced

**Pre-existing issues** (Vite security advisory, outdated packages) should be addressed in separate maintenance PRs.

**Verdict**: APPROVED for merge with recommendation to add `engines` field to package.json.

---

*Report generated by automated dependency audit*
