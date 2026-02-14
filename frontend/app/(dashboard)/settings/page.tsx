"use client";

import BackButton from "@/components/ui/BackButton";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <BackButton href="/events" label="Events" />
      <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
      <p className="text-sm text-slate-600">
        Settings and preferences will be available here.
      </p>
    </div>
  );
}
