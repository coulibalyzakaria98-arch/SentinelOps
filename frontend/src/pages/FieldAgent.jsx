import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import { useGeolocation } from '../hooks/useGeolocation';
import KPICard from '../components/common/KPICard';
import { 
  Camera, 
  MapPin, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Wifi, 
  WifiOff,
  Battery,
  Navigation,
  FileText,
  Activity,
  X,
  RotateCw, // Remplacé RefreshCw par RotateCw pour éviter le crash DOM
  Clock
} from 'lucide-react';

const FieldAgent = () => {
  const { user } = useAuth();
  const { isOnline, pendingCount, saveOffline } = useOffline();
  const { position, accuracy, error: locationError, isUsingDefault, refresh: refreshGPS } = useGeolocation();
  
  // États du formulaire
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [damageLevel, setDamageLevel] = useState('partial');
  const [crisisType, setCrisisType] = useState('flood');
  
  // États caméra
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // États UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(85);

  useEffect(() => {
    const batteryInterval = setInterval(() => {
      setBatteryLevel(prev => Math.max(5, prev - Math.random() * 0.2));
    }, 60000);
    return () => {
      clearInterval(batteryInterval);
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      }, 100);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Accès caméra refusé. Vérifiez vos permissions.");
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(dataUrl);
    
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !position) return;

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
          message: isOnline ? "Transmis avec succès." : "Stocké localement."
        });
        setTitle('');
        setDescription('');
        setCapturedImage(null);
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (err) {
      setSubmitStatus({ type: 'error', message: "Échec de l'envoi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 📡 BARRE DE STATUT */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-2xl border-white/10 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi className="text-emerald-500" size={16} /> : <WifiOff className="text-red-500" size={16} />}
            <span className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
              {isOnline ? 'Liaison Active' : 'Mode Offline'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Battery size={16} className={batteryLevel > 20 ? 'text-emerald-500' : 'text-red-500'} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{Math.round(batteryLevel)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Navigation size={16} className={isUsingDefault ? 'text-amber-500' : 'text-emerald-500'} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {isUsingDefault ? 'GPS Default' : `±${Math.round(accuracy || 0)}m`}
            </span>
          </div>
        </div>
        <div className="hidden sm:block text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
          RR-PROTO-FIELD-882
        </div>
      </div>

      {/* 🚀 KPIS RAPIDES */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Queue" value={pendingCount.toString()} subtitle="En attente" icon={<Clock size={20} />} color={pendingCount > 0 ? "amber" : "emerald"} />
        <KPICard title="ID Agent" value={user?.name?.split(' ')[0].toUpperCase() || 'AGENT'} subtitle="Secteur Alpha" icon={<Activity size={20} />} color="blue" />
        <KPICard title="Position" value={`${position.lat.toFixed(2)} / ${position.lng.toFixed(2)}`} subtitle="Tactique" icon={<MapPin size={20} />} color="accent" />
        <KPICard title="Rapports" value="03" subtitle="24h" icon={<FileText size={20} />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 📝 FORMULAIRE */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-8 rounded-[2rem] border-white/10 shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/20">
                    <Send size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Nouveau Rapport</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Intelligence Terrain</p>
                  </div>
                </div>

                {submitStatus && (
                  <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
                    submitStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    <CheckCircle2 size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">{submitStatus.message}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Titre de l'incident" 
                      className="w-full bg-[#0A0F2A]/60 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm"
                      required
                    />
                    <select 
                      value={crisisType}
                      onChange={(e) => setCrisisType(e.target.value)}
                      className="w-full bg-[#0A0F2A]/60 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm"
                    >
                      <option value="flood">Inondation 🌊</option>
                      <option value="fire">Incendie 🔥</option>
                      <option value="earthquake">Séisme 🌋</option>
                      <option value="conflict">Conflit ⚔️</option>
                    </select>
                  </div>

                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Description tactique..."
                    className="w-full bg-[#0A0F2A]/60 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm resize-none"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['minimal', 'partial', 'total'].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDamageLevel(level)}
                        className={`p-4 rounded-2xl border transition-all ${
                          damageLevel === level ? 'bg-blue-600 text-white' : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">{level}</span>
                      </button>
                    ))}
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting || !title}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.3em] shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? <RotateCw className="animate-spin" size={20} /> : <Send size={20} />}
                    {isOnline ? "Transmettre" : "Sauvegarder"}
                  </button>
                </form>
             </div>
          </div>
        </div>

        {/* 📸 CAMERA & GPS */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-[2rem] border-white/10 shadow-xl">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Camera size={14} className="text-blue-500" /> Capture
            </h3>
            <div className="relative aspect-square rounded-3xl bg-[#0A0F2A] border border-white/5 overflow-hidden">
               {!isCameraActive && !capturedImage && (
                 <button onClick={startCamera} className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <Camera size={32} className="text-blue-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase">Activer Caméra</span>
                 </button>
               )}
               {isCameraActive && (
                 <div className="relative h-full">
                   <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                   <button onClick={capturePhoto} className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white text-blue-900 rounded-xl font-black text-[10px] uppercase">Capturer</button>
                 </div>
               )}
               {capturedImage && <img src={capturedImage} alt="Tactical" className="w-full h-full object-cover" />}
            </div>
            {capturedImage && (
              <button onClick={() => setCapturedImage(null)} className="w-full mt-4 py-2 text-red-500 text-[10px] font-black uppercase">Supprimer la photo</button>
            )}
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border-white/10 shadow-xl">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-500" /> GPS
                </h3>
                <button onClick={refreshGPS} className="p-1 hover:bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <RotateCw size={14} />
                </button>
             </div>
             <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400"><span>Lat</span><span className="text-white">{position?.lat?.toFixed(6)}</span></div>
                <div className="flex justify-between text-slate-400"><span>Lng</span><span className="text-white">{position?.lng?.toFixed(6)}</span></div>
                {locationError && <p className="text-[8px] text-amber-500 mt-2 italic">{locationError}</p>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldAgent;
