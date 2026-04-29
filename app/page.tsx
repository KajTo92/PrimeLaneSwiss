"use client";

import { AboutSection } from "@/components/AboutSection";
import { BookingSection } from "@/components/BookingSection";
import { ChauffeursSection } from "@/components/ChauffeursSection";
import { ContactSection } from "@/components/ContactSection";
import { FleetSection } from "@/components/FleetSection";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Language } from "@/types/language";
import { useEffect, useRef, useState, type MouseEvent } from "react";

export default function Home() {
  const companyPhoneDisplay = "+41 77 203 76 43";
  const companyPhoneHref = "tel:+41772037643";
  const companyWhatsAppHref = "https://wa.me/41772037643";
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
  };
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  const contactMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isContactMenuOpen) {
      return;
    }

    const handleClickOutside = (event: globalThis.MouseEvent | TouchEvent) => {
      if (!contactMenuRef.current || contactMenuRef.current.contains(event.target as Node)) {
        return;
      }

      setIsContactMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isContactMenuOpen]);

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
      <section className="fixed top-0 left-0 right-0 z-30 border-b border-white/10 bg-black/45 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#hero" className="text-m leading-[1.15] tracking-[0.2em] text-white/90 sm:leading-normal">
             <span className="gold-text block sm:inline">PRIME LANE</span>{" "}
             <span className="block text-[0.52em] tracking-[0.38em] text-white/70 sm:inline sm:align-middle">GMBH SWISS</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#about" className="hover:text-white">
              {language === "de" ? "Uber uns" : "About"}
            </a>
            <a href="#fleet" className="hover:text-white">
              {language === "de" ? "Flotte" : "Fleet"}
            </a>
            <a href="#booking" className="hover:text-white">
              {language === "de" ? "Buchung" : "Booking"}
            </a>
            <a href="#contact" className="hover:text-white">
              {language === "de" ? "Kontakt" : "Contact"}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => switchLanguage("de")}
              className={`lang-pill ${language === "de" ? "lang-pill-active" : ""}`}
            >
              DE
            </button>
            <button
              type="button"
              onClick={() => switchLanguage("en")}
              className={`lang-pill ${language === "en" ? "lang-pill-active" : ""}`}
            >
              EN
            </button>
            <a href="#booking" className="btn-premium nav-booking-button">
              {language === "de" ? "Fahrt buchen" : "Book Now"}
            </a>
          </div>
        </div>
      </section>
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
          <ContactSection language={language} />
          <Footer language={language} />
        </div>
      </section>
      <div ref={contactMenuRef} className="fixed bottom-6 left-6 z-40">
        {isContactMenuOpen ? (
          <div className="mb-3 w-52 rounded-2xl border border-white/12 bg-black/88 p-2 text-sm text-white shadow-[0_18px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <a
              href={companyPhoneHref}
              className="block rounded-xl px-4 py-3 transition hover:bg-white/10"
              onClick={() => setIsContactMenuOpen(false)}
            >
              {language === "de" ? "Anrufen" : "Call"} {companyPhoneDisplay}
            </a>
            <a
              href={companyWhatsAppHref}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl px-4 py-3 transition hover:bg-white/10"
              onClick={() => setIsContactMenuOpen(false)}
            >
              WhatsApp
            </a>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setIsContactMenuOpen((current) => !current)}
          aria-expanded={isContactMenuOpen}
          aria-label={language === "de" ? `Kontaktoptionen: ${companyPhoneDisplay}` : `Contact options: ${companyPhoneDisplay}`}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#f6d88b]/65 bg-gradient-to-br from-[#f6d88b] via-[#d4a94b] to-[#b7862e] text-[#1f1609] shadow-[0_0_22px_rgba(214,166,78,0.45)] transition-transform duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(214,166,78,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6d88b] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path
              d="M6.62 10.79a15.91 15.91 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.32.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.3 21 3 13.7 3 4a1 1 0 011-1h3.49a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.2 2.2z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </main>
  );
}
