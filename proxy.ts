import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, isLocale } from "@/lib/i18n/locales";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const saved = request.cookies.get(LOCALE_COOKIE)?.value;
    const locale = saved && isLocale(saved) ? saved : DEFAULT_LOCALE;
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  const segment = pathname.split("/")[1];

  if (isLocale(segment)) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, segment, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.rewrite(new URL(`/__not-found${pathname}`, request.url));
}

export const config = {
  matcher: ["/((?!_next|api|assets|icon\\.svg|robots\\.txt|sitemap\\.xml).*)"],
};
