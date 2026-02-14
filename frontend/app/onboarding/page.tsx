"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [clubName, setClubName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [clubEmail, setClubEmail] = useState("");
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api.post("/auth/complete-club", {
        clubName: clubName.trim(),
        collegeName: collegeName.trim(),
        clubEmail: clubEmail.trim(),
        academicYearLabel: academicYear.trim() || "2024-25",
      });
      router.push(data.redirect === "events" ? "/events" : "/events");
    } catch (err: any) {
      setError(err.message || "Failed to create club");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6">
          ← ClubOps
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Set up your club</h1>
          <p className="mt-1 text-sm text-slate-500">You’re in. Add your club details to get started.</p>
          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Club name</label>
              <input
                type="text"
                required
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                className="input"
                placeholder="e.g. Coding Club"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">College / institution</label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="input"
                placeholder="e.g. ABC College"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Club email</label>
              <input
                type="email"
                required
                value={clubEmail}
                onChange={(e) => setClubEmail(e.target.value)}
                className="input"
                placeholder="club@college.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Academic year</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="input"
                placeholder="2024-25"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 transition"
            >
              {loading ? "Creating…" : "Continue to dashboard"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
