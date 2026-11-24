// Facts about me that appear in more than one place on the site.
// Edit here and every page picks it up.

export const site = {
  name: "Gerald Lai",
  fullName: "Lai Tsun Ho Gerald",
  chineseName: "黎浚昊",
  initials: "GL",
  email: "gerald.tsunholai@gmail.com",
  github: "https://github.com/Gerald-ger",
  githubHandle: "Gerald-ger",
  url: "https://gerald-ger.github.io",
  repo: "https://github.com/Gerald-ger/Gerald-ger.github.io",
  university: "HKUST",
  universityFull: "The Hong Kong University of Science and Technology",
  degree: "BEng in Chemical and Environmental Engineering",
  degreeExtras: "Extended Major in Artificial Intelligence, Minor in Business",
  graduation: "July 2028",
  year: "Year 3",
  description:
    "Gerald Lai studies Chemical and Environmental Engineering at HKUST and builds models you can audit, from reactor kinetics to equity valuation.",
} as const;

/** Public CV files. Phone number removed; regenerate from Canva and replace the PDF to update. */
export const cvFiles = {
  finance: { href: "/cv/Gerald-Lai-CV-Finance.pdf", label: "Finance and business" },
  chemical: { href: "/cv/Gerald-Lai-CV-Chemical-Engineering.pdf", label: "Chemical engineering" },
  environmental: { href: "/cv/Gerald-Lai-CV-Environmental-Engineering.pdf", label: "Environmental engineering" },
} as const;

export type CvKey = keyof typeof cvFiles;
