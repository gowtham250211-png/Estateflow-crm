import React from 'react';

export default function StatusBadge({ status }) {
  const styles = {
    NEW: 'bg-blue-50 text-blue-700 border-blue-200',
    CONTACTED: 'bg-purple-50 text-purple-700 border-purple-200',
    SITE_VISIT: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    INTERESTED: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    NEGOTIATION: 'bg-orange-50 text-orange-700 border-orange-200',
    BOOKED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    LOST: 'bg-rose-50 text-rose-700 border-rose-200',
    AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[status] || 'bg-slate-50 text-slate-700 border-slate-200'
      }`}
    >
      {status ? status.replace('_', ' ') : ''}
    </span>
  );
}