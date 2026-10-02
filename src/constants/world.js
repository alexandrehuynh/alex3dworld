import obourLogo from "../assets/logos/obour.png";

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
    name: "Dev Studio",
    emoji: "💻",
    tagline: "Software development",
    angle: Math.PI * (5 / 6), // north-northeast
    color: "#e0f2fe",
    accent: "#0284c7",
    roof: "#0369a1",
    style: "lab",
  },
  {
    id: "gym",
    name: "Performance Lab",
    emoji: "🏋️",
    tagline: "Fitness & coaching",
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
    tagline: "AI sales & go-to-market",
    angle: -Math.PI / 2, // west
    color: "#ede9fe",
    accent: "#7c3aed",
    roof: "#5b21b6",
    style: "tower",
  },
  {
    id: "cafe",
    name: "Front of House Café",
    emoji: "☕",
    tagline: "Customer service",
    angle: -Math.PI * (5 / 6), // north-northwest
    color: "#fef3c7",
    accent: "#d97706",
    roof: "#92400e",
    style: "cafe",
  },
].map((b) => ({ ...b, position: ring(b.angle) }));

// Room content. Each section is one station inside the building; `id` links it
// to a spot in that building's interior layout. Details come from Alex's resumes;
// anything not on a resume is marked "Details coming soon".
const SOON = "Details coming soon";

