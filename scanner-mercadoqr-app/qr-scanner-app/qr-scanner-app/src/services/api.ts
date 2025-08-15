export const API_BASE = 'https://example.com/api';

export async function postScan(scanData: { data: string; date: string }) {
  try {
    const res = await fetch(`${API_BASE}/scans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scanData),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn('postScan error', e);
    throw e;
  }
}
