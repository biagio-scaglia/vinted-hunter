import type { Product, Alert } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const SECURE_HEADERS = {
  'Content-Type': 'application/json',
  'X-Radar-Integrity': 'secure-radar-v2',
};

export async function search(
  query: string,
  filters: { min_price?: number; max_price?: number } = {}
): Promise<{ results: Product[]; params: Record<string, unknown> }> {
  const body: Record<string, unknown> = { query };
  if (filters.min_price != null) body.min_price = filters.min_price;
  if (filters.max_price != null) body.max_price = filters.max_price;

  const res = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: SECURE_HEADERS,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}

export async function ocr(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/ocr`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`OCR failed: ${res.status}`);
  const data = await res.json();
  return data.text ?? '';
}

export async function getAlerts(): Promise<Alert[]> {
  const res = await fetch(`${API_BASE}/alerts`);
  if (!res.ok) throw new Error(`getAlerts failed: ${res.status}`);
  return res.json();
}

export async function saveAlert(query: string): Promise<void> {
  await fetch(`${API_BASE}/save-alert`, {
    method: 'POST',
    headers: SECURE_HEADERS,
    body: JSON.stringify({ query }),
  });
}

export async function deleteAlert(id: number): Promise<void> {
  await fetch(`${API_BASE}/alerts/${id}`, { method: 'DELETE' });
}
