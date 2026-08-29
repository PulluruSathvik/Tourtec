import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DESTINATIONS } from '../data/destinationsData';
import { apiService } from '../services/apiService';
import { discoverNearbyAttractions } from '../services/cityExplorerService';
import confetti from 'canvas-confetti';

const AppContext = createContext();

import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../services/languageService';

export const AppProvider = ({ children }) => {
  const [selectedDestinationId, setSelectedDestinationId] = useState('varanasi');
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'digitalTwin' | 'flow' | 'alerts' | 'assistant'
  const [destinations, setDestinations] = useState(DESTINATIONS);
  
  // Multilingual State
  const [language, setLanguage] = useState('en');

  const t = useCallback((key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  }, [language]);
  
  // Active Destination Base
  const baseDestination = destinations.find(d => d.id === selectedDestinationId) || destinations[0];

  // Universal Global Searched Place (Controls the ENTIRE website)
  const [globalPlace, setGlobalPlace] = useState({
    name: baseDestination.name,
    shortName: baseDestination.name.split(' ')[0],
    flag: '🇮🇳',
    center: baseDestination.center,
    zoom: baseDestination.zoom || 14,
    tagline: baseDestination.tagline,
    spots: baseDestination.roadmap,
    zones: baseDestination.zones,
    weather: baseDestination.weather,
    stats: baseDestination.stats
  });

  const [isGlobalSearching, setIsGlobalSearching] = useState(false);

  // User Tourist State
  const [userLocation, setUserLocation] = useState({
    lat: baseDestination.center[0],
    lng: baseDestination.center[1],
    landmark: baseDestination.zones[1]?.name || 'Current Landmark'
  });
  
  // Authentication & User Profile State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('tourtec_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'signin'

  const loginUser = (userData) => {
    const user = {
      ...userData,
      id: `usr_${Date.now()}`,
      joinedAt: new Date().toLocaleDateString()
    };
    setCurrentUser(user);
    localStorage.setItem('tourtec_user', JSON.stringify(user));
    earnReward('Welcome Bonus for Account Registration', 100, '🎁');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('tourtec_user');
  };

  const [ecoPoints, setEcoPoints] = useState(275);
  const [isRewardsWalletOpen, setIsRewardsWalletOpen] = useState(false);
  const [rewardTransactions, setRewardTransactions] = useState([
    { id: 'tx-1', title: 'Avoided Main Temple Peak Bottleneck', points: +35, time: '10 mins ago', type: 'earn', icon: '🌿' },
    { id: 'tx-2', title: 'Refilled at Certified RO Water Point', points: +10, time: '25 mins ago', type: 'earn', icon: '🚰' },
    { id: 'tx-3', title: '5,000 Walking Steps Completed', points: +25, time: '1 hour ago', type: 'earn', icon: '🚶‍♂️' },
    { id: 'tx-4', title: 'AI Optimized Route Schedule Applied', points: +35, time: '2 hours ago', type: 'earn', icon: '⚡' }
  ]);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [sosState, setSosState] = useState({ active: false, dispatchId: null, officer: null });
  const [alerts, setAlerts] = useState([]);
  const [telemetry, setTelemetry] = useState(null);

  const earnReward = (title, points, icon = '✨') => {
    setEcoPoints(p => p + points);
    setRewardTransactions(prev => [
      { id: `tx-${Date.now()}`, title, points: +points, time: 'Just now', type: 'earn', icon },
      ...prev
    ]);
    confetti({ particleCount: 50, spread: 60 });
  };

  const redeemReward = (item) => {
    if (ecoPoints < item.cost) return { success: false, message: 'Insufficient Reward Points' };
    setEcoPoints(p => p - item.cost);
    const voucherCode = `IND-${item.category.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setRewardTransactions(prev => [
      { id: `tx-${Date.now()}`, title: `Redeemed: ${item.title}`, points: -item.cost, time: 'Just now', type: 'redeem', icon: '🎟️', code: voucherCode },
      ...prev
    ]);
    confetti({ particleCount: 70, spread: 80 });
    return { success: true, code: voucherCode };
  };
  
  // Roadmaps map
  const [roadmaps, setRoadmaps] = useState(() => {
    const map = {};
    DESTINATIONS.forEach(d => {
      map[d.id] = d.roadmap;
    });
    return map;
  });

  // Global Search Function that sets the place across ALL pages
  const searchAndSetGlobalPlace = async (placeQuery) => {
    if (!placeQuery || !placeQuery.trim()) return;

    setIsGlobalSearching(true);
    try {
      const data = await discoverNearbyAttractions(placeQuery);
      if (data && data.spots && data.spots.length > 0) {
        const cityName = data.name.split(',')[0];

        // Format spots into roadmap milestones
        const formattedRoadmap = data.spots.map((s, idx) => ({
          id: s.id || `spot-${idx}`,
          title: s.title,
          fromLocation: idx === 0 ? 'Starting Point' : data.spots[idx - 1].title,
          toLocation: s.title,
          time: s.time || `${8 + idx * 2}:30 AM`,
          status: idx === 0 ? 'completed' : idx === 1 ? 'in-progress' : 'upcoming',
          duration: s.travelTime || '1 hour',
          lat: s.lat,
          lng: s.lng,
          distanceKm: s.distanceKm || (idx * 2.1 + 1.2),
          travelTime: s.travelTime || '15 mins',
          recommendedTransport: s.recommendedTransport || 'Auto / E-Rickshaw',
          recommendedFare: s.recommendedFare || '₹30',
          transportIcon: s.transportIcon || '🛺',
          transitOptions: s.transitOptions || [
            { mode: 'auto', title: 'Local Auto / E-Rickshaw', fare: '₹30', time: '10 mins', icon: '🛺', badge: 'Recommended', steps: 'Direct drop at entrance' }
          ],
          directionsGuide: s.tips || `Travel to ${s.title}.`,
          tips: s.tips,
          category: s.category || 'Featured Attraction',
          crowdLevel: s.crowdLevel || 'Moderate (55%)'
        }));

        // Format spots into zones for crowd & alerts
        const formattedZones = data.spots.map((s, idx) => {
          const density = idx === 0 ? 88 : idx === 1 ? 72 : idx === 2 ? 42 : idx === 3 ? 24 : 18;
          return {
            id: s.id || `zone-${idx}`,
            name: s.title,
            lat: s.lat,
            lng: s.lng,
            capacity: 4500,
            currentVisitors: Math.round(density * 48 + 100),
            densityPercent: density,
            status: density > 75 ? 'overcrowded' : density > 40 ? 'heavy' : 'recommended',
            waitTime: density > 75 ? '45 mins' : density > 40 ? '15 mins' : '0 mins',
            category: s.category || 'Heritage Sight',
            ecoRewardTokens: density <= 40 ? 35 : 0,
            description: s.tips || `Major cultural landmark in ${cityName}.`,
            bestTime: idx === 0 ? '06:30 AM / Post 8 PM' : 'Morning Hours'
          };
        });

        const newGlobalPlace = {
          id: placeQuery.toLowerCase().replace(/\s+/g, '-'),
          name: data.name,
          shortName: cityName,
          flag: data.flag || '🇮🇳',
          center: data.center,
          zoom: data.zoom || 13,
          tagline: data.tagline,
          spots: formattedRoadmap,
          roadmap: formattedRoadmap,
          zones: formattedZones,
          weather: { temp: '29°C', condition: 'Clear & Sunny', humidity: '48%', aqi: '28 (Good)' },
          stats: { totalVisitorsToday: 54200, capacityUtilization: 68, ecoPointsEarned: 22400 }
        };

        setGlobalPlace(newGlobalPlace);
        setUserLocation({
          lat: data.center[0],
          lng: data.center[1],
          landmark: formattedRoadmap[0]?.title || cityName
        });

        // Set matching destination id if one matches
        const matched = destinations.find(d => d.id === placeQuery.toLowerCase().trim());
        if (matched) {
          setSelectedDestinationId(matched.id);
        }

        confetti({ particleCount: 50, spread: 65 });
      }
    } catch (err) {
      console.error('Error during global place search:', err);
    } finally {
      setIsGlobalSearching(false);
    }
  };

  // Sync with base destination dropdown if user uses that
  useEffect(() => {
    if (baseDestination) {
      setGlobalPlace({
        id: baseDestination.id,
        name: baseDestination.name,
        shortName: baseDestination.name.split(' ')[0],
        flag: baseDestination.flag || '🇮🇳',
        center: baseDestination.center,
        zoom: baseDestination.zoom || 14,
        tagline: baseDestination.tagline,
        spots: baseDestination.roadmap,
        roadmap: baseDestination.roadmap,
        zones: baseDestination.zones,
        weather: baseDestination.weather,
        stats: baseDestination.stats
      });

      setUserLocation({
        lat: baseDestination.center[0],
        lng: baseDestination.center[1],
        landmark: baseDestination.zones[1]?.name || 'Current Landmark'
      });
    }
  }, [selectedDestinationId]);

  const updateMilestoneStatus = (milestoneId, newStatus) => {
    setGlobalPlace(prev => ({
      ...prev,
      spots: prev.spots.map(s => s.id === milestoneId ? { ...s, status: newStatus } : s),
      roadmap: prev.roadmap.map(s => s.id === milestoneId ? { ...s, status: newStatus } : s)
    }));
  };

  const reorderMilestones = (newSequence) => {
    if (!newSequence || newSequence.length === 0) return;
    setGlobalPlace(prev => ({
      ...prev,
      spots: newSequence,
      roadmap: newSequence
    }));
  };

  return (
    <AppContext.Provider
      value={{
        selectedDestinationId,
        setSelectedDestinationId,
        activeTab,
        setActiveTab,
        currentDestination: globalPlace, // All components reading currentDestination get the global searched place!
        globalPlace,
        searchAndSetGlobalPlace,
        isGlobalSearching,
        destinations,
        userLocation,
        setUserLocation,
        ecoPoints,
        setEcoPoints,
        isRewardsWalletOpen,
        setIsRewardsWalletOpen,
        rewardTransactions,
        earnReward,
        redeemReward,
        isSosOpen,
        setIsSosOpen,
        sosState,
        setSosState,
        alerts,
        setAlerts,
        telemetry,
        currentRoadmap: globalPlace.roadmap || globalPlace.spots || [],
        updateMilestoneStatus,
        reorderMilestones,
        language,
        setLanguage,
        t,
        SUPPORTED_LANGUAGES,
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
