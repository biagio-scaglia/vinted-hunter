import { BASE_URL, INTEGRITY_HEADER } from './constants';
import type { Product, Alert, MarketplaceInfo } from './types';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'X-Radar-Integrity': INTEGRITY_HEADER,
};

interface SearchFiltersArg {
  min_price?: number;
  max_price?: number;
  sources?: string[];
}

export async function search(
  query: string,
  filters: SearchFiltersArg = {}
): Promise<{ results: Product[]; params: Record<string, unknown> }> {
  const body: Record<string, unknown> = { query };
  if (filters.min_price != null) body.min_price = filters.min_price;
  if (filters.max_price != null) body.max_price = filters.max_price;
  if (filters.sources?.length) body.sources = filters.sources;

  const res = await fetch(`${BASE_URL}/search`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}

export async function ocr(uri: string, filename: string): Promise<string> {
  const form = new FormData();
  // React Native FormData accepts plain objects with uri/name/type
  form.append('file', { uri, name: filename, type: 'image/jpeg' } as unknown as Blob);

  const res = await fetch(`${BASE_URL}/ocr`, {
    method: 'POST',
    // Do NOT set Content-Type — fetch sets multipart/form-data with boundary automatically
    headers: { 'X-Radar-Integrity': INTEGRITY_HEADER },
    body: form,
  });
  if (!res.ok) throw new Error(`OCR failed: ${res.status}`);
  const data = await res.json();
  return data.text ?? '';
}

export async function getSources(): Promise<MarketplaceInfo[]> {
  const res = await fetch(`${BASE_URL}/sources`);
  if (!res.ok) return [];
  return res.json();
}

export async function getAlerts(): Promise<Alert[]> {
  const res = await fetch(`${BASE_URL}/alerts`);
  if (!res.ok) throw new Error(`getAlerts failed: ${res.status}`);
  return res.json();
}

export async function saveAlert(query: string): Promise<{ id: number }> {
  const res = await fetch(`${BASE_URL}/save-alert`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`saveAlert failed: ${res.status}`);
  return res.json();
}

export async function deleteAlert(id: number): Promise<void> {
  await fetch(`${BASE_URL}/alerts/${id}`, {
    method: 'DELETE',
    headers: { 'X-Radar-Integrity': INTEGRITY_HEADER },
  });
}

// Lookup barcode → product name via Open Food Facts (free, no key needed)
export async function lookupBarcode(code: string): Promise<string> {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${code}?fields=product_name,brands`,
      { headers: { 'User-Agent': 'V-Hunter/1.0' } }
    );
    if (!res.ok) return code;
    const data = await res.json();
    if (data.status === 1 && data.product) {
      const name = data.product.product_name ?? '';
      const brand = data.product.brands ?? '';
      const full = [brand, name].filter(Boolean).join(' ').trim();
      return full || code;
    }
  } catch {
    // fallback to raw code
  }
  return code;
}
