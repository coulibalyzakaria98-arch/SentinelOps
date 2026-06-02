import React, { useState } from 'react';
import { useOffline } from '../../contexts/OfflineContext';
import { saveReportOffline } from '../../services/offlineStorage';

const OfflineReportForm = () => {
  const { isOnline, refreshStats } = useOffline();
  const [formData, setFormData] = useState({
    damage_level: 'partial',
    infrastructure_type: 'residential',
    crisis_type: 'earthquake',
    description: '',
    latitude: null,
    longitude: null
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Géolocalisation
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
      },
      (error) => {
        console.error('Geolocation error:', error);
        setSubmitStatus({ type: 'error', message: 'Impossible d'obtenir votre position' });
      }
    );
  };
  
  // Gérer la photo
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setSubmitStatus({ type: 'error', message: 'Image trop volumineuse (max 5MB)' });
    }
  };
  
  // Soumettre le rapport
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude) {
      setSubmitStatus({ type: 'warning', message: 'Géolocalisation en cours...' });
      getLocation();
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const report = {
        ...formData,
        timestamp: new Date().toISOString(),
        device_id: localStorage.getItem('device_id') || crypto.randomUUID()
      };
      
      const result = await saveReportOffline(report, image);
      
      if (result.success) {
        setSubmitStatus({
          type: isOnline ? 'success' : 'offline',
          message: isOnline 
            ? 'Rapport envoyé avec succès !'
            : 'Rapport sauvegardé - Synchronisation automatique à la reconnexion'
        });
        
        // Reset form
        setFormData(prev => ({ ...prev, description: '' }));
        setImage(null);
        setImagePreview(null);
        await refreshStats();
        
        // Redirection après 2 secondes
        setTimeout(() => {
          window.location.href = '/command';
        }, 2000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({ type: 'error', message: 'Erreur lors de l'envoi du rapport' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Status message */}
      {submitStatus && (
        <div className={`p-3 rounded-lg ${
          submitStatus.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
          submitStatus.type === 'offline' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
          submitStatus.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
        }`}>
          <div className="flex items-center gap-2">
            {submitStatus.type === 'offline' && '📡'}
            {submitStatus.type === 'success' && '✅'}
            {submitStatus.type === 'error' && '❌'}
            <span className="text-sm">{submitStatus.message}</span>
          </div>
        </div>
      )}
      
      {/* Photo */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          📸 Prendre une photo
        </label>
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center">
          {imagePreview ? (
            <div>
              <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
              <button
                type="button"
                onClick={() => { setImage(null); setImagePreview(null); }}
                className="mt-2 text-sm text-red-400"
              >
                Supprimer
              </button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="hidden"
                id="camera-input"
              />
              <label
                htmlFor="camera-input"
                className="cursor-pointer inline-block px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                📷 Prendre une photo
              </label>
              <p className="text-xs text-slate-400 mt-2">PNG, JPG max 5MB</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Niveau de dégâts */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          🏷️ Niveau de dégâts
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'minimal', label: 'Minimes', color: 'green' },
            { value: 'partial', label: 'Partiels', color: 'orange' },
            { value: 'total', label: 'Totaux', color: 'red' }
          ].map(level => (
            <button
              key={level.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, damage_level: level.value }))}
              className={`p-2 rounded-lg text-sm font-medium transition ${
                formData.damage_level === level.value
                  ? `bg-${level.color}-600 text-white`
                  : `bg-slate-700 text-slate-300 hover:bg-slate-600`
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Type d'infrastructure */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          🏢 Infrastructure
        </label>
        <select
          value={formData.infrastructure_type}
          onChange={(e) => setFormData(prev => ({ ...prev, infrastructure_type: e.target.value }))}
          className="w-full bg-slate-700 rounded-lg p-2 text-white"
        >
          <option value="residential">Résidentiel</option>
          <option value="commercial">Commercial</option>
          <option value="governmental">Gouvernemental</option>
          <option value="utility">Utilitaire</option>
          <option value="transport">Transport</option>
        </select>
      </div>
      
      {/* Type de crise */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          🌊 Type de crise
        </label>
        <select
          value={formData.crisis_type}
          onChange={(e) => setFormData(prev => ({ ...prev, crisis_type: e.target.value }))}
          className="w-full bg-slate-700 rounded-lg p-2 text-white"
        >
          <option value="earthquake">Tremblement de terre</option>
          <option value="flood">Inondation</option>
          <option value="cyclone">Cyclone</option>
          <option value="fire">Incendie</option>
          <option value="conflict">Conflit</option>
        </select>
      </div>
      
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          📝 Description (optionnelle)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full bg-slate-700 rounded-lg p-2 text-white resize-none"
          placeholder="Décrivez brièvement la situation..."
        />
      </div>
      
      {/* Localisation */}
      <div className="bg-slate-800 rounded-lg p-3">
        <button
          type="button"
          onClick={getLocation}
          className="flex items-center gap-2 text-sm text-blue-400"
        >
          <span>📍</span>
          {formData.latitude ? (
            <span>Position: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</span>
          ) : (
            <span>Obtenir ma position</span>
          )}
        </button>
      </div>
      
      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting || !formData.latitude || !formData.longitude}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Envoi...
          </span>
        ) : (
          isOnline ? '📡 ENVOYER LE RAPPORT' : '💾 SAUVEGARDER (HORS LIGNE)'
        )}
      </button>
    </form>
  );
};

export default OfflineReportForm;
