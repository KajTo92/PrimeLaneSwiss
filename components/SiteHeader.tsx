"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Language } from "@/types/language";

type SiteHeaderProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  isHomePage?: boolean;
};

type NavItem = {
  href: string;
  label: string;
};

export function SiteHeader({
  language,
  onLanguageChange,
  isHomePage = false,
}: SiteHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const homeHref = (hash: string) => (isHomePage ? hash : `/${hash}`);

  const navItems: NavItem[] = [
    { href: homeHref("#about"), label: language === "de" ? "Über uns" : "About" },
    { href: homeHref("#fleet"), label: language === "de" ? "Flotte" : "Fleet" },
    { href: homeHref("#booking"), label: language === "de" ? "Buchung" : "Booking" },
    { href: homeHref("#payments"), label: language === "de" ? "Zahlung" : "Payment" },
    { href: homeHref("#contact"), label: language === "de" ? "Kontakt" : "Contact" },
    {
      href: "/autovermietung",
      label: language === "de" ? "Autovermietung" : "Car Rental",
    },
    {
      href: homeHref("#jobs"),
      label: language === "de" ? "Jobs" : "Careers",
    },
    { href: homeHref("#partners"), label: language === "de" ? "Partner" : "Partners" },
  ];

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleClickOutside = (event: globalThis.MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
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
      if (window.innerWidth > 1180) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 border-b border-white/10 bg-black/45 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={isHomePage ? "#hero" : "/#hero"}
          className="text-m leading-[1.15] tracking-[0.2em] text-white/90 sm:leading-normal"
        >
          <span className="gold-text block sm:inline">PRIME LANE</span>{" "}
          <span className="block text-[0.52em] tracking-[0.38em] text-white/70 sm:inline sm:align-middle">
            GMBH SWISS
          </span>
        </Link>

        <nav className="hidden items-center gap-4 text-xs text-white/70 min-[1181px]:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div ref={mobileMenuRef} className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={() => onLanguageChange("de")}
            className={`lang-pill ${language === "de" ? "lang-pill-active" : ""}`}
            aria-pressed={language === "de"}
          >
            DE
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange("en")}
            className={`lang-pill ${language === "en" ? "lang-pill-active" : ""}`}
            aria-pressed={language === "en"}
          >
            EN
          </button>
          <Link href={homeHref("#booking")} className="btn-premium nav-booking-button desktop-booking-button">
            {language === "de" ? "Fahrt buchen" : "Book Now"}
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            aria-expanded={isMobileMenuOpen}
            aria-label={language === "de" ? "Menü öffnen" : "Open menu"}
            className="inline-flex h-16 w-24 items-center justify-center bg-transparent p-0 transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6d88b] min-[1181px]:hidden"
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
            <nav
              aria-label={language === "de" ? "Mobiles Menü" : "Mobile menu"}
              className="absolute right-0 top-[calc(100%+0.85rem)] w-[min(82vw,20rem)] overflow-hidden rounded-2xl border border-[#d4a94b]/35 bg-[#070606]/95 p-2 text-sm text-white shadow-[0_22px_70px_rgba(0,0,0,0.55),0_0_34px_rgba(214,166,78,0.18)] backdrop-blur-xl min-[1181px]:hidden"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f6d88b]/80 to-transparent" />
              {navItems.map((item) => {
                const content = (
                  <>
                    <span>{item.label}</span>
                    <span className="h-px w-7 bg-gradient-to-r from-[#d4a94b]/30 to-transparent transition group-hover:from-[#f6d88b]" />
                  </>
                );
                const className =
                  "group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-white/78 transition hover:bg-[#d4a94b]/12 hover:text-[#f9dfac]";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={className}
                  >
                    {content}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
