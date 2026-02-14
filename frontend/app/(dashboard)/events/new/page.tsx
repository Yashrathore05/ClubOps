"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api";
import BackButton from "../../../../components/ui/BackButton";

export default function CreateEventPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !type || !date || !venue) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/events", {
        name,
        type,
        date,
        venue,
        description,
      });

      router.push("/events");
    } catch (err: any) {
      setError(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <BackButton href="/events" label="Events" />
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Create event</h1>
        <p className="text-slate-600 mt-1">Add a new event to your club calendar.</p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field label="Event name" required>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Hackathon 2026"
          />
        </Field>

        <Field label="Event type" required>
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input"
            placeholder="Workshop / Seminar / Competition"
          />
        </Field>

        <Field label="Date" required>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Venue" required>
          <input
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="input"
            placeholder="Main Auditorium"
          />
        </Field>

        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input h-28 resize-none"
            placeholder="Optional description"
          />
        </Field>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 transition shadow-sm"
          >
            {loading ? "Creating…" : "Create event"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/events")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}
