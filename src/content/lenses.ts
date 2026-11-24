import type { LensId } from "@/lib/lens";
import type { ProjectSlug } from "./projects";
import type { CvKey } from "./site";

// One entry per "View as" lens. Each lens has its own URL (/, /finance/, ...),
// headline, project order, CV download, hero simulation and headline numbers.

export type SimMode = "packedBed" | "dcf" | "reactor" | "tests";

export type Stat = { value: string; unit?: string; label: string };

export type Lens = {
  id: LensId;
  label: string;
  /** Used in sentences: "Ordered for ...". */
  phrase: string;
  headline: string;
  sub: string;
  /** "menu" offers every CV version. */
  cv: CvKey | "menu";
  sim: SimMode;
  simCaption: string;
  order: ProjectSlug[];
  stats: Stat[];
  metaTitle: string;
  metaDescription: string;
};

const CGPA: Stat = { value: "3.53", unit: "/ 4.30", label: "CGPA at HKUST, Dean's List in Spring 2025" };
const HACKATHON: Stat = { value: "9", unit: "of 439", label: "finalist teams, Asian Hackathon for Green Future 2026" };
const TOWNGAS: Stat = { value: "Top 5", label: "Towngas cohort, HKGCC Business Case Competition 2025/26" };
const TESTS: Stat = { value: "1,061", label: "automated tests behind my valuation platform" };
const PEGASUS: Stat = { value: "40%", label: "less manual review with the finance tool I built at Pegasus" };

export const lenses: Record<LensId, Lens> = {
  all: {
    id: "all",
    label: "All",
    phrase: "everything",
    headline: "I build models you can audit.",
    sub: "From reactor kinetics to equity valuation. Year 3 Chemical and Environmental Engineering at HKUST.",
    cv: "menu",
    sim: "packedBed",
    simCaption: "Simulated: toluene through a packed bed. My transport model puts removal at 32.6%.",
    order: [
      "auditable-valuation",
      "enzyme-connect",
      "chem-e-car-redbird",
      "pegasus-claims-tool",
      "towngas-hydrogen-plan",
      "grape-leaf-classifier",
    ],
    stats: [TESTS, HACKATHON, TOWNGAS, CGPA],
    metaTitle: "Gerald Lai, engineering, finance and software",
    metaDescription:
      "Chemical and Environmental Engineering at HKUST. I build models you can audit, from reactor kinetics to equity valuation.",
  },
  finance: {
    id: "finance",
    label: "Finance",
    phrase: "finance",
    headline: "Valuation models you can audit.",
    sub: "DCF, comps and CAPM, built with an engineer's discipline. HKUST engineering with a minor in business.",
    cv: "finance",
    sim: "dcf",
    simCaption: "Simulated: a two-stage DCF. Each cash flow shrinks as it is discounted to today at a 9.7% WACC.",
    order: [
      "auditable-valuation",
      "pegasus-claims-tool",
      "towngas-hydrogen-plan",
      "enzyme-connect",
      "grape-leaf-classifier",
      "chem-e-car-redbird",
    ],
    stats: [TESTS, PEGASUS, TOWNGAS, CGPA],
    metaTitle: "Gerald Lai, valuation models you can audit",
    metaDescription:
      "DCF, comparable-company analysis and CAPM, built with an engineer's discipline. HKUST engineering student with a minor in business.",
  },
  chemical: {
    id: "chemical",
    label: "Chemical",
    phrase: "chemical engineering",
    headline: "Process models that show their working.",
    sub: "Reaction engineering, thermodynamics and CAD, from a thermoelectric Chem-E-Car to packed-bed reactors.",
    cv: "chemical",
    sim: "reactor",
    simCaption: "Simulated: H₂O₂ decomposing on MnO₂. RedBird has to move this heat down to its thermoelectric modules.",
    order: [
      "chem-e-car-redbird",
      "enzyme-connect",
      "grape-leaf-classifier",
      "towngas-hydrogen-plan",
      "auditable-valuation",
      "pegasus-claims-tool",
    ],
    stats: [
      { value: "Distinction", label: "CENG4950 Chem-E-Car, Spring 2026" },
      { value: "A+", label: "Modeling for Chemical and Biological Engineering" },
      HACKATHON,
      CGPA,
    ],
    metaTitle: "Gerald Lai, process models that show their working",
    metaDescription:
      "Chemical engineering student at HKUST: reaction engineering, thermodynamics and CAD, from a thermoelectric Chem-E-Car to packed-bed reactors.",
  },
  environmental: {
    id: "environmental",
    label: "Environmental",
    phrase: "environmental engineering",
    headline: "Cleaner air, from first principles.",
    sub: "Mass transfer and enzyme kinetics for waste-gas treatment, and a hydrogen plan for Hong Kong.",
    cv: "environmental",
    sim: "packedBed",
    simCaption: "Simulated: toluene through a packed bed. My transport model puts removal at 32.6%.",
    order: [
      "enzyme-connect",
      "towngas-hydrogen-plan",
      "chem-e-car-redbird",
      "grape-leaf-classifier",
      "auditable-valuation",
      "pegasus-claims-tool",
    ],
    stats: [
      HACKATHON,
      TOWNGAS,
      { value: "37", label: "compounds with Henry's-law data in my packed-bed model" },
      CGPA,
    ],
    metaTitle: "Gerald Lai, cleaner air from first principles",
    metaDescription:
      "Environmental engineering student at HKUST: mass transfer and enzyme kinetics for waste-gas treatment, and a hydrogen plan for Hong Kong.",
  },
  software: {
    id: "software",
    label: "Software",
    phrase: "software and AI",
    headline: "Tested tools, shipped to real users.",
    sub: "Python, TypeScript and FastAPI, from an internal finance tool to a 1,061-test valuation platform.",
    cv: "finance",
    sim: "tests",
    simCaption: "Illustration: the 1,061 offline tests behind Auditable Valuation, 809 backend and 252 frontend.",
    order: [
      "auditable-valuation",
      "pegasus-claims-tool",
      "grape-leaf-classifier",
      "enzyme-connect",
      "chem-e-car-redbird",
      "towngas-hydrogen-plan",
    ],
    stats: [
      TESTS,
      { value: "159", label: "commits in the first month of that platform" },
      { value: "99.5%", label: "leak-free accuracy on my grape-leaf classifier" },
      PEGASUS,
    ],
    metaTitle: "Gerald Lai, tested tools shipped to real users",
    metaDescription:
      "Python, TypeScript and FastAPI, from an internal finance tool to a 1,061-test valuation platform. HKUST, Extended Major in AI.",
  },
};

export const lensList = [lenses.all, lenses.finance, lenses.chemical, lenses.environmental, lenses.software];
