"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Script from "next/script";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Reveal } from "@/components/ui/Reveal";
import { PaymentSuccessBadge } from "@/components/payment/PaymentSuccessBadge";
import { Button } from "@/components/ui/Button";
import { RegisterSidebarDesktop, RegisterSidebarMobile } from "@/components/register/RegisterSidebar";
import { TURNSTILE_TEST_SITE_KEY, isLocalHostname } from "@/lib/constants/turnstile";
import {
  CAREER_OPTIONS,
  ENGLISH_OPTIONS,
  HEAR_OPTIONS,
  INITIAL_FORM_DATA,
  NEXT_OPTIONS,
  REASON_OPTIONS,
  STATUS_OPTIONS,
  STEPS,
  YES_NO,
  type FormData,
} from "@/lib/constants/register-form";

if (typeof window !== "undefined") {
  const w = window as unknown as Record<string, unknown>;
  if (typeof w.__onTurnstileReady !== "function") {
    w.__onTurnstileReady = function () {};
  }
}

type Errors = Partial<Record<keyof FormData, string>>;

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// The real site key is domain-allow-listed (production + the dev ngrok domain) and won't
// load on plain localhost — swap in Cloudflare's always-pass test key there instead.
function effectiveTurnstileSiteKey(): string | undefined {
  if (process.env.NODE_ENV !== "production" && typeof window !== "undefined" && isLocalHostname(window.location.hostname)) {
    return TURNSTILE_TEST_SITE_KEY;
  }
  return TURNSTILE_SITE_KEY;
}

// ── shared field primitives (restyled to the site's brand tokens) ──────────

