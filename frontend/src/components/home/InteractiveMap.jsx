import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Plus, Minus, Navigation, Maximize2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

// Custom circular marker with thumbnail and label matching reference image
const createCustomIcon = (imgUrl, title) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
        <div style="
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 3px solid #6C3DF5;
          box-shadow: 0 4px 12px rgba(108, 61, 245, 0.35);
          overflow: hidden;
          background: #fff;
        ">
          <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${title}" />
        </div>
        <div style="
          margin-top: 4px;
          background: rgba(20, 33, 61, 0.9);
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 8px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        ">
          ${title}
        </div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 25],
  });
};

export const InteractiveMap = ({ locations = [] }) => {
  const { isDarkMode } = useTheme();
  const [mapInstance, setMapInstance] = useState(null);

  // Default points in Bali matching the reference image
  const defaultLocations = [
    {
      name: 'Lovina',
      lat: -8.1500,
      lng: 115.0270,
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=200&q=80',
      description: 'Famous dolphin watching & black sand sunrise beaches',
    },
    {
      name: 'Munduk',
      lat: -8.2700,
      lng: 115.0600,
      image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=200&q=80',
      description: 'Misty mountain waterfalls & clove plantations',
    },
    {
      name: 'Ubud',
      lat: -8.5069,
      lng: 115.2625,
      image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=200&q=80',
      description: 'Cultural heart, monkey forest, and terraced rice paddies',
    },
    {
      name: 'Tanah Lot',
      lat: -8.6212,
      lng: 115.0868,
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=200&q=80',
      description: 'Ancient rock temple bathed in legendary ocean sunsets',
    },
    {
      name: 'Seminyak',
      lat: -8.6913,
      lng: 115.1682,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80',
      description: 'Beach clubs, luxury boutique dining & golden sand beaches',
    },
    {
      name: 'Nusa Penida',
      lat: -8.7278,
      lng: 115.5444,
      image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=200&q=80',
      description: 'Kelingking T-Rex cliff and crystal clear manta ray snorkeling',
    },
    {
      name: 'Uluwatu',
      lat: -8.8290,
      lng: 115.0849,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=200&q=80',
      description: 'Limestone clifftop temple with dramatic sunset Kecak dance',
    },
  ];

  const mapPoints = locations.length > 0 ? locations : defaultLocations;
  const centerLat = mapPoints[2]?.lat || -8.5069;
  const centerLng = mapPoints[2]?.lng || 115.2625;

  const polylineRoute = mapPoints.map((pt) => [pt.lat, pt.lng]);

  const handleZoomIn = () => mapInstance && mapInstance.zoomIn();
  const handleZoomOut = () => mapInstance && mapInstance.zoomOut();
  const handleReset = () => mapInstance && mapInstance.setView([centerLat, centerLng], 9);

  return (
    <div className="relative w-full h-[460px] sm:h-[500px] rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 dark:border-slate-800 bg-slate-100 dark:bg-[#111C2E]">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={9}
        scrollWheelZoom={false}
        zoomControl={false}
        ref={setMapInstance}
        className="w-full h-full"
      >
        <TileLayer
          key={isDarkMode ? 'dark-tiles' : 'light-tiles'}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={
            isDarkMode
              ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          }
        />

        {/* Connecting route line matching the reference image */}
        <Polyline
          positions={polylineRoute}
          color="#8B5CF6"
          weight={3}
          opacity={0.8}
          dashArray="6, 8"
        />

        {/* Location Markers with Custom circular thumbnails */}
        {mapPoints.map((loc) => (
          <Marker
            key={loc.name}
            position={[loc.lat, loc.lng]}
            icon={createCustomIcon(loc.image, loc.name)}
          >
            <Popup className="rounded-2xl">
              <div className="p-1 max-w-[180px]">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-24 object-cover rounded-xl mb-2"
                />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{loc.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 leading-relaxed">
                  {loc.description}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Map Controls from reference */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          aria-label="Zoom in"
          className="w-10 h-10 rounded-xl bg-white dark:bg-[#1A2740] shadow-lg border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#6C3DF5] dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-[#152238] transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="w-10 h-10 rounded-xl bg-white dark:bg-[#1A2740] shadow-lg border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#6C3DF5] dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-[#152238] transition-colors cursor-pointer"
        >
          <Minus className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          aria-label="Locate/Reset center"
          className="w-10 h-10 rounded-xl bg-white dark:bg-[#1A2740] shadow-lg border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#6C3DF5] dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-[#152238] transition-colors cursor-pointer"
        >
          <Navigation className="w-4 h-4 text-[#6C3DF5] dark:text-purple-400" />
        </button>
      </div>

      {/* Handwritten decorative text note from reference */}
      <div className="absolute top-4 right-6 z-20 pointer-events-none hidden sm:flex items-center gap-1 font-handwriting text-2xl text-slate-700 dark:text-slate-200 rotate-6">
        <span>Interactive <br />Travel Map</span>
        <svg className="w-10 h-10 text-[#6C3DF5] dark:text-purple-400" viewBox="0 0 50 50" fill="none" stroke="currentColor">
          <path d="M5,5 Q30,10 35,35" strokeWidth="2" strokeLinecap="round" />
          <path d="M28,30 L35,35 L38,25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export default InteractiveMap;
