import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/ssr";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto grid min-h-[80dvh] w-[min(1280px,calc(100%-2rem))] content-center pt-32 pb-12">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-4 max-w-[16ch] text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.98] font-bold tracking-[-0.045em]">
        This page isn&apos;t here.
      </h1>
      <p className="mt-5 max-w-[48ch] text-lg text-muted">The link may be old, or mistyped. Everything I&apos;ve made is one click from the home page.</p>
      <Link
        href="/"
        className="mt-9 inline-flex h-[52px] w-fit items-center gap-2.5 rounded-full bg-accent-fill px-6 font-bold text-on-accent transition-colors hover:bg-accent-fill-hover"
      >
        <ArrowLeft size={18} aria-hidden />
        Back to the home page
      </Link>
    </main>
  );
}
