import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  searchAPTourism,
  getAPDistricts,
  getAPPlaceTypes
} from '../../services/apTourismService';
import {
  MapPin,
  Compass,
  Star,
  Clock,
  Coins,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const APTourismExplorer = () => {
  const { searchAndSetGlobalPlace, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCrowd, setSelectedCrowd] = useState('all');
  const [activeTabSub, setActiveTabSub] = useState('all');

  const districts = useMemo(() => getAPDistricts(), []);
  const placeTypes = useMemo(() => getAPPlaceTypes(), []);

  const filteredPlaces = useMemo(() => {
    return searchAPTourism(searchQuery, selectedDistrict, selectedType, selectedCrowd);
  }, [searchQuery, selectedDistrict, selectedType, selectedCrowd]);

  const handleSelectPlace = async (place) => {
    await searchAndSetGlobalPlace(place.place_name);
    setActiveTab('roadmap');
    confetti({ particleCount: 50, spread: 70 });
  };

  const getCrowdBadgeClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'medium': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'high': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'very high': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>50,000 Official AP Tourism Dataset Integrated</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            🏛️ Andhra Pradesh Heritage & Tourism Directory
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Explore 259+ verified temples, hill stations, caves, forts, and beaches across all 21 districts of AP with live entry fees and crowd metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black">
            {filteredPlaces.length} Destinations Found
          </span>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        
        {/* Search Bar */}
        <div className="sm:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search temple, fort, cave, beach, or city..."
            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* District Selector */}
        <div className="sm:col-span-3">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Districts (21)</option>
            {districts.map(d => (
              <option key={d} value={d}>{d} District</option>
            ))}
          </select>
        </div>

        {/* Place Type Selector */}
        <div className="sm:col-span-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Categories ({placeTypes.length})</option>
            {placeTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Crowd Filter */}
        <div className="sm:col-span-2">
          <select
            value={selectedCrowd}
            onChange={(e) => setSelectedCrowd(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Crowds</option>
            <option value="Low">Low Crowd</option>
            <option value="Medium">Medium</option>
            <option value="High">High Crowd</option>
            <option value="Very High">Very High</option>
          </select>
        </div>

      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-1">
        {filteredPlaces.slice(0, 30).map((place) => (
          <div
            key={place.id}
            className="p-4 bg-slate-50/70 border border-slate-200 hover:border-blue-500 rounded-2xl transition hover:shadow-md flex flex-col justify-between group space-y-3"
          >
            {/* Card Header */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                  {place.place_type}
                </span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black uppercase ${getCrowdBadgeClass(place.crowd_level)}`}>
                  {place.crowd_level} Crowd
                </span>
              </div>

              <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                {place.place_name}
              </h4>
              
              <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{place.city}, {place.district} District</span>
              </div>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 block text-[9px] font-bold">ENTRY FEE</span>
                <span className="font-black text-slate-800">
                  {place.entry_fee_inr > 0 ? `₹${place.entry_fee_inr}` : 'Free'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[9px] font-bold">RATING</span>
                <span className="font-black text-amber-600 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{place.rating} / 5</span>
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[9px] font-bold">BEST SEASON</span>
                <span className="font-bold text-slate-700 text-[10px]">{place.best_season}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[9px] font-bold">AVG VISIT</span>
                <span className="font-bold text-slate-700 text-[10px]">{place.average_visit_duration_hours} Hours</span>
              </div>
            </div>

            {/* Distance Matrix */}
            <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-200/60 pt-2">
              <span>📍 {place.distance_from_vijayawada_km}km from VJA</span>
              <span>📍 {place.distance_from_tirupati_km}km from TPT</span>
            </div>

            {/* 1-Click Action Button */}
            <button
              onClick={() => handleSelectPlace(place)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore in Itinerary & Satellite Map</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
