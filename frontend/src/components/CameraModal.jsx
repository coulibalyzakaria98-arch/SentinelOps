import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CameraModal = ({ onCapture, onClose }) => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
  };

  const startCamera = async () => {
    setIsStarting(true);
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setError(t('errors.camera_permission'));
      
      // Fallback for desktop or front camera if environment fails
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
        setError(null);
      } catch (fallbackErr) {
        setError(t('errors.camera_not_found'));
      }
    } finally {
      setIsStarting(false);
    }
  };

  const capture = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    onCapture(imageData);
    stopCamera();
    onClose();
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-10">
        <h3 className="text-white font-black uppercase tracking-widest text-xs">{t('field.photo')}</h3>
        <button 
          onClick={onClose} 
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <X size={24} />
        </button>
      </div>

      {/* Video Stream */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mx-auto">
              <Camera size={32} />
            </div>
            <p className="text-white font-bold text-sm">{error}</p>
            <button 
              onClick={startCamera}
              className="px-6 py-3 bg-blue-600 rounded-xl text-white font-black uppercase text-xs tracking-widest"
            >
              {t('buttons.retry')}
            </button>
          </div>
        ) : !stream ? (
          <div className="flex flex-col items-center gap-4">
            <RefreshCw size={32} className="text-blue-500 animate-spin" />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">Initializing Optics...</p>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Controls */}
      {stream && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8 z-10">
          <div className="w-12" /> {/* Spacer */}
          
          <button 
            onClick={capture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/10 backdrop-blur transition-transform active:scale-90"
          >
            <div className="w-14 h-14 rounded-full bg-white shadow-lg" />
          </button>
          
          <button 
            onClick={startCamera}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white"
            title={t('buttons.refresh')}
          >
            <RefreshCw size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraModal;
