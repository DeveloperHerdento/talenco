"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TESTIMONIALS } from "@/lib/constants/testimonials";
import type { Dictionary } from "@/lib/i18n/dictionary";

function TestimonialCard({
  quote,
  name,
  role,
  className,
}: {
  quote: string;
  name: string;
  role: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-6 rounded-2xl border-[0.5px] border-[#e9e9e9] bg-white p-8 shadow-sm shadow-black/5 ${className ?? ""}`}
    >
      <Quote className="text-brand-orange size-10" strokeWidth={1.75} />
      <p className="flex-1 whitespace-pre-line text-md leading-relaxed text-black/70">
        {quote}
      </p>
      <div>
        <p className="text-base font-semibold text-black">{name}</p>
        <p className="text-xs font-light text-brand-blue">{role}</p>
      </div>
    </div>
  );
}

function TestimonialVideo({ caption }: { caption: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black"
    >
      {!ready && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
      )}
      {inView && (
        <video
          ref={videoRef}
          src="/assets/testimonies.mp4"
          className={`size-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
          controls={playing}
          playsInline
          preload="metadata"
          onLoadedData={() => setReady(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}
      {ready && !playing && (
        <>
          <span className="absolute top-4 left-4 rounded-full bg-brand-blue/80 px-3 py-1 text-xs font-medium text-white">
            {caption}
          </span>
          <button
            type="button"
            aria-label={caption}
            onClick={() => videoRef.current?.play()}
            className="bg-brand-orange absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105"
          >
            <Play className="size-6 translate-x-0.5" fill="currentColor" strokeWidth={0} />
          </button>
        </>
      )}
    </div>
  );
}

export function Testimonials({ dict }: { dict: Dictionary["testimonials"] }) {
  return (
    <section id="testimonials" className="relative w-full py-14 md:py-18 lg:py-20">
      <div className="absolute inset-x-4 inset-y-0 -z-10 rounded-[20px] bg-[#fafcff] lg:inset-x-3" />

      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-12 px-4 md:gap-16 md:px-8">
        <Reveal className="mx-auto flex flex-col items-center gap-5 text-center">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} align="center" />
        </Reveal>

        <Reveal className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TestimonialVideo caption={dict.videoCaption} />
          </div>

          <TestimonialCard
            quote={dict.items[TESTIMONIALS[0].key].quote}
            name={TESTIMONIALS[0].name}
            role={dict.items[TESTIMONIALS[0].key].role}
          />

          <TestimonialCard
            className="lg:col-span-3"
            quote={dict.items[TESTIMONIALS[1].key].quote}
            name={TESTIMONIALS[1].name}
            role={dict.items[TESTIMONIALS[1].key].role}
          />
        </Reveal>
      </div>
    </section>
  );
}
