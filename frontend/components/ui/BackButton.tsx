"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BackButton({
  href,
  label = "Back",
}: {
  href?: string;
  label?: string;
}) {
  const router = useRouter();

  const className =
    "inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition";

  if (href) {
    return (
      <Link href={href} className={className}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => router.back()} className={className}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}
