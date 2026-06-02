import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import OfflineIndicator from '../components/OfflineIndicator';
import { useOffline } from '../contexts/OfflineContext';
import ConflictResolver from '../components/offline/ConflictResolver';

/**
 * DashboardLayout - The persistent shell for all authenticated routes.
 * Uses <Outlet /> to render child components.
 */
const DashboardLayout = ({ title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentConflict, resolveConflict } = useOffline();

  return (
    <div className="flex h-screen bg-[#0A0F2A] overflow-hidden text-slate-100 font-sans">
      {/* Conflict Resolution Overlay */}
      {currentConflict && (
        <ConflictResolver 
          conflict={currentConflict} 
          onResolve={resolveConflict} 
          onCancel={() => resolveConflict('cancel')} 
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar (Header) */}
        <Header 
          title={title} 
          onToggleSidebar={() => setIsSidebarOpen(true)} 
          isSidebarOpen={isSidebarOpen}
        />

        {/* Global Notifications/Status Indicators */}
        <OfflineIndicator />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
            {/* INJECTED PAGE CONTENT */}
            <Outlet />
          </div>
        </main>

        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
