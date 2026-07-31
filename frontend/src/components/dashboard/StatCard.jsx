function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all duration-200 flex justify-between items-center group">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-500 transition-colors">
          {title}
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          {value}
        </h2>
      </div>

      <div className="w-12 h-12 rounded-2xl bg-slate-50 text-2xl flex items-center justify-center group-hover:bg-blue-50/50 transition-colors">
        {icon}
      </div>
    </div>
  );
}

export default StatCard;