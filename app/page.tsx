"use client";

import "@/i18n/client";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";

type Card = { title: string; desc: string };
type TimelineItem = { label: string; date: string };
type FaqItem = { q: string; a: string };

const CARD_IMAGES = [
  { src: "/images/bipaui2.png",    alt: "English Class"       },
  { src: "/images/bipaui.jpeg",    alt: "Indonesian Language"  },
  { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format", alt: "Digital Marketing" },
  { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&auto=format",    alt: "Career Preparation" },
  { src: "/images/culturalclass.png", alt: "Culture Class"    },
  { src: "/images/pulaupayung.jpg",   alt: "Island Trip"      },
];

export default function Home() {
  const { t } = useTranslation("landing");

  const cards        = t("overview.cards",  { returnObjects: true }) as Card[];
  const benefitItems = t("benefits.items",  { returnObjects: true }) as string[];
  const applyItems   = t("apply.items",     { returnObjects: true }) as string[];
  const timeline     = t("timeline.items",  { returnObjects: true }) as TimelineItem[];
  const onlineFeats  = t("pricing.online.features",  { returnObjects: true }) as string[];
  const offlineFeats = t("pricing.offline.features", { returnObjects: true }) as string[];
  const faqItems     = t("faq.items",       { returnObjects: true }) as FaqItem[];

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[90vh] flex items-center justify-center text-white text-center overflow-hidden">
        <div className="absolute inset-0 flex animate-slide">
          <div className="min-w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80&auto=format')" }} />
          <div className="min-w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80&auto=format')" }} />
          <div className="min-w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1600&q=80&auto=format')" }} />
        </div>
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 mx-auto w-[90%] max-w-[600px]">
          <h1 className="text-[42px] md:text-[32px] font-bold mb-2.5 leading-tight">{t("hero.h1")}</h1>
          <h2 className="text-2xl font-normal mb-5">{t("hero.h2")}</h2>
          <p className="max-w-[600px] mb-8">
            {t("hero.p1")}<br />{t("hero.p2")}<br />{t("hero.p3")}
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <a href="/register" className="bg-secondary text-white px-6 py-3 rounded-md font-bold transition-colors hover:bg-[#e67e00]">
              {t("hero.cta1")}
            </a>
            <a href="https://docs.google.com/document/d/1QlYQ3RWkfynswIt028RzrwrJCfKzb2haRj9vrkN9vQo/edit?usp=sharing" className="bg-white text-primary px-6 py-3 rounded-md font-bold transition-colors hover:bg-slate-100">
              {t("hero.cta2")}
            </a>
          </div>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section id="overview" className="py-16">
        <div className="mx-auto w-[90%] max-w-[1100px]">
          <h2 className="text-[28px] font-bold text-primary text-center mb-5">{t("overview.title")}</h2>
          <p className="text-center max-w-[700px] mx-auto mb-8 text-dark">{t("overview.desc")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
            {cards.map((card, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-2 hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)] w-[300px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CARD_IMAGES[i].src} alt={CARD_IMAGES[i].alt} className="w-full h-[180px] object-cover" loading="lazy" />
                <div className="p-5">
                  <h3 className="text-primary font-semibold mb-2">{card.title}</h3>
                  <p className="text-muted text-sm">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section id="benefits" className="py-16">
        <div className="mx-auto w-[90%] max-w-[1100px] flex flex-col md:flex-row items-center gap-[60px]">
          <div className="flex-1 md:pl-12 text-center md:text-left">
            <h2 className="text-[28px] font-bold text-primary mb-5">{t("benefits.title")}</h2>
            <ul className="list-none p-0 mt-5 space-y-4 inline-block text-left">
              {benefitItems.map((item) => (
                <li key={item} className="relative pl-8 text-base text-dark">
                  <span className="absolute left-0 text-primary font-bold">✔</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/benefits.png" alt="Benefits" className="max-w-full w-[350px] animate-float" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ── WHO CAN APPLY ── */}
      <section id="apply" className="py-16">
        <div className="mx-auto w-[90%] max-w-[1100px] flex flex-col md:flex-row-reverse items-center gap-[60px]">
          <div className="flex-1 md:pl-12 text-center md:text-left">
            <h2 className="text-[28px] font-bold text-primary mb-5">{t("apply.title")}</h2>
            <ul className="list-none p-0 mt-5 space-y-4 inline-block text-left">
              {applyItems.map((item) => (
                <li key={item} className="relative pl-8 text-base text-dark">
                  <span className="absolute left-0 text-primary font-bold">✔</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/apply.png" alt="Who Can Apply" className="max-w-full w-[350px] animate-float" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section id="timeline" className="py-16">
        <div className="mx-auto w-[90%] max-w-[1100px]">
          <h2 className="text-[28px] font-bold text-primary text-center mb-8">{t("timeline.title")}</h2>
          <div className="border-l-4 border-primary pl-5 space-y-5">
            {timeline.map((item) => (
              <div key={item.label} className="text-dark">
                <strong className="text-secondary">{item.label}</strong>
                <br />
                {item.date}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-16">
        <div className="mx-auto w-[90%] max-w-[1100px]">
          <h2 className="text-[28px] font-bold text-primary text-center mb-3">{t("pricing.title")}</h2>
          <p className="text-center max-w-[700px] mx-auto text-dark">{t("pricing.desc")}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 max-w-[700px] mx-auto mt-10">
            {/* Online */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-2 border-transparent transition-all hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.13)]">
              <h3 className="text-xl font-semibold text-dark mb-4">{t("pricing.online.title")}</h3>
              <div className="mb-6">
                <span className="block text-[38px] font-extrabold text-primary leading-none">{t("pricing.online.price")}</span>
                <span className="block text-sm text-muted mt-1">{t("pricing.online.priceSub")}</span>
              </div>
              <ul className="list-none p-0 mb-7 space-y-2">
                {onlineFeats.map((f) => (
                  <li key={f} className="relative pl-[22px] py-2 border-b border-slate-100 text-sm text-[#334155]">
                    <span className="absolute left-0 top-[9px] text-primary text-xs">✔</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={t("pricing.online.href")} className="block w-full text-center bg-white border border-primary text-primary px-6 py-3 rounded-md font-bold transition-colors hover:bg-slate-100">
                {t("pricing.online.cta")}
              </a>
            </div>

            {/* Offline – featured */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-2 border-primary relative transition-all hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.13)]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                {t("pricing.offline.badge")}
              </div>
              <h3 className="text-xl font-semibold text-dark mb-4">{t("pricing.offline.title")}</h3>
              <div className="mb-6">
                <span className="block text-[38px] font-extrabold text-primary leading-none">{t("pricing.offline.price")}</span>
                <span className="block text-sm text-muted mt-1">{t("pricing.offline.priceSub")}</span>
              </div>
              <ul className="list-none p-0 mb-7 space-y-2">
                {offlineFeats.map((f) => (
                  <li key={f} className="relative pl-[22px] py-2 border-b border-slate-100 text-sm text-[#334155]">
                    <span className="absolute left-0 top-[9px] text-primary text-xs">✔</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={t("pricing.offline.href")} className="block w-full text-center bg-secondary text-white px-6 py-3 rounded-md font-bold transition-colors hover:bg-[#e67e00]">
                {t("pricing.offline.cta")}
              </a>
            </div>
          </div>

          <p className="text-center text-sm text-muted mt-7 leading-loose">{t("pricing.note")}</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-16">
        <div className="mx-auto w-[90%] max-w-[1100px]">
          <h2 className="text-[28px] font-bold text-primary text-center mb-8">{t("faq.title")}</h2>
          <div className="space-y-2.5">
            {faqItems.map((item) => (
              <details key={item.q} className="faq-item bg-white rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.05)] overflow-hidden">
                <summary className="px-[18px] py-[18px] cursor-pointer font-bold text-primary relative list-none pr-10">
                  {item.q}
                </summary>
                <p className="px-[18px] pb-[18px] text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary text-white text-center py-16 px-5">
        <h2 className="text-2xl font-bold mb-6">{t("cta.title")}</h2>
        <div className="flex gap-4 flex-wrap justify-center">
          <a href="/register" className="bg-secondary text-white px-6 py-3 rounded-md font-bold transition-colors hover:bg-[#e67e00]">
            {t("cta.cta1")}
          </a>
          <a href="https://lin.ee/EQaovqv" className="bg-white text-primary px-6 py-3 rounded-md font-bold transition-colors hover:bg-slate-100">
            {t("cta.cta2")}
          </a>
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section id="location" className="py-20">
        <div className="mx-auto w-[90%] max-w-[1100px] flex flex-col md:flex-row items-center gap-[50px]">
          <div className="flex-1 flex md:block justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.2433745649114!2d106.82576147500023!3d-6.362539962242179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec18461a48f7%3A0x92ed2ac5ecd2dd4b!2sLembaga%20Bahasa%20Internasional!5e0!3m2!1sen!2sid!4v1771425764134!5m2!1sen!2sid"
              className="rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] w-full md:w-[600px] h-[300px] md:h-[450px]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="flex-1 space-y-3 text-dark">
            <h2 className="text-[28px] font-bold text-primary mb-5">{t("location.title")}</h2>
            <p><strong>{t("location.labelLocation")}</strong><br />{t("location.location")}</p>
            <p><strong>{t("location.labelAddress")}</strong><br />{t("location.address")}</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="bg-primary text-white py-12 px-5">
        <div className="mx-auto w-[90%] max-w-[1100px] flex flex-wrap justify-between gap-10">
          <div>
            <h2 className="text-xl font-bold mb-1">TalenCo</h2>
            <p className="text-sm text-white/80">{t("footer.tagline")}</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold mb-2">{t("footer.followLabel")}</h3>
            <a href="http://instagram.com/talencoid" className="flex items-center gap-2.5 text-white hover:text-secondary transition-colors"><i className="fab fa-instagram text-lg w-5" />talencoid</a>
            <a href="http://facebook.com/talencoindonesia" className="flex items-center gap-2.5 text-white hover:text-secondary transition-colors"><i className="fab fa-facebook text-lg w-5" />talencoindonesia</a>
            <a href="https://www.tiktok.com/@talencoid" className="flex items-center gap-2.5 text-white hover:text-secondary transition-colors"><i className="fab fa-tiktok text-lg w-5" />talencoid</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold mb-2">{t("footer.contactLabel")}</h3>
            <a href="mailto:talencoindonesia@gmail.com" className="flex items-center gap-2.5 text-white hover:text-secondary transition-colors"><i className="fas fa-envelope text-lg w-5" />talencoindonesia@gmail.com</a>
            <a href="https://wa.me/+6285117804811" className="flex items-center gap-2.5 text-white hover:text-secondary transition-colors"><i className="fab fa-whatsapp text-lg w-5" />+6285117804811</a>
            <a href="https://lin.ee/EQaovqv" className="flex items-center gap-2.5 text-white hover:text-secondary transition-colors"><i className="fab fa-line text-lg w-5" />LINE Official Account @601ffdki</a>
            <a href="#" className="flex items-center gap-2.5 text-white hover:text-secondary transition-colors"><i className="fab fa-line text-lg w-5" />LINE id: talenco</a>
          </div>
        </div>
        <p className="text-center text-sm text-white/70 mt-5">© 2026 TalenCo. All rights reserved.</p>
      </footer>
    </>
  );
}
