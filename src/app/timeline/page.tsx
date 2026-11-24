import type { Metadata } from "next";
import { TimelineView } from "@/components/timeline/TimelineView";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Everything Gerald Lai has worked on since secondary school: projects, internships, competitions and awards.",
  alternates: { canonical: "/timeline/" },
  openGraph: { url: "/timeline/", title: "Timeline | Gerald Lai" },
};

export default function TimelinePage() {
  return (
    <main id="main" className="mx-auto w-[min(1280px,calc(100%-2rem))] pt-32 pb-12 lg:pt-40">
      <h1 className="rise text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.95] font-bold tracking-[-0.05em]">Timeline</h1>
      <p className="rise mt-6 max-w-[54ch] text-xl leading-relaxed text-muted" style={{ animationDelay: "80ms" }}>
        Everything since secondary school, newest first: projects, jobs, competitions and awards. Filter it by field.
      </p>
      <TimelineView />
    </main>
  );
}
