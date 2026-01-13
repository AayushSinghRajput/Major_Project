"use client";

import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Loader2, AlertCircle } from "lucide-react";
import { getUserStudyPlans } from "../lib/api";
import toast from "react-hot-toast";

ChartJS.register(ArcElement, Tooltip, Legend);

function ProgressCard({ course }) {
  const currentProgress = (course.progress) || 0;
  // Chart configurations that respond to the course.progress percentage
  const doughnutData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        // This makes the blue part of the circle grow as progress increases
        data: [currentProgress, 100 - currentProgress],
        backgroundColor: ["#6366F1", "#E0E7FF"],
        hoverBackgroundColor: ["#4F46E5", "#F1F5F9"],
        borderWidth: 0,
        cutout: "80%", // Creates the "donut" look
      },
    ],
  };

  const chartOptions = {
    plugins: {
      tooltip: { enabled: false }, // Cleaner look without tooltips
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 max-w-md mx-auto mb-6 w-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="p-2 bg-indigo-50 rounded-xl text-xl leading-none">
              {course.icon || "📖"}
            </span>
            {course.name}
          </h2>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest ml-1">
            {course.category || "Study Plan"}
          </p>
        </div>
        <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">
          {course.duration}
        </span>
      </div>

      {/* Dynamic Circular Progress */}
      <div className="relative w-[180px] h-[180px] mx-auto flex items-center justify-center mb-6">
        <Doughnut key={course.progress} data={doughnutData} options={chartOptions} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-900 leading-none">
            {course.progress}%
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">
            Finished
          </span>
        </div>
      </div>

      {/* Dynamic Horizontal Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${course.progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Milestones
          </span>
          <span className="text-sm font-bold text-indigo-600">
            {course.lessonsCompleted} / {course.totalLessons} Units
          </span>
        </div>
        <div className="text-right">
            <span className={`text-xs font-black px-2 py-1 rounded-md ${
                course.progress === 100 ? "bg-emerald-100 text-emerald-700" : "bg-indigo-50 text-indigo-700"
            }`}>
                {course.progress === 100 ? "COMPLETED" : "IN PROGRESS"}
            </span>
        </div>
      </div>
    </div>
  );
}

export default function ProgressTracker() {
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const res = await getUserStudyPlans();
        if (res && res.success && res.data) {
          const mappedData = res.data.map((plan) => {
            let total = 0;
            let completed = 0;

            if (plan.schedule) {
              plan.schedule.forEach((day) => {
                day.topics.forEach((topic) => {
                  topic.subtopics.forEach((sub) => {
                    total++;
                    if (sub.completed) completed++;
                  });
                });
              });
            }

            return {
              id: plan._id,
              name: plan.subject || "Untitled Plan",
              category: plan.category || "Academic Plan",
              // Use plan.progress directly from backend calculation
              progress: plan.progress || 0,
              duration: `Day ${plan.schedule?.length || 0}`,
              lessonsCompleted: completed,
              totalLessons: total,
              icon: "📚",
            };
          });
          setCourseData(mappedData);
        } else {
          setCourseData([]);
        }
      } catch (error) {
        toast.error("Failed to load progress metrics");
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();

    // Add this: Refetch when the user refocuses the tab
  window.addEventListener("focus", fetchProgress);
  return () => window.removeEventListener("focus", fetchProgress);
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
        <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Syncing Progress</h3>
            <p className="text-slate-400 text-sm">Calculating your study metrics...</p>
        </div>
      </div>
    );

  if (courseData.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-12 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
          <AlertCircle className="text-slate-300" size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">No Analytics Available</h3>
        <p className="text-slate-500 mt-3 max-w-sm mx-auto leading-relaxed">
          You haven't started any study plans yet. Generate a roadmap from a PDF to track your journey here.
        </p>
      </div>
    );

  const visibleCourses = showAll ? courseData : courseData.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Learning Journey
        </h1>
        <p className="text-slate-500 font-medium">Visualizing your academic growth across all modules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleCourses.map((course) => (
          <ProgressCard key={course.id} course={course} />
        ))}
      </div>

      {courseData.length > 3 && (
        <div className="text-center mt-16">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-12 py-4 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-xl font-bold uppercase tracking-[0.2em] text-xs"
          >
            {showAll ? "Show Featured" : `Expand Library (${courseData.length})`}
          </button>
        </div>
      )}
    </div>
  );
}