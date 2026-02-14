"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type SidebarData = {
  user: { name: string; email: string };
  club: { name: string };
  academicYear: { yearLabel: string };
};

export default function Sidebar() {
  const [data, setData] = useState<SidebarData | null>(null);

  useEffect(() => {
    api.get("/auth/me").then(setData).catch(() => {});
  }, []);

  if (!data) {
    return (
      <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-5">
          <div className="h-5 w-32 rounded-lg bg-slate-100 animate-pulse" />
          <div className="mt-2 h-4 w-20 rounded bg-slate-50" />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="h-10 rounded-lg bg-slate-100" />
          <div className="h-10 rounded-lg bg-slate-100" />
        </nav>
        <div className="border-t border-slate-100 px-5 py-4">
          <div className="h-4 w-24 rounded bg-slate-100 mb-2" />
          <div className="h-3 w-32 rounded bg-slate-50" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-5">
        <h1 className="text-lg font-semibold text-slate-900">{data.club.name}</h1>
        <p className="text-xs text-slate-500 mt-0.5">{data.academicYear.yearLabel}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <NavItem href="/events">Events</NavItem>
        <NavItem href="/settings">Settings</NavItem>
      </nav>

      <div className="border-t border-slate-100 px-5 py-4">
        <p className="text-sm font-medium text-slate-800">{data.user.name}</p>
        <p className="text-xs text-slate-500 truncate">{data.user.email}</p>
        <button
          type="button"
          onClick={async () => {
            try {
              await api.post("/auth/logout");
            } catch {}
            window.location.href = "/login";
          }}
          className="mt-3 text-xs font-medium text-red-600 hover:text-red-700 hover:underline transition"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
    >
      {children}
    </Link>
  );
}
