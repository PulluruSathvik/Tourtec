import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Users,
  Building2,
  Car,
  AlertTriangle,
  MessageSquare,
  Coins,
  Globe,
  Sparkles,
  Search,
  MapPin,
  ChevronDown,
  Check,
  User,
  LogOut,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Navbar = () => {
  const {
    activeTab,
    setActiveTab,
    ecoPoints,
    setIsRewardsWalletOpen,
    language,
    setLanguage,
    t,
    SUPPORTED_LANGUAGES,
    currentUser,
    setIsAuthModalOpen,
    setAuthMode,
    logoutUser
  } = useApp();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const langDropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setIsLangDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'roadmap', label: t('navTripPlanner'), icon: Compass },
    { id: 'hotels', label: t('navHotels'), icon: Building2 },
    { id: 'rentals', label: t('navRentals'), icon: Car },
    { id: 'digitalTwin', label: t('navLiveCrowds'), icon: Users },
    { id: 'lostRadar', label: 'Lost Radar 🛡️', icon: ShieldAlert },
    { id: 'flow', label: t('navFastPass'), icon: Sparkles },
    { id: 'assistant', label: t('navVoiceGuide'), icon: MessageSquare }
  ];

  const handleTabClick = (tabId) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setActiveTab(tabId);
    const moduleSection = document.getElementById('feature-module-section');
    if (moduleSection) {
      moduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectLanguage = (langCode) => {
    setLanguage(langCode);
    setIsLangDropdownOpen(false);
    confetti({ particleCount: 40, spread: 60 });
  };

  const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-slate-200 shadow-xs transition-all w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => handleTabClick('roadmap')}
          >
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-2xl bg-orange-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-md">
                Holiday
              </span>
              <span className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Tourtec<span className="text-blue-600">.</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Multilingual) */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-black scale-105'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Language, Wallet & Auth */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            
            {/* 🌐 Interactive Language Selector Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 text-slate-800 text-xs font-black hover:bg-slate-200 transition cursor-pointer border border-slate-200 shadow-xs"
                title="Change Website Language"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">{activeLangObj.flag} {activeLangObj.native}</span>
                <span className="sm:hidden">{activeLangObj.flag}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Select Your Language
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`w-full px-3.5 py-2 text-left text-xs font-bold flex items-center justify-between transition hover:bg-blue-50 ${
                          isSelected ? 'text-blue-600 bg-blue-50/60 font-black' : 'text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.native} ({lang.label})</span>
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reward Points Wallet Button */}
            <button
              onClick={() => setIsRewardsWalletOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 sm:px-4 py-2 rounded-full shadow-md text-xs font-black transition active:scale-95 cursor-pointer"
              title="View Reward Points Wallet & Discounts"
            >
              <Coins className="w-4 h-4" />
              <span>₹{ecoPoints} <span className="hidden sm:inline">{t('rewardPoints')}</span></span>
            </button>

            {/* 👤 USER AUTHENTICATION / SIGN UP / PROFILE BUTTON */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500"
                  />
                  <span className="text-xs font-black text-slate-800 max-w-[90px] truncate hidden sm:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* User Profile Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-fadeIn space-y-3">
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                      />
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-black text-slate-900 truncate">{currentUser.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 mt-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Tourist ID</span>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="p-2 bg-slate-50 rounded-xl flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-500">Wallet Balance:</span>
                        <strong className="text-amber-600 font-mono">₹{ecoPoints} PTS</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        logoutUser();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full py-2 px-3 text-left text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setAuthMode('signin');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-black text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 sm:px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-black shadow-md shadow-blue-500/20 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden items-center gap-2 overflow-x-auto py-3 scrollbar-none border-t border-slate-100 text-xs font-bold">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-black'
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
