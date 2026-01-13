import { ChevronDown, ChevronRight, Check } from "lucide-react";

export default function Sidebar({
  localSchedule,
  expandedDayIdx,
  handleDayExpand,
  hydratingDays,
  expandedTopicIdx,
  setExpandedTopicIdx,
  selectedSubtopic,
  setSelectedSubtopic,
  setActiveQuiz,
  metaData,
}) {
  return (
    <div className="w-1/4 border-r p-4 overflow-y-auto bg-slate-50">
      <div className="mb-6 p-4 bg-indigo-600 rounded-2xl text-white shadow-lg">
        <p className="text-xs font-medium opacity-80 uppercase tracking-tighter">
          {metaData.subject}
        </p>
        <h2 className="text-lg font-bold truncate">{metaData.title}</h2>
      </div>

      <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Course Content
      </h3>

      <div className="space-y-2">
        {localSchedule.map((dayItem, dIdx) => (
          <div key={dIdx} className="mb-2">
            <button
              onClick={() => handleDayExpand(dIdx, dayItem.day)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                expandedDayIdx === dIdx
                  ? "bg-white border border-indigo-200 shadow-sm text-indigo-600"
                  : "hover:bg-indigo-50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                {hydratingDays[dayItem.day] ? (
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div
                    className={`w-2 h-2 rounded-full ${
                      expandedDayIdx === dIdx ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  />
                )}
                <span className="font-bold text-sm">DAY {dayItem.day}</span>
              </div>
              {expandedDayIdx === dIdx ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {expandedDayIdx === dIdx && (
              <div className="mt-2 ml-4 space-y-1 border-l-2 border-indigo-100 pl-2">
                {dayItem.topics.map((topic, tIdx) => (
                  <div key={tIdx}>
                    <button
                      onClick={() =>
                        setExpandedTopicIdx(
                          expandedTopicIdx === tIdx ? null : tIdx
                        )
                      }
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-gray-600 flex justify-between items-center hover:text-indigo-600"
                    >
                      <span className="truncate">{topic.title}</span>
                    </button>
                    {expandedTopicIdx === tIdx && (
                      <div className="ml-2 mt-1 space-y-1">
                        {topic.subtopics.map((sub, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => {
                              setSelectedSubtopic({
                                ...sub,
                                currentDay: dayItem.day,
                              });
                              setActiveQuiz(null);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs transition-all rounded-lg flex items-center justify-between ${
                              selectedSubtopic?._id === sub._id
                                ? "bg-indigo-100 text-indigo-700 font-bold"
                                : "text-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            <span
                              className={
                                sub.completed ? "line-through opacity-50" : ""
                              }
                            >
                              {sub.title}
                            </span>
                            {sub.completed && (
                              <Check size={12} className="text-emerald-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
