import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
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
        <p className="text-xs text-slate-500">Manage your account and agency defaults</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl">
          ✓ Settings saved successfully.
        </div>
      )}

      {/* Account Profile */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 uppercase tracking-wide">
          Account Profile
        </h2>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-xl">
            {(user?.name || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">{user?.name || 'Unknown User'}</div>
            <div className="text-xs text-slate-500">{user?.email || '—'}</div>
            <span className="inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
              {user?.role === 'ADMIN' ? 'Administrator' : user?.role === 'SALES_EMPLOYEE' ? 'Sales Employee' : user?.role || 'Unknown'}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          Your name, email, and role are managed by your administrator and can't be changed here.
        </p>
      </div>

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
    </div>
  );
}
