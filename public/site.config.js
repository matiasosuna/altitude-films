// Everything editable lives here: name, contact, prices, and where we are right now.
window.SITE = {
  brand: "Your Name Aerial",          // TODO: real brand name
  owner: "Your Name",                 // TODO: her first name
  tagline: "Drone & camera production, wherever the story is.",
  email: "hello@example.com",         // TODO
  whatsapp: "",                       // TODO: digits only with country code, e.g. "18085551234"
  instagram: "",                      // TODO: handle without @
  youtube: "",                        // TODO: channel handle without @
  tiktok: "",                         // TODO: handle without @
  faaCertified: true,                 // FAA Part 107

  now: { place: "Maui, Hawaii", from: "2026-10-13", to: "2026-10-31" },
  next: [
    { place: "Oahu, Hawaii", from: "2026-11-01", to: "2026-11-15" }
  ],

  credentials: [
    "Hawaiʻi Volcanoes National Park — Kīlauea eruption",
    "Hilton Waikoloa Village — resort content",
    "Hyatt Regency — sports events"
  ],

  hero: "media/hero.mp4",
  heroPoster: "media/hero.jpg",
  work: [
    { src: "media/lava.jpg", caption: "Kīlauea eruption · Hawaiʻi Volcanoes NP" },
    { src: "media/resort.jpg", caption: "Hilton Waikoloa Village" },
    { src: "media/float.jpg", caption: "Travel session · Oahu" },
    { src: "media/house.jpg", caption: "Property · Big Island" },
    { src: "media/cliffs.jpg", caption: "Makapuʻu · Oahu" },
    { src: "media/courts.jpg", caption: "Sports event · Hyatt Regency" },
    { src: "media/fireworks.jpg", caption: "Fireworks · Waikiki" },
    { src: "media/surf2.jpg", caption: "Surf session" }
  ],

  // Fixed prices: what you pay, what you get, when you get it.
  services: [
    { name: "Real Estate & Rentals", desc: "Sell or rent the property faster.", price: 350, unit: "per property",
      includes: ["25 edited aerial + ground photos", "60s tour video (vertical + horizontal)", "Up to 2 hours on site"], delivery: "48 hours" },
    { name: "Weddings & Elopements", desc: "Your day, from the ground and the sky.", price: 1200, unit: "per event",
      includes: ["Up to 4 hours of coverage", "200+ edited photos", "3–5 min highlight film with drone"], delivery: "2 weeks" },
    { name: "Proposals", desc: "We hide, you ask, we catch it all.", price: 450, unit: "per session",
      includes: ["Planning the spot and timing", "1 hour coverage", "60 edited photos + 1 reel"], delivery: "72 hours" },
    { name: "Travel Sessions", desc: "You or your family in the island's best spots.", price: 400, unit: "per session",
      includes: ["1.5 hours, 1–2 locations", "50 edited photos", "1 drone reel"], delivery: "72 hours" },
    { name: "Hotels, Tours & Brands", desc: "Content that books rooms and tours.", price: 900, unit: "per day",
      includes: ["Half day of filming (4h)", "3 edited reels for social", "40 edited photos", "Usage rights for ads"], delivery: "1 week" },
    { name: "Surf Sessions", desc: "Your best waves, from the sky and the shore.", price: 200, unit: "per surfer",
      includes: ["1 hour in the water", "40+ edited photos", "1 reel of your best rides"], delivery: "24 hours" },
    { name: "Construction & Inspection", desc: "Progress, roofs and sites from above.", price: 300, unit: "per visit",
      includes: ["Up to 1 hour flight", "40 high-res photos", "Short progress video"], delivery: "48 hours" }
  ],

  // Surf schools and board rental stands offer our sessions to their students and earn a cut.
  surfPartners: {
    commission: 20,           // % of each booking that comes with their code
    lessonPrice: 75,          // per student, shot during the school's own lesson
    lessonMin: 3,             // minimum students per lesson
    image: "media/surf.jpg"
  },

  pricingNotes: [
    "Prices in USD. No travel fee on the island we're on.",
    "50% deposit holds your date. The rest on delivery.",
    "Extra hour: $150 · Rush delivery (24h): +$100"
  ]
};
