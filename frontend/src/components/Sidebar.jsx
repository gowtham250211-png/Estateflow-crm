import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  // Safely extract user profile details
  let storedUser = user;
  if (!storedUser) {
    try {
      storedUser = JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      storedUser = {};
    }
  }

  const email = storedUser?.email || localStorage.getItem('user_email') || 'gowtham@crm.com';
  const rawName = storedUser?.name || email.split('@')[0] || 'Gowtham';
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const displayRole = (storedUser?.role || 'ADMIN').replace('ROLE_', '').toUpperCase();
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    {
      group: 'SALES & ASSETS',
      items: [
        { name: 'Dashboard', path: '/', icon: '📊' },
        { name: 'Properties & Units', path: '/properties', icon: '🏢' },
        { name: 'Leads & Pipeline', path: '/leads', icon: '👥' },
        { name: 'Closed Bookings', path: '/bookings', icon: '🔒' },
      ],
    },
    {
      group: 'OPERATIONS',
      items: [
        { name: 'Site Visits', path: '/site-visits', icon: '📅' },
        { name: 'Tasks & Reminders', path: '/tasks', icon: '⏰' },
        { name: 'Documents', path: '/documents', icon: '📁' },
        { name: 'Invoices & Payments', path: '/invoices', icon: '💳' },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { name: 'Settings', path: '/settings', icon: '⚙️' },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0d131f] text-slate-300 flex flex-col h-screen border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-500/20">
          E
        </div>
        <div>
          <h1 className="font-black text-sm tracking-wider text-white">
            ESTATE<span className="text-blue-500">FLOW</span>
          </h1>
          <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">
            Sales & Asset Command
          </p>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navLinks.map((section) => (
          <div key={section.group} className="space-y-1">
            <h2 className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              {section.group}
            </h2>
            <div className="space-y-0.5 mt-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Account Profile Card */}
      <div className="relative p-3 border-t border-slate-800/80">
        {showAccountMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#131b2e] border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
            <div className="px-3 py-2 border-b border-slate-700/50">
              <p className="text-xs font-bold text-white truncate">{displayName}</p>
              <p className="text-[11px] text-slate-400 truncate">{email}</p>
            </div>
            <button
              onClick={() => {
                setShowAccountMenu(false);
                navigate('/settings');
              }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition cursor-pointer flex items-center gap-2"
            >
              <span>⚙️</span> Account Preferences
            </button>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer flex items-center gap-2"
            >
              <span>🚪</span> Sign Out
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-800/60 transition cursor-pointer group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
              {initial}
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate group-hover:text-white">
                {displayName}
              </p>
              <p className="text-[10px] font-semibold text-blue-400 tracking-wider">
                {displayRole}
              </p>
            </div>
          </div>
          <span className="text-slate-500 group-hover:text-slate-300 text-xs shrink-0">•••</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;