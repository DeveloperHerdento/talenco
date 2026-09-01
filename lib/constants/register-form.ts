export type FormData = {
  email: string;
  fullName: string;
  phone: string;
  lineId: string;
  currentStatus: string;
  university: string;
  major: string;
  jobTitle: string;
  englishLevel: string;
  studiedAbroad: string;
  overseasWork: string;
  reasons: string[];
  careerGoal: string;
  hearAbout: string;
  nextStep: string;
};

export const INITIAL_FORM_DATA: FormData = {
  email: "",
  fullName: "",
  phone: "",
  lineId: "",
  currentStatus: "",
  university: "",
  major: "",
  jobTitle: "",
  englishLevel: "",
  studiedAbroad: "",
  overseasWork: "",
  reasons: [],
  careerGoal: "",
  hearAbout: "",
  nextStep: "",
};

export const STATUS_OPTIONS = [
  "学生 / Student",
  "新卒 / Fresh Graduate",
  "社会人 / Working Professional",
  "その他 / Other",
];

export const ENGLISH_OPTIONS = [
  "初級 / Beginner (A1–A2)",
  "中級 / Intermediate (B1–B2)",
  "上級 / Advanced (C1–C2)",
];

export const YES_NO = ["Yes・はい", "No・いいえ"];

export const REASON_OPTIONS = [
  "英語力を向上させるため / Improve my English skills",
  "国際的な経験を積むため / Gain international experience",
  "グローバルなキャリアを築くため / Build global career opportunities",
  "履歴書を充実させるため / Strengthen my CV / resume",
  "国際的なネットワークを広げるため / Expand my international network",
  "将来、海外で働く可能性を探るため / Explore working abroad in the future",
  "インドネシアの文化を体験するため / Experience Indonesian culture",
  "自己成長と自己研鑽のため / Personal growth & self-development",
  "その他 / Other",
];

export const CAREER_OPTIONS = [
  "日本にある多国籍企業で働くこと / Work for a multinational company in Japan",
  "将来、海外で働くこと / Work abroad in the future",
  "グローバルな繋がりを活かして起業すること / Start my own business with global connections",
  "海外の大学や大学院へ進学すること / Continue my studies overseas",
  "現在、キャリアの方向性を模索中であること / Still exploring my career direction",
];

export const HEAR_OPTIONS = [
  "Instagram/Facebook",
  "TikTok",
  "LINE",
  "大学/キャンパス内のお知らせ / University / Campus announcement",
  "友人からの紹介 / Friend / Referral",
  "教授/講師からの紹介 / Lecturer / Professor",
  "検索エンジン / Search Engine",
  "TalenCoウェブサイト / TalenCo Website",
  "留学フェア/イベント / Study Abroad Fair / Event",
  "その他 / Other",
];

export const NEXT_OPTIONS = [
  {
    value: "info",
    label: "まだ興味があるのですが、詳細な情報をいただきたいです。",
    sublabel: "I am still interested and would like to receive more information.",
  },
  {
    value: "payment",
    label: "支払いを進め、スポットを確保したいです。",
    sublabel: "I would like to proceed with payment and secure my spot.",
  },
];

export const STEPS = [
  { label: "個人情報", sublabel: "Personal Info" },
  { label: "学歴・職歴", sublabel: "Background" },
  { label: "参加動機", sublabel: "Motivation" },
  { label: "最終確認", sublabel: "Final Step" },
];
