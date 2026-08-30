import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  Coins,
  ShieldCheck,
  Star,
  Compass,
  Moon,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HeroBanner = () => {
  const { globalPlace, searchAndSetGlobalPlace, isGlobalSearching, t, setActiveTab } = useApp();

  const [searchLocation, setSearchLocation] = useState('');
  const [checkIn, setCheckIn] = useState(() => new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [guestBudget, setGuestBudget] = useState('2 Guests');

  const checkInInputRef = useRef(null);
  const checkOutInputRef = useRef(null);

  // Calculate number of nights
  const calculateNights = () => {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const nights = calculateNights();

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'Select Date';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleOpenCheckInPicker = () => {
    if (checkInInputRef.current) {
      if (typeof checkInInputRef.current.showPicker === 'function') {
        checkInInputRef.current.showPicker();
      } else {
        checkInInputRef.current.focus();
      }
    }
  };

  const handleOpenCheckOutPicker = () => {
    if (checkOutInputRef.current) {
      if (typeof checkOutInputRef.current.showPicker === 'function') {
        checkOutInputRef.current.showPicker();
      } else {
        checkOutInputRef.current.focus();
      }
    }
  };

  const handleHeroSearch = async (e) => {
    if (e) e.preventDefault();
    const query = searchLocation.trim() || globalPlace.name.split(',')[0];
    await searchAndSetGlobalPlace(query);
    confetti({ particleCount: 60, spread: 80 });

    const moduleSection = document.getElementById('feature-module-section');
    if (moduleSection) {
      moduleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      
      {/* 🌟 HERO SECTION: Cyan Sky + Heading + Search Capsule + Roadtrip Car Graphics */}
      <div className="relative rounded-3xl overflow-hidden holiday-hero-gradient border border-cyan-200/60 shadow-lg pt-12 pb-6 px-4 sm:px-8 lg:px-12">
        
        {/* Animated Flying Birds SVG */}
        <div className="absolute top-8 left-12 opacity-60 pointer-events-none hidden sm:block">
          <svg width="140" height="40" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20C15 15 20 22 25 18C30 14 35 20 40 18" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <path d="M50 15C54 11 58 17 62 14C66 11 70 16 74 14" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M90 25C93 22 96 26 99 24C102 22 105 26 108 24" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Hero Typography */}
        <div className="max-w-3xl mx-auto text-center space-y-3.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-800 text-xs font-black mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Powered Smart Travel Ecosystem</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            {t('heroHeading1')}<br />
            {t('heroHeading2')}
          </h1>
          <p className="text-xs sm:text-base font-medium text-slate-600 max-w-xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>
        </div>

        {/* 🚀 WORKING INTERACTIVE FLOATING SEARCH CAPSULE WIDGET */}
        <div className="mt-8 max-w-5xl mx-auto relative z-20">
          <form
            onSubmit={handleHeroSearch}
            className="glass-capsule rounded-3xl sm:rounded-full p-2.5 sm:p-3 capsule-shadow grid grid-cols-1 sm:grid-cols-12 items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200"
          >
            {/* 1. Location Input */}
            <div className="sm:col-span-4 flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="text-left w-full">
                <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">{t('labelLocation')}</span>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Where to? (e.g. Goa, Jaipur, Varanasi...)"
                  className="w-full text-xs sm:text-sm font-black text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>
            </div>

            {/* 2. Interactive Check-In Date Picker */}
            <div
              onClick={handleOpenCheckInPicker}
              className="sm:col-span-2 flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition border-t sm:border-t-0 sm:border-l border-slate-200 w-full cursor-pointer relative"
            >
              <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="text-left w-full">
                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">{t('labelCheckIn')}</span>
                <div className="text-xs font-black text-slate-900 tracking-tight">
                  {formatDisplayDate(checkIn)}
                </div>
                {/* Real Native Date Input Trigger */}
                <input
                  ref={checkInInputRef}
                  type="date"
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (e.target.value > checkOut) {
                      const next = new Date(e.target.value);
                      next.setDate(next.getDate() + 2);
                      setCheckOut(next.toISOString().split('T')[0]);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
            </div>

            {/* 3. Interactive Check-Out Date Picker */}
            <div
              onClick={handleOpenCheckOutPicker}
              className="sm:col-span-2 flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition border-t sm:border-t-0 sm:border-l border-slate-200 w-full cursor-pointer relative"
            >
              <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="text-left w-full">
                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider flex items-center gap-1">
                  <span>{t('labelCheckOut')}</span>
                  <span className="text-[8px] px-1 bg-blue-100 text-blue-800 rounded font-black">{nights}N</span>
                </span>
                <div className="text-xs font-black text-slate-900 tracking-tight">
                  {formatDisplayDate(checkOut)}
                </div>
                {/* Real Native Date Input Trigger */}
                <input
                  ref={checkOutInputRef}
                  type="date"
                  min={checkIn}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
            </div>

            {/* 4. Guest Selector */}
            <div className="sm:col-span-2 flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition border-t sm:border-t-0 sm:border-l border-slate-200 w-full">
              <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="text-left w-full">
                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">{t('labelGuests')}</span>
                <select
                  value={guestBudget}
                  onChange={(e) => setGuestBudget(e.target.value)}
                  className="text-xs font-black text-slate-900 bg-transparent focus:outline-none cursor-pointer w-full pr-1"
                >
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4+ Family</option>
                </select>
              </div>
            </div>

            {/* 5. Submit Search Button */}
            <div className="sm:col-span-2 w-full">
              <button
                type="submit"
                disabled={isGlobalSearching}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3.5 px-6 font-black text-xs sm:text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{isGlobalSearching ? 'Searching...' : t('btnSearch')}</span>
              </button>
            </div>

          </form>
        </div>

        {/* 🚗 SCENIC ROAD TRIP ILLUSTRATION GRAPHIC */}
        <div className="mt-8 relative max-w-4xl mx-auto flex flex-col items-center justify-center">
          
          {/* Road Trip Graphic Box */}
          <div className="relative w-full h-44 sm:h-56 overflow-hidden rounded-3xl bg-gradient-to-b from-cyan-200/40 via-amber-100/30 to-amber-200/60 border border-cyan-300/40 flex items-end justify-center">
            
            {/* Palm Trees Left & Right (SVGs) */}
            <div className="absolute left-4 bottom-0 w-24 sm:w-36 opacity-90">
              <svg viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 150 Q45 80 40 40" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
                <path d="M40 40 C30 20 10 30 0 40 C15 35 25 40 40 40" fill="#047857" />
                <path d="M40 40 C45 15 65 15 80 25 C65 25 55 35 40 40" fill="#059669" />
                <path d="M40 40 C20 40 20 60 10 70 C25 60 35 55 40 40" fill="#10B981" />
                <path d="M40 40 C60 40 70 55 75 65 C65 55 55 50 40 40" fill="#047857" />
              </svg>
            </div>

            <div className="absolute right-4 bottom-0 w-24 sm:w-36 opacity-90 scale-x-[-1]">
              <svg viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 150 Q45 80 40 40" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
                <path d="M40 40 C30 20 10 30 0 40 C15 35 25 40 40 40" fill="#047857" />
                <path d="M40 40 C45 15 65 15 80 25 C65 25 55 35 40 40" fill="#059669" />
                <path d="M40 40 C20 40 20 60 10 70 C25 60 35 55 40 40" fill="#10B981" />
              </svg>
            </div>

            {/* Asphalt Road with Animated White Center Dashes */}
            <div className="w-full h-14 sm:h-18 bg-slate-800 relative flex items-center justify-center overflow-hidden border-t-4 border-amber-400">
              <div className="absolute w-full h-[3px] border-b-2 border-dashed border-amber-300 opacity-80 animate-roadStripes"></div>
              
              {/* Cute Indian Tourism Taxi Car Driving with Gentle Hover Bob */}
              <div className="relative z-10 animate-carBounce">
                <svg width="90" height="42" viewBox="0 0 90 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Car Shadow */}
                  <ellipse cx="45" cy="39" rx="38" ry="3" fill="#0F172A" fillOpacity="0.4" />
                  {/* Yellow & Black Indian Taxi Body */}
                  <path d="M12 28L20 12C21 10 24 9 27 9H63C66 9 69 10 70 12L78 28C81 28 84 31 84 34V36H6V34C6 31 9 28 12 28Z" fill="#F59E0B" />
                  {/* Black Roof (Iconic Kaali-Peeli / Premier Padmini Vibe) */}
                  <path d="M22 13L27 9H63L68 13H22Z" fill="#1E293B" />
                  {/* Windows */}
                  <path d="M24 14H42V25H18L24 14Z" fill="#E0F2FE" />
                  <path d="M46 14H66L72 25H46V14Z" fill="#E0F2FE" />
                  {/* Wheels */}
                  <circle cx="22" cy="35" r="6" fill="#1E293B" />
                  <circle cx="22" cy="35" r="2.5" fill="#E2E8F0" />
                  <circle cx="68" cy="35" r="6" fill="#1E293B" />
                  <circle cx="68" cy="35" r="2.5" fill="#E2E8F0" />
                  {/* Headlight */}
                  <circle cx="82" cy="31" r="2" fill="#FEF08A" />
                  {/* TAXI Roof Top Board */}
                  <rect x="40" y="5" width="10" height="4" rx="1" fill="#FFFFFF" />
                  <rect x="42" y="6" width="6" height="2" fill="#DC2626" />
                </svg>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
