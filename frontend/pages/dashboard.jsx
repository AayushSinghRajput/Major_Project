"use client";

import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";
import DashboardShell from "../components/DashboardShell";
import { useAuth } from "../context/AuthContext";

// Tab Components
import Service from "./service";
import ProgressTracker from "./progresstracker";
import MCQSection from "./mcqsection";
import NotesSection from "./notesection";
import ChatPage from "./chatpage";
import DashboardContent from "../components/dashboardcontent";
import MockTest from "../components/MockTest";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showServiceView, setShowServiceView] = useState(false);
  const [aiPlan, setAiPlan] = useState(null);
  const { user } = useAuth();

  const handleUploadSuccess = (data) => {
    if (data) {
      setAiPlan(data);
      setShowServiceView(true);
    }
  };

  const renderContent = () => {
    if (showServiceView) return <Service planData={aiPlan} />;

    switch (activeTab) {
      case "dashboard":
        return <DashboardContent onUploadSuccess={handleUploadSuccess} />;

      case "progress":
        return (
          <DashboardShell
            title="Academic Metrics"
            subtitle="Visualizing your progress across the curriculum"
          >
            <ProgressTracker />
          </DashboardShell>
        );

      case "mcq":
        return (
          <DashboardShell
            title="Practice Center"
            subtitle="Master your subjects through active testing"
          >
            <MCQSection />
          </DashboardShell>
        );

      case "notes":
        return (
          <DashboardShell
            title="Study Vault"
            subtitle="Your personalized digital repository"
          >
            <NotesSection />
          </DashboardShell>
        );

      case "chat":
        return (
          <div className="flex flex-col h-[80vh] bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-100">
            <ChatPage />
          </div>
        );

      case "mock":
        return (
          <DashboardShell
            title="Mock Test"
            subtitle="Test your knowledge before the real exam"
          >
            <MockTest />
          </DashboardShell>
        );

      default:
        return (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🎓</div>
            <h3 className="text-2xl font-black text-slate-900">
              Select a Module
            </h3>
          </div>
        );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-5 md:p-10">
        <div className="flex flex-col md:flex-row mt-20 md:mt-24 px-2 md:px-6 gap-8 items-start">
          <aside className="w-full md:w-72 sticky top-28 h-fit hidden md:flex">
            <Sidebar
              user={user}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setShowServiceView={setShowServiceView}
            />
          </aside>
          <div className="w-full md:hidden mb-6">
            <Sidebar
              user={user}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setShowServiceView={setShowServiceView}
            />
          </div>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 w-full overflow-visible">
            <div className="max-w-6xl mx-auto">{renderContent()}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
