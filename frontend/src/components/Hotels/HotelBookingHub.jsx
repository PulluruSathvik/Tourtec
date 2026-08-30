import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getHotelsForLocation } from '../../services/hotelBookingService';
import { getDiningForLocation } from '../../services/diningService';
import {
  Building2,
  Hotel,
  UtensilsCrossed,
  MapPin,
  Star,
  Sparkles,
  Calendar,
  Users,
  Search,
  Filter,
  Check,
  CheckCircle2,
  ExternalLink,
  Tag,
  Coins,
  ShieldCheck,
  Coffee,
  Wifi,
  Waves,
  QrCode,
  ArrowRight,
  ChevronDown,
  Loader2,
  Phone,
  BedDouble,
  DollarSign,
  Calculator,
  Compass,
  Navigation,
  Clock,
  Heart,
  X,
  Printer,
  Download,
  CreditCard,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HotelBookingHub = () => {
  const { currentDestination, ecoPoints, setEcoPoints, currentUser } = useApp();

  const cityName = currentDestination?.name?.split(',')[0]?.trim() || 'Varanasi';
  const [activeTab, setActiveTab] = useState('stays'); // 'stays' | 'dining' | 'my_bookings'
  
  // Budget Filter State
  const [budgetTier, setBudgetTier] = useState('all'); // 'all' | 'budget' | 'comfort' | 'luxury'
  const [dailyBudgetSlider, setDailyBudgetSlider] = useState(4500);

  // Stays & Dining Data
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  // Stay Filter & Sorting
  const [checkInDate, setCheckInDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const next = new Date();
    next.setDate(next.getDate() + 2);
    return next.toISOString().split('T')[0];
  });
  const [roomType, setRoomType] = useState('Deluxe AC Room');
  const [guestsCount, setGuestsCount] = useState('2 Adults, 1 Room');
  
  // Instant Booking Modal State
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState(null);
  const [guestName, setGuestName] = useState(currentUser?.fullName || currentUser?.name || '');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phoneNumber || '+91 98765 43210');
  const [paymentOption, setPaymentOption] = useState('hotel'); // 'hotel' (pay at check-in) | 'upi'
  const [useRewardPointsDiscount, setUseRewardPointsDiscount] = useState(true);
  const [confirmedBookingPass, setConfirmedBookingPass] = useState(null);
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);

  // My Bookings History List
  const [myBookings, setMyBookings] = useState(() => {
    const saved = localStorage.getItem('tourtec_hotel_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  // Food Voucher Modal State
  const [claimedFoodVoucher, setClaimedFoodVoucher] = useState(null);

  useEffect(() => {
    setHotels(getHotelsForLocation(currentDestination.name));
    setRestaurants(getDiningForLocation(currentDestination.name));
  }, [currentDestination]);

  useEffect(() => {
    if (currentUser) {
      if (!guestName) setGuestName(currentUser.fullName || currentUser.name || '');
      if (!guestEmail) setGuestEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Filter Hotels based on Budget Slider & Tier
  const filteredHotels = hotels.filter(h => {
    if (budgetTier === 'budget') return h.priceINR <= 1500;
    if (budgetTier === 'comfort') return h.priceINR > 1500 && h.priceINR <= 5000;
    if (budgetTier === 'luxury') return h.priceINR > 5000;
    return h.priceINR <= dailyBudgetSlider * 2;
  });

  // Filter Restaurants based on Budget Tier
  const filteredRestaurants = restaurants.filter(r => {
    if (budgetTier === 'budget') return r.priceForTwoINR <= 250;
    if (budgetTier === 'comfort') return r.priceForTwoINR > 250 && r.priceForTwoINR <= 1000;
    if (budgetTier === 'luxury') return r.priceForTwoINR > 1000;
    return true;
  });

  // Open Booking Modal for a Hotel
  const handleOpenBookingModal = (hotel) => {
    setSelectedHotelForBooking(hotel);
    setConfirmedBookingPass(null);
    if (currentUser) {
      setGuestName(currentUser.fullName || currentUser.name || '');
      setGuestEmail(currentUser.email || '');
    }
  };

  // Confirm Hotel Room Booking
  const handleConfirmReservation = (e) => {
    if (e) e.preventDefault();
    if (!guestName.trim()) {
      alert('Please enter primary guest name');
      return;
    }

    setIsProcessingBooking(true);
    setTimeout(() => {
      setIsProcessingBooking(false);
      const discountINR = useRewardPointsDiscount && ecoPoints >= 50 ? 150 : 0;
      const finalPrice = Math.max(100, selectedHotelForBooking.priceINR - discountINR);
      const bookingId = `HTL-${cityName.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

      if (discountINR > 0) {
        setEcoPoints(p => Math.max(0, p - 50));
      } else {
        setEcoPoints(p => p + 50);
      }

      const bookingRecord = {
        bookingId,
        hotelName: selectedHotelForBooking.name,
        city: cityName,
        guestName,
        guestEmail,
        guestPhone,
        roomType,
        checkInDate,
        checkOutDate,
        guestsCount,
        finalPrice,
        discountApplied: discountINR,
        paymentOption: paymentOption === 'hotel' ? 'Pay at Hotel Desk' : 'UPI / Online Verified',
        bookingDate: new Date().toLocaleDateString(),
        amenities: selectedHotelForBooking.amenities || ['Free WiFi', 'AC Room', 'Hot Water']
      };

      setConfirmedBookingPass(bookingRecord);

      // Save to My Bookings
      const updated = [bookingRecord, ...myBookings];
      setMyBookings(updated);
      localStorage.setItem('tourtec_hotel_bookings', JSON.stringify(updated));

      confetti({ particleCount: 80, spread: 80 });
    }, 1000);
  };

  // Claim Food Voucher
  const handleClaimFoodCoupon = (foodSpot) => {
    setEcoPoints(p => Math.max(0, p - 30));
    const couponCode = `FOOD-${cityName.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setClaimedFoodVoucher({
      spotName: foodSpot.name,
      couponCode,
      discount: 'Flat 15% OFF + Free Kulhad Chai',
      validUntil: 'Valid for next 24 hours'
    });
    confetti({ particleCount: 50, spread: 60 });
  };

  return (
    <div className="space-y-6">

      {/* TOP HEADER & SEARCH BAR */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black mb-2">
              <Hotel className="w-3.5 h-3.5" />
              <span>Verified Hotel & Stay Booking Hub</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Hotels, Heritage Stays & Food in {cityName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Instant room reservations with zero booking fees, verified traveler reviews & reward discounts.
            </p>
          </div>

          {/* Tab Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('stays')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'stays' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Hotel className="w-3.5 h-3.5" />
              <span>🏨 Stays & Hotels ({filteredHotels.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('dining')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dining' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>🍛 Food & Dining ({filteredRestaurants.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('my_bookings')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'my_bookings' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-900" />
              <span>📋 My Bookings ({myBookings.length})</span>
            </button>
          </div>
        </div>

        {/* DATE & GUEST SEARCH STRIP */}
        {activeTab === 'stays' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-600" />
                <span>Check-In Date</span>
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-600" />
                <span>Check-Out Date</span>
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-600" />
                <span>Guests & Rooms</span>
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option>1 Adult (Solo Stay)</option>
                <option>2 Adults, 1 Room</option>
                <option>3 Adults, 1 Room</option>
                <option>Family (2 Adults, 2 Kids)</option>
                <option>Group (4+ Guests, 2 Rooms)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Filter className="w-3 h-3 text-blue-600" />
                <span>Budget Filter</span>
              </label>
              <select
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Price Ranges</option>
                <option value="budget">Backpacker / Budget (Under ₹1,500)</option>
                <option value="comfort">Comfort & Heritage (₹1,500 - ₹5,000)</option>
                <option value="luxury">Luxury Resorts (₹5,000+)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 1. STAYS & HOTELS TAB */}
      {activeTab === 'stays' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-black text-slate-900">
              Available Hotels & Stays in <span className="text-blue-600">{cityName}</span> ({filteredHotels.length} Verified Properties):
            </h4>
            <span className="text-slate-500 font-bold">Best Price Guaranteed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white border border-slate-200 hover:border-blue-500 rounded-3xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Hotel Image with Badge */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-xl text-[10px] font-black text-amber-400 border border-white/20">
                      ★ {hotel.badge || 'VERIFIED STAY'}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-xl text-[11px] font-black text-slate-900 shadow-sm">
                      ⭐ {hotel.rating || 4.7}
                    </div>
                  </div>

                  {/* Hotel Details */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="truncate">{hotel.location || `Central ${cityName}`}</span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                      {hotel.description}
                    </p>

                    {/* Amenities Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {hotel.amenities?.slice(0, 3).map((a, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">
                          ✓ {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Primary Booking Action Button */}
                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <div className="text-lg font-black text-slate-900 font-mono">
                      ₹{hotel.priceINR.toLocaleString()}
                      <span className="text-[10px] text-slate-500 font-normal font-sans"> /night</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">Instant Confirmation</span>
                  </div>

                  {/* HIGH VISIBILITY BOOK BUTTON */}
                  <button
                    onClick={() => handleOpenBookingModal(hotel)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs rounded-2xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Hotel className="w-3.5 h-3.5" />
                    <span>Book Room</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. FOOD & DINING TAB */}
      {activeTab === 'dining' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-black text-slate-900">
              Famous Restaurants & Authentic Food in <span className="text-blue-600">{cityName}</span>:
            </h4>
            <span className="text-slate-500 font-bold">Showing {filteredRestaurants.length} Places</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((food) => (
              <div
                key={food.id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-emerald-600 text-white rounded-lg text-[10px] font-black">
                      {food.cuisine || 'Authentic Local'}
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-white text-slate-900 rounded-lg text-xs font-black">
                      ⭐ {food.rating || 4.8}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-black text-slate-900">{food.name}</h3>
                    <p className="text-xs text-slate-600 font-medium">{food.description}</p>
                    <div className="text-xs text-amber-800 font-bold bg-amber-50 p-2 rounded-xl">
                      🍽️ <strong>Must Try:</strong> {food.famousDish}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-black text-slate-900">₹{food.priceForTwoINR} <span className="text-[10px] text-slate-400">for two</span></div>
                  </div>
                  <button
                    onClick={() => handleClaimFoodCoupon(food)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Claim 15% OFF Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MY BOOKINGS TAB */}
      {activeTab === 'my_bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-black text-slate-900">Your Confirmed Hotel Bookings ({myBookings.length}):</h4>
            {myBookings.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear booking history?')) {
                    setMyBookings([]);
                    localStorage.removeItem('tourtec_hotel_bookings');
                  }
                }}
                className="text-red-600 font-bold hover:underline cursor-pointer"
              >
                Clear History
              </button>
            )}
          </div>

          {myBookings.length === 0 ? (
            <div className="p-12 bg-white border border-slate-200 rounded-3xl text-center space-y-3">
              <Hotel className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-black text-slate-800">No Hotel Bookings Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our curated hotels in {cityName} and click "Book Room" to generate your instant digital hotel pass.
              </p>
              <button
                onClick={() => setActiveTab('stays')}
                className="px-6 py-2.5 bg-blue-600 text-white font-black text-xs rounded-2xl shadow-sm cursor-pointer"
              >
                Explore Hotels
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myBookings.map((b, idx) => (
                <div key={idx} className="bg-white border-2 border-emerald-300 rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-700 block">CONFIRMED RESERVATION</span>
                      <h4 className="text-base font-black text-slate-900">{b.hotelName}</h4>
                      <span className="text-xs text-slate-500 font-medium">📍 {b.city}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-mono font-bold text-xs rounded-xl">
                      {b.bookingId}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-1 font-medium text-slate-700">
                    <div className="flex justify-between">
                      <span>Primary Guest:</span>
                      <strong className="text-slate-900">{b.guestName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-In / Out:</span>
                      <strong className="text-slate-900">{b.checkInDate} to {b.checkOutDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Room Type:</span>
                      <strong className="text-slate-900">{b.roomType || 'Deluxe Room'}</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1 text-emerald-800 font-bold">
                      <span>Total Amount:</span>
                      <span>₹{b.finalPrice.toLocaleString()} ({b.paymentOption})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save Booking Pass</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. MODAL: INSTANT ROOM BOOKING MODAL */}
      {selectedHotelForBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-200 block">
                  CONFIRM HOTEL RESERVATION
                </span>
                <h3 className="text-lg font-black">{selectedHotelForBooking.name}</h3>
                <span className="text-xs text-blue-100">📍 {cityName}</span>
              </div>

              <button
                onClick={() => setSelectedHotelForBooking(null)}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[80vh] space-y-4">
              {!confirmedBookingPass ? (
                <form onSubmit={handleConfirmReservation} className="space-y-4">
                  
                  {/* Reservation Summary */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500">Dates:</span>
                      <strong className="text-slate-900">{checkInDate} to {checkOutDate} (2 Nights)</strong>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500">Occupancy:</span>
                      <strong className="text-slate-900">{guestsCount}</strong>
                    </div>
                  </div>

                  {/* Room Type Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Select Room Category *</label>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option>Deluxe AC Room (Queen Bed)</option>
                      <option>Executive Heritage Suite (River / City View)</option>
                      <option>Standard Comfort Room</option>
                      <option>Dormitory Bunk Bed</option>
                    </select>
                  </div>

                  {/* Guest Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Primary Guest Full Name *</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Sathvik Reddy"
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Payment Mode */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setPaymentOption('hotel')}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer ${
                          paymentOption === 'hotel' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <Building className="w-3.5 h-3.5" />
                        <span>Pay at Hotel Desk</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentOption('upi')}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer ${
                          paymentOption === 'upi' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>UPI / Card Online</span>
                      </button>
                    </div>
                  </div>

                  {/* Reward Discount Toggle */}
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="text-xs font-black text-amber-950">Apply ₹150 Reward Points Discount</div>
                        <div className="text-[10px] text-amber-800">Use 50 of your {ecoPoints} points</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={useRewardPointsDiscount}
                      onChange={(e) => setUseRewardPointsDiscount(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                    />
                  </div>

                  {/* Price Breakdown */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Room Tariff:</span>
                      <span>₹{selectedHotelForBooking.priceINR.toLocaleString()}</span>
                    </div>
                    {useRewardPointsDiscount && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Reward Discount:</span>
                        <span>- ₹150</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black border-t border-slate-700 pt-2 text-amber-400">
                      <span>Total Amount:</span>
                      <span>₹{(selectedHotelForBooking.priceINR - (useRewardPointsDiscount ? 150 : 0)).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessingBooking}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessingBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>{isProcessingBooking ? 'Reserving Room with Hotel...' : 'Confirm Instant Reservation'}</span>
                  </button>

                </form>
              ) : (
                /* CONFIRMED BOOKING PASS */
                <div className="space-y-4 text-center animate-fadeIn">
                  <div className="p-5 bg-emerald-50 border-2 border-emerald-400 rounded-3xl space-y-3">
                    <div className="inline-block p-3 bg-emerald-100 text-emerald-800 rounded-full">
                      <Check className="w-6 h-6" />
                    </div>

                    <h4 className="font-black text-lg text-emerald-950 font-heritage">
                      Hotel Reservation Confirmed!
                    </h4>
                    <p className="text-xs text-emerald-800 font-medium">
                      Your booking voucher has been generated and saved to your account.
                    </p>

                    {/* QR Code Container */}
                    <div className="p-3 bg-white border-2 border-amber-400 rounded-2xl inline-block shadow-inner">
                      <div className="w-36 h-36 mx-auto bg-slate-900 p-2 rounded-xl flex flex-col items-center justify-center text-white font-mono text-center text-[10px] space-y-1">
                        <QrCode className="w-12 h-12 text-amber-400" />
                        <span className="font-bold">{confirmedBookingPass.bookingId}</span>
                        <span className="text-[8px] text-slate-400">{confirmedBookingPass.hotelName.slice(0, 18)}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-left bg-white p-4 rounded-2xl border border-emerald-200">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Booking Reference:</span>
                        <strong className="font-mono text-slate-900">{confirmedBookingPass.bookingId}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Primary Guest:</span>
                        <strong className="text-slate-900">{confirmedBookingPass.guestName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Hotel:</span>
                        <strong className="text-slate-900 truncate max-w-[200px]">{confirmedBookingPass.hotelName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Room Category:</span>
                        <strong className="text-slate-900">{confirmedBookingPass.roomType}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Check-In Date:</span>
                        <strong className="text-slate-900">{confirmedBookingPass.checkInDate}</strong>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 pt-1.5 text-emerald-700 font-bold">
                        <span>Total Tariff:</span>
                        <span>₹{confirmedBookingPass.finalPrice.toLocaleString()} ({confirmedBookingPass.paymentOption})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Voucher</span>
                    </button>
                    <button
                      onClick={() => setSelectedHotelForBooking(null)}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl transition cursor-pointer"
                    >
                      Done / Close
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 5. FOOD VOUCHER CLAIM MODAL */}
      {claimedFoodVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <UtensilsCrossed className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900 font-heritage">
                Food Voucher Claimed!
              </h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">{claimedFoodVoucher.spotName}</p>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl space-y-1">
              <div className="text-lg font-black font-mono text-amber-950 tracking-wider">
                {claimedFoodVoucher.couponCode}
              </div>
              <div className="text-xs font-bold text-amber-800">{claimedFoodVoucher.discount}</div>
              <div className="text-[10px] text-slate-500">{claimedFoodVoucher.validUntil}</div>
            </div>

            <button
              onClick={() => setClaimedFoodVoucher(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Use at Counter / Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
