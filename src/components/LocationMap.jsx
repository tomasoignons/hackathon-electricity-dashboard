// filepath: /home/emmanuel/vs_code/weather/hackathon/electricity-dashboard/src/components/LocationMap.jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMap = ({ onLocationSelect }) => {
  const [position, setPosition] = useState([52.1082726, 9.362171]); // Centered around Germany

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setPosition([lat, lng]);
    onLocationSelect([lat, lng]);
  };

  return (
    <MapContainer center={position} zoom={6} style={{ height: '100%', width: '100%' }} onClick={handleMapClick}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          Selected Location: {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default LocationMap;