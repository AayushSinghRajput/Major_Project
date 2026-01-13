import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TEST_DURATION } from "../lib/constants";

export const useExamTimer = (isRunning, onTimeOver) => {
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft === 0) {
      toast.error("⏰ Time Over! Test auto-submitted.");
      onTimeOver();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onTimeOver]);

  const resetTimer = () => setTimeLeft(TEST_DURATION);

  return { timeLeft, resetTimer };
};
