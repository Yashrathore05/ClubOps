"use client";

import { useState, useEffect } from "react";

export function useAppUrl(): string {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(typeof window !== "undefined" ? window.location.origin : "");
  }, []);

  return url;
}
