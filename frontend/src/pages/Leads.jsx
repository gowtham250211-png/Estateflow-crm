import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leadService } from '../services/leadService';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeLead, setActiveLead] = useState(null);
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    budget: '',
    stage: 'NEW',
    followUpDate: ''
  });

  const fetchLeads = () => {
    leadService.getAll(search)
      .then((res) => setLeads(res.data || []))
      .catch((err) => console.error('Failed to load leads:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, [search]);

  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (newLead.phone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      await leadService.create({ ...newLead, budget: Number(newLead.budget) });
      setModalOpen(false);
      setNewLead({ name: '', phone: '', email: '', budget: '', stage: 'NEW', followUpDate: '' });
      fetchLeads();
    } catch (err) {
      console.error('Error creating lead:', err);
      alert('Failed to save lead. Please check backend status.');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leads</h1>
          <p className="text-xs text-slate-500">Manage prospects and pipeline states</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
        >
          + Add Lead
        </button>
      </div>

      {/* Leads Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <input
            type="text"
            placeholder="Search leads by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>

        {loading ? (
          <Loading />
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-semibold">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Follow-up</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-slate-400">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-semibold text-slate-800 text-xs">{l.name}</td>
                    <td className="p-4 text-slate-500 text-xs">
                      <div className="font-mono text-slate-700">{l.phone}</div>
                      <div className="text-[11px] text-slate-400">{l.email}</div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={l.stage} />
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-600">
                      {l.followUpDate || 'None'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveLead(l)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                      >
                        View details →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Lead Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Lead">
        <form onSubmit={handleCreateLead} className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase">Full Name</label>
            <input
              placeholder="e.g. Rahul Sharma"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none mt-1"
              required
              value={newLead.name}
              onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Phone Number</label>
              <span className={`text-[10px] font-semibold ${newLead.phone.length === 10 ? 'text-emerald-600' : 'text-slate-400'}`}>
                {newLead.phone.length}/10 digits
              </span>
            </div>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none mt-1"
              maxLength={10}
              required
              value={newLead.phone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                setNewLead({ ...newLead, phone: digits });
              }}
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase">Email Address</label>
            <input
              placeholder="lead@example.com"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none mt-1"
              type="email"
              value={newLead.email}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase">Budget (INR)</label>
            <input
              placeholder="e.g. 7500000"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none mt-1"
              type="number"
              value={newLead.budget}
              onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase">Next Follow-Up Date</label>
            <input
              type="date"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none mt-1"
              value={newLead.followUpDate}
              onChange={(e) => setNewLead({ ...newLead, followUpDate: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs mt-4 transition cursor-pointer shadow-xs"
          >
            Save Lead
          </button>
        </form>
      </Modal>

      {/* Lead Details Slide-Over Drawer */}
      {activeLead && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 uppercase">
                    Prospect Details
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 mt-1">{activeLead.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLead(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  ✕
                </button>
              </div>

              {/* Status and Pipeline */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Stage</span>
                  <div className="mt-1">
                    <StatusBadge status={activeLead.stage} />
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Budget</span>
                  <div className="text-xs font-bold text-slate-800 mt-1">
                    ₹{activeLead.budget ? Number(activeLead.budget).toLocaleString('en-IN') : 'Open'}
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Contact Information
                </span>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span>📞</span>
                  <span>{activeLead.phone || 'No phone provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span>✉️</span>
                  <span>{activeLead.email || 'No email provided'}</span>
                </div>
              </div>

              {/* Schedule */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Scheduled Follow-up
                </span>
                <div className="text-xs font-semibold text-slate-700 mt-1">
                  📅 {activeLead.followUpDate || 'No follow-up registered'}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to={`/leads/${activeLead.id}`}
                className="py-2.5 text-center border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs font-semibold transition"
              >
                Open Full Profile & Notes →
              </Link>
              <div className="flex gap-2">
                <a
                  href={`tel:${activeLead.phone}`}
                  className="flex-1 py-2.5 text-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  Call Prospect
                </a>
                <button
                  type="button"
                  onClick={() => setActiveLead(null)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}