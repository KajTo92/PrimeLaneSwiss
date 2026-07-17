"use client";

import Image from "next/image";
import { AboutSection } from "@/components/AboutSection";
import { BookingSection } from "@/components/BookingSection";
import { ChauffeursSection } from "@/components/ChauffeursSection";
import { ContactSection } from "@/components/ContactSection";
import { FleetSection } from "@/components/FleetSection";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { PaymentSection } from "@/components/PaymentSection";
import { Language } from "@/types/language";
import { useEffect, useRef, useState, type MouseEvent } from "react";

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
  };
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { href: "#about", label: language === "de" ? "Uber uns" : "About" },
    { href: "#fleet", label: language === "de" ? "Flotte" : "Fleet" },
    { href: "#booking", label: language === "de" ? "Buchung" : "Booking" },
    { href: "#payments", label: language === "de" ? "Zahlung" : "Payment" },
    { href: "#contact", label: language === "de" ? "Kontakt" : "Contact" },
  ];

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleClickOutside = (event: globalThis.MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleResize = () => {
      if (window.innerWidth > 980) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

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
          <nav className="hidden items-center gap-8 text-sm text-white/70 min-[981px]:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <div ref={mobileMenuRef} className="relative flex items-center gap-2">
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
            <a href="#booking" className="btn-premium nav-booking-button desktop-booking-button">
              {language === "de" ? "Fahrt buchen" : "Book Now"}
            </a>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              aria-expanded={isMobileMenuOpen}
              aria-label={language === "de" ? "Menu offnen" : "Open menu"}
              className="inline-flex h-16 w-24 items-center justify-center bg-transparent p-0 transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6d88b] min-[981px]:hidden"
            >
              <Image
                src="/media/burger.png"
                alt=""
                aria-hidden="true"
                width={88}
                height={40}
                className="object-contain"
                style={{ width: "88px", height: "40px", maxHeight: "64px" }}
              />
            </button>
            {isMobileMenuOpen ? (
              <div className="absolute right-0 top-[calc(100%+0.85rem)] w-[min(82vw,20rem)] overflow-hidden rounded-2xl border border-[#d4a94b]/35 bg-[#070606]/95 p-2 text-sm text-white shadow-[0_22px_70px_rgba(0,0,0,0.55),0_0_34px_rgba(214,166,78,0.18)] backdrop-blur-xl min-[981px]:hidden">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f6d88b]/80 to-transparent" />
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center justify-between rounded-xl px-4 py-3 text-white/78 transition hover:bg-[#d4a94b]/12 hover:text-[#f9dfac]"
                  >
                    <span>{item.label}</span>
                    <span className="h-px w-7 bg-gradient-to-r from-[#d4a94b]/30 to-transparent transition group-hover:from-[#f6d88b]" />
                  </a>
                ))}
              </div>
            ) : null}
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
          <PaymentSection language={language} />
          <ContactSection language={language} />
          <Footer language={language} />
        </div>
      </section>
    </main>
  );
}
