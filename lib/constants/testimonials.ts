export type TestimonialKey = "ayu" | "rafael" | "sarah" | "budi" | "mei";

export type Testimonial = {
  key: TestimonialKey;
  name: string;
};

// Names are proper nouns and stay the same across locales; quote/role text
// lives in the dictionaries (lib/i18n/dictionaries) keyed by `key`.
export const TESTIMONIALS: Testimonial[] = [
  { key: "ayu", name: "Ayu Pratiwi" },
  { key: "rafael", name: "Rafael Tanaka" },
  { key: "sarah", name: "Sarah Jenkins" },
  { key: "budi", name: "Budi Santoso" },
  { key: "mei", name: "Mei Lin" },
];
