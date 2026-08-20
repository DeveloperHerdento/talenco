import type { Locale } from "@/lib/i18n/locales";

export const REGISTER_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSewS35OEIG1OmTJ-CQwl4RFpSsj-3QwRYJWEObNpvr6mP6h6A/viewform";
export const VISA_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScbgZ88JIS6rh5Y5lbKed1TndLx8gqBQIuJAkFniCo_sh_GTw/viewform";

export type ScheduleRow = {
  day: string;
  topic: string;
  bipa: string;
  english: string;
  digitalMarketing: string;
  groupTask: string;
  catchUp?: string;
};

export type DayCardData = {
  day: string;
  title: string;
  objectives?: string[];
  outcomes?: string[];
  materials?: string[];
  output?: string[];
  groupTask?: string;
};

type CourseGuideData = {
  quickNav: { href: string; label: string }[];
  programStructure: [string, string][];
  addOnRows: [string, string][];
  onsitePeriod: [string, string][];
  included: string[];
  notIncluded: string[];
  businessEnglishSyllabus: [string, string, string][];
  bipaSyllabus: [string, string, string][];
  scheduleRows: ScheduleRow[];
  digitalMarketingDays: DayCardData[];
  careerPrepDays: DayCardData[];
  individualChallenge: string[];
};

