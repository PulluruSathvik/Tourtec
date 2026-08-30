// Comprehensive Multi-Source AI Travel Intelligence Engine for Incredible India

// 1. Fetch live Wikipedia Summary for any landmark/topic
export const fetchWikipediaSummary = async (queryTerm) => {
  try {
    const cleanTerm = encodeURIComponent(queryTerm.replace(/\s+/g, '_'));
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${cleanTerm}`);
    if (res.ok) {
      const data = await res.json();
      if (data.extract && data.type !== 'disambiguation' && data.extract.length > 50) {
        return {
          title: data.title,
          description: data.description || '',
          extract: data.extract,
          thumbnail: data.thumbnail?.source || null
        };
      }
    }
  } catch (err) {
    console.warn('Wikipedia API fetch failed:', err);
  }
  return null;
};

// 2. Comprehensive Destination Travel Intelligence Knowledge Matrix (Plans, Budgets, Stays, Food, Commute)
export const DESTINATIONS_DB = {
  varanasi: {
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    tagline: 'The Spiritual Capital of India & City of Light',
    idealDays: '2 to 3 Days',
    bestTime: 'October to March (Pleasant weather & grand Dev Deepawali festival)',
    itinerary: [
      {
        day: 'Day 1: Spiritual Awakening & Ganga Aarti',
        morning: '🌅 05:30 AM Sunrise wooden boat ride on holy Ganga from Assi Ghat to Manikarnika Ghat. Attend Subah-e-Banaras morning music and yoga at Assi Ghat.',
        afternoon: '🛕 10:30 AM VIP Darshan at Kashi Vishwanath Jyotirlinga Temple Corridor. Visit Annapurna Temple & Vishalakshi Shaktipeeth.',
        evening: '🪔 05:45 PM Front-row seats at Dashashwamedh Ghat for the world-famous Grand Ganga Aarti. Dinner at Godowlia street market.'
      },
      {
        day: 'Day 2: Buddhist Heritage & Ancient Alleys',
        morning: '☸️ 08:30 AM Excursion to Sarnath (10km) where Lord Buddha preached his first sermon. Visit Dhamek Stupa, Mulagandha Kuti Vihar & Sarnath Museum (Ashoka Lion Capital).',
        afternoon: '🛍️ 02:00 PM Heritage walk through narrow Thatheri Bazaar galis for authentic Banarasi Silk Sarees & brass handicrafts.',
        evening: '🎶 06:00 PM Classical music performance or sunset boat cruise to Namo Ghat with iconic folded hands sculptures.'
      }
    ],
    budget: {
      soloBackpacker: '₹1,500 – ₹2,200 / day',
      coupleComfort: '₹3,500 – ₹5,500 / day (total for 2)',
      familyLuxury: '₹8,000 – ₹15,000 / day',
      breakdown: {
        stay: 'Hostels ₹450–₹1,000 | 3-Star Hotels ₹1,800–₹3,500 | Heritage Haveli ₹6,000+',
        food: '₹300 – ₹700 per person/day (Kachori-Jalebi, Lassi, Thali)',
        transport: '₹150 – ₹400/day (E-rickshaws ₹20–₹50, Shared Autos)',
        activities: 'Boat ride ₹150–₹300 | Sarnath Ticket ₹25 | Temple Darshan Free'
      }
    },
    stays: [
      '🌊 Riverfront Heritage: BrijRama Palace (Darbhanga Ghat), Palace on Ganges',
      '🎒 Backpacker Hostels: Zostel Varanasi (Near Assi Ghat), Moustache Hostel',
      '🕉️ Temple Dharamshala: Kashi Vishwanath Devasthanam Guest House',
      '🏨 Cantonment Comfort: Taj Ganges, Radisson Hotel Varanasi'
    ],
    food: [
      '🍛 Ram Bhandar / Netaji: Desi Ghee Kachori & Crispy Jalebi for breakfast',
      '🥛 Blue Lassi / Pahalwan Lassi: Thick Kulhad Malai Lassi with rabri & saffron',
      '🍲 Keshari Restaurant: Authentic Pure Vegetarian North & South Indian Thali',
      '🍃 Keshav Tambool: Royal Banarasi Meetha Paan'
    ],
    howToReach: 'Direct flights to Lal Bahadur Shastri Airport (VNS). Varanasi Junction (BSB) / Pt. Deen Dayal Upadhyaya Junction (DDU) are major railway hubs.',
    proTips: [
      'Strict temple dress code: Dhoti/Kurta for men, Sarees/Salwar for women at sanctum.',
      'Leave mobile phones and leather belts in free lockers at Gate #4 before temple entry.',
      'Reach Dashashwamedh Ghat by 05:45 PM for prime seating before the crowd swells.'
    ]
  },

  goa: {
    name: 'Goa',
    state: 'Goa',
    tagline: 'Sun-Kissed Beaches, Portuguese Heritage & Vibrant Nightlife',
    idealDays: '3 to 4 Days',
    bestTime: 'November to February (Pleasant coastal breeze, watersports & beach festivals)',
    itinerary: [
      {
        day: 'Day 1: North Goa Beaches & Watersports',
        morning: '🏖️ 09:00 AM Parasailing, Jet-Ski and Banana boat ride at Calangute & Baga Beach.',
        afternoon: '🏰 02:00 PM Explore Portuguese Aguada Fort and lighthouse with panoramic Arabian Sea views.',
        evening: '🌅 05:30 PM Sunset at Anjuna / Vagator Beach cliffs followed by dinner at Curlies or Tito’s Lane.'
      },
      {
        day: 'Day 2: UNESCO Heritage, Churches & Latin Quarter',
        morning: '⛪ 09:30 AM Visit Old Goa: Basilica of Bom Jesus (St. Francis Xavier relic) & Se Cathedral.',
        afternoon: '🎨 01:30 PM Photowalk through Fontainhas (Panaji) vibrant yellow & blue Portuguese heritage lanes.',
        evening: '🚢 06:30 PM Mandovi River Sunset Dinner Cruise with live Goan folk dance & music.'
      },
      {
        day: 'Day 3: South Goa Tranquility & Waterfalls',
        morning: '💦 08:00 AM Day trip to the majestic Dudhsagar 4-tiered waterfall inside Bhagwan Mahavir Sanctuary.',
        afternoon: '🌴 02:30 PM Relax on serene white sands of Palolem & Colva Beach in South Goa.',
        evening: '🕯️ 07:00 PM Candlelight beach shack dinner with fresh Kingfish Rawa Fry and Goan Prawn Curry.'
      }
    ],
    budget: {
      soloBackpacker: '₹2,000 – ₹3,000 / day',
      coupleComfort: '₹5,000 – ₹8,500 / day (total for 2)',
      familyLuxury: '₹12,000 – ₹25,000 / day',
      breakdown: {
        stay: 'Hostels ₹600–₹1,200 | Beach Cottages ₹2,200–₹4,500 | 5-Star Luxury ₹8,000+',
        food: '₹600 – ₹1,400 per person/day (Shacks, Seafood, Cafes)',
        transport: 'Scooter Rental ₹350–₹500/day | Thar / Cab ₹1,800–₹3,000/day',
        activities: 'Watersports combo ₹1,200 | Mandovi Cruise ₹500 | Scuba Diving ₹2,500'
      }
    },
    stays: [
      '🏖️ North Goa (Nightlife & Parties): Baga, Calangute, Anjuna (Zostel, W Goa)',
      '🌴 South Goa (Peace & Couples): Palolem, Colva, Cavellossim (Taj Exotica, ITC Grand Goa)',
      '🎨 Heritage & Culture: Fontainhas Panaji (WelcomHeritage Panjim Inn)'
    ],
    food: [
      '🐟 Goan Fish Curry Thali & Kingfish Rawa Fry at Ritz Classic / Anand Seafood',
      '🍞 Pork/Chicken Vindaloo & Poi Bread at Mum’s Kitchen Panaji',
      '🍰 Bebinca Layered Cake & Feni Cocktails at Fisherman’s Wharf'
    ],
    howToReach: 'Direct flights to Dabolim Airport (GOI) or Manohar International Airport Mopa (GOX). Trains to Madgaon (MAO) or Thivim (THVM).',
    proTips: [
      'Rent a two-wheeler (Scooter) with a valid driving license for the most flexible travel.',
      'Always negotiate watersports package deals directly on the beach.',
      'South Goa is ideal for family & peace; North Goa is best for nightlife and parties.'
    ]
  },

  hyderabad: {
    name: 'Hyderabad',
    state: 'Telangana',
    tagline: 'City of Pearls, Nizam Royal Palaces & World-Famous Biryani',
    idealDays: '2 to 3 Days',
    bestTime: 'October to March (Pleasant winter climate)',
    itinerary: [
      {
        day: 'Day 1: Nizam Palaces, Charminar & Pearls',
        morning: '🏰 09:00 AM Explore historic Charminar & climb to the upper gallery. Sip Irani Chai at Nimrah Cafe.',
        afternoon: '🦪 01:00 PM Shop for authentic Basra pearls & lacquer bangles at Laad Bazaar. Lunch: Legendary Mutton Dum Biryani at Hotel Shadab.',
        evening: '👑 03:30 PM Tour royal Chowmahalla Palace and Salar Jung Museum. Sunset stroll at Hussain Sagar Lake & Buddha Statue.'
      },
      {
        day: 'Day 2: Golconda Fortress & Film City',
        morning: '🛡️ 08:30 AM Explore acoustic architecture of Golconda Fort & royal Qutb Shahi Tombs.',
        afternoon: '🎬 01:00 PM Excursion to Ramoji Film City (World’s largest film studio complex) or Shilparamam Arts Village.',
        evening: '✨ 07:00 PM Sound & Light laser show at Golconda or luxury dinner at Taj Falaknuma Palace.'
      }
    ],
    budget: {
      soloBackpacker: '₹1,400 – ₹2,000 / day',
      coupleComfort: '₹3,500 – ₹6,000 / day (total for 2)',
      familyLuxury: '₹9,000 – ₹18,000 / day',
      breakdown: {
        stay: 'Budget Hotels ₹900–₹1,800 | 3-Star Hotels ₹2,500–₹4,500 | Palace Stays ₹12,000+',
        food: '₹400 – ₹900 per person/day (Biryani ₹250, Irani Chai ₹25, Haleem ₹200)',
        transport: 'Metro / Auto ₹150–₹350/day | App Cabs ₹600–₹1,200/day',
        activities: 'Golconda Fort ₹25 | Salar Jung ₹50 | Ramoji Studio ₹1,350'
      }
    },
    stays: [
      '👑 Royal Luxury: Taj Falaknuma Palace, ITC Kohenur (Hitech City)',
      '🏙️ Central & Upscale: Banjara Hills, Jubilee Hills (Park Hyatt, Radisson)',
      '🛺 Budget & Historic: Abids, Nampally (Near Charminar & Station, ₹800–₹1,600)'
    ],
    food: [
      '🍗 Authentic Hyderabadi Dum Biryani: Hotel Shadab, Bawarchi (RTC X Roads), Cafe Bahar',
      '☕ Irani Chai with Osmania Biscuits: Nimrah Cafe (Right facing Charminar)',
      '🍲 Seasonal Mutton Haleem: Pista House, Shah Ghouse',
      '🍨 Famous Ice Cream: Mozamjahi Market handmade fruit ice creams'
    ],
    howToReach: 'Direct flights to Rajiv Gandhi International Airport (HYD). Secunderabad (SC) & Hyderabad Deccan (HYB) are major railway stations.',
    proTips: [
      'Use the Hyderabad Metro (Red & Blue lines) to bypass peak hour city traffic easily.',
      'Buy pearls only from certified government-approved stores in Pathergatti with authenticity certificates.',
      'Visit Golconda Fort in the morning before noon to avoid climbing 360 steps in the sun.'
    ]
  },

  jaipur: {
    name: 'Jaipur',
    state: 'Rajasthan',
    tagline: 'The Pink City of Royal Forts, Palaces & Rajasthani Royalty',
    idealDays: '2 to 3 Days',
    bestTime: 'October to March (Royal desert winters & vibrant cultural fairs)',
    itinerary: [
      {
        day: 'Day 1: Forts & Palaces of the Royals',
        morning: '🐘 08:30 AM Elephant/Jeep ride up to magnificent Amer Fort (Sheesh Mahal Mirror Palace). Stop for photos at Jal Mahal (Water Palace).',
        afternoon: '🏰 01:00 PM Visit Nahargarh Fort & Jaigarh Fort (World’s largest cannon on wheels). Rajasthani Dal Baati Churma lunch.',
        evening: '🪟 05:00 PM Admire the 953 honeycomb windows of Hawa Mahal (Palace of Winds) & vibrant Johari Bazaar for gemstones.'
      },
      {
        day: 'Day 2: Astronomy, City Palace & Cultural Village',
        morning: '🔭 09:00 AM Tour City Palace royal museum & UNESCO astronomical observatory Jantar Mantar.',
        afternoon: '🛍️ 02:00 PM Shop for handcrafted Blue Pottery, block-print quilts, and Mojari leather footwear at Bapu Bazaar.',
        evening: '💃 06:30 PM Grand Rajasthani folk dance, puppet shows & royal thali banquet at Chokhi Dhani ethnic resort.'
      }
    ],
    budget: {
      soloBackpacker: '₹1,600 – ₹2,400 / day',
      coupleComfort: '₹4,000 – ₹6,500 / day (total for 2)',
      familyLuxury: '₹10,000 – ₹22,000 / day',
      breakdown: {
        stay: 'Hostels ₹500–₹1,100 | Heritage Haveli Hotels ₹2,200–₹4,500 | Royal Palaces ₹12,000+',
        food: '₹450 – ₹950 per person/day (Dal Baati Thali, Pyaz Kachori, Lassi)',
        transport: 'E-Rickshaw ₹150–₹300/day | Day Cab Rental ₹1,600/day',
        activities: 'Composite Monument Ticket ₹100 (Indians) / ₹500 (Foreigners) | Chokhi Dhani ₹900'
      }
    },
    stays: [
      '👑 Heritage Havelis: Alsisar Haveli, Samode Haveli, Shahpura House',
      '🎒 Backpacker Hostels: Zostel Jaipur, Moustache Jaipur (MI Road)',
      '🏰 Palace Luxury: Rambagh Palace, ITC Rajputana'
    ],
    food: [
      '🍛 Traditional Dal Baati Churma & Gatte ki Sabzi at Laxmi Misthan Bhandar (LMB) Johari Bazaar',
      '🧅 Rawat Mishthan Bhandar: Iconic crispy Pyaaz Kachori & Mawa Kachori',
      '🥛 Lassiwala (MI Road): Original thick creamy kulhad lassi (Shop #312 since 1944)'
    ],
    howToReach: 'Jaipur International Airport (JAI) connects major metros. Jaipur Junction (JP) is well-connected by Shatabdi and Vande Bharat trains.',
    proTips: [
      'Buy the Jaipur Composite Ticket (₹100 for Indians / ₹500 for foreigners) which covers Amer Fort, Hawa Mahal, Jantar Mantar, Nahargarh, and Albert Hall Museum for 2 days!',
      'Dress modestly while entering temples and royal courtyards.'
    ]
  },

  agra: {
    name: 'Agra',
    state: 'Uttar Pradesh',
    tagline: 'Home of the Taj Mahal & Mughal Architectural Marvels',
    idealDays: '1 to 2 Days',
    bestTime: 'October to March',
    itinerary: [
      {
        day: 'Day 1: The Wonder of the World & Mughal Citadel',
        morning: '🤍 06:00 AM Sunrise entry at the Taj Mahal (East Gate) for golden light photography without crowds.',
        afternoon: '🏰 11:30 AM Tour the massive red sandstone Agra Fort (Jahangir Palace & Diwan-i-Khas). Taste authentic Agra Petha.',
        evening: '🌅 05:00 PM Sunset views of the Taj Mahal across the Yamuna River from Mehtab Bagh gardens.'
      },
      {
        day: 'Day 2: Ghost City & Royal Tomb',
        morning: '🕌 09:00 AM Day excursion to Fatehpur Sikri (Buland Darwaza & Salim Chishti Dargah, 38km).',
        afternoon: '🤍 02:30 PM Visit Tomb of I’timad-ud-Daulah (The Baby Taj) and Akbar’s Tomb at Sikandra.',
        evening: '🛍️ 06:00 PM Shop for Pietra Dura marble inlay souvenirs and handcrafted leather items at Sadar Bazaar.'
      }
    ],
    budget: {
      soloBackpacker: '₹1,500 – ₹2,200 / day',
      coupleComfort: '₹3,500 – ₹5,500 / day',
      familyLuxury: '₹8,500 – ₹18,000 / day',
      breakdown: {
        stay: 'Hostels ₹500–₹1,000 | Taj Ganj Hotels ₹1,800–₹3,200 | Luxury Oberoi Amarvilas ₹25,000+',
        food: '₹350 – ₹800/day (Bedai breakfast, Mughlai dishes, Petha)',
        transport: 'Electric Autos & Cabs ₹300–₹800/day',
        activities: 'Taj Mahal ₹50 (+₹200 main dome) | Agra Fort ₹50 | Fatehpur Sikri ₹50'
      }
    },
    stays: [
      '👑 Taj View Luxury: The Oberoi Amarvilas (Direct balcony view of Taj), ITC Mughal',
      '🎒 Budget & Backpacker: Taj Ganj Area, Joey’s Hostel, Zostel Agra'
    ],
    food: [
      '🍬 Panchhi Petha: Kesar Angoori, Paan Petha, Chocolate Petha',
      '🥘 Authentic Mughlai: Pinch of Spice, Peshawri at ITC Mughal',
      '🥞 Deviram Sweets: Bedai & Spicy Aloo with Jalebi breakfast'
    ],
    howToReach: 'Gatimaan Express / Vande Bharat Express from Delhi to Agra Cantt takes only 90 minutes. Taj Express Highway connects Delhi (3.5 hrs drive).',
    proTips: [
      'TAJ MAHAL IS STRICTLY CLOSED ON FRIDAYS for general visitors.',
      'Book online tickets in advance on the ASI portal (asi.nic.in) to skip the 1-hour ticket queue.',
      'Tripods, drones, big bags, and food items are prohibited inside the Taj Mahal complex.'
    ]
  },

  tirupati: {
    name: 'Tirupati',
    state: 'Andhra Pradesh',
    tagline: 'Sacred Abode of Lord Sri Venkateswara (Balaji) on Tirumala Hills',
    idealDays: '2 Days',
    bestTime: 'September to March (Pleasant hill climate)',
    itinerary: [
      {
        day: 'Day 1: Tirumala Hill Ascent & Holy Darshan',
        morning: '⛰️ 06:00 AM Scenic drive or Alipiri Mettu foot steps trek (3,550 steps) up to the sacred Seven Hills of Tirumala.',
        afternoon: '🛕 11:30 AM Sacred Darshan of Lord Venkateswara at the Golden Ananda Nilayam. Receive sacred GI-tagged Tirupati Laddus.',
        evening: '🌊 05:00 PM Visit Swami Pushkarini holy temple tank, Akasa Ganga waterfall, and Srivari Padalu on top of the hill.'
      },
      {
        day: 'Day 2: Downhill Temples & Chandragiri Fort',
        morning: '🛕 08:30 AM Darshan of Goddess Sri Padmavathi Ammavari Temple at Tiruchanur.',
        afternoon: '🏰 01:30 PM Tour historic 11th-century Chandragiri Fort & Raja Mahal Museum.',
        evening: '🕉️ 05:30 PM Visit Kapila Theertham sacred waterfall temple dedicated to Lord Shiva at the base of the hills.'
      }
    ],
    budget: {
      soloBackpacker: '₹1,200 – ₹1,800 / day',
      coupleComfort: '₹2,800 – ₹4,800 / day',
      familyLuxury: '₹6,500 – ₹12,000 / day',
      breakdown: {
        stay: 'TTD Pilgrim Choultries ₹100–₹500 | Tirupati City Hotels ₹1,200–₹3,000 | Luxury Hotels ₹4,500+',
        food: '₹200 – ₹500/day (Free TTD Annaprasadam, South Indian Thalis)',
        transport: 'TTD Electric Ghat Buses ₹65 uphill | Local Autos ₹150–₹300',
        activities: 'Special Entry Darshan ₹300 | TTD Extra Laddus ₹50 each'
      }
    },
    stays: [
      '⛰️ Uphill on Tirumala: TTD Pilgrim Choultries & Cottages (Book on tirupatibalaji.ap.gov.in)',
      '🏙️ Downhill in Tirupati: Fortune Select Grand Ridge, Marasa Sarovar Premiere, Bliss Hotel'
    ],
    food: [
      '🥮 Sacred GI-Tagged Tirupati Laddu Prasadam (Prepared with pure desi ghee, cashews & cardamom)',
      '🍚 Free TTD Nitya Annaprasadam (Tarigonda Vengamamba Complex serving 100,000 pilgrims daily)',
      '🥞 Andhra Ghee Roast Dosas & Pesarattu Upma at Bhimas Deluxe'
    ],
    howToReach: 'Direct flights to Tirupati Airport (TIR) at Renigunta. Direct express trains to Tirupati Main (TPTY) and Renigunta (RU).',
    proTips: [
      'MANDATORY TRADITIONAL DRESS CODE: Dhoti/Kurta or White Pyjama for men; Saree or Half-Saree/Churidar with Dupatta for women. Western wear strictly banned for darshan.',
      'Book ₹300 Special Entry Darshan tickets 3 months in advance on the official TTD portal.',
      'Free locker facilities are available for luggage and mobile phones at Vaikuntam Queue Complex.'
    ]
  }
};

// 3. Dynamic Universal Plan & Budget Generator for ANY City / Town in India or Worldwide
export const generateUniversalTravelPlan = (placeName) => {
  const cleanPlace = placeName.charAt(0).toUpperCase() + placeName.slice(1);
  return {
    name: cleanPlace,
    state: 'India / Tourism Hub',
    tagline: `All-Inclusive Travel Itinerary & Budget Blueprint for ${cleanPlace}`,
    idealDays: '2 to 3 Days',
    bestTime: 'October to March (Peak tourist season with pleasant weather)',
    itinerary: [
      {
        day: 'Day 1: Arrival & Iconic Landmarks Exploration',
        morning: `🌅 09:00 AM Check into hotel & visit the primary iconic sight of ${cleanPlace}. Enjoy authentic local breakfast nearby.`,
        afternoon: `🏛️ 01:30 PM Tour famous heritage museums, gardens, and cultural monuments in ${cleanPlace}. Traditional lunch at top-rated local eatery.`,
        evening: `🌅 05:30 PM Sunset viewpoint or evening lake/riverfront promenade stroll. Explore vibrant local street market.`
      },
      {
        day: 'Day 2: Nature, Hidden Gems & Shopping',
        morning: `🌄 08:30 AM Morning excursion to scenic viewpoints, waterfalls, or famous temples around ${cleanPlace}.`,
        afternoon: `🛍️ 02:00 PM Handicraft shopping for local souvenirs, textiles, and authentic spices in main bazaars.`,
        evening: `🍽️ 07:00 PM Cultural dinner banquet and leisure walk through the town center.`
      }
    ],
    budget: {
      soloBackpacker: '₹1,500 – ₹2,400 / day',
      coupleComfort: '₹3,500 – ₹6,000 / day (total for 2)',
      familyLuxury: '₹8,500 – ₹18,000 / day',
      breakdown: {
        stay: 'Hostels / Budget Stays ₹600–₹1,400 | 3-Star Hotels ₹2,200–₹4,500 | Resorts ₹7,000+',
        food: '₹400 – ₹900 per person/day (Local Breakfast, Thali, Evening Snacks)',
        transport: '₹200 – ₹600/day (Local Autos, Taxis & Shared Transport)',
        activities: '₹100 – ₹400/day (Entry tickets & activity passes)'
      }
    },
    stays: [
      `🌟 Central Heritage / Town Center: Close to main transport hubs and sightseeing`,
      `🎒 Backpacker Hostels & Boutique Guesthouses (Starting ₹600/night)`,
      `🏨 3-Star Comfort Hotels with Free WiFi & AC (₹2,200–₹3,800/night)`
    ],
    food: [
      `🍛 Traditional Regional Thali with local specialties and fresh preparations`,
      `☕ Iconic local morning breakfast cafes & street food bazaars`,
      `🍰 Authentic dessert & sweet shops in old town markets`
    ],
    howToReach: `Accessible via nearest airport or major railway junction. State express buses and cab rentals provide easy connectivity.`,
    proTips: [
      `Book accommodations 1–2 weeks in advance during peak travel seasons.`,
      `Carry cash for local autos, rickshaws, and street food stalls.`,
      `Use Tourtec's 'Hotels' and 'Cabs' tabs to book verified rooms and rentals instantly!`
    ]
  };
};

