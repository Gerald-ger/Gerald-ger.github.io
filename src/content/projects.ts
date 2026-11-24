import type { FieldLens } from "@/lib/lens";

// Every project on the site. The home page panels and the case-study pages
// (/work/<slug>/) are both generated from this file.

export type ProjectSlug =
  | "auditable-valuation"
  | "enzyme-connect"
  | "chem-e-car-redbird"
  | "pegasus-claims-tool"
  | "towngas-hydrogen-plan"
  | "grape-leaf-classifier";

export type Figure = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  /** Background behind the image: dark app screenshots, light pages, or white paper figures. */
  tone: "dark" | "light" | "paper";
};

export type Cover =
  | { kind: "shot"; figure: Figure }
  | { kind: "figure"; figure: Figure }
  | { kind: "number"; value: string; caption: string }
  | { kind: "equation"; value: string; caption: string }
  | { kind: "phases" };

export type Step = { title: string; text: string };

export type Phase = {
  name: string;
  start: number;
  end: number;
  text: string;
};

export type Section = {
  heading: string;
  body?: string[];
  bullets?: string[];
  after?: string[];
  steps?: Step[];
  phases?: Phase[];
  figures?: Figure[];
};

export type Project = {
  slug: ProjectSlug;
  title: string;
  tagline: string;
  summary: string;
  period: string;
  year: string;
  role: string;
  context: string;
  lenses: FieldLens[];
  chips: { label: string; lens?: FieldLens }[];
  stats: { value: string; label: string }[];
  stack?: string[];
  links?: { label: string; href: string }[];
  codeNote?: string;
  cover: Cover;
  /** Live simulation shown at the top of the case study instead of the cover. */
  heroSim?: "packedBed" | "dcf" | "reactor" | "tests";
  sections: Section[];
  credits?: string;
};

const img = (src: string, width: number, height: number, tone: Figure["tone"], alt: string, caption: string): Figure => ({
  src,
  width,
  height,
  tone,
  alt,
  caption,
});

export const TOWNGAS_PHASES: Phase[] = [
  {
    name: "Hydrogen food truck",
    start: 0,
    end: 18,
    text: "A fuel-cell food truck as a mobile demonstration. Food draws people in, and the condensed water from the exhaust shows clean operation. Targets: over 70% positive sentiment on hydrogen safety and 5,000 customer interactions a quarter.",
  },
  {
    name: "Pipeline hydrogen for buses",
    start: 6,
    end: 24,
    text: "Town gas is about 49% hydrogen. Extract it from the existing pipeline network at three depots to refuel a bus operator's fleet, targeting 500 kg a day, roughly 20 buses.",
  },
  {
    name: "Storage for renewables",
    start: 18,
    end: 48,
    text: "Electrolysis to store surplus renewable power with an electricity company. It starts only once the pilot returns more than 5% or demand passes 500 kg a day.",
  },
];

