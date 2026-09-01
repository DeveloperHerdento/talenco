"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Script from "next/script";
import { AnimatePresence, motion } from "motion/react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { RegisterSidebarDesktop, RegisterSidebarMobile } from "@/components/register/RegisterSidebar";
import { PaymentStep } from "@/components/register/PaymentStep";
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
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition-colors ${
        error ? "border-brand-red focus:border-brand-red" : "border-[#e0e0e0] focus:border-brand-blue"
      } ${value ? "text-black" : "text-black/40"}`}
    >
      <option value="" disabled>
        選択してください / Choose
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
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
          countrySelectorStyleProps={{ buttonClassName: "!border-[#e0e0e0]" }}
        />
      </FieldWrap>
      <FieldWrap label="LINE ID" sublabel="LINE ID" required error={errors.lineId}>
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
      <span className="bg-brand-orange flex size-14 items-center justify-center rounded-full text-2xl text-white">✓</span>
      <h2 className="text-xl font-bold text-black">ご登録ありがとうございます</h2>
      <p className="text-sm text-black/60">
        Thank you, {name}. Your registration has been received.{" "}
        {nextStep === "payment"
          ? "Our team will contact you with payment instructions by email or LINE/WhatsApp shortly."
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
  const [registration, setRegistration] = useState<{ id: string; accessToken: string } | null>(null);
  const [paid, setPaid] = useState(false);

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

  // Render the Turnstile widget once the script has loaded and step 4 is mounted.
  useEffect(() => {
    if (step !== 3) return;

    function render() {
      const win = window as Window & {
        turnstile?: {
          render: (el: HTMLElement, opts: Record<string, unknown>) => string;
        };
      };
      if (!turnstileContainerRef.current || !win.turnstile || widgetIdRef.current !== null) return;
      if (!TURNSTILE_SITE_KEY) return;

      widgetIdRef.current = win.turnstile.render(turnstileContainerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => {
          turnstileTokenRef.current = token;
        },
        "expired-callback": () => {
          turnstileTokenRef.current = "";
        },
      });
    }

    const w = window as unknown as Record<string, unknown>;
    if (typeof w.turnstile !== "undefined") {
      render();
    } else {
      w.__onTurnstileReady = render;
    }
  }, [step]);

  const validate = (): boolean => {
    const errs: Errors = {};
    if (step === 0) {
      if (!data.fullName.trim()) errs.fullName = "この項目は必須です";
      if (!/^\S+@\S+\.\S+$/.test(data.email)) errs.email = "有効なメールアドレスを入力してください";
      if (data.phone.trim().length < 7) errs.phone = "有効な電話番号を入力してください";
      if (!data.lineId.trim()) errs.lineId = "この項目は必須です";
    }
    if (step === 1) {
      if (!data.currentStatus) errs.currentStatus = "この項目は必須です";
      if (!data.university.trim()) errs.university = "この項目は必須です";
      if (!data.major.trim()) errs.major = "この項目は必須です";
      if (!data.englishLevel) errs.englishLevel = "この項目は必須です";
    }
    if (step === 2) {
      if (!data.studiedAbroad) errs.studiedAbroad = "この項目は必須です";
      if (!data.overseasWork) errs.overseasWork = "この項目は必須です";
      if (data.reasons.length === 0) errs.reasons = "少なくとも1つ選択してください";
      if (!data.careerGoal) errs.careerGoal = "この項目は必須です";
    }
    if (step === 3) {
      if (!data.hearAbout) errs.hearAbout = "この項目は必須です";
      if (!data.nextStep) errs.nextStep = "この項目は必須です";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;

    if (step < STEPS.length - 1) {
      setDirection(1);
      setStep((s) => s + 1);
      setMaxStep((m) => Math.max(m, step + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
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

      setRegistration({ id: json.registrationId, accessToken: json.accessToken });
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToStep = (target: number) => {
    if (target === step || target > maxStep) return;
    setDirection(target > step ? 1 : -1);
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted && data.nextStep === "payment" && registration && !paid) {
    return (
      <div className="mx-auto w-full max-w-[720px]">
        <PaymentStep
          registrationId={registration.id}
          accessToken={registration.accessToken}
          locale={locale}
          onPaid={() => setPaid(true)}
        />
      </div>
    );
  }

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

        <div className="flex min-w-0 flex-col">
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
              <h2 className="text-lg font-bold text-black">{STEPS[step].label}</h2>
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

                <div ref={turnstileContainerRef} className="min-h-[65px]" />

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
                <Button variant="primary" onClick={handleNext} disabled={submitting}>
                  {submitting ? "送信中... / Submitting..." : isLastStep ? "送信する / Submit" : "次へ / Next →"}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
