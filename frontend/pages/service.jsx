"use client";

import Sidebar from "../components/Service/Sidebar";
import SubtopicViewer from "../components/Service/SubtopicViewer";
import WelcomeState from "../components/Service/WelcomeState";
import MCQSection from "./mcqsection";
import { useServiceLogic } from "../hooks/useServiceLogic";
import { useEffect } from "react";

export default function Service({ planData, onScheduleUpdate }) {
  console.log("Service component received planData:", planData); // Debug log
  
  const { state, actions } = useServiceLogic(planData);
  
  // when we receive the schedule data
  useEffect(() => {
    console.log("Service useEffect - planData:", planData); // Debug log
    if (planData?.schedule) {
      onScheduleUpdate?.(planData.schedule);
    }
  }, [planData, onScheduleUpdate]);

  if (!planData || !planData.schedule || planData.schedule.length === 0) {
    return (
      <div className="flex w-full h-screen bg-white overflow-hidden items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">📚</div>
          <h3 className="text-2xl font-bold text-slate-900">No Schedule Available</h3>
          <p className="text-slate-600 mt-2">
            Please upload a PDF to generate a study schedule.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen bg-white overflow-hidden">
      <Sidebar {...state} {...actions} />

      <div className="w-3/4 h-full overflow-y-auto bg-white relative">
        {state.activeQuiz ? (
          <div className="py-10">
            <MCQSection
              day={state.activeQuiz.day}
              fileHash={state.activeQuiz.fileHash}
              onBack={() => actions.setActiveQuiz(null)}
            />
          </div>
        ) : state.selectedSubtopic ? (
          <SubtopicViewer
            subtopic={state.selectedSubtopic}
            {...state}
            {...actions}
          />
        ) : (
          <WelcomeState />
        )}
      </div>
    </div>
  );
}