import { useEffect, useRef, useState } from 'react';

/**
 * Default Mermaid theme configuration
 */
const DEFAULT_MERMAID_THEME = {
  primaryColor: '#e0e7ff',
  primaryTextColor: '#1e293b',
  primaryBorderColor: '#818cf8',
  lineColor: '#64748b',
  secondaryColor: '#f1f5f9',
  tertiaryColor: '#ffffff',
  fontSize: '13px'
};

/**
 * Loading placeholder for Mermaid diagrams
 */
function MermaidLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

/**
 * Inner component that handles actual Mermaid rendering
 * Separated to enable lazy loading of the mermaid library
 */
function MermaidRenderer({ slideId, content, theme, onError }) {
  const containerRef = useRef(null);
  const [mermaidModule, setMermaidModule] = useState(null);
  const [error, setError] = useState(null);

  // Lazy load mermaid library
  useEffect(() => {
    let mounted = true;

    import('mermaid').then((mod) => {
      if (mounted) {
        setMermaidModule(mod.default);
      }
    }).catch((err) => {
      if (mounted) {
        setError(err);
        onError?.(err);
      }
    });

    return () => {
      mounted = false;
    };
  }, [onError]);

  // Render diagram when mermaid is loaded
  useEffect(() => {
    if (!mermaidModule || !containerRef.current || !content) return;

    const mergedTheme = { ...DEFAULT_MERMAID_THEME, ...theme };

    mermaidModule.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: mergedTheme,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: false,
        curve: 'basis',
        padding: 20,
        nodeSpacing: 50,
        rankSpacing: 50
      },
      graph: {
        useMaxWidth: true,
        htmlLabels: false
      }
    });

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaidModule.render(`mermaid-${slideId}`, content);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err);
        onError?.(err);
      }
    };

    renderDiagram();
  }, [mermaidModule, slideId, content, theme, onError]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        <p>Failed to render diagram</p>
      </div>
    );
  }

  if (!mermaidModule) {
    return <MermaidLoading />;
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex justify-center items-center"
      style={{ transform: 'scale(0.95)', maxHeight: '100%' }}
    />
  );
}

/**
 * MermaidDiagram - Lazy-loaded Mermaid diagram component
 *
 * This component handles lazy loading of the mermaid library to reduce
 * initial bundle size. The library is only loaded when a diagram is rendered.
 *
 * @param {Object} props
 * @param {string|number} props.slideId - Unique identifier for the diagram
 * @param {string} props.content - Mermaid diagram definition
 * @param {Object} [props.theme] - Custom theme variables to merge with defaults
 * @param {function} [props.onError] - Callback when rendering fails
 */
export function MermaidDiagram({ slideId, content, theme, onError }) {
  if (!content) {
    return null;
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <MermaidRenderer
        slideId={slideId}
        content={content}
        theme={theme}
        onError={onError}
      />
    </div>
  );
}
