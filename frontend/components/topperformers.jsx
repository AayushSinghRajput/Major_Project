"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TopPerformers = () => {
  const [showAll, setShowAll] = useState(false);

  const topStudents = [
    {
      id: 1,
      name: "Ashmita Karki",
      course: "Physics Grade 12",
      completionDate: "2023-06-15",
      score: "98%",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      badge: "🥇",
    },
    {
      id: 2,
      name: "Rohan Shrestha",
      course: "Chemistry Grade 12",
      completionDate: "2023-06-10",
      score: "96%",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      badge: "🥈",
    },
    {
      id: 3,
      name: "Sita Maharjan",
      course: "Biology Grade 12",
      completionDate: "2023-06-05",
      score: "95%",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      badge: "🥉",
    },
    {
      id: 4,
      name: "Aarav Pandey",
      course: "Mathematics Grade 12",
      completionDate: "2023-05-28",
      score: "97%",
      avatar: "https://randomuser.me/api/portraits/men/54.jpg",
      badge: "🏅",
    },
    {
      id: 5,
      name: "Priya Gurung",
      course: "English Grade 12",
      completionDate: "2023-05-20",
      score: "94%",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      badge: "🏅",
    },
  ];

  const visibleStudents = showAll ? topStudents : topStudents.slice(0, 2);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
          🏆 Top Performers
        </h2>
        <p className="text-gray-600">
          Students who completed courses with 100% progress
        </p>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 mb-6"
      >
        <AnimatePresence>
          {visibleStudents.map((student, index) => (
            <motion.div
              key={student.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                index < 3
                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center">
                {/* Badge */}
                <motion.div
                  className="text-3xl mr-4 w-12 flex justify-center"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {student.badge}
                </motion.div>

                {/* Avatar */}
                <motion.div
                  className="relative mr-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <motion.div
                    className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    ✓
                  </motion.div>
                </motion.div>

                {/* Student Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.course}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <motion.div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                    <span className="text-xs font-bold text-green-600">
                      100%
                    </span>
                  </div>
                </div>

                {/* Score and Date */}
                <div className="text-right ml-4">
                  <motion.div
                    className="text-lg font-bold text-indigo-700"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: index * 0.1 }}
                  >
                    {student.score}
                  </motion.div>
                  <div className="text-xs text-gray-500">
                    {new Date(student.completionDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Toggle Button */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={toggleShowAll}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto"
        >
          {showAll ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Show Less
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              View More ({topStudents.length - 2})
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Stats Footer */}
      <motion.div
        className="pt-6 border-t border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            {
              value: topStudents.length,
              color: "indigo-600",
              label: "Top Performers",
            },
            { value: "100%", color: "purple-600", label: "Average Completion" },
            {
              value: `${Math.round(
                topStudents.reduce(
                  (acc, student) => acc + parseInt(student.score),
                  0
                ) / topStudents.length
              )}%`,
              color: "green-600",
              label: "Average Score",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <div className={`text-2xl font-bold text-${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TopPerformers;
