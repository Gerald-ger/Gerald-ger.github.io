import { site } from "@/content/site";
import { AboutTeaser } from "./AboutTeaser";
import { Hero } from "./Hero";
import { Milestones } from "./Milestones";
import { Numbers } from "./Numbers";
import { WorkStack } from "./WorkStack";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: [site.fullName, site.chineseName],
  url: site.url,
  email: `mailto:${site.email}`,
  sameAs: [site.github],
  alumniOf: { "@type": "CollegeOrUniversity", name: site.universityFull },
  knowsAbout: ["Chemical engineering", "Environmental engineering", "Equity valuation", "Software engineering", "Machine learning"],
};

/** The home page. The lens (from the URL, then the switcher) decides order and emphasis. */
export function HomePage() {
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Hero />
      <Numbers />
      <WorkStack />
      <Milestones />
      <AboutTeaser />
    </main>
  );
}
