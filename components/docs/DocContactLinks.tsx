import { Button } from "@/components/ui/Button";

export function DocContactLinks() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        href="https://lin.ee/EQaovqv"
        target="_blank"
        rel="noreferrer"
        variant="line"
        className="justify-center"
      >
        LINE @601ffdki
      </Button>
      <Button
        href="https://wa.me/+6285117804811"
        target="_blank"
        rel="noreferrer"
        variant="whatsapp"
        className="justify-center"
      >
        WhatsApp
      </Button>
    </div>
  );
}
