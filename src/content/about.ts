// Content for the About page and the About section on the home page.

export const aboutShort =
  "I study Chemical and Environmental Engineering at HKUST, with an Extended Major in AI and a Minor in Business. Most of what I build is a model, and I hold every one to the same standard: assumptions written down, sources shown, limits stated plainly.";

export const aboutStory = [
  "I'm Gerald, or 黎浚昊 in Chinese. I study Chemical and Environmental Engineering at HKUST, with an Extended Major in Artificial Intelligence and a Minor in Business, and I expect to graduate in July 2028.",
  "I have liked physics since I was young: how fluids move, how an oven heats. At university that curiosity turned into wanting to build things that work, using the science behind them. Before that, I led the engineering side of my school's robotics team in the FIRST Tech Challenge.",
  "Most of what I build is a model: a packed-bed reactor, a DCF valuation, a classifier, a car. I try to hold them all to the same standard. Write the assumptions down, show where every number comes from, and say plainly what the model does not do yet.",
  "Hong Kong is a dense city with hard environmental problems, from waste to roadside air pollution and water security. I want to work on them, and on the businesses and capital that decide which solutions get built.",
];

export const education = {
  school: "The Hong Kong University of Science and Technology",
  degree: "BEng in Chemical and Environmental Engineering",
  extras: "Extended Major in Artificial Intelligence, Minor in Business",
  period: "Sep 2024 to Jul 2028 (expected)",
  cgpa: "3.53",
  cgpaScale: "4.30",
  honours: [
    "Dean's List, Spring 2025 (term GPA 3.93)",
    "University Scholarship, 2024 to 2025",
    "Shanghai Commercial Bank Scholarship, 2025 to 2026",
  ],
};

export type Course = { code: string; name: string; grade: string };

export const courseGroups: { title: string; courses: Course[] }[] = [
  {
    title: "Engineering",
    courses: [
      { code: "CENG2310", name: "Modeling for Chemical and Biological Engineering", grade: "A+" },
      { code: "CENG1110", name: "Introduction to Chemical Engineering", grade: "A" },
      { code: "CIVL1100", name: "Discovering Civil and Environmental Engineering", grade: "A" },
      { code: "BIEN1010", name: "Introduction to Biomedical Engineering", grade: "A" },
      { code: "ENEG1700", name: "Introduction to Energy and Environmental Engineering", grade: "A-" },
      { code: "CENG4950", name: "Chem-E-Car", grade: "Distinction" },
    ],
  },
  {
    title: "Science, computing and business",
    courses: [
      { code: "CHEM1012", name: "General Chemistry B", grade: "A+" },
      { code: "LIFS1901", name: "General Biology I", grade: "A+" },
      { code: "COMP1021", name: "Introduction to Computer Science", grade: "A+" },
      { code: "ISOM2500", name: "Business Statistics", grade: "A" },
    ],
  },
];

export const currentCourses = [
  "Separation Processes",
  "Data Science for Molecular Engineering",
  "Cross-disciplinary Design Thinking",
  "Marketing Management",
];

export const skillGroups: { title: string; items: string[] }[] = [
  {
    title: "Finance and analysis",
    items: [
      "DCF and comparable-company valuation",
      "CAPM and cost of capital",
      "Sensitivity and scenario analysis",
      "Requirements gathering and user-acceptance testing",
      "Excel and PowerPoint",
    ],
  },
  {
    title: "Engineering",
    items: [
      "Mass transfer and reaction kinetics",
      "Process simulation in Python",
      "CAD in Tinkercad, Shapr3D and Fusion 360",
      "Aspen Plus and MATLAB",
      "3D printing and hardware integration",
    ],
  },
  {
    title: "Software and data",
    items: [
      "Python: FastAPI, pytest, scikit-learn, Keras",
      "TypeScript and JavaScript: React, Vite",
      "Google Apps Script, C++, SQLite",
      "Git and continuous integration",
    ],
  },
];

export const languages = [
  { name: "Cantonese", level: "Native" },
  { name: "English", level: "Professional working proficiency" },
  { name: "Mandarin", level: "Conversational" },
];

export type BeyondItem = { icon: "run" | "basketball" | "pen" | "film" | "wrench"; title: string; text: string };

export const beyondWork: BeyondItem[] = [
  {
    icon: "run",
    title: "Track and field",
    text: "Champion in the 4×100 m and 4×400 m relays at my school's 2022 Sports Day, with podiums in the 400 m and javelin.",
  },
  {
    icon: "basketball",
    title: "Basketball",
    text: "Played for my school team in the inter-school competition.",
  },
  {
    icon: "pen",
    title: "Chinese poetry",
    text: "Won the secondary-school poetry category of HKEdCity's creative writing scheme in 2022.",
  },
  {
    icon: "film",
    title: "Video editing",
    text: "I edit video in DaVinci Resolve.",
  },
  {
    icon: "wrench",
    title: "Tools for myself",
    text: "Small things that save time, like scripts that rebuild my whole development setup on a new laptop. And this website.",
  },
];
