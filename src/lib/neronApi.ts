const API_URL = import.meta.env.VITE_NERON_API_URL ?? 'http://localhost:8010';
const API_KEY = import.meta.env.VITE_NERON_API_KEY ?? '';

type ApiOptions = RequestInit & { auth?: boolean };

export async function neronFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.auth !== false && API_KEY) {
    headers.set('X-API-Key', API_KEY);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Néron API error ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}

export type NeronHealth = {
  status?: string;
  version?: string;
  service?: string;
};

export async function getHealth() {
  return neronFetch<NeronHealth>('/health', { auth: false });
}

export async function sendGoal(goal: string) {
  return neronFetch<{ response?: string; goal_id?: string }>('/goal', {
    method: 'POST',
    body: JSON.stringify({ goal }),
  });
}
