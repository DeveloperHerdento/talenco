import "server-only";

import { timingSafeEqual } from "crypto";

// Constant-time comparison for secrets. Length is checked first since timingSafeEqual throws
// on mismatched lengths — safe to leak, as string length isn't the secret part.
export function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
