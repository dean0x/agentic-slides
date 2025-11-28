# Security Audit Report

**Branch**: feature/multi-presentation-template
**Base**: main
**Date**: 2025-11-28 20:07
**Files Analyzed**: 37 changed files
**Lines Changed**: ~3,500+ (major architectural refactor)

---

## Summary

This branch introduces a significant architectural refactor from a single-presentation React app to a multi-presentation template system. The changes include:

- React Router integration for navigation between presentations
- JSON-based slide data format replacing hardcoded JavaScript
- Dynamic asset path resolution from user-controlled presentation IDs
- Mermaid diagram rendering with innerHTML injection
- Icon resolver system mapping string names to React components

**Overall Risk Assessment**: MEDIUM - No critical blocking vulnerabilities in the new code, but several areas require attention before production deployment.

---

## Issues Found

### 🔴 Critical (Blocking)

**None identified.**

The codebase does not contain SQL, authentication systems, or backend APIs, limiting the attack surface significantly for a frontend-only slideshow application.

---

### ⚠️ High/Medium (Should Fix)

#### 1. innerHTML Usage with Mermaid SVG Output

**Severity**: MEDIUM
**Files**: 
- `/workspace/agentic-slides/src/components/layouts/VisualPanel.jsx:61` (NEW - added in this branch)
- `/workspace/agentic-slides/src/components/SlideRenderer.jsx:67` (NEW - added in this branch)

**Vulnerability**: The code sets `innerHTML` with SVG output from Mermaid.js:

```javascript
// VisualPanel.jsx:59-61
const { svg } = await mermaid.render(`mermaid-${slideId}`, visualContent);
if (mermaidRef.current) {
  mermaidRef.current.innerHTML = svg;
}
```

**Attack Scenario**: 
If an attacker can control the `visualContent` (Mermaid diagram definition) in a slide JSON file, they could potentially inject malicious SVG that includes embedded scripts or event handlers. While Mermaid.js does sanitize output, the library has had XSS vulnerabilities in the past (CVE-2023-2988, CVE-2022-25869).

**Mitigating Factors**:
- Presentation JSON files are loaded from the local bundle (not user-uploaded)
- Mermaid 11.x includes improved sanitization
- `htmlLabels: false` is correctly set in configuration

**Recommendation**: 
- Consider using `DOMPurify` to sanitize SVG output before innerHTML injection
- Keep Mermaid.js updated to latest patch version
- Add Content Security Policy (CSP) headers if deployed to production

**Category**: Issue in your changes (lines ADDED in this branch)

---

#### 2. Dynamic Path Construction from URL Parameter

**Severity**: MEDIUM
**File**: `/workspace/agentic-slides/src/pages/PresentationViewer.jsx:42` (NEW)

**Vulnerability**: The presentation ID from the URL is used to construct asset paths:

```javascript
// PresentationViewer.jsx:40-43
const entry = findPresentation(id);
// ...
const basePath = `/presentations/${id}`;
loadPresentation(module.default || module, basePath);
```

And in `/workspace/agentic-slides/src/context/PresentationContext.jsx:51`:
```javascript
processed.imagePath = `${basePath}/assets/${slide.image}`;
```

**Attack Scenario**:
An attacker could craft a URL like `/presentation/../../../etc/passwd` or `/presentation/..%2F..%2Fsensitive`. While React Router and browser security models typically prevent direct file system access, this pattern could:
1. Cause unexpected behavior if ID contains special characters
2. Be exploited if the app is extended with server-side rendering

**Mitigating Factors**:
- `findPresentation(id)` validates against a whitelist registry
- Client-side only - no server file system access
- Images served from `/public` which is sandboxed by Vite

**Recommendation**:
- Add explicit ID validation with allowlist pattern (alphanumeric + hyphens only)
- Consider using URL encoding/decoding consistently

**Category**: Issue in your changes (lines ADDED in this branch)

---

#### 3. dangerouslySetInnerHTML in Chart Styling

**Severity**: LOW
**File**: `/workspace/agentic-slides/src/components/ui/chart.jsx:59-76` (PRE-EXISTING - not changed in this branch)

**Vulnerability**: The ChartStyle component uses `dangerouslySetInnerHTML` to inject CSS:

```javascript
<style
  dangerouslySetInnerHTML={{
    __html: Object.entries(THEMES)
      .map(([theme, prefix]) => `...${color}...`)
      .join("\n"),
  }}
/>
```

**Attack Scenario**: If `config` values (colors) could be controlled by an attacker, they could inject CSS-based attacks (CSS injection, data exfiltration via CSS).

**Mitigating Factors**:
- Config is defined in code/JSON, not user input
- CSS injection is limited in impact compared to JS injection
- This is standard shadcn/ui pattern

**Recommendation**:
- No immediate action required (pre-existing, not in scope of this PR)
- Consider CSS-in-JS sanitization if config becomes user-controllable

**Category**: Pre-existing issue (not blocking for this PR)

---

#### 4. Dependency Vulnerability - esbuild/Vite

**Severity**: MEDIUM
**Source**: `npm audit`

**Vulnerability**: 
```
esbuild  <=0.24.2
Severity: moderate
GHSA-67mh-4wv8-2f99: esbuild enables any website to send requests to dev server
```

