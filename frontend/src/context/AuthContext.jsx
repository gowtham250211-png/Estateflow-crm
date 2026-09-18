import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (param1, param2) => {
    // Branch A: Direct payload passed as login(userData, token)
    if (typeof param1 === 'object' && param1 !== null) {
      const userData = {
        name: param1.name || 'Gowtham',
        email: param1.email || 'gowtham@crm.com',
        role: (param1.role || 'ADMIN').replace('ROLE_', '').toUpperCase(),
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', param2);
      setUser(userData);
      return { user: userData, token: param2 };
    }

    // Branch B: Credentials passed as login(email, password)
    const email = param1;
    const password = param2;

    const res = await api.post('/auth/login', { email, password });
    const token = res.data.token;

    // Resolve name and role from backend response or fallbacks
    const rawName = res.data.user?.name || res.data.name || email.split('@')[0];
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const rawRole = res.data.user?.role || res.data.role || 'ADMIN';

    const userData = {
      name: formattedName,
      email: res.data.user?.email || res.data.email || email,
      role: rawRole.replace('ROLE_', '').toUpperCase(),
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);