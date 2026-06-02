import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const ManualLocationPicker = ({ position, setPosition }) => {
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return position ? <Marker position={position} /> : null;
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer center={position || [5.336, -4.026]} zoom={position ? 15 : 12} className="h-full w-full" zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default ManualLocationPicker;
