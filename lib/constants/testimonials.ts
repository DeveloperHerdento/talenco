export type TestimonialKey = "hiroyuki" | "grace";

export type Testimonial = {
  key: TestimonialKey;
  name: string;
};

// Names are proper nouns and stay the same across locales; quote/role text
// lives in the dictionaries (lib/i18n/dictionaries) keyed by `key`.
export const TESTIMONIALS: Testimonial[] = [
  { key: "hiroyuki", name: "Hiroyuki Kamano" },
  { key: "grace", name: "Grace" },
];