const EN: CourseGuideData = {
  quickNav: [
    { href: "#overview", label: "Overview" },
    { href: "#schemes", label: "Program Schemes" },
    { href: "#schedule", label: "Schedule" },
    { href: "#register", label: "How to Register" },
    { href: "#curriculum", label: "Curriculum" },
    { href: "#course-contact", label: "Contact" },
  ],
  programStructure: [
    ["Language Courses", "Daily BIPA and English classes to build communication skills"],
    ["Digital Marketing Course", "Step-by-step learning from marketing fundamentals to campaign execution"],
    ["Individual & Group Project", "Teams develop a marketing strategy, content, and final presentation"],
    ["Cultural Sessions", "Insights into Indonesian and Japanese business culture"],
  ],
  addOnRows: [
    ["Breakfast for 2 weeks", "¥16,083"],
    ["Lunch for 2 weeks", "¥16,083"],
    ["Dinner for 2 weeks", "¥16,083"],
    ["SIM Card", "¥1,340"],
    ["Helping Booking Flight", "¥2,813"],
    ["Weekend One Day Trip", "¥26,135"],
  ],
  onsitePeriod: [
    ["Registration Period", "3 August – 3 November 2026"],
    ["Payment Deadline", "4 November 2026"],
    ["Payment Verification", "5–9 November 2026"],
    ["Visa Issuance", "25–26 November 2026"],
    ["Participants Arrival", "29 November 2026"],
    ["Program Period", "30 November – 12 December 2026"],
    ["Participants Departure", "13 December 2026"],
  ],
  included: [
    "Accommodation (Wisma) during the program in Indonesia",
    "Airport pick-up and drop-off (round trip)",
    "All program activities (courses, materials, and project sessions)",
    "Certificate and learning outcome report",
    "Visa support",
  ],
  notIncluded: [
    "Daily meals (unless add-on is selected)",
    "Daily local transportation",
    "Flight ticket",
    "Personal expenses",
  ],
  businessEnglishSyllabus: [
    ["1st Session", "120 minutes", "Self-Introduction"],
    ["2nd Session", "120 minutes", "Describing Products & Strengths"],
    ["3rd Session", "120 minutes", "Describing People & Needs"],
    ["4th Session", "120 minutes", "Short & Strong Sentences"],
    ["5th Session", "120 minutes", "Giving Instructions & Requests"],
    ["6th Session", "120 minutes", "Email & Text Communication"],
    ["7th Session", "120 minutes", "Daily Conversation"],
    ["8th Session", "120 minutes", "Talking About Numbers & Trends"],
    ["9th Session", "120 minutes", "Learn Presentation in English"],
    ["10th Session", "120 minutes", "English Post Test"],
  ],
  bipaSyllabus: [
    ["1st Session", "Unit 1: Self-Introduction (1)", "Pronounce Indonesian alphabet, greet, introduce him/herself in a simple monologue"],
    ["2nd Session", "Unit 1: Self-Introduction (2)", "Introduce origin and personal details (phone number, address)"],
    ["3rd Session", "Unit 1: Self-Introduction (3)", "Ask and answer questions related to self-introduction"],
    ["4th Session", "Unit 2: Introducing Others (1)", "Introduce others, describe others' profession"],
    ["5th Session", "Unit 2: Introducing Others (2)", "Describe others"],
    ["6th Session", "Unit 2: Introducing Others (3)", "Describe family members"],
    ["7th Session", "Unit 3: Positions (1)", "Identify position vocabulary; ask and tell positions of objects"],
    ["8th Session", "Unit 3: Positions (2)", "Describe room positions"],
    ["9th Session", "Unit 4: Directions (1)", "Identify compass and direction vocabulary; ask and give simple directions"],
    ["10th Session", "Unit 4: Directions (2)", "Ask and give complex directions"],
  ],
  scheduleRows: [
    {
      day: "1",
      topic: "Onboarding",
      bipa: "Daily Conversation",
      english: "Self-Introduction",
      digitalMarketing: "Onboarding & Introduction",
      groupTask: "Create Group Profile & Summary of Program & Brand Choose",
      catchUp: "Update & Evaluation Progress of Group Task",
    },
    {
      day: "2",
      topic: "Marketing & Branding Introduction",
      bipa: "Daily Conversation",
      english: "Describing Products & Strengths",
      digitalMarketing: "Marketing & Branding Introduction",
      groupTask: "Create Marketing & Branding Analysis",
    },
    {
      day: "3",
      topic: "Brand Positioning & Consumer Insight",
      bipa: "Daily Conversation",
      english: "Describing People & Needs",
      digitalMarketing: "Brand Positioning & Consumer Insight",
      groupTask: "Create Brand Positioning & Consumer Insight Analysis",
    },
    {
      day: "4",
      topic: "Content Marketing & Campaign Planning",
      bipa: "Daily Conversation",
      english: "Short & Strong Sentences",
      digitalMarketing: "Content Marketing & Campaign Planning",
      groupTask: "Create Content & Campaign Marketing Plan",
    },
    {
      day: "5",
      topic: "Creative Brief & Assessing Marketing",
      bipa: "Daily Conversation",
      english: "Giving Instructions & Requests",
      digitalMarketing: "Creative Brief & Assessing Marketing",
      groupTask: "Create Creative Brief & Marketing Assessment",
    },
    {
      day: "8",
      topic: "Business Culture & Communication",
      bipa: "Daily Conversation",
      english: "Email & Text Communication",
      digitalMarketing: "Japanese Business Culture Insight & Global Cross-Cultural Communication",
      groupTask: "Marketing Content Creation",
      catchUp: "Update & Evaluation Progress of Group Task",
    },
    {
      day: "9",
      topic: "Indonesia Culture",
      bipa: "Daily Conversation",
      english: "Indonesia Culture Class (14:00–15:30)",
      digitalMarketing: "Marketing Execution Day 1",
      groupTask: "—",
    },
    {
      day: "10",
      topic: "Career Tips & Preparation",
      bipa: "Daily Conversation",
      english: "Talking About Numbers & Trends",
      digitalMarketing: "Career Tips & Preparation",
      groupTask: "Marketing Execution Day 2",
    },
    {
      day: "11",
      topic: "Final Presentation Preparation",
      bipa: "Daily Conversation",
      english: "Learn Presentation in English",
      digitalMarketing: "Marketing Execution Day 3",
      groupTask: "Marketing Execution Day 3 & Final Project Deck Design",
    },
    {
      day: "12",
      topic: "Final Presentation",
      bipa: "Daily Conversation",
      english: "English Post Test",
      digitalMarketing: "Final Project Design",
      groupTask: "Final Project Presentation",
      catchUp: "Closing Meeting & Awarding",
    },
  ],
  digitalMarketingDays: [
    {
      day: "Day 1",
      title: "Onboarding Day",
      objectives: [
        "Introduce organizer profiles (Company & LBI FIB UI) to establish credibility",
        "Overview curriculum, schedule, tools, and facilitators",
        "Explain technical guidelines and code of conduct",
        "Ice-breaking, group formation, and brand selection for the case study",
      ],
      outcomes: [
        "Shared understanding of the program's final goals",
        "Know how to access program resources",
        "Initial team bonding established",
        "Identify initial characteristics of the chosen brand",
      ],
      materials: ["Welcoming Speech & Organizer Profile", "Program Deep-Dive (Modules 1–4)", "Program Rules & Guide Book orientation", "Team Building & brand selection workshop"],
      output: ["Official group list & designated group leaders", "Brand selection form with rationale"],
      groupTask: "Create a slide deck or report covering The Team (profiles & roles), The Goal, and The Brand (industry, social handles, and why it's interesting to analyze).",
    },
    {
      day: "Day 2",
      title: "Marketing & Branding Introduction",
      objectives: [
        "Define core Marketing principles",
        "Introduce Marketing Mix (4P), 4C Diamonds, SWOT",
        "Define Branding vs. Marketing",
        "Introduce Brand Equity Model, positioning, emotional connection & insight",
      ],
      outcomes: [
        "Differentiate Marketing and Branding functions",
        "Analyze a business environment using marketing frameworks",
        "Understand the Brand Equity Model",
        "Identify emotional triggers that drive brand loyalty",
      ],
      materials: ["Introduction to Marketing, 4P, 4C Diamonds, SWOT", "Introduction to Branding, Brand Equity Model", "Growing a Brand & Building Positioning, Emotion & Insight", "Integrated case studies"],
      output: ["Marketing and Branding Analysis"],
      groupTask: "Using the Day 1 brand, create a presentation covering marketing & branding analysis with the frameworks above.",
    },
    {
      day: "Day 3",
      title: "Brand Positioning & Consumer Insight",
      objectives: [
        "Introduce Brand Positioning and how to build/maintain it",
        "Identify and articulate 'The Brand Benefit'",
        "Functional vs. Emotional Benefits",
        "Consumer understanding via Passion Points and Pain Points",
      ],
      outcomes: [
        "Formulate a compelling Brand Positioning statement",
        "Map Functional and Emotional benefits",
        "Identify Consumer Insights (Pain & Passion Points)",
        "Translate consumer problems into brand solutions",
      ],
      materials: ["Introduction to Brand Positioning", "Finding the Brand Benefit; Functional & Emotional Benefit", "Understanding your consumer; Passion & Pain Points", "Case studies"],
      output: ["Brand Strategy & Consumer Insight Analysis"],
      groupTask: "Develop a presentation covering: Consumer Profile, Benefit Ladder, and a Positioning Statement for the chosen brand.",
    },
    {
      day: "Day 4",
      title: "Content Marketing & Campaign Planning",
      objectives: [
        "Core principles and importance of Content Marketing",
        "Framework for a Content Marketing Strategy",
        "End-to-end Campaign and Media Planning process",
        "Key campaign parameters: Objectives, Messages, Channels, KPIs",
      ],
      outcomes: [
        "Distinguish content types and their roles in the marketing funnel",
        "Design a Content Marketing Strategy aligned with brand goals",
        "Develop a Campaign Plan with measurable KPIs",
        "Select the right media channels for the target audience",
      ],
      materials: ["Content Marketing Principles & Strategy", "Campaign & Media Planning: Objective, Message, Channel, KPI", "Case study"],
      output: ["Integrated Content & Campaign Marketing Plan"],
      groupTask: "Define Content Pillars & strategy, set one Campaign Objective & Core Message, and select 3+ Channels with a KPI for each.",
    },
    {
      day: "Day 5",
      title: "Creative Brief & Assessing Marketing",
      objectives: [
        "Creative Brief as the bridge between strategy and execution",
        "Step-by-step guidelines for a clear, inspiring brief",
        "Methodology for assessing and giving feedback on creative work",
        "Apply the A.B.C.D.E. framework (Attention, Branding, Communication, Delivery, Emotion)",
      ],
      outcomes: [
        "Translate marketing strategy into a formal Creative Brief",
        "Manage the briefing process to minimize miscommunication",
        "Objectively evaluate creative work using standardized frameworks",
        "Give constructive, strategy-based feedback",
      ],
      materials: ["Principles & Guidelines of Creative Brief", "How to Assess Creative Works, A.B.C.D.E, Case study"],
      output: ["Professional Creative Brief Document", "Creative Assessment Scorecard"],
      groupTask: "Write a Creative Brief for one asset, then evaluate an existing ad/post from the chosen brand using the A.B.C.D.E. Framework.",
    },
  ],
  careerPrepDays: [
    {
      day: "Day 8",
      title: "Japanese Business Culture Insight & Global Cross-Cultural Communication",
      objectives: [
        "Core values of Japanese business etiquette (Hou-Ren-So, Omotenashi, Punctuality)",
        "High-Context (Japan) vs. Low-Context (Global) communication styles",
        "Strategies for effective collaboration in a multicultural work environment",
      ],
      outcomes: [
        "Identify key differences between Japanese and Global business cultures",
        "Apply professional etiquette suitable for a global company",
        "Navigate cultural misunderstandings using a 'Global Mindset'",
      ],
      materials: ["Understanding Horenso and 'Preparation' (Nemawashi)", "Cross-cultural communication & decision-making framework", "Being assertive yet polite in non-Japanese settings"],
      output: ["A 'Cultural Adaptability' checklist for global teamwork"],
    },
    {
      day: "Day 10",
      title: "Career Tips & Preparation",
      objectives: [
        "Essential components of a modern CV and LinkedIn profile",
        "Highlight Digital Marketing skills learned in this program for employers",
        "Basic interview techniques and professional Personal Branding",
      ],
      outcomes: [
        "Translate the 12-day program experience into Achievement Statements",
        "Answer common interview questions with confidence",
        "Build a professional digital presence to attract recruiters",
      ],
      materials: ["Resume & LinkedIn 101: formatting, keywords, the STAR method", "The 'Digital Marketer' Portfolio", "Mock Interview & Elevator Pitches", "Job Hunting Strategy"],
      output: ["Draft of an updated CV/Resume or LinkedIn headline", "Personal Elevator Pitch"],
    },
  ],
  individualChallenge: [
    "LinkedIn Profile Update: professional photo, headline, and about section",
    "The 'Learning Journey' Post summarizing core skills learned",
    "Attach a visual/screenshot of your Group Project result",
    "Skill Endorsement: add at least 5 new skills acquired during the program",
    "Export to PDF via LinkedIn's 'Save to PDF' feature for a professional CV snapshot",
  ],
};

