// Content for the About and Experience pages. Roles and bullets come from the
// shared rooms data (constants/world.js) so the 3D world and the pages never
// drift apart; this file adds the page-level framing, stats, and extras.
import { rooms } from "./world";

export const RESUME_URL = `${import.meta.env.BASE_URL}AlexHuynh-GTM-Resume.pdf`;

export const headline = {
  role: "Go-To-Market & Sales",
  current: "Go-To-Market / Business Development at Daloopa",
  summary:
    "Engineer turned seller. Three years building and testing software, then into outbound, where I cleared quota every month of ramp and moved into a founding GTM seat two months later. I sell to engineers because I used to be one.",
};

// Each track maps to a building in the 3D world (worldId) so a room's
// Overview button can open the matching tab.
export const tracks = [
  {
    id: "sales",
    worldId: "sales",
    label: "Sales & GTM",
    emoji: "📈",
    accent: "#7c3aed",
    blurb: "Where I'm building my career: outbound, pipeline, and go-to-market for technical products.",
    stats: [
      { value: "280%", label: "peak ramp quota at Numeral, cleared every month of ramp" },
      { value: "$178.5K", label: "pipeline sourced in my first 3 months at Numeral" },
      { value: "0 → 1", label: "built Revyl's outbound motion as the first GTM hire" },
      { value: "52", label: "meetings in 8 months at Revyl: 2 closed-won, 9 into product evaluation" },
    ],
    // most recent first
    sections: [...rooms.sales.sections].reverse(),
    // phone and in-person sales before the GTM roles
    earlier: {
      title: "Earlier sales roles",
      sections: [
        {
          id: "purebarre",
          title: "Pure Barre Marina",
          role: "Sales Associate",
          dates: "Oct 2020 – Mar 2021",
          place: "San Francisco, CA",
          points: [
            "Acquired new members through cold outreach and networking: lead gen, follow-up, and close.",
            "Re-engaged inactive and at-risk members to protect studio revenue.",
          ],
        },
        {
          id: "wolfpack",
          title: "Wolf Pack Call Center, University of Nevada",
          role: "Student Representative, Fundraiser",
          dates: "Jan 2016 – Apr 2017",
          place: "Reno, NV",
          points: [
            "Cold-called alumni and parents for the Nevada Fund and college funds.",
            "Raised $1,100 in year one and $12,000 in year two; ranked top 3 in engagement rate and calls leading to pledges.",
          ],
        },
      ],
    },
    extra: {
      title: "Stack I've run",
      // grouped in the order an outbound motion runs, most important first
      groups: [
        { label: "CRM & inbox", chips: ["Salesforce", "HubSpot", "Outlook"] },
        { label: "Prospecting & data", chips: ["LinkedIn Sales Navigator", "Clay", "Apollo", "Lusha", "Ocean.io", "Sumble", "Neuron"] },
        { label: "Sequencing & calling", chips: ["Instantly", "HeyReach", "Nooks", "Gong"] },
        { label: "AI & automation", chips: ["n8n", "Claude", "Perplexity"] },
      ],
    },
  },
  {
    id: "engineering",
    worldId: "code",
    label: "Engineering",
    emoji: "💻",
    accent: "#0284c7",
    blurb: "Where I started: QA automation, an internship, and two bootcamps. It's why I can talk shop with the engineers I sell to.",
    stats: [
      { value: "~70%", label: "manual test time cut at Kateeva" },
      { value: "10+", label: "major releases shipped with automated QA" },
      { value: "#1", label: "highest-rated MVP at Co.Lab" },
      { value: "200+", label: "person audience for the BiteByte demo" },
    ],
    sections: rooms.code.sections.filter((s) => s.id !== "projects"),
    showProjects: true,
  },
  {
    id: "fitness",
    worldId: "gym",
    label: "Fitness & Coaching",
    emoji: "🏋️",
    accent: "#dc2626",
    blurb: "I left engineering for strength and conditioning: an unpaid internship and my CSCS, then five years coaching at gyms. It taught me discovery, trust, and retention, the same muscles sales uses.",
    stats: [
      { value: "$80K–$120K", label: "annual coaching revenue" },
      { value: "100+", label: "client relationships" },
      { value: "2022", label: "Equinox Most Inspirational Trainer & Rookie of the Year" },
      { value: "63", label: "athletes trained at Murray with zero major injuries" },
    ],
    sections: rooms.gym.sections,
    extra: {
      title: "Certifications",
      list: [
        { name: "Certified Strength and Conditioning Specialist (CSCS)", issuer: "NSCA" },
        { name: "Level 1 Weightlifting Coach", issuer: "USA Weightlifting" },
        { name: "Pain-Free Performance Specialist (PPSC)", issuer: "Dr. John Rusin" },
        { name: "Functional Kettlebell Training Specialist", issuer: "Pain-Free Performance" },
        { name: "Rotational Movement Training Specialist (RMTS)", issuer: "WeckMethod" },
        { name: "Adult & Pediatric First Aid / CPR / AED", issuer: "American Red Cross" },
      ],
    },
  },
  {
    id: "service",
    worldId: "cafe",
    label: "Customer Service",
    emoji: "☕",
    accent: "#d97706",
    blurb: "Service jobs paid the rent while I studied for my CSCS and interned unpaid, and I kept a few going alongside gym work. Years of reading a room and keeping people happy.",
    stats: [
      { value: "~20%", label: "sales lift from upselling at Magic Flute" },
      { value: "$1,650", label: "handled per shift" },
      { value: "6–10", label: "tables a shift at K-Elements" },
      { value: "24%", label: "customer acquisition growth at Pure Barre" },
    ],
    sections: rooms.cafe.sections,
    extra: {
      title: "Certifications",
      list: [
        { name: "Responsible Beverage Service (RBS) Server", issuer: "California ABC" },
        { name: "California Food Handler Card" },
      ],
    },
  },
];

