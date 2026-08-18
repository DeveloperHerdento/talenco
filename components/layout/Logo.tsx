import Image from "next/image";

export function Logo() {
  return (
    <a href="#top" className="shrink-0">
      <Image
        src="/assets/logotype-talenco.svg"
        alt="TalenCo"
        width={149}
        height={40}
        priority
        className="h-8 w-auto md:h-9"
      />
    </a>
  );
}
