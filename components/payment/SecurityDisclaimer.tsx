import Image from "next/image";

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function XenditLogo() {
  return (
    <a
      href="https://www.xendit.co"
      target="_blank"
      rel="noopener noreferrer"
      className="mx-1 inline-block align-baseline"
    >
      <Image
        src="/assets/logo-xendit.png"
        alt="Xendit"
        width={76}
        height={22}
        className="h-4 w-auto translate-y-[3px]"
      />
    </a>
  );
}

export function SecurityDisclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-start gap-2.5 rounded-lg border border-[#e0e0e0] bg-[#f7f9fc] px-4 ${compact ? "py-2.5" : "py-3"}`}>
      <span className="mt-0.5 text-black/40">
        <LockIcon />
      </span>
      <p className="text-xs leading-relaxed text-black/55">
        お支払いは決済ゲートウェイ<XenditLogo />を通じて安全に処理されます。TalenCoがカード番号・有効期限・CVVを直接取得・保存することはありません。
        <br />
        Payments are securely processed by <XenditLogo />. TalenCo never sees or stores your card number, expiry, or CVV.
      </p>
    </div>
  );
}
