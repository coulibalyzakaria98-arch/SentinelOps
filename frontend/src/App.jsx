import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OfflineProvider } from './contexts/OfflineContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import FieldAgent from './pages/FieldAgent';
import CommandCenter from './pages/CommandCenter';
import Analyst from './pages/Analyst';
import AdminPanel from './pages/AdminPanel';
import TacticalMap from './pages/TacticalMap';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import { syncService } from './services/syncService';

/**
 * ProtectedRoute - Checks if user is logged in
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0A0F2A]">
      <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
  
  return user ? children : <Navigate to="/login" replace />;
};

/**
 * RoleDispatcher - Shows the correct dashboard based on user role
 */
const RoleDispatcher = () => {
  const { user } = useAuth();
  
  switch (user.role) {
    case 'admin': return <AdminPanel />;
    case 'command': return <CommandCenter />;
    case 'analyst': return <Analyst />;
    default: return <FieldAgent />;
  }
};

const AppRoutes = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) syncService.startAutoSyncListener();
  }, [user]);

  return (
    <Routes>
      {/* AUTH: Landing Page as Login */}
      <Route path="/login" element={<LandingPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* APP: Main Dashboard Area */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <DashboardLayout title={user?.role?.toUpperCase() || 'OPS CENTER'} />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<RoleDispatcher />} />
        <Route path="map" element={<TacticalMap />} />
        <Route path="intel" element={<Analyst />} />
        <Route path="analytics" element={<Analyst />} />
        <Route path="settings" element={<AdminPanel />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <OfflineProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </OfflineProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
