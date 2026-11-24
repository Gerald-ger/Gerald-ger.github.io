"use client";

import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { useLens } from "@/components/site/LensProvider";
import { lensHomePath } from "@/lib/lens";

/** Returns to the work list in the same lens the visitor came from. */
export function BackToWork() {
  const { lens } = useLens();
  return (
    <Link
      href={`${lensHomePath(lens)}#work`}
      className="inline-flex items-center gap-2 text-[15px] font-medium text-muted transition-colors hover:text-ink"
    >
      <ArrowLeft size={16} aria-hidden />
      All work
    </Link>
  );
}
