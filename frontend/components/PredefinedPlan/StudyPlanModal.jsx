import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useState, useMemo } from "react";

// --- REQUIRED IMPORTS FOR MATH ---
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; 

export default function StudyPlanModal({ plan, onClose }) {
  const [activeDay, setActiveDay] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);

  // Helper to ensure JSON strings with literal \n are treated as actual line breaks
  const formattedDescription = useMemo(() => {
    if (!selectedSubtopic?.description) return "";
    return selectedSubtopic.description.replace(/\\n/g, "\n");
  }, [selectedSubtopic]);

  if (!plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
      >
        {/* Modern Gradient Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-indigo-700 via-indigo-800 to-violet-900 text-white flex justify-between items-center shrink-0 shadow-lg">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20">
              <span className="text-3xl">🧪</span>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight uppercase italic">
                {plan.subject} <span className="text-indigo-300">Prep</span>
              </h2>
              <p className="text-indigo-100 text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">
                Strategic 30-Day Entrance Blueprint
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90 border border-white/10 group"
          >
            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden bg-slate-50">
          
          {/* Left Sidebar: Navigation */}
          <div className="w-1/3 border-r border-slate-200 bg-white overflow-y-auto custom-scrollbar shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="p-6 space-y-4">
              {plan.schedule.map((dayData) => (
                <div key={dayData.day} className="group">
                  <button
                    onClick={() => setActiveDay(activeDay === dayData.day ? null : dayData.day)}
                    className={`w-full p-4 flex justify-between items-center rounded-2xl transition-all duration-300 ${
                      activeDay === dayData.day 
                      ? "bg-indigo-600 text-white shadow-indigo-200 shadow-xl translate-x-1" 
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="font-bold flex items-center gap-4">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${
                        activeDay === dayData.day ? "bg-white/20" : "bg-white shadow-sm"
                      }`}>
                        {dayData.day}
                      </span>
                      Day {dayData.day}
                    </span>
                    <motion.span 
                      animate={{ rotate: activeDay === dayData.day ? 180 : 0 }}
                      className="text-xs opacity-50"
                    >
                      ▼
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {activeDay === dayData.day && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-indigo-50/30 rounded-b-2xl -mt-2 pt-4 px-2 pb-2 border-x border-b border-indigo-100"
                      >
                        {dayData.topics.map((topic, tIdx) => (
                          <div key={tIdx} className="mb-2">
                            <div className="px-4 py-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                              {topic.title}
                            </div>
                            <div className="flex flex-col gap-1">
                              {topic.subtopics.map((sub, sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={() => setSelectedSubtopic(sub)}
                                  className={`text-left px-4 py-3 text-sm rounded-xl transition-all flex items-center gap-3 ${
                                    selectedSubtopic?.title === sub.title 
                                    ? "bg-white text-indigo-600 shadow-sm font-bold" 
                                    : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                                  }`}
                                >
                                  <div className={`w-1.5 h-1.5 rounded-full ${selectedSubtopic?.title === sub.title ? "bg-indigo-600" : "bg-slate-300"}`} />
                                  {sub.title}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Right Pane: Content Display */}
          <div className="flex-1 bg-white overflow-y-auto custom-scrollbar selection:bg-indigo-100 selection:text-indigo-900">
            <AnimatePresence mode="wait">
              {selectedSubtopic ? (
                <motion.div
                  key={selectedSubtopic.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-12 max-w-4xl mx-auto"
                >
                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="h-[1px] w-8 bg-indigo-600"></span>
                      <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">
                        Daily Focus
                      </span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                      {selectedSubtopic.title}
                    </h1>
                  </div>
                  
                  {/* Markdown Renderer with enhanced Typography styling */}
                  <div className="prose prose-slate prose-lg max-w-none 
                    prose-headings:text-slate-900 prose-headings:font-black
                    prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:flex prose-h3:items-center
                    prose-p:text-slate-600 prose-p:leading-relaxed
                    prose-li:text-slate-600
                    prose-strong:text-indigo-700 prose-strong:font-bold
                    prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1 prose-code:rounded
                    prose-pre:bg-slate-900 prose-pre:rounded-2xl
                    prose-img:rounded-3xl prose-img:shadow-2xl">
                    <ReactMarkdown 
                      remarkPlugins={[remarkMath]} 
                      rehypePlugins={[rehypeKatex]}
                    >
                      {formattedDescription}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-20"
                >
                  <div className="relative">
                    <div className="w-40 h-40 bg-indigo-50 rounded-full flex items-center justify-center mb-8 animate-pulse" />
                    <span className="text-7xl absolute inset-0 flex items-center justify-center">🎯</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">Select a Lesson</h3>
                  <p className="text-slate-400 max-w-xs mt-4 font-medium leading-relaxed">
                    Your 30-day chemistry roadmap is ready. Choose a day from the left to begin your study session.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </motion.div>
    </div>
  );
}