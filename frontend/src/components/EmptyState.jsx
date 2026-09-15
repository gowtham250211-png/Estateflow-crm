import React from 'react';

export default function EmptyState({ message = 'No data available.' }) {
  return (
    <div className="text-center py-12 text-slate-400 text-sm font-medium border border-dashed rounded-xl">
      {message}
    </div>
  );
}