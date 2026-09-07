/**
 * Reads the payload of a JWT without verifying its signature. This is only
 * ever used client-side to decide whether to *show* something (e.g. "does a
 * reset token still look usable?") — never to authorise an action. The API
 * is the only party that verifies signatures and enforces authorisation.
 */
export function decodeJwtPayload<T = Record<string, unknown>>(token: string): T | null {
  const [, payload] = token.split('.');
  if (!payload) {
    return null;
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    return JSON.parse(atob(padded)) as T;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload<{ exp?: number }>(token);
  if (!payload?.exp) {
    return true;
  }
  return Date.now() >= payload.exp * 1000;
}
