import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const HeatmapOverlay = ({ timeRange }) => {
  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-white/5 relative group">
      <MapContainer center={[5.336, -4.026]} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false} dragging={false} doubleClickZoom={false} scrollWheelZoom={false}>
        <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        {/* Simplified analytic view of heatmap */}
        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none group-hover:bg-transparent transition-colors" />
      </MapContainer>
      
      <div className="absolute bottom-3 right-3 bg-slate-950/80 px-2 py-1 rounded-lg border border-white/10">
         <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Densité: {timeRange}</p>
      </div>
    </div>
  );
};

export default HeatmapOverlay;
