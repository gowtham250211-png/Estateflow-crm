import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = user?.name || 'Account';
  const displayEmail = user?.email || '';
  const displayRole = user?.role || '';
  const initial = displayName.charAt(0).toUpperCase() || '?';

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <aside className="w-64 bg-[#111827] text-white flex flex-col justify-between h-screen sticky top-0 shrink-0 border-r border-slate-800 select-none">
      <div className="p-5 space-y-6 overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-500/30">
            E
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wider text-white">
              ESTATE<span className="text-blue-400">FLOW</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Sales & Asset Command
            </p>
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="space-y-6">
          {/* SECTION 1: SALES & ASSETS */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Sales & Assets
            </span>
            <div className="mt-1 space-y-1">
              <NavLink to="/" end className={linkClasses}>
                <span className="text-sm">📊</span>
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/properties" className={linkClasses}>
                <span className="text-sm">🏢</span>
                <span>Properties & Units</span>
              </NavLink>
              <NavLink to="/leads" className={linkClasses}>
                <span className="text-sm">👥</span>
                <span>Leads & Pipeline</span>
              </NavLink>
              <NavLink to="/bookings" className={linkClasses}>
                <span className="text-sm">🔒</span>
                <span>Closed Bookings</span>
              </NavLink>
            </div>
          </div>

          {/* SECTION 2: OPERATIONS */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Operations
            </span>
            <div className="mt-1 space-y-1">
              <NavLink to="/site-visits" className={linkClasses}>
                <span className="text-sm">📅</span>
                <span>Site Visits</span>
              </NavLink>
              <NavLink to="/tasks" className={linkClasses}>
                <span className="text-sm">⏰</span>
                <span>Tasks & Reminders</span>
              </NavLink>
              <NavLink to="/documents" className={linkClasses}>
                <span className="text-sm">📁</span>
                <span>Documents</span>
              </NavLink>
              <NavLink to="/invoices" className={linkClasses}>
                <span className="text-sm">💳</span>
                <span>Invoices & Payments</span>
              </NavLink>
            </div>
          </div>

          {/* SECTION 3: SYSTEM */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              System
            </span>
            <div className="mt-1 space-y-1">
              <NavLink to="/settings" className={linkClasses}>
                <span className="text-sm">⚙️</span>
                <span>Settings</span>
              </NavLink>
            </div>
          </div>
        </nav>
      </div>

      {/* Operator Profile Card & Dropdown */}
      <div className="p-4 border-t border-slate-800/80 relative" ref={menuRef}>
        {menuOpen && (
          <div className="absolute bottom-20 left-4 right-4 bg-[#1f2937] border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in duration-150">
            <div className="px-3 py-2 border-b border-slate-700/60">
              <div className="text-[11px] font-bold text-white">{displayName}</div>
              <div className="text-[10px] text-slate-400">{displayEmail}</div>
            </div>
            <button
              onClick={() => { setMenuOpen(false); navigate('/settings'); }}
              className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition"
            >
              Account Preferences
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        )}

        <div
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 transition cursor-pointer border border-slate-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-xs">
              {initial}
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-none">{displayName}</div>
              <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{displayRole}</div>
            </div>
          </div>
          <span className="text-slate-400 text-xs">•••</span>
        </div>
      </div>
    </aside>
  );
}