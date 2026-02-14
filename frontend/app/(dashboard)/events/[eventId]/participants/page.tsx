"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../lib/api";
import BackButton from "../../../../../components/ui/BackButton";

type Participant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isPresent: boolean;
  certificateGenerated: boolean;
  certificateEmailed: boolean;
};

export default function ParticipantsPage() {
  const { eventId } = useParams() as { eventId: string };
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/events/${eventId}/participants`)
      .then((res) => setParticipants(res.participants))
      .catch(() => router.push("/events"))
      .finally(() => setLoading(false));
  }, [eventId, router]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <BackButton href={`/events/${eventId}`} label="Event" />
      </div>

      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Participants</h1>
      </header>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <div className="flex items-center gap-3 text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
            <span className="text-sm">Loading…</span>
          </div>
        </div>
      )}

      {!loading && participants.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center text-slate-600">
          No registrations yet. Share the registration link to get sign-ups.
        </div>
      )}

      {!loading && participants.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3.5 text-left font-semibold text-slate-700">Name</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-700">Email</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-700">Phone</th>
                <th className="px-5 py-3.5 text-center font-semibold text-slate-700">Present</th>
                <th className="px-5 py-3.5 text-center font-semibold text-slate-700">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {participants.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5 font-medium text-slate-900">{p.name}</td>
                  <td className="px-5 py-3.5 text-slate-600">{p.email}</td>
                  <td className="px-5 py-3.5 text-slate-600">{p.phone}</td>
                  <td className="px-5 py-3.5 text-center">{p.isPresent ? "✔" : "—"}</td>
                  <td className="px-5 py-3.5 text-center text-slate-600">
                    {p.certificateEmailed ? "Emailed" : p.certificateGenerated ? "Generated" : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
