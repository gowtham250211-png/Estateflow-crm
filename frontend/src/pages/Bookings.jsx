import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import Loading from '../components/Loading';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getAll()
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  }, []);

  const totalLockedRevenue = bookings.reduce((sum, b) => sum + (b.unit?.price || 0), 0);

  if (loading) return <Loading />;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 text-slate-800">
      
      {/* Telemetry Header */}
      <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Closed Bookings Register</h1>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              {bookings.length} Locked
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official immutable registry of sales secured via database row-level locking
          </p>
        </div>
        
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Booked Gross</span>
          <span className="text-2xl font-black text-blue-600 font-mono">
            ₹{(totalLockedRevenue / 10000000).toFixed(2)} Cr
          </span>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
            <tr>
              <th className="p-4">Customer Lead</th>
              <th className="p-4">Assigned Unit</th>
              <th className="p-4">Project & Location</th>
              <th className="p-4">Deal Value</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4 text-right">Protection Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-10 text-center text-slate-400">
                  No confirmed bookings recorded yet.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-800 text-sm">{b.lead?.name || 'Client Lead'}</div>
                    <div className="text-[11px] text-slate-400">{b.lead?.phone} • {b.lead?.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200 font-mono text-xs">
                      {b.unit?.unitNumber} ({b.unit?.type})
                    </span>
                  </td>
                  <td className="p-4 text-slate-700">
                    <div className="font-bold text-slate-800">{b.unit?.building?.project?.name}</div>
                    <div className="text-[11px] text-slate-400">{b.unit?.building?.name}</div>
                  </td>
                  <td className="p-4 font-black text-slate-900 text-sm font-mono">
                    ₹{((b.unit?.price || 0) / 100000).toFixed(2)} L
                  </td>
                  <td className="p-4 text-slate-500 text-[11px]">
                    {b.bookingDate ? new Date(b.bookingDate).toLocaleString() : 'Just now'}
                  </td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {b.status} 🔒
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}