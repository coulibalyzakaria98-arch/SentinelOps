import React, { useState } from 'react';
import KPICard from '../components/common/KPICard';
import OfflineBanner from '../components/offline/OfflineBanner';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import { clearAllData, getStorageUsage } from '../services/offlineStorage';
import {
  Shield,
  Database,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HardDrive,
  Users,
  FileText,
  Image,
  Clock,
  RefreshCw
} from 'lucide-react';

const AdminPanel = () => {
  const { user } = useAuth();
  const { isOnline } = useOffline();
  const [isResetting, setIsResetting] = useState(false);
  const [resetResult, setResetResult] = useState(null);
  const [storageInfo, setStorageInfo] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const loadStorageInfo = async () => {
    try {
      const info = await getStorageUsage();
      setStorageInfo(info);
    } catch (error) {
      console.error('Error loading storage info:', error);
    }
  };

  React.useEffect(() => {
    loadStorageInfo();
  }, []);

  const handleResetDatabase = async () => {
    if (!showConfirmDialog) {
      setShowConfirmDialog(true);
      return;
    }

    setIsResetting(true);
    setResetResult(null);
    setShowConfirmDialog(false);

    try {
      const success = await clearAllData();
      setResetResult({
        success,
        message: success ? 'Base de données réinitialisée' : 'Échec de la réinitialisation',
        timestamp: new Date().toLocaleString()
      });
      await loadStorageInfo();
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setResetResult({
        success: false,
        message: `Erreur: ${error.message}`,
        timestamp: new Date().toLocaleString()
      });
    } finally {
      setIsResetting(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <OfflineBanner />

      {/* 📊 STORAGE OVERVIEW */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Rapports Locaux"
          value={storageInfo?.reports?.toString() || '0'}
          subtitle="Stockés sur l'appareil"
          icon={<FileText size={20} />}
          color="accent"
        />
        <KPICard
          title="Images & Médias"
          value={storageInfo?.images?.toString() || '0'}
          subtitle="Fichiers attachés"
          icon={<Image size={20} />}
          color="blue"
        />
        <KPICard
          title="File d'attente"
          value={storageInfo?.queue?.toString() || '0'}
          subtitle="Opérations en attente"
          icon={<Clock size={20} />}
          color="amber"
        />
        <KPICard
          title="Espace Utilisé"
          value={formatBytes(storageInfo?.estimatedSize || 0)}
          subtitle="Taille estimée"
          icon={<HardDrive size={20} />}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 🛠 DATABASE MANAGEMENT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#07101F]/80 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3.5 rounded-2xl bg-red-600/10 text-red-500 border border-red-500/20">
                <Database size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Gestion de la Base de Données</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Opérations administratives critiques</p>
              </div>
            </div>

            <div className="border border-red-500/20 rounded-2xl p-6 bg-red-500/5">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-red-500/10 text-red-500 shrink-0">
                    <Trash2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tighter mb-1">Réinitialisation Complète</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      Supprime définitivement toutes les données locales : rapports, images et file d'attente de synchronisation. 
                      Cette action est irréversible.
                    </p>
                  </div>
                </div>
              </div>

              {showConfirmDialog && (
                <div className="mb-6 p-5 border border-amber-500/20 rounded-2xl bg-amber-500/5 animate-fade-in">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle size={20} className="text-amber-500" />
                    <span className="font-black text-white uppercase text-xs tracking-widest">Confirmation Requise</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-6 font-medium">
                    Êtes-vous absolument certain de vouloir effacer toutes les données ?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleResetDatabase}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-500/20"
                    >
                      Confirmer la suppression
                    </button>
                    <button
                      onClick={() => setShowConfirmDialog(false)}
                      className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4">
                {!showConfirmDialog && (
                  <button
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={isResetting}
                    className="px-8 py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
                  >
                    {isResetting ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    {isResetting ? 'Réinitialisation...' : 'Effacer la Base de Données'}
                  </button>
                )}
                
                {resetResult && (
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border animate-fade-in ${
                    resetResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {resetResult.success ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{resetResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={loadStorageInfo} className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#07101F]/80 hover:bg-white/5 transition-all group">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-500 group-hover:scale-110 transition-transform">
                  <RefreshCw size={24} />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Rafraîchir les Stats</span>
              </div>
            </button>
            <button className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#07101F]/80 hover:bg-white/5 transition-all group">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-500 group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Gestion Utilisateurs</span>
              </div>
            </button>
          </div>
        </div>

        {/* 📋 SYSTEM INFORMATION */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#07101F]/80 shadow-xl h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20">
                <Shield size={20} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Système</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                {[
                  { label: 'Version DB', value: '41', mono: true },
                  { label: 'Status Liaison', value: isOnline ? 'Connecté' : 'Déconnecté', color: isOnline ? 'text-emerald-400' : 'text-red-400' },
                  { label: 'Admin Actif', value: user?.name || 'Admin' },
                  { label: 'Type Stockage', value: 'IndexedDB', mono: true },
                  { label: 'Agent Browser', value: 'V8 Engine', mono: true },
                  { label: 'Dernier Reset', value: resetResult?.timestamp ? 'Récemment' : 'Jamais' }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                    <span className={`text-[11px] font-bold ${item.color || 'text-white'} ${item.mono ? 'font-mono' : ''}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-blue-600/5 border border-blue-500/10 mt-8">
                <p className="text-[9px] text-slate-400 leading-relaxed italic font-medium">
                  Toutes les opérations sont journalisées. La modification des paramètres système peut affecter la synchronisation avec le cloud Sentinel-2.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
