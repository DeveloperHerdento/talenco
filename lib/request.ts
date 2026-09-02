import type { NextRequest } from "next/server";

type HeadersLike = { get(name: string): string | null };

function ipFromHeaders(headers: HeadersLike): string {
  return headers.get("x-real-ip") ?? headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export function getClientIp(request: NextRequest): string {
  return ipFromHeaders(request.headers);
}

export function getClientIpFromHeaders(headers: HeadersLike): string {
  return ipFromHeaders(headers);
}
