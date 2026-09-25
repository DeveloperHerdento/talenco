"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { RegisterSidebarDesktop, RegisterSidebarMobile } from "@/components/register/RegisterSidebar";
import { Spinner } from "@/components/register/Fields";
import { Step1, Step2, Step3, Step4, ThankYou, type Errors } from "@/components/register/Steps";
import { TURNSTILE_TEST_SITE_KEY, isLocalHostname } from "@/lib/constants/turnstile";
import { INITIAL_FORM_DATA, STEPS, type FormData } from "@/lib/constants/register-form";

if (typeof window !== "undefined") {
  const w = window as unknown as Record<string, unknown>;
  if (typeof w.__onTurnstileReady !== "function") {
    w.__onTurnstileReady = function () {};
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function effectiveTurnstileSiteKey(): string | undefined {
  if (process.env.NODE_ENV !== "production" && typeof window !== "undefined" && isLocalHostname(window.location.hostname)) {
    return TURNSTILE_TEST_SITE_KEY;
  }
  return TURNSTILE_SITE_KEY;
}

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
