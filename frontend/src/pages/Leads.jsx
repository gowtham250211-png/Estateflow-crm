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
  const [newLead, setNewLead] = useState({
    name: '', phone: '', email: '', budget: '', stage: 'NEW', followUpDate: ''
  });

  const fetchLeads = () => {
    leadService.getAll(search)
      .then((res) => setLeads(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, [search]);

  const handleCreateLead = async (e) => {
    e.preventDefault();
    await leadService.create({ ...newLead, budget: Number(newLead.budget) });
    setModalOpen(false);
    fetchLeads();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leads</h1>
          <p className="text-xs text-slate-500">Manage prospects and pipeline states</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          + Add Lead
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <input
            type="text"
            placeholder="Search leads by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {loading ? <Loading /> : (
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Follow-up</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-semibold text-slate-800">{l.name}</td>
                  <td className="p-4 text-slate-500 text-xs">{l.phone}<br/>{l.email}</td>
                  <td className="p-4"><StatusBadge status={l.stage} /></td>
                  <td className="p-4 text-xs font-medium text-slate-600">{l.followUpDate || 'None'}</td>
                  <td className="p-4 text-right">
                    <Link to={`/leads/${l.id}`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                      View details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Lead">
        <form onSubmit={handleCreateLead} className="space-y-3">
          <input
            placeholder="Full Name"
            className="w-full p-2 border rounded-lg text-sm"
            required
            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
          />
          <input
            placeholder="Phone Number"
            className="w-full p-2 border rounded-lg text-sm"
            required
            onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
          />
          <input
            placeholder="Email Address"
            className="w-full p-2 border rounded-lg text-sm"
            type="email"
            onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
          />
          <input
            placeholder="Budget (INR)"
            className="w-full p-2 border rounded-lg text-sm"
            type="number"
            onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })}
          />
          <input
            type="date"
            className="w-full p-2 border rounded-lg text-sm"
            onChange={(e) => setNewLead({ ...newLead, followUpDate: e.target.value })}
          />
          <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg text-sm mt-4">
            Save Lead
          </button>
        </form>
      </Modal>
    </div>
  );
}   