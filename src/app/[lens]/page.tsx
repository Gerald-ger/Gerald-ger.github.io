import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/home/HomePage";
import { lenses } from "@/content/lenses";
import { FIELD_LENSES, isFieldLens } from "@/lib/lens";

// /finance/, /chemical/, /environmental/ and /software/: the home page, tailored.
// Each is prerendered, so the right headline, project order and CV are in the HTML.

type Props = { params: Promise<{ lens: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return FIELD_LENSES.map((lens) => ({ lens }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lens } = await params;
  if (!isFieldLens(lens)) return {};
  const L = lenses[lens];
  return {
    title: { absolute: L.metaTitle },
    description: L.metaDescription,
    alternates: { canonical: `/${lens}/` },
    openGraph: { url: `/${lens}/`, title: L.metaTitle, description: L.metaDescription },
  };
}

export default async function LensHome({ params }: Props) {
  const { lens } = await params;
  if (!isFieldLens(lens)) notFound();
  return <HomePage />;
}
