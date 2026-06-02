import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { reportApi } from '../../services/api';
import { offlineStorage } from '../../services/offlineStorage';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Camera, Send, X, AlertOctagon, AlertTriangle, Info, CheckCircle2, ChevronRight } from 'lucide-react';

import { smsService } from '../../services/smsService';
import { MessageSquare, Hash } from 'lucide-react';

import ManualLocationPicker from '../common/ManualLocationPicker.jsx';

const StressReportForm = ({ onSubmitSuccess, onClose }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ damage_level: 'partial', infrastructure_type: 'road', description: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSmsFallback, setShowSmsFallback] = useState(false);
  const [manualPosition, setManualPosition] = useState(null);

  const { location: gpsLocation, error: geoError, loading: geoLoading, accuracy: geoAccuracy } = useGeolocation();
  const isOnline = useNetworkStatus();

  // Unified Location: Manual override takes precedence over GPS
  const effectiveLocation = manualPosition || (gpsLocation ? [gpsLocation.lat, gpsLocation.lng] : null);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!effectiveLocation) {
      alert("⚠️ Protocole de Localisation requis : Sélectionnez une zone d'impact.");
      return;
    }

    setIsSubmitting(true);
    const reportPayload = {
      title: data.title || `RAPID-CAPTURE-${new Date().toISOString().substr(11,8)}`,
      description: data.description,
      damage_level: data.damage_level,
      infrastructure_type: data.infrastructure_type || 'unknown',
      latitude: effectiveLocation[0],
      longitude: effectiveLocation[1],
      image: image // Note: L'image sera gérée par reportApi.submitSafe
    };

    try {
      if (navigator.onLine) {
        // Envoi direct via API chiffrée
        await reportApi.submitSafe(reportPayload);
        setIsSuccess(true);
      } else {
        // Enregistrement dans la file d'attente tactique locale
        await offlineStorage.saveReport(reportPayload);
        setIsSuccess(true);
      }
      setTimeout(onSubmitSuccess, 2000);
    } catch (error) {
      console.error('❌ Échec critique de transmission:', error);
      alert("Erreur de protocole. Tentative de sauvegarde locale...");
      await offlineStorage.saveReport(reportPayload);
      setIsSuccess(true);
      setTimeout(onSubmitSuccess, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSmsFallback) {
    const loc = effectiveLocation || [0,0];
    const payload = { ...data, latitude: loc[0], longitude: loc[1] };
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-900 text-white animate-in zoom-in">
        <div className="w-16 h-16 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center mb-6">
          <MessageSquare size={32} />
        </div>
        <h2 className="text-xl font-black uppercase text-center">Réseau Instable</h2>
        <p className="text-slate-400 text-center text-sm mt-2 mb-8">L'envoi IP a échoué. Utilisez le protocole SMS d'urgence pour transmettre vos coordonnées.</p>
        
        <div className="w-full space-y-4">
          <a 
            href={smsService.generateSmsUri(payload)}
            className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-xl font-black uppercase text-sm"
          >
            <MessageSquare size={18} /> Envoyer via SMS
          </a>
          
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Code USSD Direct</p>
            <p className="text-lg font-mono text-yellow-500 text-center tracking-widest">{smsService.generateUssdCode(payload)}</p>
          </div>

          <button 
            onClick={() => setShowSmsFallback(false)}
            className="w-full p-4 text-slate-500 font-bold uppercase text-[10px]"
          >
            Retour au formulaire
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess) return (
    <div className="h-full flex flex-col items-center justify-center p-10 bg-slate-900 text-white animate-in zoom-in duration-300">
      <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
        <CheckCircle2 size={50} />
      </div>
      <h2 className="text-2xl font-bold mt-8">Report Secured</h2>
      <p className="text-slate-400 mt-2">{isOnline ? 'Transmitted to Headquarters' : 'Stored in Local Queue'}</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-950 font-sans">
      {/* Premium Header */}
      <header className="glass-panel h-16 flex items-center justify-between px-6 z-10">
        <div>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Deployment Protocol</p>
          <h3 className="text-sm font-black uppercase text-slate-100">Step {step} of 3</h3>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><X size={20} className="text-slate-400" /></button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {step === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white leading-tight">Visual Evidence</h2>
              <p className="text-slate-400 mt-2">Capture the impact for immediate analysis</p>
            </div>
            <label className="relative w-full max-w-xs aspect-square group cursor-pointer">
              <input type="file" accept="image/*" capture="environment" onChange={handleCapture} className="hidden" />
              <div className="w-full h-full glass-panel rounded-[2rem] flex flex-col items-center justify-center text-blue-500 hover:border-blue-500/50 transition-all group-active:scale-95 shadow-2xl">
                <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
                  <Camera size={40} />
                </div>
                <span className="font-bold uppercase text-xs tracking-widest">Activate Camera</span>
              </div>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-right duration-300">
            <h2 className="text-xl font-bold text-white mb-2">Assess Damage Level</h2>
            {[
              { id: 'total', label: 'Catastrophic', desc: 'Critical infrastructure failure', color: 'bg-red-500', icon: <AlertOctagon /> },
              { id: 'partial', label: 'Significant', desc: 'Major structural damage', color: 'bg-orange-500', icon: <AlertTriangle /> },
              { id: 'minimal', label: 'Moderate', desc: 'Functional with minor issues', color: 'bg-green-500', icon: <Info /> }
            ].map(opt => (
              <button 
                key={opt.id}
                onClick={() => { setData({...data, damage_level: opt.id}); setStep(3); }}
                className="glass-panel p-5 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`${opt.color} p-3 rounded-xl text-white`}>{opt.icon}</div>
                  <div>
                    <p className="font-bold text-slate-100">{opt.label}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">{opt.desc}</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-600 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6 animate-in slide-in-from-bottom duration-300">
            <div className="relative h-48 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img src={preview} className="w-full h-full object-cover" alt="Capture" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 bg-slate-900/80 px-2 py-1 rounded-md border border-white/5">
                  <div className={`w-2 h-2 rounded-full ${data.damage_level === 'total' ? 'bg-red-500' : 'bg-green-500'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{data.damage_level} impact</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Additional Intelligence</label>
              <textarea 
                placeholder="Describe current status or specific needs..."
                className="w-full glass-panel rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none min-h-[80px]"
                value={data.description}
                onChange={(e) => setData({...data, description: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.1em]">Geospatial Intelligence</label>
                
                {/* 🛰️ GPS STATUS HUD */}
                <div className="flex items-center gap-2">
                  {geoError ? (
                    <span className="text-[9px] font-black text-red-500 uppercase animate-pulse">GPS Bloqué</span>
                  ) : geoLoading ? (
                    <span className="text-[9px] font-black text-blue-400 uppercase animate-pulse text-right flex items-center gap-1">
                      <Satellite size={10} className="animate-spin-slow" /> Recherche Signal...
                    </span>
                  ) : (
                    <span className="text-[9px] font-black text-green-500 uppercase flex items-center gap-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
                      Précision: {Math.round(geoAccuracy || 0)}m
                    </span>
                  )}
                </div>
              </div>
              
              <div className="rounded-2xl overflow-hidden border border-white/5 shadow-inner bg-slate-900 h-40 relative">
                <ManualLocationPicker 
                  position={effectiveLocation} 
                  setPosition={(pos) => setManualPosition(pos)} 
                />
                {!effectiveLocation && !geoLoading && (
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center p-6 text-center pointer-events-none">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                       Signal GPS Obstrué.<br/>Cliquez sur la carte pour désigner la zone.
                     </p>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`btn-premium w-full py-5 text-lg transition-all ${!effectiveLocation ? 'opacity-50 grayscale cursor-not-allowed' : 'btn-premium-primary'}`}
            >
              <Send size={24} />
              {isSubmitting ? 'Transmitting...' : 'Send Intelligence'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StressReportForm;