function FieldWrap({
  label,
  sublabel,
  required,
  error,
  children,
}: {
  label: string;
  sublabel?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-black">
        {label}
        {sublabel && <span className="ml-1 font-normal text-black/50">/ {sublabel}</span>}
        {required && <span className="ml-1 text-brand-red">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-brand-red">{error}</p>}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  maxLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full rounded-lg border px-4 py-3 text-sm text-black outline-none transition-colors ${
        error ? "border-brand-red focus:border-brand-red" : "border-[#e0e0e0] focus:border-brand-blue"
      }`}
    />
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

function Select({
  value,
  onChange,
  options,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center gap-3 rounded-lg border bg-white py-3 pr-4 pl-4 text-left text-sm outline-none transition-colors ${
          error ? "border-brand-red focus:border-brand-red" : "border-[#e0e0e0] focus:border-brand-blue"
        } ${value ? "text-black" : "text-black/40"}`}
      >
        <ChevronDown
          className={`size-4 shrink-0 text-black/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
        <span className="truncate">{value || "選択してください / Choose"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-[#e0e0e0] bg-white p-1.5 shadow-lg shadow-black/5"
          >
            {options.map((o) => (
              <li key={o}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === o}
                  onClick={() => {
                    onChange(o);
                    setOpen(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    value === o ? "bg-brand-blue/10 text-brand-blue" : "text-black/70 hover:bg-black/5"
                  }`}
                >
                  {o}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function RadioGroup({
  name,
  value,
  options,
  onChange,
  error,
}: {
  name: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      {options.map((o) => (
        <label
          key={o}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
            value === o ? "border-brand-blue bg-[#eaf3ff]" : "border-[#e0e0e0] hover:border-black/20"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={o}
            checked={value === o}
            onChange={() => onChange(o)}
            className="accent-brand-blue"
          />
          <span className="text-sm text-black">{o}</span>
        </label>
      ))}
      {error && <p className="text-xs text-brand-red">{error}</p>}
    </div>
  );
}

function CheckboxGroup({
  values,
  options,
  onChange,
  error,
}: {
  values: string[];
  options: string[];
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      {options.map((o) => (
        <label
          key={o}
          className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
            values.includes(o) ? "border-brand-blue bg-[#eaf3ff]" : "border-[#e0e0e0] hover:border-black/20"
          }`}
        >
          <input
            type="checkbox"
            checked={values.includes(o)}
            onChange={() => onChange(o)}
            className="mt-0.5 shrink-0 accent-brand-blue"
          />
          <span className="text-sm text-black">{o}</span>
        </label>
      ))}
      {error && <p className="text-xs text-brand-red">{error}</p>}
    </div>
  );
}

// ── step content ─────────────────────────────────────────────────────────

function Step1({
  data,
  errors,
  onChange,
}: {
  data: FormData;
  errors: Errors;
  onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <FieldWrap label="氏名" sublabel="Full Name" required error={errors.fullName}>
        <TextInput value={data.fullName} onChange={(v) => onChange("fullName", v)} maxLength={100} />
      </FieldWrap>
      <FieldWrap label="メールアドレス" sublabel="Email Address" required error={errors.email}>
        <TextInput type="email" value={data.email} onChange={(v) => onChange("email", v)} maxLength={254} />
      </FieldWrap>
      <FieldWrap label="電話番号" sublabel="Phone Number" required error={errors.phone}>
        <PhoneInput
          defaultCountry="jp"
          value={data.phone}
          onChange={(v) => onChange("phone", v)}
          inputClassName="!w-full !py-3 !text-sm !border-[#e0e0e0]"
          countrySelectorStyleProps={{
            buttonClassName: "!border-[#e0e0e0]",
            dropdownStyleProps: {
              className: "!rounded-xl !border-[#e0e0e0] !p-1.5 !shadow-lg !shadow-black/5",
              listItemClassName: "!rounded-lg !px-3 !py-2.5 !text-sm !text-black/70 hover:!bg-black/5",
              listItemSelectedClassName: "!bg-brand-blue/10 !text-brand-blue",
              listItemFocusedClassName: "!bg-black/5",
              listItemDialCodeClassName: "!text-black/40",
            },
          }}
        />
      </FieldWrap>
      <FieldWrap label="LINE ID" sublabel="LINE ID" error={errors.lineId}>
        <TextInput value={data.lineId} onChange={(v) => onChange("lineId", v)} maxLength={50} />
      </FieldWrap>
    </div>
  );
}

function Step2({
  data,
  errors,
  onChange,
}: {
  data: FormData;
  errors: Errors;
  onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <FieldWrap label="現在の状況" sublabel="Current Status" required error={errors.currentStatus}>
        <Select value={data.currentStatus} onChange={(v) => onChange("currentStatus", v)} options={STATUS_OPTIONS} />
      </FieldWrap>
      <FieldWrap label="大学名" sublabel="University" required error={errors.university}>
        <TextInput value={data.university} onChange={(v) => onChange("university", v)} maxLength={200} />
      </FieldWrap>
      <FieldWrap label="専攻" sublabel="Major" required error={errors.major}>
        <TextInput value={data.major} onChange={(v) => onChange("major", v)} maxLength={200} />
      </FieldWrap>
      <FieldWrap label="職種（該当する場合）" sublabel="Job Title (if applicable)">
        <TextInput value={data.jobTitle} onChange={(v) => onChange("jobTitle", v)} maxLength={200} />
      </FieldWrap>
      <FieldWrap label="英語レベル" sublabel="English Level" required error={errors.englishLevel}>
        <RadioGroup
          name="englishLevel"
          value={data.englishLevel}
          options={ENGLISH_OPTIONS}
          onChange={(v) => onChange("englishLevel", v)}
        />
      </FieldWrap>
    </div>
  );
}

function Step3({
  data,
  errors,
  onChange,
  toggleReason,
}: {
  data: FormData;
  errors: Errors;
  onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  toggleReason: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <FieldWrap label="留学経験はありますか？" sublabel="Have you studied abroad before?" required error={errors.studiedAbroad}>
        <RadioGroup
          name="studiedAbroad"
          value={data.studiedAbroad}
          options={YES_NO}
          onChange={(v) => onChange("studiedAbroad", v)}
        />
      </FieldWrap>
      <FieldWrap label="海外での就労経験はありますか？" sublabel="Have you worked abroad before?" required error={errors.overseasWork}>
        <RadioGroup
          name="overseasWork"
          value={data.overseasWork}
          options={YES_NO}
          onChange={(v) => onChange("overseasWork", v)}
        />
      </FieldWrap>
      <FieldWrap label="参加を希望する理由（複数選択可）" sublabel="Why do you want to join? (select all that apply)" required error={errors.reasons}>
        <CheckboxGroup values={data.reasons} options={REASON_OPTIONS} onChange={toggleReason} />
      </FieldWrap>
      <FieldWrap label="将来のキャリア目標" sublabel="Future Career Goal" required error={errors.careerGoal}>
        <RadioGroup
          name="careerGoal"
          value={data.careerGoal}
          options={CAREER_OPTIONS}
          onChange={(v) => onChange("careerGoal", v)}
        />
      </FieldWrap>
    </div>
  );
}

function Step4({
  data,
  errors,
  onChange,
}: {
  data: FormData;
  errors: Errors;
  onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <FieldWrap label="このプログラムをどこで知りましたか？" sublabel="How did you hear about us?" required error={errors.hearAbout}>
        <Select value={data.hearAbout} onChange={(v) => onChange("hearAbout", v)} options={HEAR_OPTIONS} />
      </FieldWrap>
      <FieldWrap label="次のステップ" sublabel="Next Step" required error={errors.nextStep}>
        <div className="space-y-2">
          {NEXT_OPTIONS.map((o) => (
            <label
              key={o.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                data.nextStep === o.value ? "border-brand-blue bg-[#eaf3ff]" : "border-[#e0e0e0] hover:border-black/20"
              }`}
            >
              <input
                type="radio"
                name="nextStep"
                checked={data.nextStep === o.value}
                onChange={() => onChange("nextStep", o.value)}
                className="mt-0.5 accent-brand-blue"
              />
              <span className="text-sm text-black">
                {o.label}
                <br />
                <span className="text-black/50">{o.sublabel}</span>
              </span>
            </label>
          ))}
        </div>
      </FieldWrap>
    </div>
  );
}

