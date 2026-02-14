"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../lib/api";
import { useAppUrl } from "../../../../lib/useAppUrl";
import BackButton from "../../../../components/ui/BackButton";

/* --------------------------------
   Types
-------------------------------- */
type EventStatus = {
  status: string;
  stats: {
    totalParticipants: number;
    presentCount: number;
    certificatesGenerated: number;
    certificatesEmailed: number;
  };
};

type EventMeta = {
  name: string;
  date: string;
  venue: string;
  certificateTemplatePath: string | null;
};

/* --------------------------------
   Helpers
-------------------------------- */
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

/* --------------------------------
   Page
-------------------------------- */
export default function EventDetailPage() {
  const { eventId } = useParams() as { eventId: string };
  const router = useRouter();
  const appUrl = useAppUrl();

  const [statusData, setStatusData] = useState<EventStatus | null>(null);
  const [event, setEvent] = useState<EventMeta | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [attendanceLink, setAttendanceLink] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<
    "attendance" | "generate" | "email" | null
  >(null);

  async function loadData() {
    try {
      const [statusRes, eventRes] = await Promise.all([
        api.get(`/events/${eventId}/status`),
        api.get(`/events/${eventId}/public`),
      ]);

      setStatusData(statusRes);
      setEvent(eventRes.event);
    } catch (err: any) {
      setError(err.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [eventId]);

  async function handleAction(
    type: "attendance" | "generate" | "email",
    url: string
  ) {
    try {
      setActionLoading(type);
      const res = await api.post(url);

      if (type === "attendance") {
        setAttendanceLink(res.attendanceUrl);
      }

      await loadData();
    } catch (err: any) {
      alert(err.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <BackButton href="/events" label="Events" />
        <div className="flex items-center gap-3 text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          <span className="text-sm">Loading event…</span>
        </div>
      </div>
    );
  }

  if (error || !statusData || !event) {
    return (
      <div className="space-y-4">
        <BackButton href="/events" label="Events" />
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Event not found"}
        </div>
      </div>
    );
  }

  const { status, stats } = statusData;

  return (
    <div className="space-y-8">
      <BackButton href="/events" label="Events" />

      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{event.name}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {new Date(event.date).toLocaleDateString()} • {event.venue}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(`/events/${eventId}/participants`)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            View participants
          </button>

          <StatusBadge status={status} />
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Registered" value={stats.totalParticipants} />
        <Stat label="Present" value={stats.presentCount} />
        <Stat label="Certificates generated" value={stats.certificatesGenerated} />
        <Stat label="Certificates emailed" value={stats.certificatesEmailed} />
      </section>

      {/* Certificate Template */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-800">Certificate template</p>
          <p className="text-xs text-slate-500">
            {event.certificateTemplatePath ? "Template uploaded" : "No template uploaded"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push(`/events/${eventId}/certificate-template`)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          {event.certificateTemplatePath ? "Edit template" : "Upload template"}
        </button>
      </section>

      {/* Actions */}
      <section className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <ActionButton
            disabled={status === "CLOSED"}
            loading={actionLoading === "attendance"}
            onClick={() =>
              handleAction(
                "attendance",
                `/events/${eventId}/attendance-token`
              )
            }
          >
            Generate attendance link
          </ActionButton>

          <ActionButton
            disabled={stats.presentCount === 0}
            loading={actionLoading === "generate"}
            onClick={() =>
              handleAction(
                "generate",
                `/events/${eventId}/certificates/generate`
              )
            }
          >
            Generate certificates
          </ActionButton>

          <ActionButton
            disabled={stats.certificatesGenerated === 0}
            loading={actionLoading === "email"}
            onClick={() =>
              handleAction(
                "email",
                `/events/${eventId}/certificates/email`
              )
            }
          >
            Email certificates
          </ActionButton>
        </div>

        {/* Shareable links */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Shareable links</h2>

          <ShareRow
            label="Registration link"
            value={appUrl ? `${appUrl}/events/${eventId}/register` : null}
          />

          <ShareRow
            label="Attendance link"
            value={
              attendanceLink && appUrl
                ? `${appUrl}${attendanceLink}`
                : null
            }
          />
        </div>
      </section>
    </div>
  );
}

/* --------------------------------
   Components
-------------------------------- */
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500 mb-0.5">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  loading,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition shadow-sm"
    >
      {loading ? "Processing…" : children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    REGISTRATION_OPEN: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-amber-100 text-amber-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
    CLOSED: "bg-slate-800 text-white",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function ShareRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (value) {
      copyToClipboard(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <p className="text-xs text-slate-500 mb-1.5 font-medium">{label}</p>
      {value ? (
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={value}
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-400">
          Generate to enable
        </p>
      )}
    </div>
  );
}
