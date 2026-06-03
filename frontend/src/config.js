// Configuration centralisée pour SentinelOps
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

const config = {
  // Version de l'application
  version: '1.0.0',
  
  // Environnement
  isProduction,
  isDevelopment,
  
  // API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  
  // Map
  mapTileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  mapAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  
  // Features
  sentinelFusionActive: import.meta.env.VITE_SENTINEL_FUSION_ACTIVE === 'true',
  
  // Offline
  offlineDbName: 'sentinelops-offline',
  maxOfflineReports: 100,
  
  // Upload
  maxImageSizeMB: 5,
  acceptedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

// Pour compatibilité avec les anciens imports
export const API_BASE_URL = config.apiUrl;

export { config };
export default config;
