"use client";

import { AdditionalServicesSection } from "@/components/AdditionalServicesSection";
import { AboutSection } from "@/components/AboutSection";
import { BookingSection } from "@/components/BookingSection";
import { ChauffeursSection } from "@/components/ChauffeursSection";
import { ContactSection } from "@/components/ContactSection";
import { FleetSection } from "@/components/FleetSection";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { PaymentSection } from "@/components/PaymentSection";
import { SiteHeader } from "@/components/SiteHeader";
import { Language } from "@/types/language";
import { useCallback, useEffect, useState, type MouseEvent } from "react";

export default function Home() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "de";
    }
    const savedLanguage = window.localStorage.getItem("site-language");
    return savedLanguage === "en" ? "en" : "de";
  });

  const switchLanguage = (value: Language) => {
    setLanguage(value);
    window.localStorage.setItem("site-language", value);
    document.documentElement.lang = value;
  };
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });
  const [isJobsOpen, setIsJobsOpen] = useState(false);
  const openJobs = useCallback(() => setIsJobsOpen(true), []);
  const closeJobs = useCallback(() => setIsJobsOpen(false), []);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      if (window.location.hash === "#jobs") {
        setIsJobsOpen(true);
      }
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  const handleAfterHeroMouseMove = (event: MouseEvent<HTMLElement>) => {
    const { innerWidth, innerHeight } = window;
    const normalizedX = event.clientX / innerWidth - 0.5;
    const normalizedY = event.clientY / innerHeight - 0.5;

    setCursorOffset({
      x: normalizedX * 3,
      y: normalizedY * 2,
    });
  };

  return (
    <main className="bg-[#050506] text-white">
      <SiteHeader
        language={language}
        onLanguageChange={switchLanguage}
        isHomePage
        onOpenJobs={openJobs}
      />
      <HeroSection language={language} />
      <section
        className="after-hero-background"
        onMouseMove={handleAfterHeroMouseMove}
        onMouseLeave={() => setCursorOffset({ x: 0, y: 0 })}
      >
        <div
          className="after-hero-background-image"
          style={{
            backgroundPosition: `calc(50% + ${cursorOffset.x}px) calc(0% + ${cursorOffset.y}px)`,
          }}
          aria-hidden="true"
        />
        <div className="after-hero-background-overlay" aria-hidden="true" />
        <div className="relative z-10">
          <AboutSection language={language} />
          <FleetSection language={language} />
          <ChauffeursSection language={language} />
          <BookingSection language={language} />
          <AdditionalServicesSection
            language={language}
            isJobsOpen={isJobsOpen}
            onOpenJobs={openJobs}
            onCloseJobs={closeJobs}
          />
          <PaymentSection language={language} />
          <ContactSection language={language} />
          <Footer language={language} />
        </div>
      </section>
    </main>
  );
}
