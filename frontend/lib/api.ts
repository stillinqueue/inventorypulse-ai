function getApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  if (typeof window !== "undefined") {
    const host = window.location.host;

    if (host.includes("github.dev")) {
      return `${window.location.protocol}//${host.replace("-3000.", "-8000.")}`;
    }

    return "http://localhost:8000";
  }

  return "http://backend:8000";
}

export const API_BASE_URL = getApiBaseUrl();

export async function apiGet(path: string) {
  const res = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function apiPost(path: string, body: any) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
