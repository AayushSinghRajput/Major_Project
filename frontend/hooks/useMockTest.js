import { useState } from "react";
import toast from "react-hot-toast";
import { getMockTest } from "../lib/api";
import { calculateScore } from "../utils/calculateScore";

export const useMockTest = () => {
  const [examData, setExamData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const startTest = async (mockType) => {
    if (!mockType) {
      toast.error("Please select exam type");
      return;
    }
    try {
      const data = await getMockTest(mockType);
      if (!data.mocks || data.mocks.length === 0) {
        toast.error("No mock test found");
        return;
      }
      setExamData(data.mocks[0]);
      setCurrentQuestion(0);
      setAnswers({});
      setScore(0);
      setShowResult(false);
      toast.success("Mock test started");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load mock test");
    }
  };

  const selectAnswer = (option) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: option }));
  };

  const prevQuestion = () => {
  if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
};


  const nextQuestion = () => {
    if (currentQuestion < examData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const submitTest = () => {
    const total = calculateScore(examData.questions, answers);
    setScore(total);
    setShowResult(true);
  };

  return {
    examData,
    currentQuestion,
    answers,
    score,
    showResult,
    startTest,
    selectAnswer,
    prevQuestion,
    nextQuestion,
    submitTest,
  };
};
