import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { leadService } from '../services/leadService';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

export default function LeadDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  const loadData = () => {
    leadService.getById(id).then((res) => setLead(res.data));
    leadService.getNotes(id).then((res) => setNotes(res.data));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleStageChange = async (e) => {
    const newStage = e.target.value;
    // Build the payload with the field names the backend's LeadRequest DTO expects
    // (assignedToId / projectId), rather than spreading the nested assignedTo/project
    // objects from the GET response — sending those directly would silently null out
    // the lead's assigned salesperson and project on every stage change.
    const payload = {
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      budget: lead.budget,
      stage: newStage,
      assignedToId: lead.assignedTo ? lead.assignedTo.id : null,
      projectId: lead.project ? lead.project.id : null,
      followUpDate: lead.followUpDate,
    };
    await leadService.update(id, payload);
    setLead({ ...lead, stage: newStage });
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    await leadService.addNote(id, { userId: user.id, note: newNote });
    setNewNote('');
    leadService.getNotes(id).then((res) => setNotes(res.data));
  };

  if (!lead) return <Loading />;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <Link to="/leads" className="text-xs font-bold text-slate-500 hover:text-slate-800">
        ← Back to Leads
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
            <StatusBadge status={lead.stage} />
          </div>

          <div className="space-y-2 text-xs border-t pt-4">
            <div><span className="font-bold text-slate-500">PHONE:</span> {lead.phone}</div>
            <div><span className="font-bold text-slate-500">EMAIL:</span> {lead.email}</div>
            <div><span className="font-bold text-slate-500">BUDGET:</span> {lead.budget ? `₹${(lead.budget / 100000).toFixed(2)} Lakhs` : 'Open'}</div>
            <div><span className="font-bold text-slate-500">FOLLOW-UP:</span> {lead.followUpDate || 'None'}</div>
          </div>

          <div className="border-t pt-4">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Update Stage</label>
            <select
              value={lead.stage}
              onChange={handleStageChange}
              className="w-full p-2 border rounded-lg text-sm bg-white font-medium"
            >
              {['NEW', 'CONTACTED', 'SITE_VISIT', 'INTERESTED', 'NEGOTIATION', 'BOOKED', 'LOST'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Activity & Notes</h3>
            <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
              {notes.map((n) => (
                <div key={n.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <p className="font-medium text-slate-800">{n.note}</p>
                  <span className="text-slate-400 text-[10px] mt-1 block">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddNote} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 p-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 text-white font-semibold text-xs px-4 py-2 rounded-lg">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}