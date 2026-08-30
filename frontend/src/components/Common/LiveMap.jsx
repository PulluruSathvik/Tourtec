import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Layers,
  Check,
  Globe2,
  Map as MapIcon,
  Home,
  Sparkles,
  Navigation,
  Compass,
  Maximize2,
  Minimize2,
  Eye,
  ExternalLink,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Custom Leaflet Icons with Light Indian Heritage Theme
const createCustomIcon = (color, label = '', isPulsing = false) => {
  const borderColor = color === 'saffron' ? '#D97706' : color === 'red' ? '#DC2626' : color === 'emerald' ? '#059669' : '#0284C7';
  const glowShadow = color === 'saffron' ? '0 2px 10px rgba(217, 119, 6, 0.4)' : color === 'red' ? '0 2px 10px rgba(220, 38, 38, 0.4)' : '0 2px 10px rgba(5, 150, 105, 0.35)';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div class="relative flex items-center justify-center">
        ${isPulsing ? `<div class="absolute w-12 h-12 rounded-full bg-amber-400/40 animate-ping"></div>` : ''}
        <div class="w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center text-xs shadow-lg text-slate-900 font-bold" style="border-color: ${borderColor}; box-shadow: ${glowShadow};">
          ${label || '📍'}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

// Helper to safely parse any coordinate format
const parseSafeCoords = (input, defaultCoords = [25.3176, 83.0062]) => {
  if (!input) return defaultCoords;
  if (Array.isArray(input)) {
    const lat = Number(input[0]);
    const lng = Number(input[1]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }
  if (typeof input === 'object') {
    const lat = Number(input.lat ?? input.centerLat ?? input.latitude);
    const lng = Number(input.lng ?? input.centerLng ?? input.longitude);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }
  return defaultCoords;
};

// Map Recenter Helper Component with Smooth FlyTo & Auto-Bounds Fitting
const ChangeMapView = ({ center, zoom, roadmapPoints, userGpsCoords }) => {
  const map = useMap();
  useEffect(() => {
    // If user clicked Locate My Home / GPS, zoom super close onto user's location (Zoom 19)
    if (userGpsCoords && userGpsCoords.lat && userGpsCoords.lng) {
      map.flyTo([userGpsCoords.lat, userGpsCoords.lng], 19, { animate: true, duration: 1.5 });
      return;
    }

    const safe = parseSafeCoords(center);
    
    // If roadmap points are provided, fit bounds to show all attractions in the city
    if (roadmapPoints && roadmapPoints.length > 0) {
      const validPoints = roadmapPoints.filter(p => p.lat && p.lng);
      if (validPoints.length > 1) {
        try {
          const bounds = L.latLngBounds(validPoints.map(p => [Number(p.lat), Number(p.lng)]));
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16, animate: true, duration: 1.2 });
          return;
        } catch (e) {
          console.warn('Bounds fit fallback:', e);
        }
      }
    }
    
    map.flyTo(safe, zoom || 15, { animate: true, duration: 1.2 });
  }, [center, zoom, roadmapPoints, userGpsCoords, map]);

  return null;
};

