# gerald-ger.github.io

My personal website: one site that reads differently for finance, chemical engineering,
environmental engineering and software roles, plus a timeline of everything I've done.

Live at **https://gerald-ger.github.io** once deployed.

## Links to send

Each lens is a real page with its own headline, project order, CV and hero simulation, so
paste the one that matches the application:

| Lens | URL | CV it offers |
|---|---|---|
| All | `/` | a menu with every version |
| Finance | `/finance/` | Finance and business |
| Chemical engineering | `/chemical/` | Chemical engineering |
| Environmental engineering | `/environmental/` | Environmental engineering |
| Software and AI | `/software/` | Finance and business (no software CV yet) |

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm run preview    # serve out/ locally
```

`npm run dev` and `npm run build` first download the Satoshi font into `public/fonts/`
(see "Fonts" below), so the first run needs an internet connection.

## Editing content

Everything you'd normally change lives in `src/content/`. You shouldn't need to touch
the components.

| File | What it holds |
|---|---|
| `site.ts` | name, email, GitHub, and which PDF each CV button downloads |
| `lenses.ts` | per-lens headline, subline, project order, numbers and simulation |
| `projects.ts` | the six projects: home-page panels and the full case studies |
| `timeline.ts` | the life-recap timeline, newest first |
| `about.ts` | About page story, courses and grades, skills, beyond work |

**Add a timeline entry:** copy an entry in `timeline.ts`, give it a new `id`, a `date` in
`YYYY-MM` form, and the `lenses` it belongs to (or `"all"`). Set `highlight: true` to show
it in "Recent milestones" on the home page.

**Add a project:** add an object to `projects` in `projects.ts`, add its slug to the
`ProjectSlug` type, then add the slug to each lens's `order` in `lenses.ts`. The case
study page at `/work/<slug>/` is generated automatically.

**Update a CV:** export from Canva, **remove the phone number**, and save over the file
in `public/cv/` with the same name.

**Images** live in `public/images/`. Use WebP around 1,400 px wide, and set the real
`width` and `height` in the content file.

## How it's built

- Next.js 16 static export (`output: "export"`), Tailwind CSS v4, Motion
- Light and dark themes follow the visitor's system until they pick one
- The hero simulations are plain canvas code in `src/sims/`:
  - `packedBed.ts`: gas through a packed bed, as in my packed-bed-transport model
  - `dcf.ts`: cash flows discounted back to today at 9.7%
  - `reactor.ts`: H₂O₂ decomposing on MnO₂, as in the RedBird simulator
  - `tests.ts`: the 1,061 tests behind Auditable Valuation

  They pause off-screen, recolour with the theme, and show a still frame for visitors who
  prefer reduced motion. Their captions say "Simulated" or "Illustration" because they
  are drawings of the models, not the models themselves.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site on Ubuntu
and publishes it to GitHub Pages. One-time setup in the repository: **Settings → Pages →
Source: GitHub Actions**.

## Fonts

Satoshi is free to use and self-host, but its licence (ITF Free Font License) does not
allow redistributing the font files through a public repository. So `scripts/fetch-fonts.mjs`
downloads it from Fontshare at build time into `public/fonts/`, which is git-ignored. If
the download ever fails, the site falls back to the system font. JetBrains Mono comes
from Google Fonts via `next/font`.

## Windows note

Next.js 16.4 writes some prefetch files incorrectly when building on Windows.
`scripts/fix-segment-paths.mjs` runs after every build and corrects them. On Linux and
macOS, including the deploy, it finds nothing to fix.
