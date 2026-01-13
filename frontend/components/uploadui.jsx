"use client";

import { useState } from "react";
import { FiLoader, FiUploadCloud } from "react-icons/fi";
import { FaBookOpen } from "react-icons/fa";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { uploadPdfAndGenerateSchedule } from "../api/pdf";

export default function UploadUI({ onUploadSuccess }) {
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null); // store file object
  const [filename, setFilename] = useState("");
  const [days, setDays] = useState(""); // store number of study days
  const [tempData, setTempData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }

    setPdfFile(file);
    setFilename(file.name);
  };

  const handleDaysChange = (e) => {
    let value = e.target.value;
    // Remove leading zeros
    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, "");
    }
    setDays(value);
  };

  const handleLearnNow = async () => {
    if (!pdfFile) {
      toast.error("Please select a PDF file first.");
      return;
    }

    const numDays = Number(days);
    if (!numDays || numDays <= 0) {
      toast.error("Number of days must be greater than 0.");
      return;
    }

    setLoading(true);

    try {
      const result = await uploadPdfAndGenerateSchedule(pdfFile, numDays);
      if (result.success) {
        console.log("API Response:",result); //debug log
        setTempData(result);
        toast.success("Study schedule generated successfully!");
        onUploadSuccess(result); // send schedule back to parent
      } else {
        toast.error(result.message || "Upload failed.");
      }
    } catch (error) {
      toast.error("Server error during upload.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 rounded-3xl shadow-xl max-w-lg mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 🔔 Toaster for toast messages */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl">
          <FiLoader className="text-5xl text-indigo-600 animate-spin mb-4" />
          <p className="text-indigo-900 font-semibold text-lg">AI is analyzing your PDF...</p>
          <p className="text-xs text-gray-500 mt-2">Extracting topics and generating your plan</p>
        </div>
      )}

      {/* PDF UPLOAD SECTION */}
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-indigo-400 rounded-2xl p-10 w-full bg-white hover:bg-indigo-50 transition"
      >
        <FiUploadCloud className="text-6xl text-indigo-500 mb-4" />
        {!filename ? (
          <>
            <h2 className="text-xl font-semibold text-indigo-900">Upload Your Study Notes</h2>
            <p className="text-sm text-gray-600 mt-2">PDF files only</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-indigo-900">Selected PDF:</h2>
            <p className="text-sm text-gray-700 mt-2 font-medium">{filename}</p>
          </>
        )}
        <input
          id="file-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />
      </label>

      {/* DAYS INPUT (below PDF upload, same width) */}
      <div className="mt-4 w-full flex justify-center">
        <input
          type="number"
          min={1}
          value={days}
          onChange={handleDaysChange}
          className="border border-indigo-300 rounded-lg p-2 w-full text-center text-indigo-900 font-semibold placeholder-indigo-400"
          placeholder="Enter number of study days"
        />
      </div>

      {/* LEARN NOW BUTTON */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 w-full">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 shadow-lg transition font-bold"
          onClick={handleLearnNow}
          disabled={loading || !pdfFile || !days}
        >
          <FaBookOpen />
          Learn Now
        </motion.button>
      </div>
    </motion.div>
  );
}
