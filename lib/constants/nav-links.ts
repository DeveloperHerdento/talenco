export type NavLinkKey = "about" | "programs" | "schedule" | "article" | "faq" | "contact";

export type NavLink = {
  key: NavLinkKey;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { key: "about", href: "#about" },
  { key: "programs", href: "#programs" },
  { key: "schedule", href: "#schedule" },
  // { key: "article", href: "#article" },
  { key: "faq", href: "#faq" },
  { key: "contact", href: "#contact" },
];
