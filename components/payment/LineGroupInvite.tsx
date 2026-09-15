import Image from "next/image";
import { Button } from "@/components/ui/Button";

const LINE_GROUP_URL = "https://line.me/ti/g/BKT7KGVsWJ";

export function LineGroupInvite() {
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border border-[#e0e0e0] bg-[#f0fdf4] p-4 sm:flex-row sm:items-center">
      <Image
        src="/assets/line-group-qr.png"
        alt="LINE group QR code"
        width={112}
        height={112}
        className="mx-auto size-24 shrink-0 rounded-md sm:mx-0 sm:size-28"
      />
      <div className="flex flex-col items-start gap-3 text-left">
        <div>
          <p className="text-sm font-semibold text-black">参加者限定LINEグループへご招待します</p>
          <p className="text-sm text-black/50">You&apos;re invited to our participant-only LINE group</p>
        </div>
        <p className="text-xs leading-relaxed text-black/50">
          今後のご連絡やお知らせはこちらのグループで行います。ぜひご参加ください。
          <br />
          We&apos;ll share updates and important announcements there — please join.
        </p>
        <Button href={LINE_GROUP_URL} target="_blank" rel="noreferrer" variant="line" className="w-full justify-center sm:w-auto">
          LINEグループに参加する / Join LINE Group
        </Button>
      </div>
    </div>
  );
}
