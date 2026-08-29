import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DynamicRoadmap } from './components/Roadmap/DynamicRoadmap';
import { TravelDigitalTwin } from './components/DigitalTwin/TravelDigitalTwin';
import { HotelBookingHub } from './components/Hotels/HotelBookingHub';
import { TransportRentalsHub } from './components/Transport/TransportRentalsHub';
import { SmartFlowDistribution } from './components/FlowDistribution/SmartFlowDistribution';
import { ContextLanguageAssistant } from './components/LanguageAssistant/ContextLanguageAssistant';
import { MobileBottomNav } from './components/Navigation/MobileBottomNav';
import { SosModal } from './components/Common/SosModal';
import { RewardsWalletModal } from './components/Common/RewardsWalletModal';
import { AuthModal } from './components/Auth/AuthModal';
import { Heart, Shield, Sparkles, MapPin, Mail, ArrowRight, Globe, Share2, Compass } from 'lucide-react';

export const AppContent = () => {
  const { activeTab, setActiveTab, currentDestination } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-holiday antialiased selection:bg-blue-200 selection:text-blue-950 pb-16 lg:pb-0">
      
      {/* 1. Top Modern Navigation */}
      <Navbar />

      {/* 2. Main Full-Screen Fluid Content Area */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 space-y-10">
        
        {/* Dynamic Hero Banner with Floating Search Capsule & Roadtrip Graphic */}
        <HeroBanner />

        {/* Feature Modules View Header */}
        <div id="feature-module-section" className="pt-6 border-t border-slate-200/80 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
                Interactive Smart Travel Grid
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {activeTab === 'roadmap' && 'Your Itinerary & Live GPS Navigation'}
                {activeTab === 'hotels' && `Exclusive Hotel & Food Stays in ${currentDestination.name.split(',')[0]}`}
                {activeTab === 'rentals' && `Private Cabs, Tourist Buses & Verified Agencies in ${currentDestination.name.split(',')[0]}`}
                {activeTab === 'digitalTwin' && `Live Crowd Density & Queue Clearance in ${currentDestination.name.split(',')[0]}`}
                {activeTab === 'flow' && 'Avoid Queues with 1-Click VIP FastPasses'}
                {activeTab === 'assistant' && 'Multilingual AI Travel Guide & Camera Translator'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                📍 {currentDestination.name.split(',')[0]}
              </span>
            </div>
          </div>

          {/* Active Module View */}
          <div className="w-full">
            {activeTab === 'roadmap' && <DynamicRoadmap />}
            {activeTab === 'hotels' && <HotelBookingHub />}
            {activeTab === 'rentals' && <TransportRentalsHub />}
            {activeTab === 'digitalTwin' && <TravelDigitalTwin />}
            {activeTab === 'flow' && <SmartFlowDistribution />}
            {activeTab === 'assistant' && <ContextLanguageAssistant />}
          </div>
        </div>

      </main>

      {/* User Sign Up / Sign In SSO Modal */}
      <AuthModal />

      {/* Rewards Points & Wallet Modal */}
      <RewardsWalletModal />

      {/* Emergency SOS Modal */}
      <SosModal />

      {/* 3. Modern Dark Navy Footer matching the Reference Design */}
      <footer className="bg-[#0F172A] text-slate-400 mt-20 pt-16 pb-12 w-full border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Top Newsletter & Promo Banner inside Footer */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Ready to plan your trip in half the time?
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 font-medium">
                Get real-time crowd alerts, exclusive hotel discounts & verified temple fastpasses delivered to your device.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email..."
                className="px-4 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-blue-200 text-xs sm:text-sm focus:outline-none focus:bg-white/20 w-full sm:w-64"
              />
              <button
                onClick={() => alert('Thank you for subscribing to TOURTEC Travel Updates!')}
                className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-900 font-black rounded-full text-xs sm:text-sm whitespace-nowrap shadow-md transition active:scale-95 cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
            
            {/* Brand Col */}
            <div className="space-y-4 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-orange-500 text-white font-black text-xs">
                  Holiday
                </span>
                <span className="font-extrabold text-xl text-white">
                  Tourtec<span className="text-blue-400">.</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Smart Geospatial Tourism & Crowd Prediction Platform for Incredible India.
              </p>
              <div className="flex items-center gap-3 pt-2 text-slate-300">
                <div className="p-2 bg-slate-800 hover:bg-blue-600 rounded-full transition cursor-pointer"><Globe className="w-4 h-4" /></div>
                <div className="p-2 bg-slate-800 hover:bg-blue-600 rounded-full transition cursor-pointer"><Share2 className="w-4 h-4" /></div>
                <div className="p-2 bg-slate-800 hover:bg-blue-600 rounded-full transition cursor-pointer"><Compass className="w-4 h-4" /></div>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explore Cities</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('roadmap')}>Hyderabad (City of Pearls)</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('roadmap')}>Varanasi (Sacred Ghats)</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('roadmap')}>Agra (Taj Mahal)</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('roadmap')}>Vijayawada (Kanaka Durga)</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('roadmap')}>Tirupati (Balaji Darshan)</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Features</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('hotels')}>Hotels & Food by Budget</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('digitalTwin')}>Live Crowd & Queue Times</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('flow')}>VIP FastPass & Rewards</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('assistant')}>Multilingual Voice Assistant</li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Trust & Safety</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white cursor-pointer">Incredible India Verified</li>
                <li className="hover:text-white cursor-pointer">Tourist Helpline 1363</li>
                <li className="hover:text-white cursor-pointer">Emergency Police 112</li>
                <li className="hover:text-white cursor-pointer">Open-Meteo Weather Grid</li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 TOURTEC Holiday India. All rights reserved. Built for Smart Indian Tourism.
            </div>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-400 cursor-pointer">Security</span>
            </div>
          </div>

        </div>
      </footer>

      {/* 4. Mobile Bottom Fixed App Bar */}
      <MobileBottomNav />

    </div>
  );
};

export default function App() {
  return <AppContent />;
}