const JA: CourseGuideData = {
  quickNav: [
    { href: "#overview", label: "概要" },
    { href: "#schemes", label: "プログラムスキーム" },
    { href: "#schedule", label: "スケジュール" },
    { href: "#register", label: "登録方法" },
    { href: "#curriculum", label: "カリキュラム" },
    { href: "#course-contact", label: "お問い合わせ" },
  ],
  programStructure: [
    ["語学コース", "コミュニケーション力を養う毎日のBIPA・英語クラス"],
    ["デジタルマーケティングコース", "マーケティングの基礎からキャンペーン実施までを段階的に学ぶ"],
    ["個人・グループプロジェクト", "チームでマーケティング戦略・コンテンツ・最終プレゼンテーションを作成"],
    ["文化交流セッション", "インドネシアと日本のビジネス文化への理解を深める"],
  ],
  addOnRows: [
    ["朝食（2週間分）", "¥16,083"],
    ["昼食（2週間分）", "¥16,083"],
    ["夕食（2週間分）", "¥16,083"],
    ["SIMカード", "¥1,340"],
    ["航空券予約サポート", "¥2,813"],
    ["週末1日ツアー", "¥26,135"],
  ],
  onsitePeriod: [
    ["登録期間", "2026年8月3日〜11月3日"],
    ["お支払い期限", "2026年11月4日"],
    ["お支払い確認", "2026年11月5日〜9日"],
    ["ビザ発給", "2026年11月25日〜26日"],
    ["参加者到着", "2026年11月29日"],
    ["プログラム期間", "2026年11月30日〜12月12日"],
    ["参加者出発", "2026年12月13日"],
  ],
  included: [
    "インドネシア滞在中の宿泊（Wisma）",
    "空港送迎（往復）",
    "すべてのプログラム活動（授業・教材・プロジェクトセッション）",
    "修了証と学習成果レポート",
    "ビザサポート",
  ],
  notIncluded: ["食事（追加オプション選択時を除く）", "現地での日常の交通費", "航空券", "個人的な出費"],
  businessEnglishSyllabus: [
    ["第1回", "120分", "自己紹介"],
    ["第2回", "120分", "商品と強みを説明する"],
    ["第3回", "120分", "人物とニーズを説明する"],
    ["第4回", "120分", "短く力強い文章表現"],
    ["第5回", "120分", "指示・依頼の伝え方"],
    ["第6回", "120分", "メール・テキストでのやり取り"],
    ["第7回", "120分", "日常会話"],
    ["第8回", "120分", "数字とトレンドについて話す"],
    ["第9回", "120分", "英語プレゼンテーションを学ぶ"],
    ["第10回", "120分", "英語ポストテスト"],
  ],
  bipaSyllabus: [
    ["第1回", "ユニット1: 自己紹介 (1)", "インドネシア語のアルファベットを発音し、簡単な独話で挨拶・自己紹介ができる"],
    ["第2回", "ユニット1: 自己紹介 (2)", "出身地や個人情報（電話番号・住所）を紹介できる"],
    ["第3回", "ユニット1: 自己紹介 (3)", "自己紹介に関する質問をし、答えることができる"],
    ["第4回", "ユニット2: 他者紹介 (1)", "他者を紹介し、職業を説明できる"],
    ["第5回", "ユニット2: 他者紹介 (2)", "他者について説明できる"],
    ["第6回", "ユニット2: 他者紹介 (3)", "家族について説明できる"],
    ["第7回", "ユニット3: 位置表現 (1)", "位置に関する語彙を理解し、物の位置を尋ね・答えられる"],
    ["第8回", "ユニット3: 位置表現 (2)", "部屋の位置関係を説明できる"],
    ["第9回", "ユニット4: 方向表現 (1)", "方角・方向に関する語彙を理解し、簡単な道案内ができる"],
    ["第10回", "ユニット4: 方向表現 (2)", "複雑な道案内ができる"],
  ],
  scheduleRows: [
    {
      day: "1",
      topic: "オンボーディング",
      bipa: "日常会話",
      english: "自己紹介",
      digitalMarketing: "オンボーディング・導入",
      groupTask: "グループプロフィール作成・プログラム概要まとめ・ブランド選定",
      catchUp: "グループ課題の進捗確認・振り返り",
    },
    {
      day: "2",
      topic: "マーケティング・ブランディング入門",
      bipa: "日常会話",
      english: "商品と強みを説明する",
      digitalMarketing: "マーケティング・ブランディング入門",
      groupTask: "マーケティング・ブランディング分析の作成",
    },
    {
      day: "3",
      topic: "ブランドポジショニングと消費者インサイト",
      bipa: "日常会話",
      english: "人物とニーズを説明する",
      digitalMarketing: "ブランドポジショニングと消費者インサイト",
      groupTask: "ブランドポジショニング・消費者インサイト分析の作成",
    },
    {
      day: "4",
      topic: "コンテンツマーケティングとキャンペーン企画",
      bipa: "日常会話",
      english: "短く力強い文章表現",
      digitalMarketing: "コンテンツマーケティングとキャンペーン企画",
      groupTask: "コンテンツ・キャンペーンマーケティング計画の作成",
    },
    {
      day: "5",
      topic: "クリエイティブブリーフとマーケティング評価",
      bipa: "日常会話",
      english: "指示・依頼の伝え方",
      digitalMarketing: "クリエイティブブリーフとマーケティング評価",
      groupTask: "クリエイティブブリーフとマーケティング評価の作成",
    },
    {
      day: "8",
      topic: "ビジネス文化とコミュニケーション",
      bipa: "日常会話",
      english: "メール・テキストでのやり取り",
      digitalMarketing: "日本のビジネス文化理解とグローバルな異文化コミュニケーション",
      groupTask: "マーケティングコンテンツ制作",
      catchUp: "グループ課題の進捗確認・振り返り",
    },
    {
      day: "9",
      topic: "インドネシア文化",
      bipa: "日常会話",
      english: "インドネシア文化クラス（14:00〜15:30）",
      digitalMarketing: "マーケティング実施 Day 1",
      groupTask: "—",
    },
    {
      day: "10",
      topic: "キャリアのヒントと準備",
      bipa: "日常会話",
      english: "数字とトレンドについて話す",
      digitalMarketing: "キャリアのヒントと準備",
      groupTask: "マーケティング実施 Day 2",
    },
    {
      day: "11",
      topic: "最終プレゼンテーション準備",
      bipa: "日常会話",
      english: "英語プレゼンテーションを学ぶ",
      digitalMarketing: "マーケティング実施 Day 3",
      groupTask: "マーケティング実施 Day 3・最終プロジェクト資料デザイン",
    },
    {
      day: "12",
      topic: "最終プレゼンテーション",
      bipa: "日常会話",
      english: "英語ポストテスト",
      digitalMarketing: "最終プロジェクトデザイン",
      groupTask: "最終プロジェクト発表",
      catchUp: "クロージングミーティング・表彰",
    },
  ],
  digitalMarketingDays: [
    {
      day: "Day 1",
      title: "オンボーディングデー",
      objectives: [
        "運営者プロフィール（会社・LBI FIB UI）を紹介し、信頼性を確立する",
        "カリキュラム・スケジュール・ツール・ファシリテーターの概要を把握する",
        "技術的なガイドラインと行動規範を説明する",
        "アイスブレイク、グループ編成、ケーススタディ用のブランド選定を行う",
      ],
      outcomes: [
        "プログラムの最終目標について共通理解を持つ",
        "プログラムのリソースへのアクセス方法を理解する",
        "初期のチームの絆を築く",
        "選定したブランドの初期特徴を把握する",
      ],
      materials: ["ウェルカムスピーチ・運営者プロフィール", "プログラム詳細解説（モジュール1〜4）", "プログラムルール・ガイドブックのオリエンテーション", "チームビルディング・ブランド選定ワークショップ"],
      output: ["正式なグループリストとグループリーダーの選出", "根拠付きのブランド選定フォーム"],
      groupTask: "チーム（プロフィールと役割）、目標、ブランド（業界、SNSアカウント、分析対象として興味深い理由）についてまとめたスライドまたはレポートを作成する。",
    },
    {
      day: "Day 2",
      title: "マーケティング・ブランディング入門",
      objectives: [
        "マーケティングの基本原則を定義する",
        "マーケティングミックス（4P）、4Cダイヤモンド、SWOT分析を紹介する",
        "ブランディングとマーケティングの違いを定義する",
        "ブランドエクイティモデル、ポジショニング、感情的なつながりとインサイトを紹介する",
      ],
      outcomes: [
        "マーケティングとブランディングの機能を区別できる",
        "マーケティングフレームワークを用いてビジネス環境を分析できる",
        "ブランドエクイティモデルを理解する",
        "ブランドロイヤルティを生む感情的トリガーを特定できる",
      ],
      materials: ["マーケティング、4P、4Cダイヤモンド、SWOTの紹介", "ブランディング、ブランドエクイティモデルの紹介", "ブランドの成長・ポジショニング構築・感情とインサイト", "統合ケーススタディ"],
      output: ["マーケティング・ブランディング分析"],
      groupTask: "Day 1で選定したブランドを用いて、上記のフレームワークに基づくマーケティング・ブランディング分析のプレゼンテーションを作成する。",
    },
    {
      day: "Day 3",
      title: "ブランドポジショニングと消費者インサイト",
      objectives: [
        "ブランドポジショニングとその構築・維持方法を紹介する",
        "「ブランドベネフィット」を特定し、言語化する",
        "機能的ベネフィットと感情的ベネフィットの違い",
        "パッションポイントとペインポイントを通じた消費者理解",
      ],
      outcomes: [
        "説得力のあるブランドポジショニングステートメントを策定できる",
        "機能的ベネフィットと感情的ベネフィットをマッピングできる",
        "消費者インサイト（ペイン・パッションポイント）を特定できる",
        "消費者の課題をブランドソリューションに転換できる",
      ],
      materials: ["ブランドポジショニングの紹介", "ブランドベネフィットの発見：機能的・感情的ベネフィット", "消費者理解：パッション・ペインポイント", "ケーススタディ"],
      output: ["ブランド戦略・消費者インサイト分析"],
      groupTask: "選定ブランドについて、消費者プロフィール、ベネフィットラダー、ポジショニングステートメントをまとめたプレゼンテーションを作成する。",
    },
    {
      day: "Day 4",
      title: "コンテンツマーケティングとキャンペーン企画",
      objectives: [
        "コンテンツマーケティングの基本原則と重要性",
        "コンテンツマーケティング戦略のフレームワーク",
        "キャンペーン・メディアプランニングの一連のプロセス",
        "キャンペーンの主要指標：目的・メッセージ・チャネル・KPI",
      ],
      outcomes: [
        "コンテンツの種類とマーケティングファネルにおける役割を区別できる",
        "ブランド目標に沿ったコンテンツマーケティング戦略を設計できる",
        "測定可能なKPIを持つキャンペーンプランを策定できる",
        "ターゲットオーディエンスに適したメディアチャネルを選定できる",
      ],
      materials: ["コンテンツマーケティングの原則と戦略", "キャンペーン・メディアプランニング：目的・メッセージ・チャネル・KPI", "ケーススタディ"],
      output: ["統合されたコンテンツ・キャンペーンマーケティングプラン"],
      groupTask: "コンテンツピラーと戦略を定義し、キャンペーン目的とコアメッセージを1つ設定、KPI付きで3つ以上のチャネルを選定する。",
    },
    {
      day: "Day 5",
      title: "クリエイティブブリーフとマーケティング評価",
      objectives: [
        "戦略と実行をつなぐクリエイティブブリーフの役割",
        "明確でインスピレーションを与えるブリーフ作成のステップバイステップガイド",
        "クリエイティブ作品を評価しフィードバックする手法",
        "A.B.C.D.E.フレームワーク（Attention・Branding・Communication・Delivery・Emotion）の適用",
      ],
      outcomes: [
        "マーケティング戦略を正式なクリエイティブブリーフに落とし込める",
        "誤解を最小限に抑えるブリーフィングプロセスを管理できる",
        "標準化されたフレームワークを用いてクリエイティブ作品を客観的に評価できる",
        "戦略に基づいた建設的なフィードバックができる",
      ],
      materials: ["クリエイティブブリーフの原則とガイドライン", "クリエイティブ作品の評価方法、A.B.C.D.E、ケーススタディ"],
      output: ["プロフェッショナルなクリエイティブブリーフ文書", "クリエイティブ評価スコアカード"],
      groupTask: "1つの制作物についてクリエイティブブリーフを作成し、A.B.C.D.E.フレームワークを用いて選定ブランドの既存広告・投稿を評価する。",
    },
  ],
  careerPrepDays: [
    {
      day: "Day 8",
      title: "日本のビジネス文化理解とグローバルな異文化コミュニケーション",
      objectives: [
        "日本のビジネスマナーの核となる価値観（報連相、おもてなし、時間厳守）",
        "ハイコンテクスト（日本）とローコンテクスト（グローバル）のコミュニケーションスタイル",
        "多文化な職場環境で効果的に協働するための戦略",
      ],
      outcomes: [
        "日本とグローバルなビジネス文化の主な違いを理解できる",
        "グローバル企業に適したプロフェッショナルなマナーを実践できる",
        "「グローバルマインドセット」を用いて文化的な誤解に対応できる",
      ],
      materials: ["報連相と「根回し（準備）」の理解", "異文化コミュニケーション・意思決定のフレームワーク", "非日本的な環境でアサーティブかつ礼儀正しく振る舞う方法"],
      output: ["グローバルなチームワークのための「文化適応力」チェックリスト"],
    },
    {
      day: "Day 10",
      title: "キャリアのヒントと準備",
      objectives: [
        "現代的な履歴書とLinkedInプロフィールに必要な要素",
        "本プログラムで学んだデジタルマーケティングスキルを企業にアピールする方法",
        "基本的な面接テクニックとプロフェッショナルなパーソナルブランディング",
      ],
      outcomes: [
        "12日間のプログラム経験をアチーブメントステートメントに落とし込める",
        "よくある面接質問に自信を持って答えられる",
        "採用担当者の目を引くプロフェッショナルなデジタルプレゼンスを構築できる",
      ],
      materials: ["履歴書・LinkedIn 101：フォーマット、キーワード、STAR法", "「デジタルマーケター」ポートフォリオ", "模擬面接・エレベーターピッチ", "就職活動戦略"],
      output: ["更新した履歴書またはLinkedInヘッドラインの草案", "個人のエレベーターピッチ"],
    },
  ],
  individualChallenge: [
    "LinkedInプロフィールの更新：プロフィール写真、ヘッドライン、自己紹介欄",
    "学んだ主要スキルをまとめた「学びの軌跡」投稿",
    "グループプロジェクトの成果を示すビジュアル・スクリーンショットの添付",
    "スキルエンドースメント：プログラム中に習得した新しいスキルを5つ以上追加",
    "LinkedInの「PDFとして保存」機能を使って、履歴書用のプロフェッショナルなPDFを出力",
  ],
};

export function getCourseGuide(locale: Locale): CourseGuideData {
  return locale === "ja" ? JA : EN;
}
