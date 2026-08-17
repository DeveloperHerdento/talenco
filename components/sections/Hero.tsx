import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[740px] w-full items-center overflow-hidden pt-32 pb-16 md:pt-32"
    >
      <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-3">
        <Image
          src="/assets/images/hero-bg.webp"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(32,129,249,0.6) 0%, rgba(0,0,0,0.6) 50%, rgba(255,110,0,0.6) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 md:px-8">
        <div className="flex max-w-5xl flex-col gap-10">
          <h1 className="animate-fade-up text-4xl font-extrabold tracking-normal text-white opacity-0 sm:text-6xl lg:text-7xl xl:text-[96px] xl:leading-[0.95]">
            Start Your <span className="text-brand-orange">Global</span>{" "}
            <span className="text-brand-orange">Career</span> Here.
          </h1>

          <p
            className="leading-normal animate-fade-up text-base text-white opacity-0 sm:text-xl lg:text-2xl"
            style={{ animationDelay: "150ms" }}
          >
            Interested in working internationally but unsure how to begin? <br/> Develop practical global
            skills, improve your English, and <br/> gain real international experience.
          </p>

          <div
            className="animate-fade-up flex flex-wrap items-center gap-3 opacity-0"
            style={{ animationDelay: "300ms" }}
          >
            <Button variant="primary" href="#programs">
              Register Now
            </Button>
            <Button variant="secondary" href="#contact" className="w-[202px] justify-center">
              Get More Information
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
