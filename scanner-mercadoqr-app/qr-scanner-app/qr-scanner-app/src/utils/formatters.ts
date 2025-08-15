export function shortDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (e) { return iso; }
}
