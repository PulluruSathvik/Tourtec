import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Satellite,
  Compass,
  Maximize2,
  Minimize2,
  ExternalLink,
  MapPin,
  Sparkles,
  Layers,
  Eye,
  Navigation,
  RefreshCw,
  Share2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Satellite360Map = () => {
  const { currentDestination, globalPlace } = useApp();

  const [mapMode, setMapMode] = useState('satellite'); // 'satellite' (t=k) | 'hybrid' (t=h) | 'streetview'
  const [zoomLevel, setZoomLevel] = useState(17);
  const [selectedSpotIndex, setSelectedSpotIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  const cityName = currentDestination?.name?.split(',')[0]?.trim() || 'Varanasi';
  const spots = currentDestination?.roadmap || currentDestination?.zones || [
    { title: `${cityName} Heritage Center`, lat: currentDestination?.center?.[0] || 25.3176, lng: currentDestination?.center?.[1] || 83.0062 }
  ];

  const activeSpot = spots[selectedSpotIndex] || spots[0] || {
    title: `${cityName} Center`,
    lat: currentDestination?.center?.[0] || 25.3176,
    lng: currentDestination?.center?.[1] || 83.0062
  };

  const lat = activeSpot.lat || currentDestination?.center?.[0] || 25.3176;
  const lng = activeSpot.lng || currentDestination?.center?.[1] || 83.0062;

  // Reset selected spot when city changes
  useEffect(() => {
    setSelectedSpotIndex(0);
    setZoomLevel(17);
  }, [currentDestination]);

  // 360 Orbit rotation effect simulation
  useEffect(() => {
    let interval;
    if (isRotating) {
      interval = setInterval(() => {
        setRotationAngle(prev => (prev + 15) % 360);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isRotating]);

  // Generate Google Maps Embed URL
  const getGoogleMapsEmbedUrl = () => {
    if (mapMode === 'streetview') {
      return `https://maps.google.com/maps?layer=c&cbll=${lat},${lng}&cbp=12,${rotationAngle},0,0,0&output=svembed`;
    }
    const mapType = mapMode === 'hybrid' ? 'h' : 'k'; // k = Satellite, h = Hybrid Satellite with labels
    return `https://maps.google.com/maps?q=${lat},${lng}&t=${mapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;
  };

  // Direct Google Earth 3D URL
  const googleEarthUrl = `https://earth.google.com/web/search/${encodeURIComponent(activeSpot.title + ' ' + cityName)}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className={`space-y-4 animate-fadeIn ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 sm:p-6 overflow-y-auto' : ''}`}>

      {/* TOP CONTROL BAR */}
      <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Title & Coordinate HUD */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black">
            <Satellite className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Google Maps 360° Satellite & Street View</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>360° Satellite Radar: {activeSpot.title}</span>
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500 font-bold">
            <span className="px-2 py-0.5 bg-slate-100 rounded-md">📍 Lat: {lat.toFixed(4)}° N</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-md">Lng: {lng.toFixed(4)}° E</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-md">City: {cityName}</span>
          </div>
        </div>

        {/* Action Controls & Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          {/* Map Layer Mode Selector */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                mapMode === 'satellite' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛰️ 360° Satellite
            </button>
            <button
              onClick={() => setMapMode('hybrid')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                mapMode === 'hybrid' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🗺️ Hybrid Labels
            </button>
            <button
              onClick={() => setMapMode('streetview')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                mapMode === 'streetview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🚶 360° Street View
            </button>
          </div>

          {/* 360 Rotate Orbit Toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2.5 rounded-2xl border transition cursor-pointer text-xs font-bold flex items-center gap-1.5 ${
              isRotating
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md animate-pulse'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
            title="Auto-Rotate 360 Orbit"
          >
            <Compass className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRotating ? '360° Orbiting' : '360° Orbit'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl transition cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Google Earth 3D Button */}
          <a
            href={googleEarthUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition flex items-center gap-1.5 shadow-xs"
          >
            <span>Google Earth 3D</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

        </div>

      </div>

      {/* QUICK LANDMARK JUMP CHIPS */}
      <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-xs flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[11px] font-black uppercase text-slate-400 whitespace-nowrap flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Jump to Landmark:</span>
        </span>
        {spots.map((spot, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedSpotIndex(idx);
              confetti({ particleCount: 30, spread: 40 });
            }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-xs ${
              selectedSpotIndex === idx
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {spot.title || spot.name}
          </button>
        ))}
      </div>

      {/* SATELLITE 360 MAP VIEWPORT */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl h-[520px] sm:h-[620px]">
        
        {/* Live Google Maps Satellite & Street View iFrame */}
        <iframe
          key={`${lat}-${lng}-${mapMode}-${zoomLevel}-${rotationAngle}`}
          src={getGoogleMapsEmbedUrl()}
          title={`Google Maps 360 Satellite View of ${activeSpot.title}`}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
        ></iframe>

        {/* Floating Zoom & Compass HUD Overlay */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
          <button
            onClick={() => setZoomLevel(prev => Math.min(21, prev + 1))}
            className="p-3 bg-white/90 hover:bg-white text-slate-900 rounded-2xl shadow-xl backdrop-blur-md transition cursor-pointer active:scale-95"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(12, prev - 1))}
            className="p-3 bg-white/90 hover:bg-white text-slate-900 rounded-2xl shadow-xl backdrop-blur-md transition cursor-pointer active:scale-95"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Live Information Badge */}
        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-white/20 text-white p-3 rounded-2xl max-w-xs shadow-xl hidden sm:block">
          <div className="flex items-center gap-2 text-xs font-black text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Resolution Satellite Stream</span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium mt-1">
            Viewing <strong>{activeSpot.title}</strong> in {cityName}. Interact directly with the map to rotate, tilt, and zoom in 360 degrees.
          </p>
        </div>

      </div>

    </div>
  );
};
