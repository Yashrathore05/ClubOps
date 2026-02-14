"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "../../../../../lib/api";

type EventInfo = {
  name: string;
  date: string;
  venue: string;
  description?: string | null;
};

export default function EventRegistrationPage() {
  const { eventId } = useParams() as { eventId: string };

  const [event, setEvent] = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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

    try {
      await api.post(`/events/${eventId}/register`, {
        name,
        email,
        phone,
      });
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || "Registration failed");
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

  if (error || !event) {
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
            {event.description && (
              <p className="mt-2 text-sm text-slate-600">{event.description}</p>
            )}
          </div>

          {success ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800 font-medium">
              You’re registered. We’ll see you there!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full name" value={name} onChange={setName} />
              <Input label="Email" type="email" value={email} onChange={setEmail} />
              <Input label="Phone" value={phone} onChange={setPhone} />
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition"
              >
                {submitting ? "Submitting…" : "Register"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      />
    </div>
  );
}
