import Link from "next/link";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/ssr";
import { site } from "@/content/site";
import { CopyEmail } from "./CopyEmail";

export function SiteFooter() {
  return (
    <footer id="contact" className="mx-auto mt-10 w-[min(1280px,calc(100%-2rem))] border-t border-line pt-14 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-10">
        <div>
          <p className="max-w-[44ch] text-muted">Looking for 2027 internships in finance, engineering or software.</p>
          <a
            href={`mailto:${site.email}`}
            className="group mt-4 inline-flex items-center gap-4 text-[clamp(2.8rem,7vw,6.4rem)] leading-none font-bold tracking-[-0.05em]"
          >
            Email me
            <ArrowUpRight
              aria-hidden
              className="text-[0.6em] text-accent transition-transform duration-500 ease-out-expo group-hover:rotate-45"
            />
          </a>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-muted">{site.email}</span>
            <CopyEmail />
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3 font-medium text-muted">
          <a href={site.github} className="inline-flex items-center gap-2 transition-colors hover:text-ink">
            <GithubLogo size={18} aria-hidden />
            GitHub
          </a>
          <Link href="/timeline/" className="transition-colors hover:text-ink">
            Timeline
          </Link>
          <Link href="/about/" className="transition-colors hover:text-ink">
            About
          </Link>
        </nav>
      </div>
      <div className="mt-14 flex flex-wrap justify-between gap-4 text-sm text-muted">
        <span>
          &copy; 2026 {site.name} <span lang="zh-Hant">{site.chineseName}</span>
        </span>
        <span>
          Built with Next.js.{" "}
          <a href={site.repo} className="underline decoration-line underline-offset-4 transition-colors hover:text-ink">
            Source on GitHub
          </a>
        </span>
      </div>
    </footer>
  );
}
