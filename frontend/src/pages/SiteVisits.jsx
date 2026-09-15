import React, { useState } from 'react';

export default function SiteVisits() {
  const [visits, setVisits] = useState([
    { id: 1, leadName: 'Arun Kumar', project: 'Green Valley Residency', unitType: '2 BHK', date: '2026-09-16', time: '11:00 AM', status: 'SCHEDULED' },
    { id: 2, leadName: 'Priya Sharma', project: 'Green Valley Residency', unitType: '3 BHK', date: '2026-09-16', time: '02:30 PM', status: 'CONFIRMED' },
    { id: 3, leadName: 'Karthik Raja', project: 'Skyline Residency', unitType: '2 BHK', date: '2026-09-17', time: '10:00 AM', status: 'SCHEDULED' },
  ]);

  const [leadName, setLeadName] = useState('');
  const [project, setProject] = useState('Green Valley Residency');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleAddVisit = (e) => {
    e.preventDefault();
    setVisits([
      ...visits,
      { id: Date.now(), leadName, project, unitType: '2 BHK', date, time, status: 'SCHEDULED' },
    ]);
    setLeadName('');
    setDate('');
    setTime('');
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Site Visit Schedule</h1>
          <p className="text-xs text-slate-400 mt-0.5">Coordinate and log on-premise client tours</p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          {visits.length} Tours Scheduled
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Book New Tour</h2>
          <form onSubmit={handleAddVisit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Lead Name</label>
              <input
                type="text"
                placeholder="e.g. Rahul Verma"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Target Property</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
              >
                <option value="Green Valley Residency">Green Valley Residency (Chennai)</option>
                <option value="Skyline Residency">Skyline Residency (Bangalore)</option>
                <option value="Urban Heights">Urban Heights (Hyderabad)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Time</label>
                <input
                  type="text"
                  placeholder="11:30 AM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl shadow-md transition"
            >
              Add Site Tour
            </button>
          </form>
        </div>

        {/* Visit Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b">
              <tr>
                <th className="p-4">Customer Lead</th>
                <th className="p-4">Property</th>
                <th className="p-4">Schedule</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visits.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-800">{v.leadName}</td>
                  <td className="p-4 text-slate-600">{v.project} ({v.unitType})</td>
                  <td className="p-4 text-slate-500">{v.date} at {v.time}</td>
                  <td className="p-4 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}