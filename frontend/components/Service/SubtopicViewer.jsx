import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Sparkles, CheckCircle, RotateCcw, Check } from "lucide-react";

export default function SubtopicViewer({
  subtopic,
  generatingDay,
  generatingMCQ,
  isToggling,
  handleGenerateDayNote,
  handleGenerateMCQ,
  handleToggleComplete,
}) {
  return (
    <div className="max-w-3xl mx-auto py-16 px-10">
      <h1 className="text-4xl font-black text-gray-900 mb-8 leading-tight">
        {subtopic.title}
      </h1>

      <div className="prose prose-indigo max-w-none mb-10">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {subtopic.description}
        </ReactMarkdown>
      </div>

      {subtopic.images && subtopic.images.length > 0 && (
        <div className="mb-12 space-y-6">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            Visual Aids <Sparkles size={14} className="text-indigo-400" />
          </h4>
          <div className="grid grid-cols-1 gap-6">
            {subtopic.images.map((img, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-xl"
              >
                {/* Main Image */}
                <img
                  src={img.base64Data}
                  alt={`Diagram for ${subtopic.title}`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />

                {/* Unsplash Attribution Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-white text-xs opacity-90">
                    Photo by{" "}
                    <a
                      href={`${img.photographerUrl}?utm_source=your_app_name&utm_medium=referral`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-indigo-300"
                    >
                      {img.photographerName || "Contributor"}
                    </a>{" "}
                    on{" "}
                    <a
                      href="https://unsplash.com/?utm_source=your_app_name&utm_medium=referral"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-indigo-300"
                    >
                      Unsplash
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="border-t pt-8 flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <button
            disabled={generatingDay === subtopic.currentDay}
            onClick={() => handleGenerateDayNote(subtopic.currentDay)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-full font-bold hover:bg-indigo-100 transition-all disabled:opacity-50 border border-indigo-100"
          >
            {generatingDay === subtopic.currentDay ? (
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            Generate AI Note
          </button>

          <button
            disabled={generatingMCQ === subtopic.currentDay}
            onClick={() => handleGenerateMCQ(subtopic.currentDay)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-full font-bold hover:bg-emerald-100 transition-all disabled:opacity-50 border border-emerald-100"
          >
            {generatingMCQ === subtopic.currentDay ? (
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle size={18} />
            )}
            Take Day Quiz
          </button>
        </div>

        <button
          onClick={() =>
            handleToggleComplete(subtopic.currentDay, subtopic.title)
          }
          disabled={isToggling}
          className={`flex items-center gap-2 px-10 py-4 rounded-full font-black transition-all shadow-md ${
            subtopic.completed
              ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
          }`}
        >
          {isToggling ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : subtopic.completed ? (
            <>
              <RotateCcw size={20} /> Mark as Incomplete
            </>
          ) : (
            <>
              <Check size={20} /> Mark as Completed
            </>
          )}
        </button>
      </div>
    </div>
  );
}