// ── thank you screen ────────────────────────────────────────────────────

function ThankYou({ name, locale, nextStep }: { name: string; locale: string; nextStep: string }) {
  return (
    <Reveal className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-[#ececec] p-10 text-center">
      <PaymentSuccessBadge size="lg" />
      <h2 className="text-xl font-bold text-black">ご登録ありがとうございます</h2>
      <p className="text-sm text-black/60">
        Thank you, {name}. Your registration has been received.{" "}
        {nextStep === "payment"
          ? "Check your confirmation email for a link to complete your payment."
          : "We'll follow up by email shortly with more information."}
      </p>
      <a href={`/${locale}`} className="text-brand-blue text-sm font-semibold hover:underline">
        トップページに戻る / Back to Home
      </a>
    </Reveal>
  );
}

// ── main wizard ──────────────────────────────────────────────────────────

export function RegisterForm({ locale }: { locale: string }) {
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Errors>({});
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const formTopRef = useRef<HTMLDivElement>(null);
  const honeypotRef = useRef("");
  const turnstileTokenRef = useRef("");
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleReason = (v: string) => {
    setData((d) => ({
      ...d,
      reasons: d.reasons.includes(v) ? d.reasons.filter((r) => r !== v) : [...d.reasons, v],
    }));
    setErrors((e) => ({ ...e, reasons: undefined }));
  };

  const renderTurnstile = useCallback(() => {
    const win = window as Window & {
      turnstile?: {
        render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      };
    };
    const sitekey = effectiveTurnstileSiteKey();
    if (!turnstileContainerRef.current || !win.turnstile || widgetIdRef.current !== null) return;
    if (!sitekey) return;

    widgetIdRef.current = win.turnstile.render(turnstileContainerRef.current, {
      sitekey,
      callback: (token: string) => {
        turnstileTokenRef.current = token;
      },
      "expired-callback": () => {
        turnstileTokenRef.current = "";
      },
    });
  }, []);

  const setTurnstileContainer = useCallback(
    (node: HTMLDivElement | null) => {
      turnstileContainerRef.current = node;
      if (node) renderTurnstile();
    },
    [renderTurnstile]
  );

  useEffect(() => {
    if (step !== 3) return;

    const w = window as unknown as Record<string, unknown>;
    if (typeof w.turnstile !== "undefined") {
      renderTurnstile();
    } else {
      w.__onTurnstileReady = renderTurnstile;
    }

    return () => {
      const win = window as Window & { turnstile?: { remove: (id: string) => void } };
      if (widgetIdRef.current !== null) {
        win.turnstile?.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
      turnstileTokenRef.current = "";
    };
  }, [step, renderTurnstile]);

  const validate = (): boolean => {
    const errs: Errors = {};
    if (step === 0) {
      if (!data.fullName.trim()) errs.fullName = "この項目は必須です / This field is required";
      if (!/^\S+@\S+\.\S+$/.test(data.email)) errs.email = "有効なメールアドレスを入力してください / Please enter a valid email address";
      if (data.phone.trim().length < 7) errs.phone = "有効な電話番号を入力してください / Please enter a valid phone number";
    }
    if (step === 1) {
      if (!data.currentStatus) errs.currentStatus = "この項目は必須です / This field is required";
      if (!data.university.trim()) errs.university = "この項目は必須です / This field is required";
      if (!data.major.trim()) errs.major = "この項目は必須です / This field is required";
      if (!data.englishLevel) errs.englishLevel = "この項目は必須です / This field is required";
    }
    if (step === 2) {
      if (!data.studiedAbroad) errs.studiedAbroad = "この項目は必須です / This field is required";
      if (!data.overseasWork) errs.overseasWork = "この項目は必須です / This field is required";
      if (data.reasons.length === 0) errs.reasons = "少なくとも1つ選択してください / Please select at least one";
      if (!data.careerGoal) errs.careerGoal = "この項目は必須です / This field is required";
    }
    if (step === 3) {
      if (!data.hearAbout) errs.hearAbout = "この項目は必須です / This field is required";
      if (!data.nextStep) errs.nextStep = "この項目は必須です / This field is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const scrollToFormTop = () => {
    const el = formTopRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100; // clears the fixed navbar
    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleNext = async () => {
    if (!validate()) return;

    if (step < STEPS.length - 1) {
      setDirection(1);
      setStep((s) => s + 1);
      setMaxStep((m) => Math.max(m, step + 1));
      scrollToFormTop();
      return;
    }

    if (!privacyConsent) {
      setSubmitError("プライバシーポリシーへの同意が必要です。/ Please agree to the Privacy Policy.");
      return;
    }
    if (!turnstileTokenRef.current) {
      setSubmitError("セキュリティ確認を完了してください。/ Please complete the security check.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          locale,
          turnstileToken: turnstileTokenRef.current,
          _hp: honeypotRef.current,
          privacyConsent: true,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setSubmitError(json.error ?? "エラーが発生しました。再度お試しください。");
        const win = window as Window & { turnstile?: { reset: (id: string) => void } };
        if (widgetIdRef.current !== null && win.turnstile) {
          win.turnstile.reset(widgetIdRef.current);
        }
        turnstileTokenRef.current = "";
        return;
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("ネットワークエラーが発生しました。再度お試しください。/ Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
    scrollToFormTop();
  };

  const goToStep = (target: number) => {
    if (target === step || target > maxStep) return;
    setDirection(target > step ? 1 : -1);
    setStep(target);
    scrollToFormTop();
  };

  // Enter advances the step, except from buttons (which already handle their own click).
  const handleStepKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter") return;
    const target = e.target as HTMLElement;
    if (target.tagName === "BUTTON" || target.tagName === "TEXTAREA" || target.tagName === "A") return;
    e.preventDefault();
    if (!submitting) handleNext();
  };

  if (submitted) return <ThankYou name={data.fullName} locale={locale} nextStep={data.nextStep} />;

  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__onTurnstileReady&render=explicit"
        strategy="afterInteractive"
      />

      {/* Honeypot — invisible to humans, filled in by naive bots */}
      <input
        type="text"
        name="_hp"
        defaultValue=""
        onChange={(e) => {
          honeypotRef.current = e.target.value;
        }}
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      <RegisterSidebarMobile steps={STEPS} current={step} maxStep={maxStep} onSelect={goToStep} />

      <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-[220px_1fr] lg:gap-12 lg:pt-0">
        <RegisterSidebarDesktop steps={STEPS} current={step} maxStep={maxStep} onSelect={goToStep} />

        <div ref={formTopRef} className="flex min-w-0 flex-col scroll-mt-24" onKeyDown={handleStepKeyDown}>
          <Reveal className="overflow-hidden rounded-2xl border border-[#ececec] p-6 shadow-sm md:p-8">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction >= 0 ? 32 : -32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -32 : 32 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6 border-b border-[#ececec] pb-5">
              <h2 className="text-xl font-bold text-brand-blue md:text-2xl">{STEPS[step].label}</h2>
              <p className="text-sm text-black/50">{STEPS[step].sublabel}</p>
            </div>

            {step === 0 && <Step1 data={data} errors={errors} onChange={setField} />}
            {step === 1 && <Step2 data={data} errors={errors} onChange={setField} />}
            {step === 2 && <Step3 data={data} errors={errors} onChange={setField} toggleReason={toggleReason} />}
            {step === 3 && <Step4 data={data} errors={errors} onChange={setField} />}

            {step === 3 && (
              <div className="mt-6 space-y-4 border-t border-[#ececec] pt-5">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => {
                      setPrivacyConsent(e.target.checked);
                      if (submitError.includes("プライバシー")) setSubmitError("");
                    }}
                    className="accent-brand-blue mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-black">
                    <a href={`/${locale}/privacy`} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
                      プライバシーポリシー / Privacy Policy
                    </a>{" "}
                    に同意します / I agree to the privacy policy
                    <span className="text-brand-red ml-1">*</span>
                  </span>
                </label>

                <div ref={setTurnstileContainer} className="min-h-[65px]" />

                {submitError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

            <div className="mt-8 flex items-center justify-between border-t border-[#ececec] pt-6">
              {step > 0 ? (
                <Button variant="outline" onClick={handleBack} disabled={submitting}>
                  ← 戻る / Back
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-4">
                <span className="text-xs text-black/40">
                  {step + 1} / {STEPS.length}
                </span>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={submitting}
                  icon={submitting ? <Spinner /> : undefined}
                >
                  {submitting ? "送信中 / Submitting" : isLastStep ? "送信する / Submit" : "次へ / Next →"}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
