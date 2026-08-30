import apTourismData from '../data/apTourismDataset.json';

// Get all unique districts
export const getAPDistricts = () => {
  const set = new Set(apTourismData.map(p => p.district));
  return Array.from(set).sort();
};

// Get all unique place types
export const getAPPlaceTypes = () => {
  const set = new Set(apTourismData.map(p => p.place_type));
  return Array.from(set).sort();
};

// Search AP Tourism Database
export const searchAPTourism = (query = '', district = 'all', placeType = 'all', crowd = 'all') => {
  const q = (query || '').toLowerCase().trim();
  
  return apTourismData.filter(place => {
    const matchQuery = !q || 
      place.place_name.toLowerCase().includes(q) ||
      place.city.toLowerCase().includes(q) ||
      place.district.toLowerCase().includes(q) ||
      place.place_type.toLowerCase().includes(q);
      
    const matchDistrict = district === 'all' || place.district.toLowerCase() === district.toLowerCase();
    const matchType = placeType === 'all' || place.place_type.toLowerCase() === placeType.toLowerCase();
    const matchCrowd = crowd === 'all' || place.crowd_level.toLowerCase() === crowd.toLowerCase();

    return matchQuery && matchDistrict && matchType && matchCrowd;
  });
};

// Find matching AP city or district for global search integration
export const findAPDestinationBundle = (searchTerm) => {
  const term = (searchTerm || '').toLowerCase().trim();
  if (!term) return null;

  // Filter matching places
  const matching = apTourismData.filter(p => 
    p.city.toLowerCase().includes(term) ||
    p.district.toLowerCase().includes(term) ||
    p.place_name.toLowerCase().includes(term) ||
    term.includes(p.city.toLowerCase()) ||
    term.includes(p.district.toLowerCase())
  );

  if (matching.length === 0) return null;

  // Calculate center coordinates
  const avgLat = matching.reduce((sum, p) => sum + p.lat, 0) / matching.length;
  const avgLng = matching.reduce((sum, p) => sum + p.lng, 0) / matching.length;
  const primaryPlace = matching[0];

  const times = ['07:30 AM', '10:30 AM', '01:30 PM', '04:30 PM', '06:45 PM', '08:00 PM'];
  const transportModes = [
    { mode: 'walk', title: 'Walk / E-Auto', fare: 'Free / ₹20', icon: '🚶‍♂️' },
    { mode: 'auto', title: 'Local Auto-Rickshaw', fare: '₹35', icon: '🛺' },
    { mode: 'bus', title: 'APSRTC Express Bus', fare: '₹40', icon: '🚌' },
    { mode: 'cab', title: 'AC Tourist Taxi', fare: '₹150', icon: '🚕' },
    { mode: 'walk', title: 'Evening Stroll', fare: 'Free', icon: '🚶‍♂️' }
  ];

  const spots = matching.slice(0, 5).map((p, idx) => ({
    id: `ap-${p.id}`,
    title: p.place_name,
    category: `${p.place_type} (${p.district} District)`,
    time: times[idx] || '02:00 PM',
    lat: p.lat,
    lng: p.lng,
    distanceKm: idx === 0 ? 0.0 : +(idx * 2.8).toFixed(1),
    travelTime: idx === 0 ? 'Starting Point' : `${p.estimated_travel_time_hours * 60 || 15} mins`,
    recommendedTransport: transportModes[idx % transportModes.length].title,
    recommendedFare: p.entry_fee_inr > 0 ? `₹${p.entry_fee_inr} Entry` : 'Free Entry',
    transportIcon: transportModes[idx % transportModes.length].icon,
    crowdLevel: `${p.crowd_level} (${Math.round(p.rating * 20)}%)`,
    tips: `Rating: ⭐ ${p.rating}/5 | Best Season: ${p.best_season} | Avg Duration: ${p.average_visit_duration_hours} hrs | Entry: ₹${p.entry_fee_inr}`,
    transitOptions: [
      {
        mode: transportModes[idx % transportModes.length].mode,
        title: transportModes[idx % transportModes.length].title,
        fare: transportModes[idx % transportModes.length].fare,
        time: `${Math.round(p.estimated_travel_time_hours * 60) || 12} mins`,
        icon: transportModes[idx % transportModes.length].icon,
        badge: p.crowd_level === 'Very High' ? 'Crowded' : 'Recommended',
        steps: `Route from ${primaryPlace.city} center to ${p.place_name}`
      }
    ]
  }));

  return {
    name: `${primaryPlace.city || primaryPlace.district}, Andhra Pradesh`,
    flag: '🏛️',
    center: [primaryPlace.lat, primaryPlace.lng],
    zoom: 13,
    tagline: `AP Tourism Official Dataset: ${matching.length} Verified Heritage & Pilgrimage Spots`,
    spots,
    zones: spots.slice(0, 3).map((s, idx) => ({
      id: `z-${idx + 1}`,
      name: s.title,
      status: idx === 0 ? 'open' : idx === 1 ? 'moderate' : 'open',
      waitTimeMinutes: idx === 0 ? 5 : 15,
      lat: s.lat,
      lng: s.lng
    }))
  };
};

export default apTourismData;
