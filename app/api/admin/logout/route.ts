import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, clearSessionCookieHeader } from "@/lib/admin-auth";

// Redirects rather than returning JSON — this is posted to by a plain HTML <form> (no client JS)
// on the admin page, so the response needs to be something a browser form submission can land on.
//
// NextResponse.redirect() specifically (not the raw Response.redirect() static method) — the
// latter returns a Response whose headers are immutable in some runtimes, so appending the
// Set-Cookie header after the fact can fail. NextResponse.redirect() supports mutating headers
// afterward.
export async function POST(request: NextRequest) {
  const currentToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const response = NextResponse.redirect(new URL("/admin/login", request.url), 303);
  response.headers.append("Set-Cookie", await clearSessionCookieHeader(currentToken));
  return response;
}
