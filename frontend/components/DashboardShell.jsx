export default function DashboardShell({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm p-8 border border-slate-100">
      {title && (
        <header className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{title}</h2>
          {subtitle && <p className="text-slate-500 font-medium">{subtitle}</p>}
        </header>
      )}
      {children}
    </div>
  );
}