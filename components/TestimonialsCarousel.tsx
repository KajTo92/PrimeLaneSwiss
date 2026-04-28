"use client";

import { motion } from "framer-motion";
import { Language } from "@/types/language";
import { testimonials } from "@/components/testimonialsData";

type TestimonialsCarouselProps = {
  language: Language;
};

export function TestimonialsCarousel({ language }: TestimonialsCarouselProps) {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="mt-8 overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] py-5 shadow-[0_0_50px_rgba(255,255,255,0.03)]">
      <div className="mb-4 flex items-center gap-3 px-5 sm:px-6">
        <div className="flex items-center gap-1 text-sm text-[#f6d88b]">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index}>★</span>
          ))}
        </div>
        <p className="text-xs uppercase tracking-[0.24em] text-white/58">
          {language === "de" ? "KUNDENSTIMMEN ZU TRANSFERS" : "CLIENT FEEDBACK ON TRANSFERS"}
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#0b0b0d] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#0b0b0d] to-transparent" />

        <motion.div
          className="flex w-max gap-4 px-5 sm:px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 52, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
        >
          {duplicatedTestimonials.map((review, index) => (
            <article
              key={`${review.name}-${index}`}
              className="w-[280px] shrink-0 rounded-[1.5rem] border border-white/10 bg-black/28 p-4 sm:w-[340px]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{review.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/45">
                    {review.route[language]}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[12px] text-[#f6d88b]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span key={starIndex}>★</span>
                  ))}
                </div>
              </div>

              <p className="mt-3 line-clamp-4 text-sm leading-6 text-white/76">“{review.text[language]}”</p>
            </article>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
