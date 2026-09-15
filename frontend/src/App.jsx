import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Properties from './pages/Properties';
import Bookings from './pages/Bookings';
import SiteVisits from './pages/SiteVisits';
import Invoices from './pages/Invoices';
import Login from './pages/Login';

function ProtectedLayout({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen w-screen bg-[#F1F5F9] text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[#F1F5F9] overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/leads" element={<ProtectedLayout><Leads /></ProtectedLayout>} />
          <Route path="/properties" element={<ProtectedLayout><Properties /></ProtectedLayout>} />
          <Route path="/bookings" element={<ProtectedLayout><Bookings /></ProtectedLayout>} />
          <Route path="/site-visits" element={<ProtectedLayout><SiteVisits /></ProtectedLayout>} />
          <Route path="/invoices" element={<ProtectedLayout><Invoices /></ProtectedLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}