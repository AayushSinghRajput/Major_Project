'use client';

import { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { BookText, Hash, Calendar, Loader2, ChevronDown, AlertCircle } from 'lucide-react';
import { getUserNotes } from "../lib/api";

const NotesSection = () => {
  const [activeCourse, setActiveCourse] = useState('All');
  const [expandedNote, setExpandedNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const res = await getUserNotes();
      if (res.success) {
        setNotes(res.data || []);
      } else {
        setError("Failed to load notes from server.");
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("An error occurred while connecting to the library.");
    } finally {
      setLoading(false);
    }
  };

  // Derive unique subjects for the sidebar
  const courses = useMemo(() => {
    const subjects = notes.map(note => note.subject).filter(Boolean);
    return ['All', ...new Set(subjects)];
  }, [notes]);

  // Filter logic
  const filteredNotes = useMemo(() => {
    return activeCourse === 'All' 
      ? notes 
      : notes.filter(note => note.subject === activeCourse);
  }, [notes, activeCourse]);

  const toggleNote = (id) => {
    setExpandedNote(expandedNote === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Accessing your personal library...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-gray-800">Connection Issue</h3>
        <p className="text-gray-500 mt-2">{error}</p>
        <button onClick={loadNotes} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Try Again</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar: Course Filter */}
        <aside className="w-full md:w-72 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
              <BookText className="mr-2 text-indigo-500" size={18} /> 
              My Subjects
            </h3>
            <div className="space-y-1">
              {courses.map((course) => (
                <button
                  key={course}
                  onClick={() => setActiveCourse(course)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeCourse === course 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content: Notes List */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Study Library</h2>
              <p className="text-slate-500 mt-1">Review your AI-generated deep dives.</p>
            </div>
            <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-black">
              {filteredNotes.length} {filteredNotes.length === 1 ? 'Note' : 'Notes'}
            </div>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Hash className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 font-medium">No notes found for <span className="text-indigo-600 font-bold">{activeCourse}</span>.</p>
              <p className="text-slate-400 text-sm mt-1">Generate a note from your study plan to see it here.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredNotes.map((note) => (
                <div 
                  key={note._id} 
                  className={`group bg-white border rounded-2xl transition-all duration-300 ${
                    expandedNote === note._id 
                    ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-xl' 
                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  <div 
                    className="p-6 cursor-pointer flex justify-between items-start"
                    onClick={() => toggleNote(note._id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-indigo-50 text-indigo-600 rounded">
                          {note.subject}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                          <Calendar size={12} />
                          Day {note.day}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {note.title}
                      </h3>
                    </div>
                    <div className={`mt-2 p-1 rounded-full transition-all ${expandedNote === note._id ? 'bg-indigo-600 text-white rotate-180' : 'text-slate-400 bg-slate-100 group-hover:bg-indigo-50'}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                  
                  {expandedNote === note._id && (
                    <div className="px-8 pb-8 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="h-px bg-slate-100 mb-6" />
                      <div className="prose prose-indigo max-w-none prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed">
                        <ReactMarkdown 
                          remarkPlugins={[remarkMath]} 
                          rehypePlugins={[rehypeKatex]}
                        >
                          {note.content}
                        </ReactMarkdown>
                      </div>
                      
                      {note.hashtags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-slate-50">
                          {note.hashtags.map((tag, idx) => (
                            <span key={idx} className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg">
                              #{tag.replace('#', '')}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NotesSection;