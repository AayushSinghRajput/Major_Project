"use client";

import Sidebar from "../components/Service/Sidebar";
import SubtopicViewer from "../components/Service/SubtopicViewer";
import WelcomeState from "../components/Service/WelcomeState";
import MCQSection from "./mcqsection";
import { useServiceLogic } from "../hooks/useServiceLogic";

export default function Service({ planData }) {
  const { state, actions } = useServiceLogic(planData);

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
