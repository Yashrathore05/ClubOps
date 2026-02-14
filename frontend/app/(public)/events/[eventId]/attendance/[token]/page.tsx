"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "../../../../../../lib/api";

type EventInfo = {
  name: string;
  date: string;
  venue: string;
};

export default function AttendancePage() {
  const { eventId, token } = useParams() as { eventId: string; token: string };

  const [event, setEvent] = useState<EventInfo | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get(`/events/${eventId}/public`)
      .then((res) => setEvent(res.event))
      .catch(() => setError("Event not found"))
      .finally(() => setLoading(false));
  }, [eventId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post(`/events/${eventId}/attendance/${token}`, { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Attendance failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          <span>Loading…</span>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <p className="text-red-600 font-medium">Event not found</p>
          <Link href="/" className="mt-4 inline-block text-sm text-slate-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6"
        >
          <span aria-hidden>←</span> Back to home
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-slate-900">{event.name}</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {new Date(event.date).toLocaleDateString()} • {event.venue}
            </p>
          </div>

          {success ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800 font-medium">
              Attendance marked. Thank you!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Registered email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition"
              >
                {submitting ? "Submitting…" : "Mark attendance"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
