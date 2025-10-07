import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Box, TextField, Typography, Chip, Alert } from '@mui/material';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  initialPosition?: [number, number];
  onLocationChange: (lat: number, lng: number, address?: string) => void;
}

type LocationSource = 'gps' | 'ip' | 'manual';

const LocationMarker = ({ position, onLocationChange }: { 
  position: [number, number]; 
  onLocationChange: (lat: number, lng: number) => void; 
}) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(position);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      onLocationChange(lat, lng);
    },
  });

  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  const handleDragEnd = (e: any) => {
    const marker = e.target;
    const newPosition = marker.getLatLng();
    setMarkerPosition([newPosition.lat, newPosition.lng]);
    onLocationChange(newPosition.lat, newPosition.lng);
  };

  return (
    <Marker
      position={markerPosition}
      draggable={true}
      eventHandlers={{
        dragend: handleDragEnd,
      }}
    />
  );
};

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  initialPosition = [37.7749, -122.4194],
  onLocationChange 
}) => {
  const [position, setPosition] = useState<[number, number]>(initialPosition);
  const [locationSource, setLocationSource] = useState<LocationSource>('manual');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const getIPLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.latitude && data.longitude) {
        const newPos: [number, number] = [data.latitude, data.longitude];
        setPosition(newPos);
        setLocationSource('ip');
        onLocationChange(newPos[0], newPos[1], `${data.city}, ${data.region}`);
      }
    } catch (error) {
      console.log('IP geolocation failed');
    }
  };

  const searchLocation = async (query: string) => {
    if (!query.trim()) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await response.json();
      if (data[0]) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setPosition([lat, lon]);
        setLocationSource('manual');
        onLocationChange(lat, lon, data[0].display_name);
      }
    } catch (error) {
      console.log('Address search failed');
    }
  };

  useEffect(() => {
    const initLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
            setPosition(newPos);
            setLocationSource('gps');
            onLocationChange(newPos[0], newPos[1]);
            setLoading(false);
          },
          async () => {
            await getIPLocation();
            setLoading(false);
          }
        );
      } else {
        await getIPLocation();
        setLoading(false);
      }
    };
    initLocation();
  }, []);

  const handleLocationChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setLocationSource('manual');
    onLocationChange(lat, lng);
  };

  const getLocationStatusColor = () => {
    switch (locationSource) {
      case 'gps': return 'success';
      case 'ip': return 'warning';
      default: return 'info';
    }
  };

  const getLocationStatusText = () => {
    switch (locationSource) {
      case 'gps': return 'Using GPS location';
      case 'ip': return 'Using approximate location';
      default: return 'Manual location selected';
    }
  };

  if (loading) {
    return <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</Box>;
  }

  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search for an address or landmark"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            searchLocation(searchQuery);
          }
        }}
        sx={{ mb: 2 }}
      />
      
      <Chip 
        label={getLocationStatusText()} 
        color={getLocationStatusColor()}
        size="small"
        sx={{ mb: 2 }}
      />
      
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '350px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} onLocationChange={handleLocationChange} />
      </MapContainer>
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
      </Typography>
    </Box>
  );
};

export default LocationPicker;