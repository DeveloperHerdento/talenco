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
  legal: {
    terms: {
      metaTitle: string;
      metaDescription: string;
      title: string;
      lastUpdated: string;
      banner: string;
      nav: {
        generalProvisions: string;
        overview: string;
        registration: string;
        accountSecurity: string;
        payment: string;
        thirdParty: string;
        miscellaneous: string;
        contact: string;
      };
      definitions: {
        hgsTerm: string;
        hgsDesc: string;
        hgsServicesTerm: string;
        hgsServicesDesc: string;
        talencoTerm: string;
        talencoDesc: string;
        userTerm: string;
        userDesc: string;
        affiliateTerm: string;
        affiliateDesc: string;
        tncTerm: string;
        tncDesc: string;
      };
      section1: { title: string; intro: string };
      section2: { title: string; intro: string; bullet1: string; bullet2: string; bullet3: string };
      section3: {
        title: string;
        item1: string;
        item2: string;
        item3: string;
        privacyPrefix: string;
        privacyLinkLabel: string;
        privacySuffix: string;
      };
      section4: {
        title: string;
        accountSecurityLabel: string;
        accountSecurityText: string;
        dataAccuracyLabel: string;
        dataAccuracyText: string;
        cyberLabel: string;
        cyberText: string;
      };
      section5: {
        title: string;
        intro: string;
        bankingLabel: string;
        bankingText: string;
        liabilityLabel: string;
        liabilityText: string;
        finalLabel: string;
        finalText: string;
      };
      section6: { title: string; text1: string; text2: string };
      section7: {
        title: string;
        item1: string;
        item2: string;
        item3: string;
        item4: string;
        item5: string;
        item6: string;
      };
      section8: { title: string; text: string };
    };
    privacy: {
      metaTitle: string;
      metaDescription: string;
      title: string;
      lastUpdated: string;
      nav: {
        collection: string;
        disclosure: string;
        retention: string;
        rights: string;
        withdrawal: string;
        contact: string;
      };
      thirdParties: {
        institutionalTerm: string;
        institutionalDesc: string;
        governmentTerm: string;
        governmentDesc: string;
      };
      rights: { item1: string; item2: string; item3: string };
      section1: { title: string; text1: string; text2: string };
      section2: { title: string; intro: string };
      section3: { title: string; text1: string; text2: string };
      section4: { title: string; intro: string; footnote: string };
      section5: { title: string; text: string };
      section6: { title: string; text: string };
    };
  };
};
