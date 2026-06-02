import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('sentinelops-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (role) => {
    const userData = {
      id: crypto.randomUUID(),
      role,
      name: role === 'user' ? 'Agent de Terrain' : 
            role === 'command' ? 'Officier de Commandement' :
            role === 'analyst' ? 'Analyste Stratégique' : 'Administrateur Système',
      sector: 'Alpha-01',
      joinedAt: new Date().toISOString()
    };
    setUser(userData);
    localStorage.setItem('sentinelops-user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sentinelops-user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
