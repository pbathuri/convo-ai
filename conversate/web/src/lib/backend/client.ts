const BASE = process.env.BACKEND_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export async function backendHealth(): Promise<{
  ok: boolean;
  backend?: Record<string, unknown>;
  error?: string;
}> {
  try {
    const res = await fetch(`${BASE}/health`, { next: { revalidate: 0 } });
    if (!res.ok) {
      return { ok: false, error: `backend ${res.status}` };
    }
    return { ok: true, backend: await res.json() };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "backend unreachable",
    };
  }
}

export async function backendPost<T>(
  path: string,
  body: unknown,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`backend ${path}: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function backendGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`backend ${path}: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
