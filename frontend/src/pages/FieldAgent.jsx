import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Send, AlertTriangle, Wifi, WifiOff, CheckCircle, RotateCw, Clock, Activity, FileText, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import { useGeolocation } from '../hooks/useGeolocation';
import CameraModal from '../components/CameraModal';

const FieldAgent = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { user } = useAuth();
  const { isOnline, pendingCount, saveOffline } = useOffline();
  const { position, accuracy, error: locationError, refresh: refreshGPS } = useGeolocation();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [damageLevel, setDamageLevel] = useState('partial');
  const [crisisType, setCrisisType] = useState('flood');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    // Set document direction for RTL support
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRTL, i18n.language]);

  const handleCapture = (imageData) => {
    setCapturedImage(imageData);
    setShowCamera(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !position) {
      setSubmitStatus({ type: 'error', message: t('errors.generic') });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    const reportData = {
      title,
      description,
      damage_level: damageLevel,
      crisis_type: crisisType,
      latitude: position.lat,
      longitude: position.lng,
      timestamp: new Date().toISOString(),
      agent_id: user?.id,
      agent_name: user?.name
    };

    try {
      let imageBlob = null;
      if (capturedImage) {
        const res = await fetch(capturedImage);
        imageBlob = await res.blob();
      }

      const result = await saveOffline(reportData, imageBlob);
      
      if (result.success) {
        setSubmitStatus({
          type: isOnline ? 'success' : 'offline',
          message: isOnline ? t('field.success_msg') : t('field.offline_msg')
        });
        setTitle('');
        setDescription('');
        setCapturedImage(null);
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (err) {
      setSubmitStatus({ type: 'error', message: t('errors.network') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#0A0F2A] to-[#0F172A] text-white ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-20 bg-[#0A0F2A]/90 backdrop-blur border-b border-[#1F77D2]/30 px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">
              Sentinel<span className="text-[#1F77D2]">Ops</span>
              <span className="text-xs text-slate-400 mx-2 uppercase tracking-widest">{t('app.field')}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isOnline ? (
              <div className="flex items-center gap-1 text-emerald-400">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t('status.online')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-400">
                <WifiOff size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">{t('status.offline')}</span>
              </div>
            )}
            {pendingCount > 0 && (
              <div className="bg-amber-500 text-black px-2 py-0.5 rounded-full text-[10px] font-black">
                {pendingCount}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto pb-32">
        {submitStatus && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${
            submitStatus.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
            submitStatus.type === 'offline' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {submitStatus.type === 'success' && <CheckCircle size={20} />}
            {submitStatus.type === 'offline' && <WifiOff size={20} />}
            <span className="text-xs font-bold uppercase tracking-wide">{submitStatus.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border-white/10 bg-white/5 space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                {t('field.tactical_title')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('field.placeholders.title')}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#1F77D2] transition shadow-inner"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                {t('field.intel_terrain')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('field.placeholders.intel')}
                rows={3}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#1F77D2] transition resize-none shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
                {t('field.severity_level')}
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'minimal', label: t('field.severity.minimal'), color: 'emerald' },
                  { value: 'partial', label: t('field.severity.partial'), color: 'amber' },
                  { value: 'total', label: t('field.severity.critical'), color: 'red' }
                ].map(level => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setDamageLevel(level.value)}
                    className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      damageLevel === level.value
                        ? `bg-${level.color}-600 text-white shadow-lg`
                        : 'bg-white/5 text-slate-500 hover:bg-white/10'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
                {t('field.classification')}
              </label>
              <select
                value={crisisType}
                onChange={(e) => setCrisisType(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#1F77D2] transition appearance-none"
              >
                <option value="flood">🌊 {t('field.types.flood')}</option>
                <option value="fire">🔥 {t('field.types.fire')}</option>
                <option value="earthquake">🌋 {t('field.types.earthquake')}</option>
                <option value="cyclone">🌀 {t('field.types.cyclone')}</option>
                <option value="conflict">⚔️ {t('field.types.conflict')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-3xl border-white/10 bg-white/5">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <MapPin size={12} /> GPS
                </label>
                <button type="button" onClick={refreshGPS} className="text-[#1F77D2]"><RotateCw size={12} /></button>
              </div>
              {position ? (
                <div className="text-[11px] font-mono font-bold">
                  <p className="text-white" dir="ltr">{position.lat.toFixed(5)}</p>
                  <p className="text-white" dir="ltr">{position.lng.toFixed(5)}</p>
                  <p className="text-[9px] text-emerald-500 mt-1 uppercase">±{Math.round(accuracy || 0)}m</p>
                </div>
              ) : (
                <p className="text-[10px] text-amber-500 font-bold uppercase animate-pulse">{t('field.gps_fixing')}</p>
              )}
            </div>

            <div className="glass-panel p-5 rounded-3xl border-white/10 bg-white/5 flex flex-col items-center justify-center relative overflow-hidden min-h-[120px]">
               {capturedImage ? (
                 <div className="absolute inset-0 group">
                    <img src={capturedImage} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setCapturedImage(null)} 
                      className="absolute top-2 right-2 bg-red-600 rounded-full p-1.5 shadow-lg active:scale-90 transition-transform"
                    >
                      <X size={12} />
                    </button>
                 </div>
               ) : (
                 <button 
                   type="button" 
                   onClick={() => setShowCamera(true)} 
                   className="flex flex-col items-center gap-2 group"
                 >
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-[#1F77D2] group-hover:scale-110 transition-transform">
                      <Camera size={24} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('field.photo')}</span>
                 </button>
               )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !title || !position}
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-black text-white text-sm uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/20 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {isSubmitting ? <RotateCw className="animate-spin" size={20} /> : <Send size={20} />}
            {isOnline ? t('field.transmit') : t('field.save')}
          </button>
        </form>
      </main>

      {/* 🚨 SOS EMERGENCY BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0A0F2A]/95 backdrop-blur-xl border-t border-white/5 pb-8">
        <button
          type="button"
          className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-2xl flex items-center justify-center gap-3 text-white font-black uppercase tracking-[0.3em] shadow-lg shadow-red-600/20 transition-all active:scale-95"
          onClick={() => {
            if (confirm(t('field.sos_confirm'))) {
               setTitle(`[URGENT] ${t('field.sos_signal')}`);
               setDamageLevel('total');
               handleSubmit(new Event('submit'));
            }
          }}
        >
          <AlertTriangle size={20} className="animate-pulse" />
          {t('field.sos_signal')}
        </button>
      </div>

      {/* Camera Modal Overlay */}
      {showCamera && (
        <CameraModal 
          onCapture={handleCapture} 
          onClose={() => setShowCamera(false)} 
        />
      )}
    </div>
  );
};

export default FieldAgent;
