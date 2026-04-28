"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Language } from "@/types/language";
import { RotatingHeadline } from "@/components/RotatingHeadline";

type HeroSectionProps = {
  language: Language;
};

export function HeroSection({ language }: HeroSectionProps) {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 60]);
  const rotatingPhrases =
    language === "de"
      ? ["Reisen mit Komfort", "Schweizer Qualitatsfahrten", "24/7 Service"]
      : ["Premium Transport", "Luxury Taxi Service", "Travel in Comfort", "Swiss Quality Rides"];

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-4 pt-24 pb-14 sm:px-6 lg:px-8"
    >
      <motion.div className="hero-image-layer z-0" style={{ y: parallaxY }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/media/teslax.png"
          className="h-full w-full object-cover"
        >
          <source src="/media/bgfilmpc.mp4" type="video/mp4" />
        </video>
      </motion.div>
      <div className="hero-image-overlay z-10" />
      <div className="relative z-20 mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <RotatingHeadline phrases={rotatingPhrases} intervalMs={3200} />
        </motion.div>

        <div className="grid items-center gap-10 lg:grid-cols-2">
    <div className="text-center lg:text-left">
            <p className="text-xs tracking-[0.35em] text-white/60">
              PRIME LANE GMBH - Swiss
            </p>
         
            <h2 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-4xl">
              {language === "de" ? "Exklusiver Fahrservice" : "Exclusive Chauffeur Service"}
            </h2>
            <p className="mt-2 text-sm text-white/75 sm:text-base">
              {language === "de"
                ? "Premium Transport in der ganzen Schweiz."
                : "Premium Transport in der ganzen Schweiz."}
            </p>
          </div>

          <div className="text-center lg:text-right lg:justify-self-end">
            
            <div className="mt-2 flex justify-center lg:justify-end">
              <img
                src="/media/logo4.png"
                alt="Swiss Prime Lane logo"
                width={300}
                height={300}
                loading="eager"
                decoding="async"
                onError={(event) => {
                  event.currentTarget.src = "/media/logo2.png";
                }}
                className="h-27 w-auto object-contain"
              />
            </div>
            <h2 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-4xl">
              <span className="gold-text">PRIME LANE</span>{" "}
              <span className=" inline-block text-[0.22em] font-medium tracking-[0.18em] text-white/72">
                GMBH
              </span>{" "}
              SWISS
            </h2>
            <p className="mt-2 text-sm text-white/75 sm:text-base">
              {language === "de"
                ? "Diskret, punktlich und mit hochstem Komfort."
                : "Discrete, punctual, and exceptionally comfortable."}
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-8 flex justify-center lg:justify-start"
        >
          <a href="#booking" className="btn-premium px-8 py-3 text-sm tracking-[0.16em]">
            {language === "de" ? "Jetzt buchen" : "Book a Ride"}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