export const LiveMap = ({
  center = [25.3176, 83.0062],
  zoom = 15,
  zones = [],
  roadmapPoints = [],
  userLocation = null,
  showHeatCircles = true,
  height = '490px',
  onMarkerClick = null
}) => {
  const safeCenter = parseSafeCoords(center, [25.3176, 83.0062]);

  // Map Provider & Layer State (Default to Google Hybrid Satellite showing Houses & Roads)
  const [activeLayer, setActiveLayer] = useState('google_hybrid');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [show360Modal, setShow360Modal] = useState(false);
  
  const [userGpsCoords, setUserGpsCoords] = useState(null);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);

  // High-Definition Tile Providers (Google Satellite showing exact houses, rooftops, roads, lanes)
  const tileProviders = {
    google_hybrid: {
      name: '🛰️ Google Hybrid (Houses, Roads & Rooftops)',
      url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps Satellite Imagery & Roads',
      maxZoom: 21
    },
    google_satellite: {
      name: '🛰️ Google Pure Satellite (Ultra-HD)',
      url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps Satellite Imagery',
      maxZoom: 21
    },
    google_streets: {
      name: '🗺️ Google Street Map (Roads & House Numbers)',
      url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps Street Data',
      maxZoom: 20
    },
    esri_streets: {
      name: '🗺️ ESRI Clean Street Map (HD Light)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri, HERE, Garmin',
      maxZoom: 19
    },
    osm: {
      name: '🗺️ OpenStreetMap (Standard Grid)',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }
  };

  const currentTileConfig = tileProviders[activeLayer] || tileProviders.google_hybrid;

  const polylineCoords = roadmapPoints
    .filter(p => p.lat && p.lng)
    .map(p => [Number(p.lat), Number(p.lng)]);

  // 1-Click "Locate My Home / Current GPS Position in Satellite View"
  const handleLocateMyHome = () => {
    setIsLocatingUser(true);
    setLocationStatus('Locating your GPS coordinates...');

    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      setIsLocatingUser(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserGpsCoords({ lat: latitude, lng: longitude, title: 'My Home / Current Location' });
        setActiveLayer('google_hybrid'); // Automatically switch to Satellite View so user sees their rooftop/home!
        setIsLocatingUser(false);
        setLocationStatus('📍 Zoomed in to your home & roads in Satellite 3D View!');

        confetti({ particleCount: 50, spread: 70 });
        setTimeout(() => setLocationStatus(null), 4000);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setUserGpsCoords({ lat: safeCenter[0], lng: safeCenter[1], title: 'Current Region' });
        setActiveLayer('google_hybrid');
        setIsLocatingUser(false);
        setLocationStatus('Using current map center in Satellite 3D View.');
        setTimeout(() => setLocationStatus(null), 3000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Coordinates for 360 Google View
  const targetLat = userGpsCoords?.lat || safeCenter[0];
  const targetLng = userGpsCoords?.lng || safeCenter[1];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-950" style={{ height }}>
      
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none">
        
        {/* Left: Quick Satellite ➔ Street View Toggle & Locate Home */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-lg text-xs">
          
          {/* Satellite Mode Button */}
          <button
            onClick={() => setActiveLayer('google_hybrid')}
            className={`px-3 py-1.5 rounded-xl font-black transition flex items-center gap-1.5 cursor-pointer ${
              activeLayer === 'google_hybrid' || activeLayer === 'google_satellite'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-white hover:text-amber-400'
            }`}
            title="Show satellite imagery with roads & houses"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>🛰️ Satellite (Roads & Houses)</span>
          </button>

          {/* Street Map Button */}
          <button
            onClick={() => setActiveLayer('google_streets')}
            className={`px-3 py-1.5 rounded-xl font-black transition flex items-center gap-1.5 cursor-pointer ${
              activeLayer === 'google_streets' || activeLayer === 'esri_streets' || activeLayer === 'osm'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-white hover:text-amber-400'
            }`}
            title="Show regular street map"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>🗺️ Streets</span>
          </button>

          <div className="w-[1px] h-4 bg-white/20 my-auto"></div>

          {/* 360° Google Viewport Button */}
          <button
            onClick={() => setShow360Modal(true)}
            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
            title="Open 360 Google Maps Street & Satellite View"
          >
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">360° View</span>
          </button>

          {/* Locate My Home GPS Button */}
          <button
            onClick={handleLocateMyHome}
            disabled={isLocatingUser}
            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
            title="Zoom into your home in Satellite View"
          >
            <Home className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">{isLocatingUser ? 'Finding...' : 'Locate Home'}</span>
          </button>
        </div>

        {/* Right: Layer Dropdown */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 text-xs font-bold text-white shadow-lg hover:bg-slate-800 transition cursor-pointer"
              title="Change Map Layers"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Layers</span>
            </button>

            {/* Layer Menu Dropdown */}
            {showLayerMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-2 space-y-1 text-xs animate-fadeIn text-white z-[1010]">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Map & Satellite View:
                </div>
                {Object.entries(tileProviders).map(([key, provider]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveLayer(key);
                      setShowLayerMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between font-semibold transition cursor-pointer ${
                      activeLayer === key
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{provider.name}</span>
                    {activeLayer === key && <Check className="w-3.5 h-3.5 text-slate-950" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* GPS Status Toast */}
      {locationStatus && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/90 backdrop-blur-md border border-amber-400 px-4 py-2 rounded-2xl text-xs font-bold text-amber-300 shadow-xl animate-fadeIn flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{locationStatus}</span>
        </div>
      )}

      {/* Map Container (High-Res zoom up to 21 for house and road details) */}
      <MapContainer
        center={safeCenter}
        zoom={zoom}
        maxZoom={21}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeMapView
          center={safeCenter}
          zoom={zoom}
          roadmapPoints={roadmapPoints}
          userGpsCoords={userGpsCoords}
        />
        
        {/* Dynamic Tile Layer (Google Hybrid Satellite / Streets) */}
        <TileLayer
          key={activeLayer}
          attribution={currentTileConfig.attribution}
          url={currentTileConfig.url}
          maxZoom={currentTileConfig.maxZoom || 21}
          maxNativeZoom={currentTileConfig.maxZoom || 21}
        />

        {/* Dynamic Zone Heat & Geofence Circles */}
        {showHeatCircles && zones && zones.map(zone => {
          if (!zone.lat || !zone.lng) return null;
          const isRed = zone.status === 'overcrowded';
          const isAmber = zone.status === 'heavy';
          const circleColor = isRed ? '#EF4444' : isAmber ? '#F59E0B' : '#10B981';

          return (
            <React.Fragment key={zone.id}>
              <Circle
                center={[Number(zone.lat), Number(zone.lng)]}
                radius={isRed ? 380 : 220}
                pathOptions={{
                  color: circleColor,
                  fillColor: circleColor,
                  fillOpacity: isRed ? 0.35 : 0.2,
                  weight: 2,
                  dashArray: isRed ? '4, 4' : null
                }}
              />
            </React.Fragment>
          );
        })}

        {/* Roadmap Numbered Sightseeing Markers */}
        {roadmapPoints && roadmapPoints.map((point, pIdx) => {
          if (!point.lat || !point.lng) return null;
          return (
            <Marker
              key={point.id || `pt-${pIdx}`}
              position={[Number(point.lat), Number(point.lng)]}
              icon={createCustomIcon('saffron', `${pIdx + 1}`)}
            >
              <Popup>
                <div className="p-1 min-w-[200px] text-slate-900">
                  <div className="text-xs font-black text-blue-700 uppercase">Stop #{pIdx + 1}</div>
                  <div className="font-bold text-sm text-slate-900 mt-0.5">{point.title}</div>
                  <div className="text-xs text-slate-600 mt-1">{point.directionsGuide || point.tips}</div>
                  <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-amber-700">
                    <span>{point.recommendedTransport || 'Auto / Cab'}</span>
                    <span>{point.recommendedFare || '₹30'}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* User GPS Home Marker */}
        {userGpsCoords && (
          <Marker
            position={[userGpsCoords.lat, userGpsCoords.lng]}
            icon={createCustomIcon('emerald', '🏠', true)}
          >
            <Popup>
              <div className="p-1 font-bold text-xs text-slate-900">
                🏠 <strong>Your Location / Home</strong>
                <p className="text-[11px] text-slate-600 font-normal mt-1">
                  Viewing in Google Satellite 3D Mode (Rooftops & Roads)
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Connecting GPS Route Line */}
        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: '#3B82F6',
              weight: 4,
              opacity: 0.85,
              dashArray: '8, 8'
            }}
          />
        )}
      </MapContainer>

      {/* 360° GOOGLE MAPS IN-MAP MODAL VIEWPORT */}
      {show360Modal && (
        <div className="absolute inset-0 z-[2000] bg-slate-950/95 backdrop-blur-md p-4 flex flex-col animate-fadeIn text-white">
          <div className="flex items-center justify-between pb-3 border-b border-white/20">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              <div>
                <h4 className="text-sm font-black text-white">360° Google Maps Satellite & Street View</h4>
                <p className="text-[10px] text-slate-400">Viewing real roads, buildings, houses and monuments at {targetLat.toFixed(4)}°N, {targetLng.toFixed(4)}°E</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://earth.google.com/web/search/${targetLat},${targetLng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <span>Google Earth 3D</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setShow360Modal(false)}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full rounded-2xl overflow-hidden mt-3 border border-white/20">
            <iframe
              src={`https://maps.google.com/maps?q=${targetLat},${targetLng}&t=k&z=18&ie=UTF8&iwloc=&output=embed`}
              title="360 Google Satellite View"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
};
