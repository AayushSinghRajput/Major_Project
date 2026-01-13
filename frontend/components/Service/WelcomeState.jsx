import { BookOpen } from "lucide-react";

export default function WelcomeState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-20">
      <div className="w-64 h-64 bg-indigo-50 rounded-full flex items-center justify-center mb-8 animate-pulse">
        <BookOpen size={80} className="text-indigo-200" />
      </div>
      <h3 className="text-3xl font-black text-gray-900">
        Your Study Plan is Ready
      </h3>
      <p className="text-gray-500 mt-4 max-w-md mx-auto text-lg">
        Select a Day or a Lesson to begin.
      </p>
    </div>
  );
}
