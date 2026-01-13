"use client";
import UploadUI from "./uploadui";

export default function DashboardContent({ onUploadSuccess }) {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-300">
      <div className="flex justify-center items-center h-full px-6 py-12">
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome to SmartPrep AI!</h2>
          <p className="text-gray-600">Start by uploading a textbook or notes to generate an AI study plan.</p>
          <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100">
            {/* We use onUploadSuccess which we received from props */}
            <UploadUI onUploadSuccess={onUploadSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}