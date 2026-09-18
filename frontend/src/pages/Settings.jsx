import React, { useState } from 'react';

export default function Settings() {
  const [agencyName, setAgencyName] = useState('EstateFlow Real Estate Command');
  const [commissionRate, setCommissionRate] = useState('2.5');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
        <p className="text-xs text-slate-500">Manage agency defaults, team parameters, and server health</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl">
          ✓ Settings saved successfully.
        </div>
      )}

      {/* General Settings */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 uppercase tracking-wide">
          Agency Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase">Agency Brand Name</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase">Default Broker Commission (%)</label>
            <input
              type="number"
              step="0.1"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600 uppercase">Primary Sales Territory</label>
          <input
            type="text"
            defaultValue="Chennai Metropolitan Area"
            className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
        >
          Save Configuration
        </button>
      </form>

      {/* Backend Keep-Alive Monitor Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 uppercase tracking-wide">
          Server Telemetry & Keep-Alive
        </h2>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Keep-Alive Monitor Target</span>
          <span className="font-mono text-[11px] bg-slate-100 px-2 py-1 rounded-md text-slate-700">/api/health</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Cron Ping Interval</span>
          <span className="font-semibold text-slate-800">Every 10 minutes</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Target Container</span>
          <span className="text-emerald-600 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active (Warm State)
          </span>
        </div>
      </div>
    </div>
  );
}