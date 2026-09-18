import React, { useState, useEffect } from 'react';

const DEFAULT_TASKS = [
  { id: 1, title: 'Follow up on Token Advance deposit', lead: 'Arun Kumar', due: 'Today, 5:00 PM', priority: 'HIGH', status: 'PENDING' },
  { id: 2, title: 'Send Sale Agreement Draft via WhatsApp', lead: 'Priya', due: 'Tomorrow, 11:00 AM', priority: 'MEDIUM', status: 'PENDING' },
  { id: 3, title: 'Schedule Architect Meeting for Custom Floor Plan', lead: 'Karthik', due: 'Sep 20, 2:30 PM', priority: 'LOW', status: 'COMPLETED' },
  { id: 4, title: 'KYC Document Verification with Bank Officer', lead: 'Rahul Sharma', due: 'Sep 22, 10:00 AM', priority: 'HIGH', status: 'PENDING' }
];

export default function Tasks() {
  // Load saved state from localStorage or initialize with defaults
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('estateflow_tasks');
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    lead: '',
    due: '',
    priority: 'MEDIUM'
  });

  // Sync state to localStorage on every update
  useEffect(() => {
    localStorage.setItem('estateflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleStatus = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'PENDING' ? 'COMPLETED' : 'PENDING' }
          : t
      )
    );
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const created = {
      id: Date.now(),
      title: newTask.title,
      lead: newTask.lead || 'General Task',
      due: newTask.due || 'Upcoming',
      priority: newTask.priority,
      status: 'PENDING'
    };

    setTasks([created, ...tasks]);
    setModalOpen(false);
    setNewTask({ title: '', lead: '', due: '', priority: 'MEDIUM' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tasks & Reminders</h1>
          <p className="text-xs text-slate-500">Action items, client follow-ups, and operational tasks</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
        >
          + Create Task
        </button>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition"
          >
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={task.status === 'COMPLETED'}
                onChange={() => toggleStatus(task.id)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
              />
              <div>
                <h3
                  className={`text-xs font-bold transition-all ${
                    task.status === 'COMPLETED'
                      ? 'line-through text-slate-400'
                      : 'text-slate-800'
                  }`}
                >
                  {task.title}
                </h3>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Assigned Lead: <span className="font-semibold text-slate-700">{task.lead}</span> • Due: {task.due}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  task.priority === 'HIGH'
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : task.priority === 'MEDIUM'
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {task.priority}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  task.status === 'COMPLETED'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Add New Task</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Call client regarding loan sanction"
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Related Prospect / Lead</label>
                <input
                  type="text"
                  placeholder="e.g. Arun Kumar"
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newTask.lead}
                  onChange={(e) => setNewTask({ ...newTask, lead: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Due Time</label>
                  <input
                    type="text"
                    placeholder="e.g. Today, 6:00 PM"
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newTask.due}
                    onChange={(e) => setNewTask({ ...newTask, due: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Save Task
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}