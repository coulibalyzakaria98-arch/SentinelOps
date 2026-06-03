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
import { config } from './config';

// Log de démarrage
console.log(`🚀 SentinelOps v${config.version} - ${config.isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
console.log(`📡 API URL: ${config.apiUrl}`);

/**
 * ProtectedRoute - Checks if user is logged in and has appropriate role
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0A0F2A]">
      <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their default dashboard if role not allowed for this specific route
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
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
        
        {/* Role-specific routes */}
        <Route path="field" element={
          <ProtectedRoute allowedRoles={['field', 'command', 'admin']}>
            <FieldAgent />
          </ProtectedRoute>
        } />
        
        <Route path="command" element={
          <ProtectedRoute allowedRoles={['command', 'admin']}>
            <CommandCenter />
          </ProtectedRoute>
        } />
        
        <Route path="analytics" element={
          <ProtectedRoute allowedRoles={['analyst', 'command', 'admin']}>
            <Analyst />
          </ProtectedRoute>
        } />

        <Route path="intel" element={
          <ProtectedRoute allowedRoles={['analyst', 'command', 'admin']}>
            <Analyst />
          </ProtectedRoute>
        } />

        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />

        <Route path="map" element={<TacticalMap />} />
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
