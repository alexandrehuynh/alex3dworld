// Layout and content for the walkable hub world.
// Buildings sit on the northern half of a ring around the central plaza, doors facing
// the center. The south side stays open for the spawn point and follow camera.
// Room content is placeholder until the resume pass fills in the details.

export const ISLAND_RADIUS = 24;
export const BUILDING_RING = 15;

const ring = (angle) => [
  Math.sin(angle) * BUILDING_RING,
  0,
  Math.cos(angle) * BUILDING_RING,
];

export const buildings = [
  {
    id: "code",
    name: "Code Lab",
    emoji: "💻",
    tagline: "Where I build things",
    angle: Math.PI * (5 / 6), // north-northeast
    color: "#e0f2fe",
    accent: "#0284c7",
    roof: "#0369a1",
    style: "lab",
  },
  {
    id: "gym",
    name: "The Gym",
    emoji: "🏋️",
    tagline: "Coaching athletes, youth to pro",
    angle: Math.PI / 2, // east
    color: "#fee2e2",
    accent: "#dc2626",
    roof: "#991b1b",
    style: "gym",
  },
  {
    id: "sales",
    name: "AI Sales HQ",
    emoji: "📈",
    tagline: "Selling AI to real teams",
    angle: -Math.PI / 2, // west
    color: "#ede9fe",
    accent: "#7c3aed",
    roof: "#5b21b6",
    style: "tower",
  },
  {
    id: "cafe",
    name: "The Café",
    emoji: "☕",
    tagline: "Every job that shaped me",
    angle: -Math.PI * (5 / 6), // north-northwest
    color: "#fef3c7",
    accent: "#d97706",
    roof: "#92400e",
    style: "cafe",
  },
].map((b) => ({ ...b, position: ring(b.angle) }));

// Placeholder room content. Names come from Alex; titles, dates, and details
// get filled in from the resumes in the content pass.
export const rooms = {
  code: {
    intro:
      "QA automation, bootcamps, hackathons, and the AI apps I've shipped since.",
    sections: [
      { title: "Kateeva", subtitle: "Software Test Automation Engineer" },
      { title: "Coding Temple", subtitle: "Software Engineering Bootcamp" },
      { title: "Co.Lab", subtitle: "Lead Developer, BiteByte" },
      { title: "Projects & hackathons", subtitle: "See the full list", link: "/projects" },
    ],
  },
  gym: {
    intro: "Years of coaching at premium facilities, plus my own brand, OFFTHEWEIGHTS.",
    sections: [
      { title: "Pure Barre", subtitle: "Details coming soon" },
      { title: "Equinox", subtitle: "Details coming soon" },
      { title: "Murray Athletic", subtitle: "Details coming soon" },
      { title: "LuxFit", subtitle: "Details coming soon" },
      { title: "Bay Club", subtitle: "Details coming soon" },
      { title: "OFFTHEWEIGHTS", subtitle: "My coaching brand", link: "https://www.offtheweights.com/" },
    ],
  },
  sales: {
    intro: "Go-to-market for AI products: talking to customers and closing the loop with engineering.",
    sections: [
      { title: "Numeral", subtitle: "Details coming soon" },
      { title: "Revyl", subtitle: "Details coming soon" },
      { title: "Dalupa", subtitle: "Current role" },
    ],
  },
  cafe: {
    intro: "The job board. Serving, tour guiding, and everything in between.",
    board: true,
    sections: [
      { title: "Server", subtitle: "Details coming soon" },
      { title: "Tour Guide", subtitle: "Details coming soon" },
      { title: "More odd jobs", subtitle: "Pinned soon" },
    ],
  },
};
