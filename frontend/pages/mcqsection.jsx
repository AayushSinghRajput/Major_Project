"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
  Trophy,
  ChevronLeft,
  RotateCcw,
  Clock,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { getAllUserMCQs } from "../lib/api";
import { toast } from "react-hot-toast";

const MCQSection = ({ onBack, day }) => {
  const [quizGroups, setQuizGroups] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const res = await getAllUserMCQs();
        const sortedData = (res?.data || []).sort((a, b) => a.day - b.day);
        setQuizGroups(sortedData);
      } catch (err) {
        toast.error("Failed to load your MCQ library.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Filter logic to handle specific day view vs. mastery bank view
  const displayedQuizzes = useMemo(() => {
    if (day !== undefined && day !== null) {
      return quizGroups.filter((quiz) => quiz.day === day);
    }
    return quizGroups;
  }, [quizGroups, day]);

  // Calculate total questions and score
  const scoreStats = useMemo(() => {
    let totalQuestions = 0;
    let correctAnswers = 0;

    displayedQuizzes.forEach((quiz) => {
      quiz.questions.forEach((q, qIdx) => {
        totalQuestions++;
        const questionId = `${quiz._id}-${qIdx}`;
        const userSelection = selectedOptions[questionId];
        const correctIndex = q.options.indexOf(q.correctAnswer);

        if (userSelection !== undefined && userSelection === correctIndex) {
          correctAnswers++;
        }
      });
    });

    return { totalQuestions, correctAnswers };
  }, [displayedQuizzes, selectedOptions]);

  // NEW: Check if every question in the current view has been answered
  const allQuestionsAnswered = useMemo(() => {
    if (scoreStats.totalQuestions === 0) return false;
    // Count how many of the currently displayed questions are in selectedOptions
    let answeredCount = 0;
    displayedQuizzes.forEach((quiz) => {
      quiz.questions.forEach((_, qIdx) => {
        if (selectedOptions[`${quiz._id}-${qIdx}`] !== undefined) {
          answeredCount++;
        }
      });
    });
    return answeredCount === scoreStats.totalQuestions;
  }, [displayedQuizzes, selectedOptions, scoreStats.totalQuestions]);

  // Reset function to clear all selected answers
  const handleReset = () => {
    setSelectedOptions({});
    toast.success("All answers have been reset!");
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          Sorting your roadmap...
        </p>
      </div>
    );

  if (displayedQuizzes.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-10">
        <AlertCircle className="text-slate-300 mb-4" size={48} />
        <h3 className="text-xl font-bold text-slate-800">No MCQs Found</h3>
        <p className="text-slate-500 mt-2">
          {day
            ? `No quiz generated for Day ${day} yet.`
            : "Generate a quiz from your study plan to see it here."}
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 text-indigo-600 font-bold flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Go Back
          </button>
        )}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-4 z-50 mb-12 bg-white/80 backdrop-blur-md border border-slate-200 p-6 rounded-[2rem] shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-3 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ChevronLeft size={24} className="text-slate-600" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {day ? `Day ${day} Quiz` : "Mastery Bank"}
            </h1>
            <p className="text-slate-500 font-medium">
              {day
                ? "Focusing on today's objectives"
                : "All generated quizzes organized by day"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            disabled={Object.keys(selectedOptions).length === 0}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all ${
              Object.keys(selectedOptions).length === 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
            }`}
            title="Reset all answers"
          >
            <RotateCcw size={18} />
            <span className="font-bold text-sm">Reset</span>
          </button>

          <div className="flex items-center gap-4 bg-indigo-600 px-6 py-3 rounded-2xl text-white shadow-lg shadow-indigo-200">
            <Trophy size={20} className="text-indigo-200" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">
                Score
              </span>
              <span className="text-lg font-bold leading-none">
                {scoreStats.correctAnswers}{" "}
                <span className="text-indigo-300 font-medium text-sm">
                  / {scoreStats.totalQuestions}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {displayedQuizzes.map((quiz, groupIdx) => (
          <section key={quiz._id || groupIdx} className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <span className="font-black text-sm italic">D{quiz.day}</span>
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-xl tracking-tight">
                    Day {quiz.day} Challenge
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Generated on{" "}
                    {new Date(quiz.createdAt).toLocaleDateString(undefined, {
                      dateStyle: "long",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-8">
              {quiz.questions.map((q, qIdx) => {
                const questionId = `${quiz._id}-${qIdx}`;
                const correctIndex = q.options.indexOf(q.correctAnswer);
                const userSelection = selectedOptions[questionId];
                const isAnswered = userSelection !== undefined;

                return (
                  <div
                    key={questionId}
                    className={`transition-all duration-500 p-8 rounded-[2.5rem] border-2 ${
                      isAnswered
                        ? userSelection === correctIndex
                          ? "border-emerald-100 bg-emerald-50/20"
                          : "border-rose-100 bg-rose-50/20"
                        : "border-slate-50 bg-white"
                    }`}
                  >
                    <div className="flex gap-4 mb-6">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-black">
                        {qIdx + 1}
                      </span>
                      <div className="text-xl font-bold text-slate-800 leading-tight pt-1">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {q.question}
                        </ReactMarkdown>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-12">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = isAnswered && optIdx === correctIndex;
                        const isSelected = userSelection === optIdx;
                        const isWrong = isSelected && !isCorrect;

                        return (
                          <button
                            key={optIdx}
                            disabled={isAnswered}
                            onClick={() =>
                              setSelectedOptions({
                                ...selectedOptions,
                                [questionId]: optIdx,
                              })
                            }
                            className={`p-5 rounded-2xl border-2 text-left transition-all relative ${
                              isCorrect
                                ? "bg-emerald-500 border-emerald-500 text-white shadow-lg"
                                : isWrong
                                ? "bg-rose-500 border-rose-500 text-white shadow-md"
                                : isSelected
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50"
                            }`}
                          >
                            <div
                              className={`text-sm font-semibold prose prose-sm max-w-none ${
                                isSelected || isCorrect || isWrong
                                  ? "prose-invert"
                                  : ""
                              }`}
                            >
                              <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                              >
                                {opt}
                              </ReactMarkdown>
                            </div>
                            {isCorrect && (
                              <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-emerald-200" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* ONLY SHOW TIPS/BREAKDOWN IF ALL QUESTIONS IN VIEW ARE ANSWERED */}
                    {allQuestionsAnswered && (
                      <div className="space-y-6 mt-8 ml-12 animate-in fade-in slide-in-from-top-4 duration-700">
                        {/* Quick Tip Section */}
                        {q.quickTip && (
                          <div className="p-6 bg-amber-50/80 rounded-3xl border border-amber-100 shadow-sm flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                              <Clock className="text-amber-600" size={20} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-1">
                                Quick Tip 
                              </p>
                              <div className="text-sm text-amber-800 leading-relaxed font-medium">
                                <ReactMarkdown
                                  remarkPlugins={[remarkMath]}
                                  rehypePlugins={[rehypeKatex]}
                                >
                                  {q.quickTip}
                                </ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Explanation Section */}
                        <div className="p-6 bg-white/80 rounded-3xl border border-slate-100 shadow-sm flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                            <Info className="text-indigo-600" size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-1">
                              Concept Breakdown
                            </p>
                            <div className="text-sm text-slate-600 leading-relaxed italic prose prose-sm">
                              <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                              >
                                {q.explanation}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default MCQSection;