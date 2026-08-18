export type Dictionary = {
  meta: {
    title: string;
    description: string;
    ogAlt: string;
    ogLocale: string;
  };
  nav: {
    about: string;
    programs: string;
    schedule: string;
    article: string;
    faq: string;
    contact: string;
    register: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    titleLine1: string;
    titleLine2: string;
    paragraph: [string, string, string];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
  };
  participants: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: Record<"students" | "freshGrads" | "youngPros" | "enthusiasts", string>;
  };
  programs: {
    eyebrow: string;
    title: string;
    items: Record<
      "english" | "bipa" | "digitalMarketing" | "careerPrep" | "culture" | "weekendTrip",
      { title: string; description: string }
    >;
  };
  benefits: {
    eyebrow: string;
    title: string;
    items: Record<
      "realProject" | "certificate" | "knowledge" | "network",
      { label: string; description: string }
    >;
  };
  timeline: {
    eyebrow: string;
    title: string;
    inProgress: string;
    items: Record<"registration" | "payment" | "arrival" | "program", string>;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    pauseScroll: string;
    resumeScroll: string;
    items: Record<"ayu" | "rafael" | "sarah" | "budi" | "mei", { quote: string; role: string }>;
  };
  location: {
    eyebrow: string;
    title: string;
    campusName: string;
    campusLocation: string;
    body: string;
    highlights: [string, string, string];
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: Record<
      "eligibility" | "englishLevel" | "fee" | "deadline" | "format" | "certificate",
      { question: string; answer: string }
    >;
  };
  cta: {
    heading: string;
    subtitle: string;
    ctaPrimary: string;
  };
  footer: {
    tagline: string;
    quickLinksHeading: string;
    legalHeading: string;
    contactHeading: string;
    privacyPolicy: string;
    termsOfService: string;
    subscriptionAgreement: string;
    lineOfficialAccount: string;
    lineId: string;
    backToTop: string;
    rightsReserved: string;
    builtBy: string;
  };
  notFound: {
    eyebrow: string;
    title: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
};