// 4. Main Intelligent AI Processing Engine
export const generateIntelligentChatReply = async (query, currentCity = 'Varanasi', locationContext = 'Heritage Sight', language = 'en') => {
  const q = (query || '').toLowerCase().trim();

  // A. Check if the user is asking to visit/plan ANY destination ("I want to visit Goa", "Plan a trip to Jaipur", "Visiting Ooty", "Trip to Hyderabad with budget")
  const visitPlaceRegex = /(?:i want to visit|i want to go to|plan a trip to|travel to|trip to|visit|going to|how to visit|guide for|budget for|explore)\s+([a-zA-Z\s]+)/i;
  const visitMatch = q.match(visitPlaceRegex);

  let targetPlace = null;
  if (visitMatch && visitMatch[1]) {
    targetPlace = visitMatch[1].replace(/(?:for \d+ days|with budget|on a budget|with family|solo|\?|\.|!)/gi, '').trim().toLowerCase();
  } else {
    // Check if query is just a place name or contains a known city
    for (const key of Object.keys(DESTINATIONS_DB)) {
      if (q.includes(key)) {
        targetPlace = key;
        break;
      }
    }
  }

  // If destination matched or user asking for complete trip plan
  if (targetPlace || q.includes('itinerary') || q.includes('plan') || q.includes('budget') || q.includes('trip') || q.includes('places to visit')) {
    const searchKey = targetPlace || currentCity.toLowerCase();
    
    // Look up in curated DB or generate dynamic universal blueprint
    let matchedDest = null;
    for (const [key, dest] of Object.entries(DESTINATIONS_DB)) {
      if (searchKey.includes(key) || key.includes(searchKey)) {
        matchedDest = dest;
        break;
      }
    }

    if (!matchedDest) {
      matchedDest = generateUniversalTravelPlan(searchKey);
    }

    // Format rich, comprehensive travel plan with Day-by-day Itinerary + Complete Budget + Stays + Food
    return {
      category: `Complete Travel Plan & Budget: ${matchedDest.name}`,
      isTravelPlan: true,
      destinationName: matchedDest.name,
      reply: `✨ Complete Travel Blueprint & Budget for ${matchedDest.name} (${matchedDest.idealDays}):

🌟 Overview: ${matchedDest.tagline}
⏰ Best Time to Visit: ${matchedDest.bestTime}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗺️ DAY-BY-DAY ITINERARY PLAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${matchedDest.itinerary.map(item => `
📍 ${item.day}
  • Morning: ${item.morning}
  • Afternoon: ${item.afternoon}
  • Evening: ${item.evening}
`).join('')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 ESTIMATED BUDGET BREAKDOWN (INR):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 🎒 Solo Backpacker: ${matchedDest.budget.soloBackpacker}
• 👫 Couple Comfort: ${matchedDest.budget.coupleComfort}
• 👨‍👩‍👧‍👦 Family / Luxury: ${matchedDest.budget.familyLuxury}

📊 Itemized Daily Cost Estimates:
  🏨 Stay / Hotel: ${matchedDest.budget.breakdown.stay}
  🍛 Food & Dining: ${matchedDest.budget.breakdown.food}
  🚖 Local Commute & Cabs: ${matchedDest.budget.breakdown.transport}
  🎟️ Sightseeing & Entry: ${matchedDest.budget.breakdown.activities}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏨 RECOMMENDED AREAS TO STAY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${matchedDest.stays.map(s => `• ${s}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍛 MUST-TRY LOCAL FOOD & ICONIC SPOTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${matchedDest.food.map(f => `• ${f}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚗 HOW TO REACH & LOCAL COMMUTE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
➔ ${matchedDest.howToReach}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 SMART TRAVELER PRO-TIPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${matchedDest.proTips.map(p => `• ${p}`).join('\n')}
`
    };
  }

  // B. Temple Dress Codes & Cultural Rules
  if (q.includes('dress') || q.includes('rule') || q.includes('wear') || q.includes('entry') || q.includes('prohibit') || q.includes('phone') || q.includes('leather')) {
    return {
      category: `Temple Rules & Etiquette in ${currentCity}`,
      reply: `🛕 Sacred Temple Dress Code & Visitor Rules for ${currentCity}:
1. 👗 Attire Requirements: Traditional Indian wear is mandatory for sanctum entry.
   • Men: Dhoti with Kurta/Angavastram or white Cotton Pyjama. (Shorts, jeans, and sleeveless shirts are prohibited inside inner sanctum).
   • Women: Saree, Half-Saree, or Churidar with Dupatta.
2. 👞 Footwear: Strictly prohibited inside temple complexes. Free & secure shoe-stands are available at main entrance gates.
3. 📱 Electronics & Leather: Mobile phones, smartwatches, cameras, leather belts, and leather wallets must be deposited in free digital lockers.
4. 🌸 Temple Sanctity: Maintain silence during Aarti. Photography inside sanctum is strictly prohibited by ASI and Devasthanam boards.`
    };
  }

  // C. Street Food & Dining
  if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('dish') || q.includes('breakfast') || q.includes('biryani') || q.includes('kachori') || q.includes('lassi')) {
    return {
      category: `Authentic Food & Eateries in ${currentCity}`,
      reply: `🍛 Must-Try Authentic Food in ${currentCity}:
1. 🌅 Morning Breakfast: Fresh hot Kachori with spicy aloo sabzi and jalebi from local heritage halwais.
2. 🥛 Traditional Drinks: Chilled thick Kulhad Malai Lassi topped with fresh rabri, pistachios, and saffron.
3. 🍲 Main Meals: Pure Desi Ghee Thali featuring regional curries, dal, and tandoori breads.
4. 🍃 Iconic Sweets: Famous local royal Paan and regional milk sweets (Petha / Laddus / Jalebis).
💡 Tip: Visit popular street vendors before 11:00 AM for fresh, piping hot breakfast straight from the kadhai!`
    };
  }

  // D. General query fallback with live Wikipedia enrichment
  const wikiData = await fetchWikipediaSummary(q + ' ' + currentCity);
  if (wikiData) {
    return {
      category: `Travel Insights: ${wikiData.title}`,
      reply: `🗺️ Travel Guide for ${wikiData.title}:

📍 Overview: ${wikiData.extract}

🚖 Recommended Travel Mode:
➔ Use Tourtec's 'Trip Planner' tab for live GPS navigation and crowd density estimates.
➔ Book verified cabs or hotel rooms with instant zero-fee passes in the top navigation.

💡 Insider Advice: Visit early in the morning or near sunset for the most pleasant weather and stunning photos!`
    };
  }

  return {
    category: `Incredible India AI Guide: ${currentCity}`,
    reply: `Namaste! For visiting ${currentCity}, Tourtec recommends exploring iconic heritage sights during morning hours to avoid peak crowds.

🗺️ Need a complete trip plan? Type "Plan a trip to ${currentCity}" or "I want to visit Goa/Jaipur/Tirupati" and I will give you a full day-by-day itinerary, itemized budget in INR, best hotels to stay, and iconic food spots!`
  };
};
