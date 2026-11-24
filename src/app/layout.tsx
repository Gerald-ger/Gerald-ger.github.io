import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { LensProvider } from "@/components/site/LensProvider";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import { site } from "@/content/site";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Gerald Lai, engineering, finance and software", template: "%s | Gerald Lai" },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_HK",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Gerald Lai: I build models you can audit." }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eff0f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0d0f" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" className={mono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <link rel="preload" href="/fonts/satoshi-variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="bg-bg text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <LensProvider>
          <SiteNav />
          {children}
          <SiteFooter />
        </LensProvider>
      </body>
    </html>
  );
}
