"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../../lib/api";

type Event = {
  id: string;
  name: string;
  date: string;
  venue: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get("/events");
        setEvents(data.events || []);
      } catch (err: any) {
        setError(err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Events</h1>
        <Link
          href="/events/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition shadow-sm"
        >
          <span aria-hidden>+</span>
          Create event
        </Link>
      </header>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <div className="flex items-center gap-3 text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
            <span className="text-sm">Loading events…</span>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-600">No events yet.</p>
          <p className="text-sm text-slate-500 mt-1">Create your first event to get started.</p>
          <Link
            href="/events/new"
            className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Create event
          </Link>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3.5 text-left font-semibold text-slate-700">Event</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-700">Date</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-700">Venue</th>
                <th className="px-5 py-3.5 text-right font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EventRow({ event }: { event: Event }) {
  const [status, setStatus] = useState<string>("…");

  useEffect(() => {
    api.get(`/events/${event.id}/status`).then((res) => setStatus(res.status)).catch(() => setStatus("ERROR"));
  }, [event.id]);

  return (
    <tr className="hover:bg-slate-50/50 transition">
      <td className="px-5 py-3.5">
        <Link
          href={`/events/${event.id}`}
          className="font-medium text-slate-900 hover:text-slate-700 hover:underline"
        >
          {event.name}
        </Link>
      </td>
      <td className="px-5 py-3.5 text-slate-600">{new Date(event.date).toLocaleDateString()}</td>
      <td className="px-5 py-3.5 text-slate-600">{event.venue}</td>
      <td className="px-5 py-3.5 text-right">
        <StatusBadge status={status} />
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    REGISTRATION_OPEN: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-amber-100 text-amber-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
    CLOSED: "bg-slate-800 text-white",
    ERROR: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
}