**Impact**: During development, any website could make requests to the Vite dev server and potentially read responses. This is a development-time vulnerability, not production.

**Mitigating Factors**:
- Only affects `npm run dev` (development mode)
- Production builds are not affected
- Fix requires breaking change (Vite 7.x)

**Recommendation**:
- Accept risk for development
- Plan Vite 7.x upgrade in future
- Never run dev server on untrusted networks

**Category**: Pre-existing (dependency issue)

---

### ℹ️ Low/Info (Pre-existing or Minor)

#### 5. No Input Sanitization on Search Query

**Severity**: LOW
**File**: `/workspace/agentic-slides/src/pages/HomePage.jsx:81` (NEW)

**Code**:
```javascript
<input
  type="text"
  placeholder="Search presentations..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
```

**Note**: The search query is only used in client-side filtering via `.includes()`. No XSS risk as React escapes output by default. No action required.

**Category**: Informational only

---

#### 6. Console.error Leaks Error Details

**Severity**: LOW
**Files**: 
- `/workspace/agentic-slides/src/components/layouts/VisualPanel.jsx:64`
- `/workspace/agentic-slides/src/components/SlideRenderer.jsx:70`
- `/workspace/agentic-slides/src/pages/PresentationViewer.jsx:46-47`

**Code**:
```javascript
console.error('Failed to load presentation:', err);
```

**Note**: Error messages are logged to browser console. In production, this could leak implementation details. Consider using a structured logging approach that can be disabled in production.

**Category**: Informational (code quality)

---

#### 7. No Rate Limiting Consideration

**Severity**: INFO
**Scope**: Application-wide

**Note**: As a static frontend app, rate limiting is not applicable. However, if the app is extended with API calls, rate limiting should be considered.

**Category**: Not applicable for current scope

---

#### 8. Missing Security Headers

**Severity**: LOW
**Scope**: Deployment configuration (not in this codebase)

**Note**: The following headers should be configured at deployment:
- `Content-Security-Policy` (especially for inline scripts/styles)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (if embedding not needed)
- `Referrer-Policy: strict-origin-when-cross-origin`

**Category**: Deployment concern, not code change

---

## Recommendations

### Fix Before Merge (Priority Order)

1. **Consider DOMPurify for Mermaid SVG** (optional enhancement)
   - Install: `npm install dompurify`
   - Sanitize SVG before innerHTML:
   ```javascript
   import DOMPurify from 'dompurify';
   mermaidRef.current.innerHTML = DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true } });
   ```

2. **Add ID Validation in PresentationViewer**
   ```javascript
   const VALID_ID_PATTERN = /^[a-z0-9-]+$/;
   if (!VALID_ID_PATTERN.test(id)) {
     setLoadError('Invalid presentation ID format');
     return;
   }
   ```

### Future Considerations

1. Plan Vite 7.x upgrade when stable (addresses esbuild vulnerability)
2. Add CSP headers at deployment if hosting on web
3. Consider structured logging for production deployments

---

## Security Score: 7/10

**Breakdown**:
- XSS Prevention: 7/10 (React escaping good, innerHTML with mermaid is concern)
- Input Validation: 6/10 (registry validation exists, but ID pattern not enforced)
- Dependency Security: 6/10 (moderate dev-time vulnerability)
- Secrets Management: 10/10 (no secrets, no .env files)
- Configuration: 8/10 (reasonable defaults)

---

## Merge Recommendation

**APPROVED WITH CONDITIONS**

The changes in this branch do not introduce critical security vulnerabilities. The identified issues are:
- **Medium severity** items that represent defense-in-depth improvements rather than immediate exploits
- Mitigated by the application architecture (client-side only, registry validation)
- Standard patterns used in React applications

**Conditions for production deployment**:
1. Ensure Mermaid.js stays updated to latest patch version
2. Configure security headers at hosting layer
3. Do not allow user-uploaded JSON presentations without additional validation

---

## Files Reviewed

| File | Security Relevance | Issues Found |
|------|-------------------|--------------|
| `src/pages/PresentationViewer.jsx` | HIGH - URL params, asset loading | Path construction (MEDIUM) |
| `src/context/PresentationContext.jsx` | HIGH - State, path processing | None (well-structured) |
| `src/components/SlideRenderer.jsx` | HIGH - Rendering, innerHTML | Mermaid innerHTML (MEDIUM) |
| `src/components/layouts/VisualPanel.jsx` | HIGH - innerHTML usage | Mermaid innerHTML (MEDIUM) |
| `src/presentations/registry.js` | MEDIUM - Presentation loading | None (proper validation) |
| `src/lib/icons.js` | LOW - Icon resolution | None |
| `src/pages/HomePage.jsx` | LOW - UI only | None |
| `src/components/BenchmarkChart.jsx` | LOW - Data visualization | None |
| `src/components/ui/chart.jsx` | MEDIUM - dangerouslySetInnerHTML | Pre-existing (not blocking) |
| `slides.json` | LOW - Static data | None |

---

*Report generated by security audit specialist*
*Methodology: Static code analysis, dependency scanning, pattern matching*
