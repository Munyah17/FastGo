// Encoding for the QR payload used by Scan to Pay. Kept trivial and
// self-describing (a scheme prefix + a FastGo user id) since the actual
// recipient lookup happens server-side in production — the QR code itself
// carries no money or fee logic, it is only ever "who am I."
const SCHEME = "fastgo:pay:";

export function encodeScanToPayPayload(userId: string): string {
  return `${SCHEME}${userId}`;
}

export function decodeScanToPayPayload(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed.startsWith(SCHEME)) return null;
  const id = trimmed.slice(SCHEME.length).trim();
  return id || null;
}
