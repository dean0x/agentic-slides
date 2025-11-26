import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import mermaid from 'mermaid';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20
    }
  }
};

export const Slide = ({ slide, currentSlideIndex, totalSlides }) => {
  useEffect(() => {
    if (slide.visualType === 'mermaid') {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'base',
        themeVariables: {
          primaryColor: '#e0e7ff',
          primaryTextColor: '#1e293b',
          primaryBorderColor: '#818cf8',
          lineColor: '#64748b',
          secondaryColor: '#f1f5f9',
          tertiaryColor: '#ffffff',
          fontSize: '13px'
        },
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
      mermaid.contentLoaded();
    }
  }, [slide.id, slide.visualType]);

  // Determine Layout Type
  const getLayoutType = (s) => {
    if (s.type === 'title' || s.id === 1) return 'intro';
    if (s.type === 'code_split') return 'code';
    if (s.type === 'mermaid_split') return 'mermaid_split';
    return 'standard';
  };

  const layout = getLayoutType(slide);

  // --- Content Blocks ---

  const VisualPanel = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="z-10 w-full h-full flex items-center justify-center"
      key={`visual-${slide.id}`}
    >
      {slide.visualType === 'mermaid' ? (
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="mermaid w-full h-full flex justify-center items-center" style={{ transform: 'scale(0.95)', maxHeight: '100%' }}>
            {slide.visualContent}
          </div>
        </div>
      ) : slide.visualType === 'code' ? (
          <div className="w-full h-full flex items-center justify-center p-12">
            <div className="w-full bg-[#1e1e1e] p-6 rounded-2xl shadow-xl font-mono text-xs xl:text-sm text-white overflow-hidden border border-gray-800 text-left relative">
              <div className="flex gap-1.5 mb-4 absolute top-4 left-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <pre className="mt-6 overflow-x-auto custom-scrollbar">
                <code className="language-javascript">{slide.visualContent}</code>
              </pre>
            </div>
          </div>
      ) : slide.image ? (
        <img 
          src={slide.image} 
          alt="Slide Visual" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center p-12">
          <div className="w-full aspect-square max-w-lg bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2rem] shadow-inner flex items-center justify-center relative overflow-hidden ring-1 ring-black/5">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="text-9xl font-bold text-blue-900/10 tracking-tighter z-10">
                  {slide.title.substring(0, 1)}
              </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  const HeaderContent = ({ align = "center" }) => (
    <motion.div variants={item} className={`mb-10 ${align === 'left' ? 'text-left' : 'text-center'}`}>
      <h2 className="text-primary text-sm font-bold tracking-[0.2em] uppercase mb-4 opacity-70">
        {slide.subtitle || "Gen AI Session"}
      </h2>
      <h1 className="text-5xl xl:text-7xl font-bold text-text leading-[1.1] tracking-tight">
        {slide.title}
      </h1>
    </motion.div>
  );

  const BodyContent = ({ align = "center" }) => (
    <>
      <motion.p variants={item} className={`text-2xl text-secondary mb-12 leading-relaxed font-medium max-w-2xl ${align === 'left' ? 'text-left' : 'text-center'}`}>
        {slide.content}
      </motion.p>

      {/* Dynamic Content Types */}
      
      {/* Type: List / Cards / Timeline - Unified List View */}
      {(slide.type === 'list' || slide.type === 'cards' || slide.type === 'timeline') && (
        <div className="w-full max-w-xl grid grid-cols-1 gap-4">
          {slide.items?.map((lItem, idx) => (
            <motion.div 
              key={idx} 
              variants={item}
              className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left"
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white text-primary rounded-full font-bold text-lg shadow-sm border border-gray-100">
                {idx + 1}
              </div>
              <div>
                <h3 className="text-xl font-bold text-text">{lItem.title || lItem.text}</h3>
                {(lItem.text && lItem.title) && <p className="text-secondary text-base mt-1">{lItem.text}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Type: Image Split (Items) */}
      {slide.type === 'image_split' && (
          <div className="w-full max-w-xl grid grid-cols-1 gap-4">
          {slide.items?.map((cItem, idx) => (
            <motion.div 
              key={idx} 
              variants={item}
              className="p-5 bg-gray-50 rounded-2xl border border-gray-100 text-left"
            >
              <h3 className="text-lg font-bold text-text mb-1">{cItem.title}</h3>
              <p className="text-secondary text-base">{cItem.text}</p>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );

  const CodeBlock = () => (
    <motion.div variants={item} className="w-full h-full flex items-center justify-center p-12">
      <div className="w-full bg-[#1e1e1e] p-8 rounded-2xl shadow-xl font-mono text-lg text-white overflow-hidden border border-gray-800 text-left">
        <pre className="overflow-x-auto custom-scrollbar">
          <code className="language-javascript">{slide.code}</code>
        </pre>
      </div>
    </motion.div>
  );

  return (
    <div className="h-screen w-full bg-[#F5F5F7] text-text overflow-hidden flex items-center justify-center p-6 xl:p-12">
      
      {/* Main Slide Wrapper */}
      <div className="w-full max-w-[95vw] h-full max-h-[95vh] bg-white rounded-[2.5rem] shadow-2xl flex overflow-hidden ring-1 ring-black/5 relative">
        
        {/* --- INTRO LAYOUT --- */}
        {layout === 'intro' && (
          <>
            {/* LEFT: Visuals (45%) */}
            <div className="w-[45%] h-full bg-gray-50 flex items-center justify-center relative border-r border-gray-100 overflow-hidden">
              <VisualPanel />
            </div>
            {/* RIGHT: Content (55%) */}
            <div className="w-[55%] h-full flex flex-col justify-center p-16 xl:p-24 relative text-center items-center">
               <motion.div 
                className="w-full max-w-3xl mx-auto flex flex-col items-center"
                variants={container}
                initial="hidden"
                animate="show"
                key={`content-${slide.id}`}
              >
                <HeaderContent align="center" />
                <BodyContent align="center" />
              </motion.div>
            </div>
          </>
        )}

        {/* --- STANDARD LAYOUT --- */}
        {layout === 'standard' && (
          <>
            {/* LEFT: Header (40%) */}
            <div className="w-[40%] h-full flex flex-col justify-center p-16 xl:p-20 relative bg-gray-50 border-r border-gray-100">
               <motion.div 
                className="w-full flex flex-col items-start text-left"
                variants={container}
                initial="hidden"
                animate="show"
                key={`header-${slide.id}`}
              >
                <HeaderContent align="left" />
              </motion.div>
            </div>
            {/* RIGHT: Body + Items (60%) */}
            <div className="w-[60%] h-full flex flex-col justify-center p-16 xl:p-24 relative overflow-y-auto">
               <motion.div 
                className="w-full flex flex-col items-start text-left"
                variants={container}
                initial="hidden"
                animate="show"
                key={`body-${slide.id}`}
              >
                <BodyContent align="left" />
              </motion.div>
            </div>
          </>
        )}

        {/* --- CODE LAYOUT --- */}
        {layout === 'code' && (
          <>
            {/* LEFT: Header + Content (40%) */}
            <div className="w-[40%] h-full flex flex-col justify-center p-16 xl:p-20 relative bg-gray-50 border-r border-gray-100">
               <motion.div 
                className="w-full flex flex-col items-start text-left"
                variants={container}
                initial="hidden"
                animate="show"
                key={`header-${slide.id}`}
              >
                <HeaderContent align="left" />
                <motion.p variants={item} className="text-xl text-secondary mt-8 leading-relaxed font-medium">
                  {slide.content}
                </motion.p>
              </motion.div>
            </div>
            {/* RIGHT: Code Block (60%) */}
            <div className="w-[60%] h-full flex flex-col justify-center p-8 relative bg-[#1e1e1e]">
               <motion.div 
                className="w-full h-full flex items-center justify-center"
                variants={container}
                initial="hidden"
                animate="show"
                key={`code-${slide.id}`}
              >
                <CodeBlock />
              </motion.div>
            </div>
          </>
        )}

        {/* --- MERMAID SPLIT LAYOUT --- */}
        {layout === 'mermaid_split' && (
          <>
            {/* LEFT: Header + Content (40%) */}
            <div className="w-[40%] h-full flex flex-col justify-center p-16 xl:p-20 relative bg-gray-50 border-r border-gray-100">
               <motion.div 
                className="w-full flex flex-col items-start text-left"
                variants={container}
                initial="hidden"
                animate="show"
                key={`header-${slide.id}`}
              >
                <HeaderContent align="left" />
                <motion.p variants={item} className="text-xl text-secondary mt-8 leading-relaxed font-medium">
                  {slide.content}
                </motion.p>
              </motion.div>
            </div>
            {/* RIGHT: Mermaid Block (60%) */}
            <div className="w-[60%] h-full flex flex-col justify-center p-8 relative bg-white">
               <motion.div
                className="w-full h-full flex items-center justify-center"
                variants={container}
                initial="hidden"
                animate="show"
                key={`mermaid-${slide.id}`}
              >
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div className="mermaid w-full h-full flex justify-center items-center" style={{ transform: 'scale(0.95)', maxHeight: '100%' }}>
                    {slide.visualContent}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Footer / Progress */}
        <div className={`absolute bottom-10 right-12 font-medium text-xs tracking-widest ${layout === 'code' ? 'text-white/30' : 'text-secondary/30'}`}>
          {currentSlideIndex + 1} / {totalSlides}
        </div>

      </div>
    </div>
  );
};
