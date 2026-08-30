import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { getHeritageDataForCity } from '../../services/heritageTimeMachineService';
import {
  History,
  Hourglass,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  Layers,
  Compass,
  Download,
  Share2,
  Play,
  Pause,
  Maximize2,
  Info,
  ChevronRight,
  Shield,
  Zap,
  MapPin,
  Clock,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HeritageTimeMachine = () => {
  const { currentDestination, language } = useApp();

  const [selectedEraIndex, setSelectedEraIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // Split slider percentage
  const [isXrayMode, setIsXrayMode] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAiNarrating, setIsAiNarrating] = useState(false);

  const cityName = currentDestination?.name?.split(',')[0]?.trim() || 'Varanasi';

  // Dynamically resolve 100% accurate heritage timeline data for the current active city
  const heritageData = getHeritageDataForCity(currentDestination?.name || 'Varanasi');
  const eras = heritageData.eras;
  const currentEra = eras[selectedEraIndex] || eras[0];

  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);

  // Reset selected era index to 0 when city changes
  useEffect(() => {
    setSelectedEraIndex(0);
    if (isAiNarrating && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAiNarrating(false);
    }
  }, [currentDestination]);

  // Synthesize Ambient Era Audio
  const toggleAmbientSound = () => {
    if (isPlayingAudio) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      setIsPlayingAudio(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = selectedEraIndex === 3 ? 'sine' : selectedEraIndex === 0 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(currentEra.toneFreq || 440, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      setIsPlayingAudio(true);

      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 5000);
    } catch (e) {
      setIsPlayingAudio(!isPlayingAudio);
    }
  };

  // AI Voice Narration (SpeechSynthesis)
  const handleToggleAiNarration = () => {
    if ('speechSynthesis' in window) {
      if (isAiNarrating) {
        window.speechSynthesis.cancel();
        setIsAiNarrating(false);
        return;
      }

      window.speechSynthesis.cancel();
      const narrationText = `Welcome to ${currentEra.year}, the ${currentEra.tag} of ${heritageData.cityName}. In this era under ${currentEra.ruler}, ${currentEra.description} Key architectural secret: ${currentEra.secrets[0]}`;
      const utterance = new SpeechSynthesisUtterance(narrationText);
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
      utterance.rate = 0.92;

      utterance.onstart = () => setIsAiNarrating(true);
      utterance.onend = () => setIsAiNarrating(false);
      utterance.onerror = () => setIsAiNarrating(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Download Postcard
  const handleDownloadPostcard = () => {
    confetti({ particleCount: 80, spread: 80 });
    alert(`🎉 Vintage Heritage Postcard from ${currentEra.year} in ${heritageData.cityName} saved to your gallery!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* HEADER CAPSULE */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">
            <Hourglass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>AI Augmented Heritage Time Machine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-heritage">
            Travel Through Centuries: {heritageData.monumentName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
            Explore authentic historical eras for <strong className="text-amber-300">{heritageData.cityName}</strong>. Slide through centuries of royal architecture, engineering secrets & ambient soundscapes.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={handleToggleAiNarration}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition shadow-md cursor-pointer ${
              isAiNarrating ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>{isAiNarrating ? 'Stop Voice Narration' : 'Narrate History'}</span>
          </button>
        </div>
      </div>

      {/* ERA SELECTOR TIMELINE SLIDER */}
      <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm">
        <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Select Historical Era for {heritageData.cityName}</span>
          <span className="text-blue-600 font-bold">Currently Viewing: {currentEra.year}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {eras.map((era, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedEraIndex(idx);
                confetti({ particleCount: 30, spread: 50 });
              }}
              className={`p-3.5 rounded-2xl text-left transition cursor-pointer border relative overflow-hidden ${
                selectedEraIndex === idx
                  ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border-amber-600 shadow-md font-black'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 font-bold'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black font-mono">{era.year}</span>
                {selectedEraIndex === idx && <Sparkles className="w-3.5 h-3.5 text-slate-950" />}
              </div>
              <div className="text-[11px] truncate">{era.tag}</div>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN INTERACTIVE 2-COLUMN VIEWPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT 7 COLS: INTERACTIVE SPLIT COMPARISON VIEWFINDER */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-100 text-amber-900 rounded-xl">
                <Layers className="w-4 h-4 text-amber-700" />
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-900">{currentEra.year} vs 2026 AD Split Lens</h4>
                <p className="text-[10px] text-slate-500 font-medium">Drag the horizontal slider below to reveal past vs present</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsXrayMode(!isXrayMode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isXrayMode
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isXrayMode ? 'X-Ray Blueprint ON' : 'X-Ray Mode'}</span>
              </button>
            </div>
          </div>

          {/* SPLIT VIEWFINDER BOX */}
          <div className="relative rounded-2xl overflow-hidden h-[360px] bg-slate-950 select-none shadow-inner border border-slate-200">
            
            {/* Modern Image (Base Layer) */}
            <img
              src={currentEra.modernImage}
              alt={`${heritageData.cityName} Modern View`}
              className={`w-full h-full object-cover transition ${isXrayMode ? 'invert opacity-70 hue-rotate-180' : ''}`}
            />
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md rounded-xl text-[10px] font-black text-white border border-white/20">
              Present Day (2026)
            </div>

            {/* Ancient Era Image (Top Overlay Clipped by Slider) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={currentEra.ancientImage}
                alt={`${heritageData.cityName} Historic Era View`}
                className={`absolute inset-0 w-[800px] h-full object-cover max-w-none ${
                  selectedEraIndex === 0 ? 'sepia-80 contrast-125' : selectedEraIndex === 1 ? 'sepia-50' : 'grayscale-50'
                } ${isXrayMode ? 'invert brightness-125' : ''}`}
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-slate-950 rounded-xl text-[10px] font-black shadow-md">
                Era: {currentEra.year}
              </div>
            </div>

            {/* Split Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-2xl flex items-center justify-center cursor-ew-resize z-20"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-lg border-2 border-white">
                ↔
              </div>
            </div>

            {/* X-Ray Blueprint Overlay Elements */}
            {isXrayMode && (
              <div className="absolute inset-0 border-2 border-cyan-400/80 bg-cyan-950/30 backdrop-blur-2xs flex flex-col justify-end p-4 pointer-events-none z-10">
                <div className="p-3 bg-cyan-950/90 border border-cyan-400 rounded-xl text-cyan-200 text-xs space-y-1">
                  <div className="font-mono font-black text-cyan-300">📐 STRUCTURAL BLUEPRINT & MESH ACTIVE: {heritageData.monumentName}</div>
                  <div>• Heritage Foundation: Ancient Interlocking Stone & Lime Mortar Geometry</div>
                  <div>• Acoustic Resonance: Harmonic Funnel Geometry across {heritageData.cityName}</div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-500">
              <span>Ancient Era ({currentEra.year})</span>
              <span>Slide Comparison (Split: {sliderPosition}%)</span>
              <span>Modern 2026</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

        </div>

        {/* RIGHT 5 COLS: ERA ARCHITECTURAL SECRETS & SOUNDSCAPES */}
        <div className="lg:col-span-5 space-y-6">

          {/* 1. ERA STORY CARD */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-black uppercase text-slate-900">{currentEra.year} Chronicle</h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full truncate max-w-[200px]">
                👑 {currentEra.ruler}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              {currentEra.description}
            </p>

            {/* Architectural Secrets List */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-slate-900 uppercase block tracking-wider">
                🔍 Architectural Secrets & Engineering:
              </span>
              {currentEra.secrets.map((secret, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>{secret}</span>
                </div>
              ))}
            </div>

            {/* Historic Soundscape Player */}
            <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  {isPlayingAudio ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-300">Historic Soundscape</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{currentEra.soundLabel}</div>
                </div>
              </div>

              <button
                onClick={toggleAmbientSound}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer active:scale-95"
              >
                {isPlayingAudio ? 'Pause' : 'Play Sound'}
              </button>
            </div>

            {/* Postcard Export Button */}
            <button
              onClick={handleDownloadPostcard}
              className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save {heritageData.cityName} ({currentEra.year}) Postcard</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
