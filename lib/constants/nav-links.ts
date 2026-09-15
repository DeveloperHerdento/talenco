export type NavLinkKey = "about" | "programs" | "schedule" | "article" | "courseGuide" | "faq" | "contact";

export type NavLink = {
  key: NavLinkKey;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { key: "about", href: "#about" },
  { key: "programs", href: "#programs" },
  { key: "schedule", href: "#schedule" },
  { key: "courseGuide", href: "/course" },
  { key: "faq", href: "#faq" },
  { key: "contact", href: "#contact" },
];

export function resolveNavHref(href: string, locale: string): string {
  return `/${locale}${href}`;
}
