"use client";

import { useState } from "react";
import { FiLoader, FiUploadCloud } from "react-icons/fi";
import { FaBookOpen } from "react-icons/fa";
import { motion } from "framer-motion";
import { uploadBook } from "../lib/api";

export default function UploadUI({ onUploadSuccess }) {
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [filename, setFilename] = useState("");
  const [tempData, setTempData] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      setFilename(file.name);
      setLoading(true);
      try {
        const result = await uploadBook(file);
        if (result.success) {
          setUploaded(true);
          // Store the AI result locally in the component
          setTempData(result.data); 
        } else {
          alert(result.error || "Upload failed.");
        }
      } catch (error) {
        alert("Server error during upload.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please upload a PDF file.");
    }
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 rounded-3xl shadow-xl max-w-lg mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* LOADING OVERLAY */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl">
          <FiLoader className="text-5xl text-indigo-600 animate-spin mb-4" />
          <p className="text-indigo-900 font-semibold text-lg">AI is analyzing your PDF...</p>
          <p className="text-xs text-gray-500 mt-2">Extracting topics and generating your plan</p>
        </div>
      )}

      {!uploaded ? (
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-indigo-400 rounded-2xl p-10 w-full bg-white hover:bg-indigo-50 transition"
        >
          <FiUploadCloud className="text-6xl text-indigo-500 mb-4" />
          <h2 className="text-xl font-semibold text-indigo-900">Upload Your Study Notes</h2>
          <p className="text-sm text-gray-600 mt-2">PDF files only</p>
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />
        </label>
      ) : (
        <>
          <motion.div
            className="bg-green-50 border border-green-200 p-6 rounded-xl w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-lg font-bold text-green-700">
              {filename} is Ready!
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Your personalized study roadmap is generated.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 shadow-lg transition font-bold"
              onClick={() => onUploadSuccess(tempData)} // Critical: sends data back to Dashboard
            >
              <FaBookOpen />
              Learn Now
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  );
}