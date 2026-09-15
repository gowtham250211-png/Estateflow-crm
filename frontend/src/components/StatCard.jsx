import React from 'react';

export default function StatCard({ label, val, sub, subColor = 'text-slate-500' }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">{label}</span>
      <div className="text-3xl font-extrabold text-slate-800 my-1">{val}</div>
      <div className={`text-xs font-semibold ${subColor}`}>{sub}</div>
    </div>
  );
}