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
    article?: string;
    courseGuide: string;
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
    items: Record<"ayu" | "rafael" | "sarah" | "budi" | "mei", { quote: string; role: string; year: string }>;
  };
  location: {
    eyebrow: string;
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
    contactHeading: string;
    privacyPolicy: string;
    termsOfService: string;
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
  course: {
    hero: { title: string; meta: string };
    dayCardLabels: {
      objectives: string;
      outcomes: string;
      materials: string;
      output: string;
      groupTask: string;
    };
    overview: {
      heading: string;
      subtitle: string;
      section1Title: string;
      welcome1: string;
      welcome2: string;
      section2Title: string;
      about1: string;
      visionLabel: string;
      visionText: string;
      points: [string, string, string, string, string];
      section3Title: string;
      whatIs: string;
    };
    schemes: {
      heading: string;
      subtitle: string;
      scheme1Badge: string;
      scheme1Title: string;
      scheme1Desc: string;
      scheme2Badge: string;
      scheme2Title: string;
      scheme2Desc: string;
      programFeeLabel: string;
      scheme1Note: string;
      scheme2Note: string;
      onsitePeriodTitle: string;
      addOnTitle: string;
      milestoneHeader: string;
      dateHeader: string;
      componentHeader: string;
      priceHeader: string;
      includedTitle: string;
      notIncludedTitle: string;
    };
    schedule: {
      heading: string;
      subtitle: string;
      headers: [string, string, string, string, string, string, string];
      weekendTrip: string;
      weekendReturn: string;
    };
    registration: {
      heading: string;
      subtitle: string;
      sectionTitle: string;
      steps: [string, string, string, string, string];
      registrationFormBtn: string;
      visaFormBtn: string;
      termsSectionTitle: string;
      termsItem1: string;
      termsItem2: string;
      termsItem3: string;
      refundPrefix: string;
      termsLinkLabel: string;
      refundSuffix: string;
      termsItem5: string;
    };
    curriculum: {
      heading: string;
      subtitle: string;
      businessEnglish: {
        alt: string;
        title: string;
        paragraph: string;
        bullets: [string, string, string];
        tableHeaders: [string, string, string];
      };
      bipa: {
        alt: string;
        title: string;
        paragraph: string;
        footnote: string;
        tableHeaders: [string, string, string];
      };
      digitalMarketing: { alt: string; title: string; paragraph: string };
      careerPrep: { alt: string; title: string; paragraph: string; individualChallengeTitle: string };
      culture: { alt: string; title: string; paragraph: string };
    };
    contact: {
      heading: string;
      infoLine: string;
      chatButton: string;
      lineButton: string;
    };
  };
};
