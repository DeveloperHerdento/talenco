import { Reveal } from "@/components/ui/Reveal";
import { PaymentSuccessBadge } from "@/components/payment/PaymentSuccessBadge";
import { CheckboxGroup, FieldWrap, RadioGroup, Select, TextInput } from "@/components/register/Fields";
import {
  CAREER_OPTIONS,
  ENGLISH_OPTIONS,
  HEAR_OPTIONS,
  NEXT_OPTIONS,
  REASON_OPTIONS,
  STATUS_OPTIONS,
  YES_NO,
  type FormData,
} from "@/lib/constants/register-form";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export type Errors = Partial<Record<keyof FormData, string>>;

type StepProps = {
  data: FormData;
  errors: Errors;
  onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
};

export function Step1({ data, errors, onChange }: StepProps) {
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

export function Step2({ data, errors, onChange }: StepProps) {
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

export function Step3({
  data,
  errors,
  onChange,
  toggleReason,
}: StepProps & { toggleReason: (v: string) => void }) {
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

export function Step4({ data, errors, onChange }: StepProps) {
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

export function ThankYou({ name, locale, nextStep }: { name: string; locale: string; nextStep: string }) {
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
