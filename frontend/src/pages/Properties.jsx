import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/propertyService';
import { bookingService } from '../services/bookingService';
import { leadService } from '../services/leadService';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

export default function Properties() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [units, setUnits] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState('ALL');
  const [bookingUnit, setBookingUnit] = useState(null);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [conflictError, setConflictError] = useState('');
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    propertyService.getProjects()
      .then((res) => {
        setProjects(res.data);
        if (res.data.length > 0) {
          handleSelectProject(res.data[0]);
        }
      })
      .finally(() => setLoading(false));

    leadService.getAll().then((res) => setLeads(res.data));
  }, []);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setSelectedBuilding(null);
    setUnits([]);
    propertyService.getBuildings(project.id).then((bRes) => {
      setBuildings(bRes.data);
      if (bRes.data.length > 0) {
        handleSelectBuilding(bRes.data[0]);
      }
    });
  };

  const handleSelectBuilding = (building) => {
    setSelectedBuilding(building);
    propertyService.getUnits(building.id).then((uRes) => {
      setUnits(uRes.data);
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setConflictError('');
    setBookingInProgress(true);
    try {
      await bookingService.create({
        leadId: Number(selectedLeadId),
        unitId: bookingUnit.id,
        bookedById: user?.id || 1,
      });
      setBookingUnit(null);
      handleSelectBuilding(selectedBuilding);
    } catch (err) {
      setConflictError(err.response?.data?.message || 'Conflict: Unit already locked by another agent.');
    } finally {
      setBookingInProgress(false);
    }
  };

  const filteredUnits = units.filter((u) => {
    if (typeFilter === 'ALL') return true;
    return u.type === typeFilter;
  });

  if (loading) return <Loading />;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 text-slate-800">
      
      {/* Top Banner Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Properties & Unit Inventory</h1>
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200">
              Pessimistic Row-Lock Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explore active residential sites, drill into towers, and reserve available units
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {['ALL', '1 BHK', '2 BHK', '3 BHK'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                typeFilter === t
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* 1. Projects */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">
            1. Select Property ({projects.length})
          </span>
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => handleSelectProject(p)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${
                selectedProject?.id === p.id
                  ? 'border-2 border-blue-600 bg-blue-50/60 shadow-sm'
                  : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
              }`}
            >
              <div className="font-extrabold text-sm text-slate-800">{p.name}</div>
              <span className="text-[11px] text-blue-600 font-semibold">{p.location}</span>
            </div>
          ))}
        </div>

        {/* 2. Towers */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">
            2. Select Tower ({buildings.length})
          </span>
          {buildings.length === 0 ? (
            <div className="text-xs text-slate-400 p-6 text-center border border-dashed border-slate-200 rounded-2xl">
              No towers registered.
            </div>
          ) : (
            buildings.map((b) => (
              <div
                key={b.id}
                onClick={() => handleSelectBuilding(b)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 flex justify-between items-center ${
                  selectedBuilding?.id === b.id
                    ? 'border-2 border-blue-600 bg-blue-50/60 shadow-sm'
                    : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <span className="font-bold text-sm text-slate-800">{b.name}</span>
                <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-lg">
                  Select
                </span>
              </div>
            ))
          )}
        </div>

        {/* 3. Live Unit Inventory (Spans 2 cols) */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                  3. {selectedBuilding?.name || 'Tower'} Inventory ({filteredUnits.length} Units)
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Click an available unit to lock reservation</p>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-bold">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span> Locked
                </span>
              </div>
            </div>

            {filteredUnits.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                No units match the selected criteria.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {filteredUnits.map((u) => {
                  const isAvail = u.status === 'AVAILABLE';
                  return (
                    <div
                      key={u.id}
                      onClick={() => isAvail && setBookingUnit(u)}
                      className={`p-4 rounded-2xl border transition-all relative ${
                        isAvail
                          ? 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-md cursor-pointer'
                          : 'border-slate-200 bg-slate-50/80 text-slate-400 cursor-not-allowed opacity-75'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-base font-black text-slate-800">
                          {u.unitNumber}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black tracking-wider ${
                          isAvail ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {u.type}
                        </span>
                      </div>
                      <div className="text-base font-black text-slate-900">
                        ₹{(u.price / 100000).toFixed(1)} <span className="text-[10px] text-slate-400 font-normal">Lakhs</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[10px] font-bold">
                        <span className={isAvail ? 'text-emerald-700' : 'text-slate-400'}>
                          {isAvail ? '● Ready to Lock' : '🔒 Reserved'}
                        </span>
                        {isAvail && (
                          <span className="text-blue-600 font-extrabold hover:underline">
                            RESERVE →
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Booking Confirmation Modal */}
      <Modal isOpen={!!bookingUnit} onClose={() => setBookingUnit(null)} title="Confirm Property Reservation">
        {conflictError && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
            ⚠️ {conflictError}
          </div>
        )}
        <form onSubmit={handleBooking} className="space-y-4 text-slate-800 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 font-mono">
            <div>TARGET UNIT: <span className="font-bold text-slate-900">{bookingUnit?.unitNumber} ({bookingUnit?.type})</span></div>
            <div>PRICE: <span className="font-black text-emerald-600">₹{((bookingUnit?.price || 0) / 100000).toFixed(2)} Lakhs</span></div>
            <div>LOCK TYPE: <span className="text-blue-600 font-bold">PESSIMISTIC_WRITE (Prevents duplicate booking)</span></div>
          </div>

          <div>
            <label className="block font-bold text-slate-600 uppercase mb-1.5">Assign To Prospective Lead</label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Choose prospective buyer...</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>{l.name} — {l.phone} (Budget: ₹{l.budget / 100000}L)</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={bookingInProgress}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-3 rounded-xl uppercase tracking-wider transition shadow-md shadow-blue-600/20"
          >
            {bookingInProgress ? 'Acquiring Exclusive Row Lock...' : 'Lock Unit & Generate Booking'}
          </button>
        </form>
      </Modal>

    </div>
  );
}