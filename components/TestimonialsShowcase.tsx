"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Language } from "@/types/language";
import { testimonials } from "@/components/testimonialsData";

type TestimonialsShowcaseProps = {
  language: Language;
};

export function TestimonialsShowcase({ language }: TestimonialsShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const activeReview = testimonials[activeIndex];

  return (
    <div className="mt-10 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(246,216,139,0.16),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-[0_0_80px_rgba(255,255,255,0.04)] sm:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">{language === "de" ? "KUNDENSTIMMEN" : "CLIENT REVIEWS"}</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[0.04em] text-white sm:text-3xl">
            {language === "de"
              ? "Stimmen zu Fahrten in der ganzen Schweiz"
              : "What clients say about rides across Switzerland"}
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/68 sm:text-base">
            {language === "de"
              ? "Stilistisch an klassische Bewertungsboxen angelehnt, mit formulierten Beispielstimmen fur die deutsche und englische Version der Seite."
              : "Styled like premium rating cards, with prepared sample testimonials for the German and English versions of the site."}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setActiveIndex((activeIndex - 1 + testimonials.length) % testimonials.length)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition hover:border-amber-200/45 hover:text-amber-100"
            aria-label={language === "de" ? "Vorherige Bewertung" : "Previous review"}
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ←
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((activeIndex + 1) % testimonials.length)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition hover:border-amber-200/45 hover:text-amber-100"
            aria-label={language === "de" ? "Nachste Bewertung" : "Next review"}
          >
            <span aria-hidden="true" className="text-xl leading-none">
              →
            </span>
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)]">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-black/30 p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-1 text-[#f6d88b]">
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index} className="text-lg">
                ★
              </span>
            ))}
            <span className="ml-3 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-200">
              {language === "de" ? "Top bewertet" : "Top rated"}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${language}-${activeIndex}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <p className="text-lg leading-8 text-white/90 sm:text-xl">“{activeReview.text[language]}”</p>

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                <div>
                  <p className="text-base font-semibold text-white">{activeReview.name}</p>
                  <p className="mt-1 text-sm text-white/56">{activeReview.route[language]}</p>
                </div>
                <div className="rounded-full border border-amber-200/18 bg-amber-300/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-amber-100">
                  {language === "de" ? "Private Fahrt" : "Private transfer"}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid gap-3">
          {testimonials.map((review, index) => (
            <button
              key={review.name}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`rounded-3xl border px-5 py-4 text-left transition ${
                index === activeIndex
                  ? "border-amber-200/55 bg-amber-300/10 shadow-[0_0_26px_rgba(246,216,139,0.14)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
              }`}
              aria-label={`${language === "de" ? "Bewertung anzeigen" : "Show review"} ${index + 1}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/88">{review.name}</p>
                  <p className="mt-1 text-xs text-white/52">{review.route[language]}</p>
                </div>
                <div className="flex items-center gap-1 text-[13px] text-[#f6d88b]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span key={starIndex}>★</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
