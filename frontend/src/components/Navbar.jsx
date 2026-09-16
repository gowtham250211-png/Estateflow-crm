import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  // Live search debounced query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/leads?search=${encodeURIComponent(query.trim())}`);
        setResults(res.data || []);
        setIsOpen(true);
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLead = (lead) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/leads`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setIsOpen(false);
      navigate(`/leads`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex justify-between items-center z-30 shadow-sm relative">
      
      {/* Functional Live Search Input */}
      <div className="relative w-80" ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setIsOpen(true)}
            placeholder="Search leads by name, email, or phone..."
            className="w-full pl-9 pr-8 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
          {query && (
            <button
              onClick={() => { setQuery(''); setIsOpen(false); }}
              className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Live Search Floating Dropdown */}
        {isOpen && (
          <div className="absolute top-12 left-0 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100 animate-in fade-in duration-150">
            <div className="px-3 py-2 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center">
              <span>Matching Leads</span>
              {loading && <span className="text-blue-600 animate-pulse">Searching...</span>}
            </div>

            {results.length === 0 && !loading ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching leads found for "{query}"
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {results.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className="p-3 hover:bg-blue-50/70 cursor-pointer flex justify-between items-center transition"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">{lead.name}</div>
                      <div className="text-[10px] text-slate-400">{lead.phone} • {lead.email}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {lead.stage}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live System & Database Telemetry Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-[11px] font-semibold text-emerald-700 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Neon DB Connected</span>
        </div>
      </div>

    </header>
  );
}
