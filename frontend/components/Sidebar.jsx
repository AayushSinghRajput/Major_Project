import { DASHBOARD_TABS } from "../lib/constants";
import { formatAcademicId, getCleanUsername } from "../lib/utils";

export default function Sidebar({ user, activeTab, setActiveTab, setShowServiceView }) {
  return (
    <div className="w-full md:w-72 bg-white shadow-xl md:rounded-2xl p-6 flex flex-col border border-indigo-50">
      {/* Profile Section */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-600 to-purple-400 rounded-full blur opacity-10"></div>
          <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto shadow-sm border-4 border-white">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-700 text-4xl font-black">
                {getCleanUsername(user).charAt(0)}
              </div>
            )}
          </div>
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">{getCleanUsername(user)}</h2>
        <p className="text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
          {user?.publicMetadata?.role || "Science Student"}
        </p>

        {/* Academic ID */}
        <div className="mt-4 flex flex-col items-center">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Institutional ID</span>
          <div className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-sm font-mono font-bold text-slate-700 tracking-tight">
              {formatAcademicId(user?._id || user?.id, user?.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {DASHBOARD_TABS.map((tab) => (
          <button
            key={tab.name}
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === tab.name
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
            onClick={() => {
              setShowServiceView(false);
              setActiveTab(tab.name);
            }}
          >
            <span className="mr-3 text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="mt-8 pt-4 border-t border-slate-100 text-center">
        <span className="text-[10px] font-bold text-slate-300 tracking-tighter uppercase">Academic Standard 2026</span>
      </div>
    </div>
  );
}