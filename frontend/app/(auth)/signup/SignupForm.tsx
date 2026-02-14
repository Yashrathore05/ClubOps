"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clubName, setClubName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [clubEmail, setClubEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [academicYear, setAcademicYear] = useState("2024-25");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", {
        clubName: clubName.trim(),
        collegeName: collegeName.trim(),
        clubEmail: clubEmail.trim(),
        adminName: adminName.trim(),
        adminEmail: adminEmail.trim(),
        password,
        academicYearLabel: academicYear.trim() || "2024-25",
      });
      router.push("/events");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2 bg-slate-50 text-slate-900">
      <section className="hidden md:flex flex-col justify-center px-16 bg-white border-r border-slate-200">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900 mb-12 hover:text-slate-700">
          ClubOps
        </Link>
        <h1 className="text-3xl font-semibold leading-tight text-slate-900 mb-4">
          Register your club
        </h1>
        <p className="text-slate-600 leading-relaxed max-w-md">
          Join clubs worldwide. Get your own dashboard for events, attendance, and certificates in minutes.
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-12 overflow-auto">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6">
            ← Back to home
          </Link>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Create your club account</h2>
          <p className="text-sm text-slate-500 mb-6">One account per club. You’ll be the first admin.</p>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <a
            href="/api/auth/google"
            className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <GoogleIcon />
            Continue with Google
          </a>
          <div className="relative mb-5">
            <span className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </span>
            <span className="relative flex justify-center text-xs text-slate-500">
              or register with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
            <hr className="border-slate-200" />
            <p className="text-sm font-medium text-slate-700">Admin account (you)</p>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your name</label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="input"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="input"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="At least 8 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 transition"
            >
              {loading ? "Creating account…" : "Register club"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-slate-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
