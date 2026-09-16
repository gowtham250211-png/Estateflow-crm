import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const sections = [
    {
      title: 'SALES & ASSETS',
      items: [
        { to: '/', label: 'Dashboard', icon: '📊' },
        { to: '/properties', label: 'Properties & Units', icon: '🏢' },
        { to: '/leads', label: 'Leads & Pipeline', icon: '👥' },
        { to: '/bookings', label: 'Closed Bookings', icon: '🔒' },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { to: '/site-visits', label: 'Site Visits', icon: '📅' },
        { to: '/invoices', label: 'Invoices & Payments', icon: '💳' },
      ],
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#1E2738] text-slate-300 flex flex-col justify-between border-r border-slate-800 select-none shadow-xl relative">
      <div>
        {/* Brand Header */}
        <div className="px-6 py-6 border-b border-slate-700/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/20">
            E
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-white">
              ESTATE<span className="text-blue-400">FLOW</span>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
              Sales & Asset Command
            </div>
          </div>
        </div>

        {/* Categorized Navigation */}
        <div className="p-4 space-y-6">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {sec.title}
              </div>
              {sec.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#2A364F] text-white border-l-4 border-blue-500 shadow-sm'
                        : 'text-slate-400 hover:bg-[#253045] hover:text-slate-200'
                    }`
                  }
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Operator User Card with Floating Logout Menu */}
      <div className="relative m-3" ref={menuRef}>
        {/* Floating Menu */}
        {showMenu && (
          <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#171F2E] border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="px-3 py-2 border-b border-slate-700/50 mb-1">
              <p className="text-[11px] font-bold text-white truncate">{user?.name || 'Gowtham'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'gowtham@crm.com'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg flex items-center gap-2 transition cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* User Badge Click Target */}
        <button
          type="button"
          onClick={() => setShowMenu((prev) => !prev)}
          className="w-full p-3 bg-[#171F2E] hover:bg-[#202b3f] border border-slate-700/60 rounded-2xl flex items-center justify-between transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-xs shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'G'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{user?.name || 'Gowtham'}</div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                {user?.role || 'Admin'}
              </div>
            </div>
          </div>
          <span className="text-slate-400 hover:text-white text-xs px-1 font-mono">•••</span>
        </button>
      </div>
    </aside>
  );
}
