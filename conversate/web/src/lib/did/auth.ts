/** Build Authorization header for D-ID REST (embed client key is already Basic payload). */
export function didAuthHeader(clientKey: string): string {
  const trimmed = clientKey.trim();
  if (trimmed.toLowerCase().startsWith("basic ")) return trimmed;
  return `Basic ${trimmed}`;
}
