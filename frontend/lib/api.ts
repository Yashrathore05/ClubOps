const API_BASE =
  typeof window !== "undefined"
    ? "" // same origin (Next.js rewrites proxy to backend)
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getUrl(path: string): string {
  const base = typeof window !== "undefined" ? "" : API_BASE;
  const prefix = base ? "" : "/api";
  return `${base}${prefix}${path}`;
}

async function request(path: string, options: RequestInit = {}) {
  const url = getUrl(path);
  const isFormData = options.body instanceof FormData;
  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(url, {
    credentials: "include",
    method: options.method,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
    body: options.body,
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body?: any) =>
    request(path, {
      method: "POST",
      body: body instanceof FormData ? body : body != null ? JSON.stringify(body) : undefined,
    }),
};

export function getAssetUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return typeof window !== "undefined" ? path : `${API_BASE}${path}`;
}
