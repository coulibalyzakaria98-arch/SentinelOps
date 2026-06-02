import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import KPICard from '../components/ui/KPICard';
import OfflineBanner from '../components/offline/OfflineBanner';
import StressReportForm from '../components/user/ReportForm';
import QuickCamera from '../components/user/QuickCamera';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import { Send, Map as MapIcon, Activity, Clock, CheckCircle } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const { isOnline, pendingCount, forceSync, isSyncing } = useOffline();
  const [showForm, setShowForm] = useState(false);

  return (
    <MainLayout
      title="Field Agent Dashboard"
      status={isOnline ? (isSyncing ? 'syncing' : 'online') : 'offline'}
      queueCount={pendingCount}
      user={user}
    >
      <div className="space-y-6">
        {/* Offline Banner */}
        <OfflineBanner
          isOffline={!isOnline}
          queueCount={pendingCount}
          onRetry={forceSync}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Reports Sent Today"
            value="3"
            subtitle="Last 24 hours"
            icon={Send}
            trend={{ value: '+2', positive: true, label: 'vs yesterday' }}
          />
          <KPICard
            title="Pending Sync"
            value={pendingCount}
            subtitle="Queued locally"
            icon={Clock}
            className={pendingCount > 0 ? 'border-warning/20' : ''}
          />
          <KPICard
            title="Response Time"
            value="2.3m"
            subtitle="Average"
            icon={Activity}
            trend={{ value: '-0.5m', positive: true, label: 'improvement' }}
          />
          <KPICard
            title="Last Activity"
            value="5m ago"
            subtitle="Location updated"
            icon={CheckCircle}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Quick Camera */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Report</h3>
            <QuickCamera onCapture={() => setShowForm(true)} />
          </div>

          {/* Recent Reports */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Recent Reports</h3>
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-surface/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-success"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Infrastructure Damage</p>
                    <p className="text-xs text-slate-400">2 hours ago • Synced</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-surface/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-warning"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Medical Emergency</p>
                    <p className="text-xs text-slate-400">4 hours ago • Pending sync</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 text-center">
          <p className="text-sm text-slate-300">
            All transmissions are end-to-end encrypted. EXIF metadata is automatically removed before sending.
          </p>
        </div>
      </div>

      {/* Full Screen Report Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-[2000] bg-primary animate-in slide-in-from-bottom duration-500">
          <StressReportForm
            onSubmitSuccess={() => setShowForm(false)}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}
    </MainLayout>
  );
};

export default UserDashboard;
