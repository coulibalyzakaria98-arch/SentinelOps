import { useState, useEffect, useCallback } from 'react';

// Default location: Abidjan, Côte d'Ivoire (HQ)
const DEFAULT_LOCATION = {
  lat: 5.3599,
  lng: -4.0083,
  name: 'Abidjan, Côte d\'Ivoire (Position par défaut)'
};

export function useGeolocation() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accuracy, setAccuracy] = useState(null);
  const [isUsingDefault, setIsUsingDefault] = useState(false);

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée.');
      setLocation(DEFAULT_LOCATION);
      setIsUsingDefault(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const options = {
      enableHighAccuracy: false, // Désactiver pour plus de compatibilité
      timeout: 8000,
      maximumAge: 30000 // Cache pendant 30s
    };

    const success = (pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        name: 'Position actuelle (GPS)'
      });
      setAccuracy(pos.coords.accuracy);
      setError(null);
      setIsUsingDefault(false);
      setLoading(false);
      console.log(`📍 GPS OK: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (±${Math.round(pos.coords.accuracy)}m)`);
    };

    const handleError = (err) => {
      let msg = 'GPS indisponible';
      switch (err.code) {
        case 1:
          msg = 'Permission GPS refusée — réactivez-la dans les paramètres du site ou la page actuelle.';
          break;
        case 2:
          msg = 'Signal GPS hors de portée';
          break;
        case 3:
          msg = 'Délai d\'attente GPS dépassé';
          break;
        default:
          msg = 'Erreur GPS: ' + err.message;
      }
      
      console.warn(`⚠️ ${msg}`);
      setError(msg);
      setLocation(DEFAULT_LOCATION);
      setIsUsingDefault(true);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, handleError, options);
  }, []);

  useEffect(() => {
    getPosition();
    
    // Essayer de mettre à jour la position toutes les 60 secondes
    const interval = setInterval(getPosition, 60000);
    return () => clearInterval(interval);
  }, [getPosition]);

  return { 
    position: location,
    error, 
    loading, 
    accuracy, 
    isUsingDefault,
    refresh: getPosition 
  };
}
