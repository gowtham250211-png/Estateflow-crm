import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <Loading />;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      
      {/* Top 2 Primary Metric Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Metric 1: Properties & Availability */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Properties Inventory</span>
              <div className="text-4xl font-black text-slate-800 mt-1">3 Projects</div>
            </div>
            <div className="flex items-center gap-6 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Total Units</span>
                <span className="text-lg font-black text-slate-800">{data.availableUnits + data.bookings}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Units Locked</span>
                <span className="text-lg font-black text-blue-600">{data.bookings}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Vacant Units</span>
                <span className="text-lg font-black text-emerald-600">{data.availableUnits}</span>
              </div>
            </div>
          </div>
          <div className="w-24 h-24 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-4xl shadow-inner">
            🏢
          </div>
        </div>

        {/* Metric 2: Booked Sales Value */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booked Deal Volume</span>
              <div className="text-4xl font-black text-slate-800 mt-1">₹1.20 Cr</div>
            </div>
            <div className="flex items-center gap-6 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Advance Collected</span>
                <span className="text-lg font-black text-emerald-600">₹32.50 L</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Receivable Due</span>
                <span className="text-lg font-black text-amber-600">₹87.50 L</span>
              </div>
            </div>
          </div>
          <div className="w-24 h-24 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-4xl shadow-inner">
            💼
          </div>
        </div>

      </div>

      {/* Middle Row: Quick Actions & Pipeline Collection Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quick Actions (Width: 5/12) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Quick Actions</h2>
          
          <div className="space-y-2.5">
            <div
              onClick={() => navigate('/leads')}
              className="p-3.5 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 rounded-2xl cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  +
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-800 group-hover:text-blue-700">Add New Lead</div>
                  <div className="text-[11px] text-slate-400">Register prospective buyer in seconds.</div>
                </div>
              </div>
              <span className="text-slate-400 group-hover:text-blue-600 font-bold">›</span>
            </div>

            <div
              onClick={() => navigate('/properties')}
              className="p-3.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 rounded-2xl cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  🏢
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-800 group-hover:text-emerald-700">Explore Unit Matrix</div>
                  <div className="text-[11px] text-slate-400">Lock high-demand inventory with zero collisions.</div>
                </div>
              </div>
              <span className="text-slate-400 group-hover:text-emerald-600 font-bold">›</span>
            </div>

            <div
              onClick={() => navigate('/site-visits')}
              className="p-3.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 rounded-2xl cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  📅
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-700">Schedule Site Visit</div>
                  <div className="text-[11px] text-slate-400">Coordinate property viewings for leads.</div>
                </div>
              </div>
              <span className="text-slate-400 group-hover:text-indigo-600 font-bold">›</span>
            </div>
          </div>
        </div>

        {/* Sales Velocity Chart (Width: 7/12) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Sales Velocity & Collection</h2>
              <p className="text-[11px] text-slate-400">Quarterly booked deals trajectory</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              2026 Target: 100%
            </span>
          </div>

          {/* Smooth Curved Line Graph */}
          <div className="h-44 w-full flex items-end pt-4">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              <path
                d="M 0 120 Q 80 110, 160 85 T 320 60 T 500 20"
                fill="none"
                stroke="#2563EB"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 0 120 Q 80 110, 160 85 T 320 60 T 500 20 L 500 150 L 0 150 Z"
                fill="url(#gradient-blue)"
                opacity="0.12"
              />
              <defs>
                <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
              </defs>
              <circle cx="160" cy="85" r="5" fill="#2563EB" />
              <circle cx="320" cy="60" r="5" fill="#2563EB" />
              <circle cx="500" cy="20" r="6" fill="#2563EB" />
            </svg>
          </div>

          <div className="flex justify-between text-[11px] font-bold text-slate-400 pt-3 border-t border-slate-100">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span>
          </div>
        </div>

      </div>

      {/* Bottom Row: Property Showcase & Scheduled Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Featured Properties Preview (Width: 7/12) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Property Portfolio</h2>
            <button onClick={() => navigate('/properties')} className="text-xs font-bold text-blue-600 hover:underline">
              See All Inventory ›
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Green Valley', loc: 'Chennai', price: '₹45 L', type: '2 & 3 BHK', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400' },
              { name: 'Skyline Heights', loc: 'Bangalore', price: '₹51 L', type: '1 & 2 BHK', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400' },
              { name: 'Urban Towers', loc: 'Hyderabad', price: '₹78 L', type: '3 BHK Luxury', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400' },
            ].map((p, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition">
                <img src={p.img} alt={p.name} className="h-28 w-full object-cover" />
                <div className="p-3 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-slate-800">{p.name}</span>
                    <span className="text-[11px] font-black text-blue-600">{p.price}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">{p.loc} • {p.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Lead Follow-ups Table (Width: 5/12) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Scheduled Follow-Ups</h2>
            <button onClick={() => navigate('/leads')} className="text-xs font-bold text-blue-600 hover:underline">
              All Leads ›
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {data.upcomingFollowUps.length === 0 ? (
              <div className="text-center py-8 text-slate-400">All calls cleared for today.</div>
            ) : (
              data.upcomingFollowUps.map((f, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{f.leadName}</div>
                    <div className="text-[11px] text-slate-400">Site Discussion • Call Assigned</div>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg">
                    {f.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}