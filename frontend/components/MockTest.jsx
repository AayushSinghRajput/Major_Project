"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Toaster } from "react-hot-toast";

import { useMockTest } from "../hooks/useMockTest";
import { useExamTimer } from "../hooks/useExamTimer";
import { formatTime } from "../utils/formatTime";

export default function MockTest() {
  const {
    examData,
    currentQuestion,
    answers,
    score,
    showResult,
    startTest,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    submitTest,
  } = useMockTest();

  const { timeLeft, resetTimer } = useExamTimer(Boolean(examData), () => {
    submitTest();
    resetTimer();
  });

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <h1 className="text-3xl font-bold text-emerald-600 mb-4">
            🎉 Test Completed
          </h1>
          <p className="text-2xl font-semibold mb-6">Score: {score}</p>
          <button
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl"
            onClick={() => startTest(examData.mock_type)}
          >
            Retake Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50 flex justify-center items-center p-4">
      <Toaster />

      <div className="bg-white max-w-4xl w-full p-8 rounded-3xl shadow-lg">
        {!examData ? (
          <>
            <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
              🧠 Mock Test
            </h1>

            <select
              className="w-full border p-3 rounded-xl mb-4 text-lg"
              onChange={(e) => startTest(e.target.value)}
            >
              <option value="">Select Exam</option>
              <option value="Engineering">Engineering</option>
              <option value="Medical">Medical</option>
            </select>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg">
                Q {currentQuestion + 1}/{examData?.questions?.length ?? 0}
              </span>
              <span className="font-bold text-red-600 text-lg">
                ⏱ {formatTime(timeLeft)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-gray-200 rounded-full mb-6">
              <div
                className="h-3 bg-indigo-600 rounded-full transition-all"
                style={{
                  width: `${((currentQuestion + 1) / examData?.questions?.length) * 100}%`,
                }}
              ></div>
            </div>

            {/* Question */}
            <div className="text-lg mb-6">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {examData?.questions?.[currentQuestion]?.question_text ?? ""}
              </ReactMarkdown>
            </div>

            {/* Options */}
            <div className="grid gap-4 mb-6">
              {examData?.questions?.[currentQuestion]?.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => selectAnswer(opt)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                    answers[currentQuestion] === opt
                      ? "bg-indigo-600 text-white font-semibold"
                      : "hover:bg-indigo-50"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {opt}
                  </ReactMarkdown>
                </button>
              ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className={`px-6 py-2 rounded-xl ${
                  currentQuestion === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
              >
                Previous
              </button>

              <button
                onClick={
                  currentQuestion === (examData?.questions?.length ?? 1) - 1
                    ? submitTest
                    : nextQuestion
                }
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700"
              >
                {currentQuestion === (examData?.questions?.length ?? 1) - 1
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