export const trackForWorld = (worldId) => tracks.find((t) => t.worldId === worldId);

export const salesSkills = [
  "Outbound prospecting",
  "Multi-channel sequencing",
  "Discovery & qualification",
  "Pipeline generation",
  "Selling to technical buyers",
  "Account research & enrichment",
  "Persona & messaging design",
  "Playbooks & sales enablement",
  "Channel economics analysis",
  "GTM automation",
];

// Toolkit, sales-first. `icon` keys map to logos in assets/icons/tools; tools
// without a free logo render as name tiles.
export const toolkit = [
  {
    title: "Sales stack",
    cols: 7,
    tools: [
      { name: "Salesforce", icon: "salesforce" },
      { name: "HubSpot", icon: "hubspot" },
      { name: "Outlook", icon: "outlook" },
      { name: "Sales Navigator", icon: "linkedin" },
      { name: "Clay", icon: "clay" }, // clay.svg crops the wordmark to just the arch
      { name: "Apollo", icon: "apollo" },
      { name: "Lusha", icon: "lusha" },
      { name: "Ocean.io", icon: "ocean" },
      { name: "Sumble", icon: "sumble" },
      { name: "Neuron", icon: "neuron" },
      { name: "Instantly", icon: "instantly" },
      { name: "HeyReach", icon: "heyreach" },
      { name: "Nooks", icon: "nooks" },
      { name: "Gong", icon: "gong" },
    ],
  },
  {
    title: "AI & automation",
    tools: [
      { name: "n8n", icon: "n8n" },
      { name: "Claude", icon: "claude" },
      { name: "Perplexity", icon: "perplexity" },
    ],
  },
  {
    title: "Engineering",
    note: "From my engineering years",
    small: true,
    cols: 5,
    // `skill` pulls the icon from the engineering skills list
    tools: [
      { name: "Python", skill: "Python" },
      { name: "JavaScript", skill: "JavaScript" },
      { name: "TypeScript", skill: "TypeScript" },
      { name: "React", skill: "React" },
      { name: "SQL", skill: "PostgreSQL" },
      { name: "REST APIs / Webhooks", glyph: "{ }" },
      { name: "Postman", icon: "postman" },
      { name: "Google Sheets", icon: "googlesheets" },
      { name: "Excel", icon: "microsoftexcel" },
      { name: "Git", skill: "Git" },
    ],
  },
];
