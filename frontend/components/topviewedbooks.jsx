"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import books from "../assets/data/topviewedbooks.json";
import { getGlobalPlan } from "../lib/api";
import StudyPlanModal from "../components/PredefinedPlan/StudyPlanModal"; 
import toast from "react-hot-toast";

export default function TopViewedBooks() {
  const [showAll, setShowAll] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const visibleBooks = showAll ? books : books.slice(0, 3);

const handleViewDetails = async (subject) => {
  if (!subject) {
    toast.error("Subject name is missing for this card.");
    return;
  }

  setLoading(true);
  try {
    const data = await getGlobalPlan(subject);
    setSelectedPlan(data);
    setIsModalOpen(true);
    toast.success(`${subject} plan loaded successfully!`);
  } catch (error) {
    console.error("Failed to fetch plan:", error);
    toast.error("Study plan not found for this subject yet.");
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.div className="p-8 bg-white rounded-2xl shadow-lg max-w-6xl mx-auto border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-800 mb-2">📚 Predefined Study Plans</h2>
        <p className="text-indigo-600">Entrance Preparation Master Plans</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {visibleBooks.map((book) => (
            <motion.div
              key={book.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col"
            >
              {/* Rating - Top Right */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm z-10 flex items-center gap-1">
                <span className="text-yellow-500 text-sm">⭐</span>
                <span className="text-xs font-bold text-gray-700">{book.rating || "N/A"}</span>
              </div>

              <img src={book.img} alt={book.subject} className="h-52 w-full object-cover" />
              
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{book.subject}</h3>
                
                {/* Views and Plan Button Row */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">
                    👁️ {book.views}
                  </span>
                  <button
                    onClick={() => handleViewDetails(book.subject)}
                    disabled={loading}
                    className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all font-semibold shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {loading ? "..." : "View Plan"}
                  </button>
                </div>

                {/* Author Section - Below the row */}
                <div className="pt-3 border-t border-indigo-100 mt-auto">
                  <p className="text-xs text-gray-500 italic">
                    Author: <span className="text-indigo-700 font-medium">{book.author || "Unknown"}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal for 30-Day Details */}
      <AnimatePresence>
        {isModalOpen && (
          <StudyPlanModal 
            plan={selectedPlan} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>

      <div className="mt-8 text-center">
        <button 
          onClick={() => setShowAll(!showAll)} 
          className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold transition-colors shadow-lg"
        >
          {showAll ? "Show Less" : `View More (${books.length - 3})`}
        </button>
      </div>
    </motion.div>
  );
}