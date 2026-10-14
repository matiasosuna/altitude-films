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

  services: [
    { id: "realestate", name: "Real Estate & Vacation Rentals", desc: "Aerial photos and a 60–90s tour video that sells the property and its surroundings.", from: 350 },
    { id: "wedding", name: "Weddings & Elopements", desc: "Ceremony coverage from the ground and the sky. Proposals too.", from: 800 },
    { id: "brand", name: "Hotels, Tours & Brands", desc: "Reels, ads and hero footage for resorts, tour operators and local businesses.", from: 600 },
    { id: "travel", name: "Travel Sessions", desc: "A 1–2 hour shoot of you or your family in the island's best spots.", from: 400 },
    { id: "inspection", name: "Construction & Inspection", desc: "Progress shots, roof and site inspections, mapping.", from: 300 }
  ]
};
