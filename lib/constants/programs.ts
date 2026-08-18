export type ProgramKey = "english" | "bipa" | "digitalMarketing" | "careerPrep" | "culture" | "weekendTrip";

export type Program = {
  key: ProgramKey;
  number: string;
  image: string;
};

export const PROGRAMS: Program[] = [
  { key: "english", number: "01", image: "/assets/images/english-class.webp" },
  { key: "bipa", number: "02", image: "/assets/images/bipa-class.webp" },
  { key: "digitalMarketing", number: "03", image: "/assets/images/digital-marketing-class.webp" },
  { key: "careerPrep", number: "04", image: "/assets/images/career-preparation.webp" },
  { key: "culture", number: "05", image: "/assets/images/indonesian-culture-class.webp" },
  { key: "weekendTrip", number: "06", image: "/assets/images/weekend-trip.webp" },
];
