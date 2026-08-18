"use client";

import { useState } from "react";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TESTIMONIALS } from "@/lib/constants/testimonials";
import type { Dictionary } from "@/lib/i18n/dictionary";

function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="flex w-[320px] shrink-0 flex-col gap-6 rounded-2xl border-[0.5px] border-[#e9e9e9] bg-white p-8 shadow-sm shadow-black/5 md:w-[380px]">
      <Quote className="text-brand-orange size-10" strokeWidth={1.75} />
      <p className="flex-1 text-md leading-relaxed text-black/70">{quote}</p>
      <div>
        <p className="text-base font-semibold text-black">{name}</p>
        <p className="text-xs font-light text-brand-blue">{role}</p>
      </div>
    </div>
  );
}

export function Testimonials({ dict }: { dict: Dictionary["testimonials"] }) {
  const [paused, setPaused] = useState(false);

  return (
    <section id="testimonials" className="relative w-full py-14 md:py-18 lg:py-20">
      <div className="absolute inset-x-4 inset-y-0 -z-10 rounded-[20px] bg-[#fafcff] lg:inset-x-3" />

      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-12 md:gap-16">
        <Reveal className="mx-auto flex flex-col items-center gap-5 px-4 text-center md:px-8">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} align="center" />
        </Reveal>

        <Reveal className="group relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent md:w-32"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent md:w-32"
          />

          <button
            type="button"
            onClick={() => setPaused((prev) => !prev)}
            aria-pressed={paused}
            aria-label={paused ? dict.resumeScroll : dict.pauseScroll}
            className="absolute inset-0 z-0 cursor-pointer"
          />

          <div
            className="animate-marquee pointer-events-none flex w-max items-stretch gap-6 group-hover:[animation-play-state:paused]"
            style={paused ? { animationPlayState: "paused" } : undefined}
          >
            {TESTIMONIALS.map((testimonial) => {
              const item = dict.items[testimonial.key];
              return (
                <TestimonialCard key={testimonial.key} quote={item.quote} name={testimonial.name} role={item.role} />
              );
            })}
            {/* Duplicate set makes the loop seamless; hidden from assistive tech so content isn't announced twice. */}
            <div aria-hidden="true" className="contents">
              {TESTIMONIALS.map((testimonial) => {
                const item = dict.items[testimonial.key];
                return (
                  <TestimonialCard
                    key={`${testimonial.key}-dup`}
                    quote={item.quote}
                    name={testimonial.name}
                    role={item.role}
                  />
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
