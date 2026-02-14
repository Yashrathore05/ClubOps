"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Draggable from "react-draggable";
import { api } from "../../../../../lib/api";
import BackButton from "../../../../../components/ui/BackButton";

type Layout = {
  name: { x: number; y: number };
  event: { x: number; y: number };
};

export default function CertificateTemplatePage() {
  const { eventId } = useParams() as { eventId: string };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number } | null>(null);

  const [layout, setLayout] = useState<Layout>({
    name: { x: 0.4, y: 0.6 },
    event: { x: 0.4, y: 0.55 },
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get(`/events/${eventId}/certificate-template`)
      .then((res) => {
        if (res.url) setPdfUrl(res.url);
        if (res.layout) setLayout(res.layout);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [eventId]);

  useEffect(() => {
    if (!pdfUrl || !canvasRef.current) return;
    const url = pdfUrl;
    const canvas = canvasRef.current;

    async function renderPDF() {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs";

      const pdf = await pdfjsLib.getDocument(url).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setCanvasSize({ w: viewport.width, h: viewport.height });

      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    }

    renderPDF();
  }, [pdfUrl]);

  async function uploadTemplate() {
    if (!file) {
      setError("Please select a PDF file");
      return;
    }
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("template", file);
    try {
      const res = await api.post(
        `/events/${eventId}/certificate-template`,
        formData
      );
      setPdfUrl(res.url);
      setFile(null);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleStop(key: "name" | "event", _: unknown, data: { x: number; y: number }) {
    if (!canvasSize) return;
    setLayout((prev) => ({
      ...prev,
      [key]: {
        x: data.x / canvasSize.w,
        y: data.y / canvasSize.h,
      },
    }));
  }

  async function saveLayout() {
    setSaving(true);
    setError(null);
    try {
      await api.post(`/events/${eventId}/certificate-layout`, layout);
      setSaveFeedback(true);
      setTimeout(() => setSaveFeedback(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <BackButton href={`/events/${eventId}`} label="Event" />
        <div className="rounded-xl bg-slate-100 animate-pulse h-12 w-48" />
        <div className="rounded-xl bg-slate-100 animate-pulse h-64 w-full max-w-lg" />
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="space-y-6 max-w-md">
        <BackButton href={`/events/${eventId}`} label="Event" />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            Upload certificate template
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload a PDF template. You’ll place name and event text on the next step.
          </p>
          <div className="mt-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:text-white file:hover:bg-slate-800"
            />
          </div>
          {error && (
            <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <button
            type="button"
            onClick={uploadTemplate}
            disabled={uploading}
            className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition"
          >
            {uploading ? "Uploading…" : "Upload template"}
          </button>
        </div>
      </div>
    );
  }

  const w = canvasSize?.w ?? 0;
  const h = canvasSize?.h ?? 0;

  return (
    <div className="space-y-6">
      <BackButton href={`/events/${eventId}`} label="Event" />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-slate-700">Preview & place text</h2>
          <div
            ref={containerRef}
            className="relative inline-block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
            style={{ width: w, height: h, maxWidth: "100%" }}
          >
            <canvas
              ref={canvasRef}
              className="block"
              style={{ width: w, height: h }}
            />
            {w > 0 && h > 0 && (
              <>
                <Draggable
                  nodeRef={nameRef}
                  bounds="parent"
                  position={{
                    x: layout.name.x * w,
                    y: layout.name.y * h,
                  }}
                  onStop={(e, data) => handleStop("name", e, data)}
                >
                  <div
                    ref={nameRef}
                    className="absolute left-0 top-0 cursor-move rounded-lg bg-slate-900/90 px-3 py-1.5 text-sm font-medium text-white shadow-lg hover:bg-slate-800"
                  >
                    Participant Name
                  </div>
                </Draggable>
                <Draggable
                  nodeRef={eventRef}
                  bounds="parent"
                  position={{
                    x: layout.event.x * w,
                    y: layout.event.y * h,
                  }}
                  onStop={(e, data) => handleStop("event", e, data)}
                >
                  <div
                    ref={eventRef}
                    className="absolute left-0 top-0 cursor-move rounded-lg bg-slate-700/90 px-3 py-1.5 text-sm font-medium text-white shadow-lg hover:bg-slate-600"
                  >
                    Event Name
                  </div>
                </Draggable>
              </>
            )}
          </div>
        </div>

        <div className="w-full lg:w-72 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">Layout</h3>
            <p className="text-xs text-slate-500 mt-1">
              Drag the labels on the certificate to where the name and event text should appear when generating PDFs.
            </p>
            {error && (
              <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            <button
              type="button"
              onClick={saveLayout}
              disabled={saving}
              className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition"
            >
              {saving ? "Saving…" : saveFeedback ? "Saved!" : "Save layout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
