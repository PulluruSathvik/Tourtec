import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  AlertTriangle,
  RotateCw,
  Navigation,
  ShieldCheck,
  Footprints,
  Activity,
  PhoneCall,
  CheckCircle,
  ArrowRight,
  Radio,
  Eye,
  MapPin,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Languages,
  WifiOff,
  Wifi,
  Shield,
  HelpCircle,
  RefreshCw,
  Clock,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LostTouristDetector = () => {
  const { currentDestination, setIsSosOpen, language, setEcoPoints } = useApp();
  const canvasRef = useRef(null);

  const cityName = currentDestination?.name?.split(',')[0]?.trim() || 'Varanasi';
  const mainLandmark = currentDestination?.roadmap?.[0]?.title || currentDestination?.zones?.[0]?.name || `${cityName} Heritage Center`;

  // 4 Core Anomaly Simulation Modes
  const [anomalyMode, setAnomalyMode] = useState('lost_loop'); // 'normal' | 'lost_loop' | 'route_deviation' | 'stranded' | 'offline_lost'
  const [isPermissionGranted, setIsPermissionGranted] = useState(true);
  const [trajectory, setTrajectory] = useState([]);
  const [isSpeakingLocalCard, setIsSpeakingLocalCard] = useState(false);
  const [selectedCardLang, setSelectedCardLang] = useState('hi'); // 'hi' | 'te' | 'ta' | 'kn' | 'bn' | 'mr' | 'en'

  const [anomalyData, setAnomalyData] = useState({
    confusionScore: 84,
    status: 'CONFUSED_OR_LOST',
    anomalyType: 'Circular Walking in Narrow Alleyways',
    indicators: {
      circularityIndex: '0.89 (3 Loops in 12 mins)',
      hesitationStops: '5 stops in last 3 mins',
      paceVariance: 'Erratic (0.7 km/h in Gali)',
      orientationEntropy: '180° Backtracking Inversions'
    },
    actionableGuidance: `Proactive Anomaly: Tourist has passed the same intersection 3 times in ${cityName} narrow alleys. 1-Tap Line-of-sight rescue path to main promenade is ready.`
  });

  const [isRescuePathActive, setIsRescuePathActive] = useState(false);

  // Generate dynamic trajectory points based on anomaly scenario
  useEffect(() => {
    let points = [];
    const centerX = 200;
    const centerY = 150;

    if (anomalyMode === 'normal') {
      for (let i = 0; i < 16; i++) {
        points.push({
          x: 40 + i * 22,
          y: centerY + Math.sin(i * 0.4) * 20,
          angle: 0
        });
      }
      setAnomalyData({
        confusionScore: 12,
        status: 'ON_TRACK',
        anomalyType: 'Smooth Forward Progression',
        indicators: {
          circularityIndex: '0.02 (Linear)',
          hesitationStops: '0 stops in 10 mins',
          paceVariance: 'Steady (3.8 km/h)',
          orientationEntropy: 'Aligned with Heritage Corridor'
        },
        actionableGuidance: `Tourist journey is on track along ${cityName} designated tourist corridor.`
      });
    } else if (anomalyMode === 'lost_loop') {
      // Backtracking loops in narrow heritage alleys
      for (let i = 0; i < 22; i++) {
        const rad = (i / 7) * Math.PI * 2;
        points.push({
          x: centerX + Math.cos(rad) * (55 + (i % 4) * 8),
          y: centerY + Math.sin(rad) * (48 + (i % 3) * 10),
          angle: (rad * 180) / Math.PI
        });
      }
      setAnomalyData({
        confusionScore: 88,
        status: 'CONFUSED_OR_LOST',
        anomalyType: 'Circular Walking in Narrow Alleyways',
        indicators: {
          circularityIndex: '0.92 (3 Loops in 10 mins)',
          hesitationStops: '6 stops at intersections',
          paceVariance: 'Erratic (0.6 km/h in alley)',
          orientationEntropy: '180° Direction Inversions'
        },
        actionableGuidance: `Proactive Anomaly: Repeated circular path detected in ${cityName} narrow galis. Tap below for direct bearing heading back to Main Heritage Promenade.`
      });
    } else if (anomalyMode === 'route_deviation') {
      // Drifted 600m off planned path
      for (let i = 0; i < 18; i++) {
        points.push({
          x: 40 + i * 16,
          y: 60 + i * 12 + Math.sin(i * 0.6) * 15,
          angle: 45
        });
      }
      setAnomalyData({
        confusionScore: 78,
        status: 'ROUTE_DEVIATION',
        anomalyType: 'Significant Route Deviation (>500m Off Path)',
        indicators: {
          circularityIndex: '0.24 (Drifting Outward)',
          hesitationStops: '3 stops in unverified zone',
          paceVariance: 'Fast Walking (5.2 km/h - possible rush)',
          orientationEntropy: 'Perpendicular to Designated Corridor'
        },
        actionableGuidance: `Proactive Alert: You have drifted 540m off the planned heritage itinerary into an unverified zone. Return path to nearest safe corridor calculated.`
      });
    } else if (anomalyMode === 'stranded') {
      // Stationary cluster in unverified area for 25 mins
      for (let i = 0; i < 16; i++) {
        points.push({
          x: 180 + (Math.random() - 0.5) * 18,
          y: 140 + (Math.random() - 0.5) * 18,
          angle: Math.random() * 360
        });
      }
      setAnomalyData({
        confusionScore: 92,
        status: 'STRANDED_ANOMALY',
        anomalyType: 'Prolonged Stationary Anomaly (>20 Mins)',
        indicators: {
          circularityIndex: 'N/A (Stationary Cluster)',
          hesitationStops: 'Stationary for 22 mins',
          paceVariance: '0.1 km/h (No Movement)',
          orientationEntropy: 'High random orientation jitter'
        },
        actionableGuidance: `Proactive Safety Check: You have been stationary at an unusual location in ${cityName} for over 20 minutes without landmark check-in. Are you safe?`
      });
    } else if (anomalyMode === 'offline_lost') {
      // Offline loss of network
      for (let i = 0; i < 18; i++) {
        points.push({
          x: 100 + i * 12 + (Math.random() - 0.5) * 20,
          y: 120 + (Math.random() - 0.5) * 25,
          angle: Math.random() * 360
        });
      }
      setAnomalyData({
        confusionScore: 95,
        status: 'OFFLINE_DISCONNECTED',
        anomalyType: 'Zero Internet / Offline Mesh Emergency',
        indicators: {
          circularityIndex: 'Cached Trajectory Only',
          hesitationStops: 'Network Signal Lost',
          paceVariance: 'Sensor Dead-Reckoning Active',
          orientationEntropy: 'Magnetic Compass Fallback'
        },
        actionableGuidance: `Offline Safety Activated: Internet lost in ${cityName}. All local assistance phrases, emergency numbers, and compass bearings are pre-cached on device.`
      });
    }

    setTrajectory(points);
    setIsRescuePathActive(false);
  }, [anomalyMode, cityName]);

  // Canvas visualizer for GPS trajectory
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw Subtle Gali Grid Background
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw Designated Corridor Baseline
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(40, 150);
    ctx.lineTo(360, 150);
    ctx.stroke();

    // Draw Tourist Trajectory Path
    if (trajectory.length > 1) {
      const isConfused = anomalyData.confusionScore > 50;
      ctx.strokeStyle = isConfused ? '#EF4444' : '#10B981';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(trajectory[0].x, trajectory[0].y);
      for (let i = 1; i < trajectory.length; i++) {
        ctx.lineTo(trajectory[i].x, trajectory[i].y);
      }
      ctx.stroke();

      // Trajectory Waypoints
      trajectory.forEach((pt, i) => {
        ctx.fillStyle = i === trajectory.length - 1 ? (isConfused ? '#DC2626' : '#059669') : '#94A3B8';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, i === trajectory.length - 1 ? 6 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Rescue Reroute Line if user activated path correction
      if (isRescuePathActive && trajectory.length > 0) {
        const lastPt = trajectory[trajectory.length - 1];
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(lastPt.x, lastPt.y);
        ctx.lineTo(360, 150); // Direct line back to main promenade
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [trajectory, anomalyData, isRescuePathActive]);

  // Multilingual "Ask a Local" Phrase Matrix
  const localHelperPhrases = {
    hi: {
      lang: 'हिंदी (Hindi)',
      native: `नमस्ते भाई साहब! मैं एक पर्यटक हूँ और रास्ता भूल गया हूँ। मुझे ${mainLandmark} जाना है। क्या आप कृपया मुझे सही रास्ता बता सकते हैं?`,
      phonetic: `Namaste bhai sahab! Main ek tourist hoon aur rasta bhool gaya hoon. Mujhe ${mainLandmark} jaana hai. Kripya sahi rasta bataiye.`,
      english: `Hello brother! I am a tourist and I am lost. I need to reach ${mainLandmark}. Can you please show me the right direction?`
    },
    te: {
      lang: 'తెలుగు (Telugu)',
      native: `నమస్కారం అండి! నేను టూరిస్ట్‌ని, దారి తప్పిపోయాను. నేను ${mainLandmark} వెళ్ళాలి. దయచేసి సరైన దారి చూపించగలరా?`,
      phonetic: `Namaskaram andi! Nenu tourist-ni, daari thappipoyanu. Nenu ${mainLandmark} vellali. Dayachesi daari chupinchandi.`,
      english: `Hello sir! I am a tourist and lost my way. I need to go to ${mainLandmark}. Please show the route.`
    },
    ta: {
      lang: 'தமிழ் (Tamil)',
      native: `வணக்கம் ஐயா! நான் ஒரு சுற்றுலாப் பயணி, வழி தெரியவில்லை. நான் ${mainLandmark} செல்ல வேண்டும். தயவுசெய்து சரியான வழியைக் காட்டுங்கள்.`,
      phonetic: `Vanakkam aiya! Naan tourist, vazhi theriya villai. Naan ${mainLandmark} sella vendum. Vazhi kaattungal.`,
      english: `Hello sir! I am a tourist and lost my way to ${mainLandmark}. Please guide me.`
    },
    kn: {
      lang: 'ಕನ್ನಡ (Kannada)',
      native: `ನಮಸ್ಕಾರ ಸರ್! ನಾನು ಪ್ರವಾಸಿ, ದಾರಿ ತಪ್ಪಿದ್ದೇನೆ. ನಾನು ${mainLandmark} ಗೆ ಹೋಗಬೇಕು. ದಯವಿಟ್ಟು ಸರಿಯಾದ ದಾರಿ ತೋರಿಸಿ.`,
      phonetic: `Namaskara sir! Naanu pravasi, daari thappiddeene. Naanu ${mainLandmark} ge hogabeku. Daari thorisi.`,
      english: `Hello sir! I am a tourist and lost my route to ${mainLandmark}. Please guide me.`
    },
    bn: {
      lang: 'বাংলা (Bengali)',
      native: `নমস্কার দাদা! আমি একজন পর্যটক এবং পথ হারিয়ে ফেলেছি। আমাকে ${mainLandmark} যেতে হবে। দয়া করে সঠিক রাস্তাটি দেখান।`,
      phonetic: `Nomoshkar dada! Aami tourist, poth hariye felechi. Aamake ${mainLandmark} jete hobe.`,
      english: `Hello brother! I am a tourist and lost my way to ${mainLandmark}.`
    },
    mr: {
      lang: 'मराठी (Marathi)',
      native: `नमस्कार काका! मी एक पर्यटक आहे आणि रस्ता चुकलो आहे. मला ${mainLandmark} येथे जायचे आहे. कृपया योग्य रस्ता दाखवा.`,
      phonetic: `Namaskar! Me tourist ahe ani rasta chuklo ahe. Mala ${mainLandmark} la jayche ahe.`,
      english: `Hello! I am a tourist and lost my way to ${mainLandmark}.`
    },
    en: {
      lang: 'English (India)',
      native: `Excuse me, Namaste! I am a tourist and I seem to be lost. I am trying to reach ${mainLandmark}. Could you please point me in the right direction?`,
      phonetic: `Excuse me! Lost tourist heading to ${mainLandmark}.`,
      english: `Excuse me! Lost tourist heading to ${mainLandmark}.`
    }
  };

  const currentLocalPhrase = localHelperPhrases[selectedCardLang] || localHelperPhrases.hi;

  // Speak Local Help Phrase Aloud via Phone Speaker
  const handleSpeakLocalPhrase = () => {
    if ('speechSynthesis' in window) {
      if (isSpeakingLocalCard) {
        window.speechSynthesis.cancel();
        setIsSpeakingLocalCard(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentLocalPhrase.native);
      utterance.lang = selectedCardLang === 'hi' ? 'hi-IN' : selectedCardLang === 'te' ? 'te-IN' : selectedCardLang === 'ta' ? 'ta-IN' : 'en-IN';
      utterance.rate = 0.88;

      utterance.onstart = () => setIsSpeakingLocalCard(true);
      utterance.onend = () => setIsSpeakingLocalCard(false);
      utterance.onerror = () => setIsSpeakingLocalCard(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // 1-Tap Path Correction
  const handleApplyPathCorrection = () => {
    setIsRescuePathActive(true);
    confetti({ particleCount: 50, spread: 70 });
    alert(`🧭 Proactive Path Correction Applied! Direct straight-line bearing (Heading 120° East) back to ${mainLandmark} promenade.`);
  };

  return (
    <div className="space-y-6">

      {/* TOP INNOVATION HERO BANNER */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 text-white p-6 rounded-3xl shadow-xl border border-red-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-red-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-black">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span>TOURTEC Proactive Innovation • Patent-Ready</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-heritage">
            AI Proactive Lost Tourist & Anomaly Radar
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
            Unlike reactive GPS apps that wait for you to panic, TOURTEC proactively detects confusion patterns (walking in circles, route deviation, prolonged stillness, or lost signal) in <strong>{cityName}</strong> and offers instant multilingual rescue guidance.
          </p>
        </div>

        {/* Live Safety Status Indicator Badge */}
        <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center gap-3.5 flex-shrink-0 relative z-10">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-md ${
            anomalyData.confusionScore > 50 ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500 text-slate-950'
          }`}>
            {anomalyData.confusionScore}%
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Confusion Risk Score</div>
            <div className={`text-xs font-black ${anomalyData.confusionScore > 50 ? 'text-red-300' : 'text-emerald-300'}`}>
              {anomalyData.status}
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE SCENARIO SIMULATOR SELECTOR */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-600 animate-pulse" />
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
              Test Real-Time Tourist Anomaly Patterns:
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-bold">Select a scenario to test proactive AI intervention</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {[
            { id: 'lost_loop', label: '🔄 Walking in Circles', sub: 'Repeated Loops in Galis', alertColor: 'text-red-600' },
            { id: 'route_deviation', label: '⚠️ Route Deviation', sub: 'Drifted >500m Off-Path', alertColor: 'text-amber-600' },
            { id: 'stranded', label: '⏳ Stranded Stillness', sub: 'No Movement for >20m', alertColor: 'text-orange-600' },
            { id: 'offline_lost', label: '📶 Offline & No Internet', sub: 'Dead-Zone Emergency', alertColor: 'text-purple-600' },
            { id: 'normal', label: '🏃 Smooth On-Track', sub: 'Linear Normal Journey', alertColor: 'text-emerald-600' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setAnomalyMode(item.id)}
              className={`p-3 rounded-2xl text-left border transition cursor-pointer ${
                anomalyMode === item.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 font-medium'
              }`}
            >
              <div className="text-xs font-black truncate">{item.label}</div>
              <div className={`text-[10px] mt-0.5 ${anomalyMode === item.id ? 'text-slate-300' : item.alertColor}`}>
                {item.sub}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: TRAJECTORY RADAR & ACTIONABLE RESCUE CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT 6 COLS: REAL-TIME TRAJECTORY CANVAS & METRICS */}
        <div className="lg:col-span-6 bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-black text-slate-900">Live GPS Trajectory & Gali Geometry Radar</h4>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 rounded-md text-slate-600">
              Pattern: {anomalyData.anomalyType}
            </span>
          </div>

          {/* Canvas Map Radar */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-inner">
            <canvas ref={canvasRef} width={400} height={280} className="w-full h-64 object-contain" />
            
            {/* Overlay Indicator Pills */}
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-bold text-slate-700 border border-slate-200 shadow-xs">
              📍 Heritage Corridor: {mainLandmark}
            </div>

            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-slate-900/85 backdrop-blur-md rounded-xl text-[10px] font-mono text-white flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>GPS Tracking Active</span>
            </div>
          </div>

          {/* Anomaly Sensor Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Circularity Ratio</span>
              <strong className="text-slate-900 font-mono text-xs">{anomalyData.indicators.circularityIndex}</strong>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Hesitation Stops</span>
              <strong className="text-slate-900 font-mono text-xs">{anomalyData.indicators.hesitationStops}</strong>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pace & Speed Variance</span>
              <strong className="text-slate-900 font-mono text-xs">{anomalyData.indicators.paceVariance}</strong>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Orientation Entropy</span>
              <strong className="text-slate-900 font-mono text-xs truncate block">{anomalyData.indicators.orientationEntropy}</strong>
            </div>
          </div>

        </div>

        {/* RIGHT 6 COLS: PROACTIVE RESCUE INTERVENTIONS & "ASK A LOCAL" FLASHCARD */}
        <div className="lg:col-span-6 space-y-4">

          {/* 1. PROACTIVE INTERVENTION CARD */}
          <div className={`p-5 rounded-3xl border shadow-sm space-y-3.5 transition-all ${
            anomalyData.confusionScore > 50 ? 'bg-red-50/70 border-red-200' : 'bg-emerald-50/70 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {anomalyData.confusionScore > 50 ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 animate-bounce" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                )}
                <h4 className="text-sm font-black text-slate-900">
                  {anomalyData.confusionScore > 50 ? 'Proactive Assistance Triggered' : 'Journey Health: Optimal'}
                </h4>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                anomalyData.confusionScore > 50 ? 'bg-red-100 text-red-900' : 'bg-emerald-100 text-emerald-900'
              }`}>
                Auto-Detected
              </span>
            </div>

            <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              {anomalyData.actionableGuidance}
            </p>

            {/* 1-Tap Rescue Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {anomalyData.confusionScore > 50 && (
                <button
                  onClick={handleApplyPathCorrection}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>1-Tap Path Correction</span>
                </button>
              )}

              <button
                onClick={() => setIsSosOpen(true)}
                className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Emergency SOS</span>
              </button>
            </div>
          </div>

          {/* 2. MULTILINGUAL "ASK A LOCAL" FLASHCARD (BRIDGES LANGUAGE BARRIERS) */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-black uppercase text-slate-900">
                  "Ask a Local" Multilingual Helper Card
                </h4>
              </div>

              {/* Language Selector */}
              <select
                value={selectedCardLang}
                onChange={(e) => setSelectedCardLang(e.target.value)}
                className="p-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="en">English</option>
              </select>
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              Show this card to any local shopkeeper or bystander in <strong>{cityName}</strong>, or tap the button to let your phone speak for you!
            </p>

            {/* Native Script Flashcard */}
            <div className="p-4 bg-amber-50/80 border-2 border-amber-300 rounded-2xl space-y-2">
              <div className="text-xs sm:text-sm font-heritage font-black text-slate-950 leading-relaxed">
                "{currentLocalPhrase.native}"
              </div>
              <div className="text-[11px] font-mono text-amber-900 font-medium pt-1 border-t border-amber-200">
                🗣️ Pronunciation: <em>{currentLocalPhrase.phonetic}</em>
              </div>
            </div>

            {/* Audio Speaker Button */}
            <button
              onClick={handleSpeakLocalPhrase}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm cursor-pointer ${
                isSpeakingLocalCard
                  ? 'bg-amber-500 text-slate-950 animate-pulse font-black'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>{isSpeakingLocalCard ? 'Speaking to Local...' : '🔊 Speak Aloud to Local in ' + currentLocalPhrase.lang}</span>
            </button>
          </div>

          {/* 3. NEAREST VERIFIED SAFE HAVENS */}
          <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm space-y-2.5">
            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
              <span className="font-black text-slate-900 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nearest Safe Havens within 300m in {cityName}:</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block font-bold">Tourist Police Booth #2</strong>
                  <span className="text-[10px] text-slate-500">120m away • 24/7 Staffed</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-lg">Safe</span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block font-bold">ASI Verified Help Desk</strong>
                  <span className="text-[10px] text-slate-500">210m away • Free RO Water</span>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded-lg">Official</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
