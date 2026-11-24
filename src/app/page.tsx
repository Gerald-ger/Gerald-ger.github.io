import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { lenses } from "@/content/lenses";

export const metadata: Metadata = {
  title: { absolute: lenses.all.metaTitle },
  description: lenses.all.metaDescription,
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: lenses.all.metaTitle, description: lenses.all.metaDescription },
};

export default function Page() {
  return <HomePage />;
}
