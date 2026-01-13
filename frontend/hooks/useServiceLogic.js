import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  sendContext,
  getMCQs,
  toggleSubtopicProgress,
  hydrateDayWithImages,
} from "../lib/api";

export function useServiceLogic(planData) {
  const [localSchedule, setLocalSchedule] = useState([]);
  const [expandedDayIdx, setExpandedDayIdx] = useState(null);
  const [expandedTopicIdx, setExpandedTopicIdx] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [generatingDay, setGeneratingDay] = useState(null);
  const [generatingMCQ, setGeneratingMCQ] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const [hydratingDays, setHydratingDays] = useState({});

  console.log("useServiceLogic - planData received:", planData); // Debug log

  // Initialize schedule from planData
  useEffect(() => {
    if (planData?.schedule) {
      console.log("Setting localSchedule:", planData.schedule); // Debug log
      setLocalSchedule(planData.schedule);
    } else {
      console.log("No schedule in planData:", planData); // Debug log
      setLocalSchedule([]);
    }
  }, [planData]);

  const metaData = {
    subject: planData?.subject || "Study Material",
    title: planData?.bookTitle || "Your PDF",
    fileHash: planData?.pdf_hash || planData?.fileHash || "default_hash",
    planId: planData?._id || planData?.id || "temp-id",
  };

  console.log("metaData:", metaData); // Debug log
  console.log("localSchedule:", localSchedule); // Debug log

  const handleDayExpand = async (idx, dayNum) => {
    const isExpanding = expandedDayIdx !== idx;

    if (isExpanding) {
      setExpandedDayIdx(idx);
      setExpandedTopicIdx(null);
      setSelectedSubtopic(null);

      // If closing the previous day, collapse it first
      if (expandedDayIdx !== null) {
        const prevDay = localSchedule[expandedDayIdx]?.day;
        setHydratingDays((prev) => ({ ...prev, [prevDay]: false }));
      }

      // Check if day exists in schedule
      const dayItem = localSchedule[idx];
      if (!dayItem?.topics || dayItem.topics.length === 0) {
        toast.error("No topics found for this day");
        return;
      }

      const firstSubtopic = dayItem.topics[0]?.subtopics?.[0];

      // Logic to check if we need to fetch images (hydration)
      const needsHydration =
        !firstSubtopic?.images ||
        firstSubtopic.images.length === 0 ||
        typeof firstSubtopic.images[0] === "string";

      if (needsHydration && !hydratingDays[dayNum] && metaData.planId) {
        const toastId = `hydrate-${dayNum}`;

        try {
          setHydratingDays((prev) => ({ ...prev, [dayNum]: true }));

          toast.loading(`Generating educational diagrams...`, {
            id: toastId,
          });

          const res = await hydrateDayWithImages(metaData.planId, dayNum);

          if (res.success) {
            // Update the local schedule with the new data containing image objects
            const updatedSchedule = localSchedule.map((d) =>
              d.day === dayNum ? res.data : d
            );
            setLocalSchedule(updatedSchedule);

            // Update the selected subtopic if it's from this day
            if (selectedSubtopic && selectedSubtopic.currentDay === dayNum) {
              for (let t of res.data.topics) {
                const freshSubtopic = t.subtopics.find(
                  (s) => s.title === selectedSubtopic.title
                );
                if (freshSubtopic) {
                  setSelectedSubtopic({ ...freshSubtopic, currentDay: dayNum });
                }
              }
            }

            toast.success("Generated successfully created your diagrams!", {
              id: toastId,
            });
          } else {
            toast.error("Couldn't generate images right now.", {
              id: toastId,
            });
          }
        } catch (err) {
          console.error("Hydration Error:", err);
          toast.error("Connection error. Please try again.", { id: toastId });
        } finally {
          setHydratingDays((prev) => ({ ...prev, [dayNum]: false }));
        }
      }
    } else {
      setExpandedDayIdx(null);
      setExpandedTopicIdx(null);
      setSelectedSubtopic(null);
    }
  };

  const handleToggleComplete = async (day, subtopicTitle) => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      const res = await toggleSubtopicProgress(
        metaData.planId,
        day,
        subtopicTitle
      );
      if (res.success) {
        const updatedSchedule = localSchedule.map((d) =>
          d.day === day
            ? {
                ...d,
                topics: d.topics.map((t) => ({
                  ...t,
                  subtopics: t.subtopics.map((st) =>
                    st.title === subtopicTitle
                      ? { ...st, completed: res.completed }
                      : st
                  ),
                })),
              }
            : d
        );
        setLocalSchedule(updatedSchedule);
        setSelectedSubtopic(
          (prev) =>
            prev && {
              ...prev,
              completed: res.completed,
            }
        );
        toast.success(
          res.completed ? "Marked as completed!" : "Reset to incomplete"
        );
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setIsToggling(false);
    }
  };

  const handleGenerateMCQ = async (dayNum) => {
    const dayItem = localSchedule.find((d) => d.day === dayNum);
    if (!dayItem) return;
    setGeneratingMCQ(dayNum);
    setActiveQuiz(null);

    const combinedContext = dayItem.topics
      .map((t) =>
        t.subtopics
          .map((s) => `${s.title}: ${s.content || s.description || ""}`)
          .join("\n")
      )
      .join("\n\n");

    try {
      const res = await getMCQs(combinedContext, metaData.fileHash, dayNum);
      if (res.success) {
        setActiveQuiz({ day: dayNum, fileHash: metaData.fileHash });
        setSelectedSubtopic(null);
        setExpandedDayIdx(null);
        setExpandedTopicIdx(null);
      } else {
        toast.error("Failed to generate MCQs");
      }
    } catch (err) {
      console.error("MCQ Generation Error:", err);
      toast.error("Quiz generation failed");
    } finally {
      setGeneratingMCQ(null);
    }
  };

  const handleGenerateDayNote = async (dayNum) => {
    const dayItem = localSchedule.find((d) => d.day === dayNum);
    if (!dayItem) return;
    setGeneratingDay(dayNum);

    const combinedContext = dayItem.topics
      .map((t) =>
        t.subtopics
          .map((s) => `${s.title}: ${s.content || s.description || ""}`)
          .join("\n")
      )
      .join("\n\n");

    try {
      const res = await sendContext(combinedContext, metaData.fileHash, dayNum);
      if (res.success) toast.success(`Note saved successfully!`);
      else toast.error("Failed to save note");
    } catch (err) {
      console.error("Note Generation Error:", err);
      toast.error("Note generation failed");
    } finally {
      setGeneratingDay(null);
    }
  };

  return {
    state: {
      localSchedule,
      expandedDayIdx,
      expandedTopicIdx,
      selectedSubtopic,
      generatingDay,
      generatingMCQ,
      activeQuiz,
      isToggling,
      hydratingDays,
      metaData,
    },
    actions: {
      setExpandedTopicIdx,
      setSelectedSubtopic,
      setActiveQuiz,
      handleDayExpand,
      handleToggleComplete,
      handleGenerateMCQ,
      handleGenerateDayNote,
    },
  };
}