export const projects: Project[] = [
  {
    slug: "auditable-valuation",
    title: "Auditable Valuation",
    tagline: "Investment-banking valuation models written as code you can audit, so every number shows where it came from.",
    summary:
      "A two-stage DCF, trading comps and a 0 to 100 scorecard for US and Hong Kong listings, with every assumption carrying its source.",
    period: "Jul to Aug 2026",
    year: "2026",
    role: "Solo project",
    context: "Independent project",
    lenses: ["finance", "software"],
    chips: [{ label: "Finance", lens: "finance" }, { label: "Software", lens: "software" }, { label: "Python" }],
    stats: [
      { value: "1,061", label: "offline tests: 809 backend, 252 frontend" },
      { value: "159", label: "commits in its first month" },
      { value: "3", label: "valuation models, chosen by company type" },
    ],
    stack: ["Python", "FastAPI", "React", "SQLite", "pytest", "GitHub Actions", "Ollama (optional)"],
    links: [
      { label: "Live demo", href: "https://auditable-valuation.onrender.com" },
      { label: "Source on GitHub", href: "https://github.com/Gerald-ger/auditable-valuation" },
    ],
    cover: {
      kind: "shot",
      figure: img(
        "/images/valuation/scorecard-crop.webp",
        1260,
        574,
        "dark",
        "Auditable Valuation scorecard for Apple: a 65 out of 100 composite, pillar scores and a football-field valuation range",
        "The Scorecard tab."
      ),
    },
    heroSim: "dcf",
    sections: [
      {
        heading: "Why I built it",
        body: [
          "Most valuation spreadsheets bury their assumptions. I wanted a model that keeps every input next to its source, down to the date of the equity risk premium, and that checks its own answer before anyone relies on it.",
          "It values US and Hong Kong listed companies and runs entirely on your own machine. An optional local language model explains the numbers without sending them anywhere.",
        ],
      },
      {
        heading: "When the model disagrees with the market",
        body: [
          "In the Apple example captured in August 2026, the two-stage FCFF DCF gives a fair value of $132.49 a share against a price of $305.93. Rather than tuning inputs until the gap closes, the app runs the model in reverse: today's price implies 7.3% growth forever, in an economy assumed to grow 4% a year in nominal terms.",
          "That gap stays on screen, next to what you would have to believe to pay the price anyway. A model tuned until it agreed with the market would only be telling you the price.",
        ],
        figures: [
          img(
            "/images/valuation/models.webp",
            1407,
            578,
            "dark",
            "Financial Models tab showing DCF inputs with their sources and the trust checks row",
            "The Financial Models tab: every input with its source, and trust checks that test the result (terminal value share, implied exit multiple, implied perpetual growth)."
          ),
        ],
      },
      {
        heading: "The right model for each company",
        body: [
          "A DCF does not fit every business. A bank has no meaningful free cash flow to discount, and most of a REIT's capital spending is acquisitions. So the app classifies each company first and uses the model that fits:",
        ],
        bullets: [
          "A two-stage FCFF DCF for most companies",
          "An excess return model for banks and insurers: book equity plus the present value of return on equity above the cost of equity",
          "A two-stage dividend discount model, per share, for REITs",
        ],
      },
      {
        heading: "A scorecard that admits what it doesn't know",
        body: [
          "Every company gets a 0 to 100 score from five weighted pillars: valuation, quality, financial health, growth and momentum. The weights change with the company type, so a bank is not judged on ratios that suit a software firm. A football field places today's price against the DCF, peer multiples and analyst targets.",
          "The 28 scoring curves are set by hand and have not been tested against future returns yet, and the app says so. Every score is saved with the price at the time, so that test becomes possible once enough quarters have passed.",
        ],
        figures: [
          img(
            "/images/valuation/scorecard.webp",
            1377,
            724,
            "dark",
            "Scorecard tab with pillar breakdown, football field and the bridge from model value to market price",
            "The Scorecard tab: pillar scores, the football field and the bridge from model value to market price."
          ),
        ],
      },
      {
        heading: "Engineered like a product",
        bullets: [
          "1,061 tests run offline against the real financial statements of eight companies, captured in August 2026 and committed to the repository",
          "Continuous integration on Ubuntu, Windows and macOS, across Python 3.12 and 3.13",
          "A demo mode that needs no API key and no network, using the same data the tests pin their results to",
          "Open source under AGPL-3.0, with every correction logged alongside its measured before and after",
        ],
        figures: [
          img(
            "/images/valuation/tracker.webp",
            1385,
            1081,
            "dark",
            "Tracker tab with a price chart, watchlist and news",
            "The Tracker tab, one of six in the full app."
          ),
        ],
      },
      {
        heading: "How I worked",
        body: [
          "I used AI-assisted development and research tools to move quickly, and relied on source checks, my own review and the test suite to keep the numbers right. The method, its limits and its open problems are written down in the repository rather than left implied.",
        ],
      },
    ],
  },
  {
    slug: "enzyme-connect",
    title: "Enzyme Connect, then Monod",
    tagline:
      "Can biology clean a factory's exhaust instead of a furnace? A hackathon platform that grew into a sizing tool and a physics library.",
    summary:
      "Began as a hackathon platform matching factory exhaust to enzymes. Grew into Monod, a biofilter sizing tool where every statement carries its provenance.",
    period: "Apr to Aug 2026",
    year: "2026",
    role: "Team leader at the hackathon; Monod and its physics library are my own follow-up work",
    context: "Asian Hackathon for Green Future 2026, then independent work",
    lenses: ["environmental", "chemical", "software"],
    chips: [{ label: "Environmental", lens: "environmental" }, { label: "Chemical", lens: "chemical" }, { label: "AI", lens: "software" }],
    stats: [
      { value: "9 of 439", label: "finalist teams from 22 countries and territories, plus a Consolation Prize" },
      { value: "37", label: "compounds with Henry's-law data, keyed by CAS number" },
      { value: "3 to 8x", label: "the known error Monod states about itself, on its own front page" },
    ],
    stack: ["Python", "FastAPI", "SciPy", "JavaScript", "pytest"],
    codeNote: "The code is private. I'm happy to walk through it on request.",
    cover: {
      kind: "shot",
      figure: img(
        "/images/enzyme/monod-top.webp",
        1600,
        918,
        "light",
        "Monod landing page laid out as an engineering datasheet, with provenance tags",
        "Monod's datasheet-style landing page."
      ),
    },
    heroSim: "packedBed",
    sections: [
      {
        heading: "The problem",
        body: [
          "Factories often destroy the volatile organic compounds in their exhaust by burning them in thermal oxidisers at roughly 760 to 980 °C. That burns fuel all day and emits CO₂. Biological treatment can do the same job near room temperature, but the data that says whether it will work, such as enzyme kinetics in the BRENDA database, is written for biologists rather than for the engineers who run the plant.",
        ],
      },
      {
        heading: "Enzyme Connect, built for the hackathon",
        body: [
          "A factory operator enters the pollutant by CAS number, its concentration, temperature, pressure, pH, flow rate and reactor volume. A triage engine checks whether a naturally occurring enzyme can keep up and, if not, walks through what a designed enzyme would need to do. Around it sat a business model connecting factories with biotech foundries.",
          "We were one of 9 finalists out of 439 teams from 22 countries and territories, and received a Consolation Prize. I led the team.",
        ],
        figures: [
          img(
            "/images/enzyme/enzyme-connect-mvp.webp",
            1400,
            836,
            "light",
            "Enzyme Connect MVP: a factory emission data form with a chemical search by CAS number",
            "The hackathon MVP, demonstrated with real emission data: a factory's stack conditions go in, enzyme triage comes out."
          ),
        ],
      },
      {
        heading: "Three resistances in series",
        body: [
          "The pollutant arrives as a gas and the enzyme works in water, so three steps happen in series and the slowest one decides the answer.",
        ],
        bullets: [
          "Henry's law, corrected for pH, sets how much of the pollutant dissolves",
          "Two-film mass transfer sets how fast it crosses into the liquid: the liquid side controls for benzene, the gas side for ammonia and SO₂",
          "Michaelis-Menten kinetics then runs on the dissolved concentration, scaled to the liquid actually in the reactor, capped by the oxygen the reaction consumes, and integrated along the column",
        ],
        after: [
          "The result is removal efficiency against a target you set, which is what a permit is written against. A Damköhler number reported alongside says whether the enzyme or the gas-liquid boundary is the real limit, so the tool does not recommend a faster enzyme that would change nothing.",
        ],
      },
      {
        heading: "Four things a naive model gets wrong",
        bullets: [
          "Solubility per compound, not per class. Ethanol and n-hexane are both 'VOCs', yet their Henry constants differ by a factor of about 250,000.",
          "pH changes everything for gases that ionise. At pH 7, sulfur dioxide dissolves about 230,000 times more than its physical Henry constant suggests, which is why it can be scrubbed at neutral pH.",
          "A packed bed is only 5 to 10% liquid, and air-saturated water holds only about 260 µM of oxygen. Ignoring either overstates the rate by an order of magnitude or more.",
          "Concentration falls along the column, so the rate does too. The model integrates the profile with fourth-order Runge-Kutta, because simple Euler steps still moved the answer by 2.5% at 99% removal.",
        ],
      },
      {
        heading: "Monod: a tool that publishes its own error",
        body: [
          "After the hackathon I rebuilt the engine for biofilters and biotrickling filters, the technology plants actually use. Its landing page is set out like an engineering datasheet, and every statement carries a tag: verified, modelled, not validated, or absent. One switch hides everything that is not verified.",
          "The biggest known error sits on the front page rather than in a footnote. For hydrogen sulfide the engine predicts 38.3 g/m³·h, while published biotrickling filters reach 100 to 300. The page also names the free, government-published alternative that is the better choice today.",
        ],
        figures: [
          img(
            "/images/enzyme/monod-top.webp",
            1600,
            918,
            "light",
            "Monod landing page laid out as an engineering datasheet, with a provenance legend and a switch to show only verified statements",
            "Monod's landing page, set out like a datasheet. Every statement is tagged, and one switch hides anything not verified."
          ),
          img(
            "/images/enzyme/monod-discrepancy.webp",
            1400,
            418,
            "light",
            "Known discrepancy box: engine predicts 38.3 g per cubic metre per hour against 100 to 300 in the literature, 3 to 8 times low",
            "Clause 4 of the Monod datasheet: the known discrepancy, stated up front."
          ),
        ],
      },
      {
        heading: "packed-bed-transport: the physics on its own",
        body: [
          "I then pulled the gas-side physics into a small Python library with no dependencies: Henry's-law constants for 37 compounds stored exactly as NIST reports them, two-film transfer, liquid holdup, the oxygen ceiling and the column profile, covered by 44 tests that check the integrator against the exact first-order solution.",
          "Its worked example is toluene at 50 ppmv with a 7.2 second residence time. The model gives 32.6% removal and a Damköhler number of 183, so the column is limited by mass transfer by two orders of magnitude: a faster biocatalyst would change almost nothing, and more interfacial area would change everything.",
        ],
      },
    ],
    credits: "Enzyme data derived from the BRENDA database (CC BY 4.0).",
  },
  {
    slug: "chem-e-car-redbird",
    title: "Chem-E-Car RedBird",
    tagline: "A small car powered by the heat of a chemical reaction, designed in CAD and simulated before it was built.",
    summary:
      "A thermoelectric car powered by hydrogen peroxide decomposition. I led CAD and hardware, and wrote a layered simulator to size the car before building it.",
    period: "2026",
    year: "2026",
    role: "CAD Modelling and Hardware Subteam Captain",
    context: "HKUST RedBird, AIChE Chem-E-Car Competition 2026",
    lenses: ["chemical"],
    chips: [{ label: "Chemical", lens: "chemical" }, { label: "CAD" }, { label: "Simulation" }],
    stats: [
      { value: "Distinction", label: "CENG4950 Chem-E-Car, Spring 2026" },
      { value: "2", label: "thermoelectric modules set into the reactor floor" },
      { value: "110 mL", label: "of reacting liquid, 11.7 mm deep, in the designed chamber" },
    ],
    stack: ["Tinkercad", "Shapr3D", "Python", "NumPy", "SciPy"],
    codeNote: "The simulator is private for now.",
    cover: {
      kind: "equation",
      value: "2H₂O₂ → 2H₂O + O₂",
      caption: "The heat from this reaction drives two thermoelectric modules, which drive the car.",
    },
    heroSim: "reactor",
    sections: [
      {
        heading: "The brief",
        body: [
          "Chem-E-Car teams build a small car that is powered and stopped by chemical reactions. RedBird runs on heat: hydrogen peroxide decomposes on a manganese dioxide catalyst, and two thermoelectric modules turn the temperature difference across them into electricity for the motor.",
          "The team competed at the AIChE Chem-E-Car Competition 2026, and the course behind it, CENG4950, earned a Distinction.",
        ],
      },
      {
        heading: "CAD and hardware",
        body: [
          "I captained the CAD and hardware subteam and designed every 3D-printed part in Tinkercad and Shapr3D: the reaction containers, the body shells and the stopping-system enclosures.",
          "The reactor chamber is 75 by 125 mm with a 2 mm floor printed in high-temperature PLA. Two 41 mm windows in that floor hold the thermoelectric modules, so their hot faces sit in the reacting liquid while their cold faces rest on an ice-water compartment below.",
        ],
        bullets: [
          "Validated the purchased hardware before integration",
          "Coordinated how the custom parts fit with propulsion, cooling, drivetrain and stopping systems",
        ],
      },
      {
        heading: "Simulating before building",
        body: [
          "Building and testing a car is slow, so I wrote a Python simulator to estimate voltage and speed under realistic, non-ideal conditions, and to inform sizing and the trade-off between mass and power.",
        ],
        bullets: [
          "The liquid is a stack of layers. Hot, depleted liquid near the surface is lighter, so it stays put unless rising bubbles or buoyancy mix it",
          "The catalyst arrives wrapped in tissue, wets, breaks up and settles, and only the exposed part reacts",
          "Each module is modelled from the manufacturer's data, including the Seebeck, Peltier and Joule effects",
          "The cold side warms as the ice melts, and escaping oxygen carries water vapour away",
          "Motor, gears, rolling resistance, the relay cut-off and coasting complete the run",
        ],
        after: [
          "Apart from the CAD geometry and the module data, the defaults are placeholders, and the simulator includes commands to fit them to measured runs.",
        ],
      },
    ],
  },
  {
    slug: "pegasus-claims-tool",
    title: "Refund and claims tool at Pegasus",
    tagline: "An internal tool that catches incomplete and invalid submissions before a person has to.",
    summary:
      "An internal tool for the Finance team, built from requirements gathered with four stakeholders. Invalid submissions are flagged before they reach a reviewer.",
    period: "Jul to Aug 2026",
    year: "2026",
    role: "Software Engineering Intern",
    context: "Pegasus",
    lenses: ["software", "finance"],
    chips: [{ label: "Software", lens: "software" }, { label: "Finance ops", lens: "finance" }, { label: "TypeScript" }],
    stats: [
      { value: "40%", label: "less manual review time in user-acceptance testing" },
      { value: "4", label: "Finance and Operations stakeholders" },
      { value: "2", label: "workflows: client refunds and employee claims" },
    ],
    stack: ["TypeScript", "Vite", "Google Apps Script"],
    codeNote: "An internal tool, so there are no public screenshots or code.",
    cover: { kind: "number", value: "40%", caption: "less manual review time, measured in user-acceptance testing" },
    sections: [
      {
        heading: "The problem",
        body: [
          "Client refunds and employee claims reached the Finance team with missing fields and invalid entries, and reviewers had to catch them by hand.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "A web app with a TypeScript and Vite front end and a Google Apps Script backend. Finance's rules became validation checks that run as a submission is made, so incomplete or invalid entries are flagged before anyone reviews them.",
        ],
        steps: [
          { title: "Submit", text: "Staff enter a refund or a claim in the web app." },
          { title: "Validate", text: "Checks written from Finance's rules flag missing or invalid fields straight away." },
          { title: "Review", text: "Reviewers only see submissions that are complete and valid." },
        ],
      },
      {
        heading: "How I worked",
        body: [
          "I gathered requirements with four Finance and Operations stakeholders, tested the workflows with them in user-acceptance testing, refined the tool and deployed it.",
          "In that testing, manual review time fell by 40% compared with the original workflow.",
        ],
      },
    ],
  },
  {
    slug: "towngas-hydrogen-plan",
    title: "Hydrogen plan for Towngas",
    tagline: "A three-phase plan to make hydrogen visible to Hong Kong first, and profitable second.",
    summary:
      "Three phases: a fuel-cell food-truck pilot, pipeline hydrogen for bus-depot refuelling, then renewable energy storage, each with budgets and a trigger to scale.",
    period: "Dec 2025 to Mar 2026",
    year: "2026",
    role: "Team leader",
    context: "HKGCC Business Case Competition 2025/26, Towngas track",
    lenses: ["finance", "environmental"],
    chips: [{ label: "Strategy", lens: "finance" }, { label: "Energy", lens: "environmental" }],
    stats: [
      { value: "Top 5", label: "in the Towngas Hong Kong cohort" },
      { value: "3", label: "phases over four years, each with its own success measures" },
      { value: "500 kg", label: "of hydrogen a day, roughly 20 buses, as the trigger to scale" },
    ],
    cover: { kind: "phases" },
    sections: [
      {
        heading: "The brief",
        body: [
          "Towngas asked how it should engage Hong Kong with hydrogen. Most people still see fuel cells as experimental, and the business case depends on demand that does not exist yet. Our answer was to make hydrogen tangible first, then grow it where it can pay for itself.",
        ],
      },
      {
        heading: "Three phases, each with a trigger",
        phases: TOWNGAS_PHASES,
      },
      {
        heading: "Why it fits Hong Kong",
        body: [
          "The government's 2024 Strategy of Hydrogen Development supports refuelling infrastructure and partnerships between fuel suppliers and transport operators, and trials such as a hydrogen double-decker bus already carry passengers. The food truck fills the gap those trials leave: small businesses and the public.",
        ],
      },
      {
        heading: "What I did",
        bullets: [
          "Led the team and shaped the overall strategy",
          "Reviewed Hong Kong hydrogen policy and the trials already approved",
          "Prepared preliminary infrastructure and operating budgets for each phase",
          "Mapped partner responsibilities and the criteria for moving from pilot to scale",
        ],
      },
    ],
  },
  {
    slug: "grape-leaf-classifier",
    title: "Grape-leaf disease classifier",
    tagline: "The accuracy looked excellent. Then I checked which leaves were in the test set.",
    summary:
      "Found that 83.6% of test images had a copy of the same leaf in training, rebuilt the split so no leaf crosses it, then compared CNNs and embeddings honestly.",
    period: "Sep to Nov 2026",
    year: "2026",
    role: "Group project. My part: the evaluation rework and the modelling described here",
    context: "CENG3300 Data Science for Molecular Engineering, HKUST",
    lenses: ["software"],
    chips: [{ label: "AI", lens: "software" }, { label: "Data science" }, { label: "Python" }],
    stats: [
      { value: "83.6% to 0%", label: "test images with a copy of the same leaf in training" },
      { value: "99.5%", label: "accuracy on the leak-free split, CNN trained from scratch" },
      { value: "3,595", label: "distinct leaves behind 12,000 images" },
    ],
    stack: ["Python", "Keras", "scikit-learn"],
    codeNote: "Course group work, kept private.",
    cover: {
      kind: "figure",
      figure: img(
        "/images/grape/otsu-two-rows.webp",
        878,
        458,
        "paper",
        "Two grape leaves with ESCA and black rot: original photo, earlier mask, background removed, and lesions marked in red",
        "Left to right: the original photo, the mask an earlier notebook used, the background removed, and lesions marked in red."
      ),
    },
    sections: [
      {
        heading: "The leak",
        body: [
          "The dataset has 12,000 images in four classes: healthy, ESCA, leaf blight and black rot. It was enlarged by rotating, flipping, zooming and re-lighting the same photos, so only 3,595 distinct leaves sit behind it.",
          "Our first notebook split the images at random, which put copies of the same leaf on both sides: 83.6% of test images had a twin in training. I grouped images by their source leaf so every copy stays on one side of the split. Depending on the model, the leak had been inflating accuracy by between 0.7 and 8 percentage points.",
        ],
      },
      {
        heading: "Better features, compared honestly",
        body: ["With a leak-free split in place, I compared models on equal terms:"],
        bullets: [
          "Frozen EfficientNetB0 embeddings plus 16 lesion features took logistic regression from 80.5% on raw pixels to 99.2%",
          "K-nearest neighbours improved with scaling, PCA and cosine distance, tuned with grouped cross-validation",
          "A CNN trained from scratch with augmentation, batch normalisation and early stopping reached 99.5%",
          "Ensembles were tuned on the validation fold, never on the test set, and did not beat the best single CNN",
        ],
        figures: [
          img(
            "/images/grape/accuracy-top.webp",
            890,
            758,
            "paper",
            "Bar chart of test accuracy on the leak-free split for the 28 best model and feature combinations, from 99.5% down to 93.9%, with 95% confidence intervals",
            "The top of the leaderboard on the leak-free split, with 95% confidence intervals. Green bars are CNNs, orange are classical models, yellow are ensembles."
          ),
        ],
      },
      {
        heading: "Otsu thresholding, used properly",
        body: [
          "An earlier attempt fed the Otsu mask in as the image itself, which turned the brown lesions into holes and threw the disease away. I thresholded Lab chroma instead, filled holes and kept the largest object to remove only the background, then ran a second pass to map the lesions.",
        ],
        figures: [
          img(
            "/images/grape/otsu-all-classes.webp",
            878,
            1830,
            "paper",
            "Eight grape leaves across the four classes, each shown as original, earlier mask, background removed and lesion map",
            "All four classes. Second column: the earlier mask, with the lesions punched out as holes. Fourth column: lesions found by the second Otsu pass."
          ),
        ],
      },
      {
        heading: "Statistics, not just a leaderboard",
        bullets: [
          "Bootstrap 95% confidence intervals: with 2,400 test images they are about ±0.9 points wide, so gaps under a point are not real differences",
          "McNemar tests for paired comparisons between models",
          "Fixed a label-order bug in the confusion matrix, which showed the genuinely hardest pair is ESCA against black rot",
          "Cut peak memory from 4.16 GB to 1.81 GB by caching images as 8-bit arrays",
        ],
      },
    ],
    credits:
      "Leaf images: Augmented Grapevine Disease Dataset on Kaggle (CC0), itself derived from the Grape_disease dataset.",
  },
];

export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p])) as Record<ProjectSlug, Project>;