export const rooms = {
  code: {
    intro: "From a QA lab and an intern desk to two bootcamps and the AI apps I've shipped since.",
    sections: [
      {
        id: "kateeva",
        title: "Kateeva",
        role: "Software QA Automation Engineer",
        dates: "Aug 2017 – Feb 2020",
        place: "Newark, CA",
        points: [
          "Built automated test frameworks in Python, Perl, and C# for five industrial inkjet printer systems.",
          "Cut manual test time roughly 70% and expanded regression coverage across 10+ major releases and 50+ patches.",
          "Wrote the API and GUI testing protocols the team used for every build.",
        ],
      },
      {
        id: "gainspan",
        title: "GainSpan",
        role: "Software Engineer Intern",
        dates: "May 2015 – Aug 2015",
        place: "San Jose, CA",
        points: [
          "Automated IoT sensor data processing and reporting with Python and Pandas.",
          "Wrote a program to record Wi-Fi module interference and plotted it as histograms.",
        ],
      },
      {
        id: "codingtemple",
        title: "Coding Temple",
        role: "Full-Stack Software Developer Trainee",
        dates: "Jan 2024 – Mar 2024",
        place: "Remote",
        points: [
          "Built full-stack apps with React front ends and Flask REST APIs backed by SQL.",
          "Capstone: a Pokémon battler with Firebase, React, and Flask.",
        ],
      },
      {
        id: "colab",
        title: "Co.Lab",
        role: "Lead Software Developer",
        dates: "Mar 2024 – Aug 2024",
        place: "Remote",
        points: [
          "Led a 4-person team building BiteByte, an AI nutrition app.",
          "Ran discovery with 45+ respondents and turned it into the product spec.",
          "Demoed to a 200+ person audience and earned the program's highest-rated MVP.",
        ],
        link: "https://bitebyte.onrender.com/",
      },
      {
        id: "projects",
        title: "Projects & hackathons",
        role: "EyeSpyAI, Trainers Memory, HealthBridge, and more",
        link: "/projects",
      },
    ],
  },
  gym: {
    intro: "Five years coaching in the Bay Area, from NBA combines to luxury clubs, plus my own brand.",
    sections: [
      {
        id: "equinox",
        title: "Equinox",
        role: "Personal Trainer",
        dates: "Sep 2022 – Oct 2025",
        place: "San Francisco, CA",
        points: [
          "2022 Equinox Union Street Most Inspirational Trainer of the Year and Rookie of the Year.",
          "Science-based programs for a diverse clientele, with about 90% client retention.",
        ],
      },
      {
        id: "murray",
        title: "Murray Athletic Development",
        role: "Strength & Conditioning Coach (Intern)",
        dates: "Apr 2021 – Nov 2022",
        place: "San Francisco, CA",
        points: [
          "Coached athletes toward collegiate scholarships and professional contracts.",
          "Helped run NBA combines for the G League Ignite, basketball camps, and AAU teams.",
          "Built Smartabase player reports and dashboards to track readiness and strength gains.",
        ],
      },
      {
        id: "luxfit",
        title: "LuxFit",
        role: "Performance Coach",
        dates: "Oct 2020 – Oct 2025",
        place: "SF Bay Area",
        points: ["Outdoor barbell and strength coaching.", "More details coming soon."],
      },
      {
        id: "bayclub",
        title: "Bay Club",
        role: "Performance Coach",
        dates: "Oct 2020 – Oct 2025",
        place: "SF Bay Area",
        points: [
          "Across Bay Club, Equinox, and LuxFit: $80K–$120K in annual revenue from 100+ client relationships with 85% retention.",
        ],
      },
      {
        id: "skrappack",
        title: "Skrap Pack Marina",
        role: "Strength & Conditioning Coach",
        points: ["Strength and conditioning for jiu-jitsu athletes.", "More details coming soon."],
      },
      {
        id: "offtheweights",
        title: "OFFTHEWEIGHTS",
        role: "My coaching brand",
        link: "https://www.offtheweights.com/",
      },
    ],
  },
  sales: {
    intro: "Engineer turned seller: outbound and GTM for developer and finance tools.",
    sections: [
      {
        id: "numeral",
        title: "Numeral (YC W23)",
        role: "Sales Development Representative · placed via InsideScale",
        dates: "Oct 2025 – Dec 2025",
        place: "SF Bay Area",
        points: [
          "Sales tax compliance for everyone from enterprises to mom-and-pop shops. Booked directly with CFOs, VPs of Finance, and controllers.",
          "Sourced 31 opportunities and $178.5K in pipeline in three months, at 280%, 120%, and 200% of quota.",
          "Top SDR in December and first on the team to hit quota.",
          "Built the research and enrichment pipeline in Clay, n8n, Claude, and Perplexity.",
        ],
      },
      {
        id: "revyl",
        title: "Revyl (YC F24)",
        role: "Go-To-Market / Business Development Representative",
        dates: "Jan 2026 – Aug 2026",
        place: "SF Bay Area",
        points: [
          "A QA platform for mobile apps: AI agents run tests on cloud devices and feed results straight back into the dev loop. First GTM hire.",
          "Booked 52 meetings from cold outbound and sourced 2 closed-won customers, one enterprise.",
          "Built the outbound motion from zero and wrote the playbook, persona matrix, and product claims reference.",
        ],
      },
      {
        id: "daloopa",
        title: "Daloopa",
        role: "GTM Business Development · placed via InsideScale",
        dates: "Oct 2026 – Present",
        place: "SF Bay Area",
        points: ["The data layer for financial models.", "More details coming soon."],
      },
    ],
  },
  cafe: {
    intro: "Serving, guiding, and selling: the jobs that taught me to read a room.",
    sections: [
      {
        id: "presidio",
        title: "Presidio Social Club",
        role: "Server, American diner",
        place: "San Francisco, CA",
        points: ["More details coming soon."],
      },
      {
        id: "magicflute",
        title: "Magic Flute Ristorante",
        role: "Server, Italian brunch",
        dates: "Apr 2021 – Feb 2023",
        place: "San Francisco, CA",
        points: [
          "Ran busy brunch shifts: mimosas, wine, cocktails, and Italian specials.",
          "Upsold signature appetizers and drinks for about a 20% sales lift; handled ~$1,650 per shift.",
        ],
      },
      {
        id: "kelements",
        title: "K-Elements BBQ",
        role: "Server, all-you-can-eat Korean BBQ",
        dates: "Oct 2020 – Jul 2021",
        place: "San Francisco, CA",
        points: [
          "Ran 6–10 tables a shift: grills, propane swaps, and endless banchan.",
          "Set up an assembly-line table setup that cut setup time about 20%.",
        ],
      },
      {
        id: "board",
        title: "Flyer board",
        role: "Odd jobs and side gigs",
        flyers: [
          {
            title: "Sierra Adventures",
            role: "River rafting tour guide / Store Manager",
            dates: "Jun – Oct 2016 · Reno, NV",
            color: "#bae6fd",
            art: "sierra",
          },
          {
            title: "Pure Barre Marina",
            role: "Fitness Sales Associate",
            dates: "Oct 2020 – Mar 2021 · SF",
            note: "Lead gen and cold calls grew customer acquisition 24% during COVID.",
            color: "#fbcfe8",
            art: "pureBarre",
          },
          {
            title: "Obour Foods",
            role: "Hummus stand, farmers market",
            dates: SOON,
            color: "#fef08a",
            art: "obour",
            logo: obourLogo,
          },
        ],
      },
    ],
  },
};
