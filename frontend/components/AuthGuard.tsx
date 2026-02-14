"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(() => setAllowed(true))
      .catch((err: Error) => {
        if (err.message === "Unauthorized" || err.message?.includes("401")) {
          router.replace("/login");
        } else {
          setAllowed(true);
        }
      });
  }, [router]);

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8]">
        <p className="text-sm text-gray-500">Checking authentication…</p>
      </div>
    );
  }

  return <>{children}</>;
}
