"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Language } from "@/types/language";
import aurisImage from "@/Media/vermietung/auris.png";
import aurisCollage from "@/Media/vermietung/kolazauris.jpg";

const WHATSAPP_NUMBER = "41772037643";
const INQUIRY_EMAIL = "Primelaneswiss@gmail.com";

function MessageIcon() {
  return (
    <svg className="spdrive-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.2 9.2 0 0 1-3.8-.9L3 21l1.8-5a8.5 8.5 0 1 1 16.2-4.5Z" />
      <path d="M8.5 9.5c.7 2.2 1.8 3.3 4 4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="spdrive-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 5h18v14H3z" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
    </svg>
  );
}

export function CarRentalPage() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "de";
    }
    return window.localStorage.getItem("site-language") === "en" ? "en" : "de";
  });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const closeGalleryButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!isGalleryOpen) {
      return;
    }

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeGalleryButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsGalleryOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [isGalleryOpen]);

  const switchLanguage = (value: Language) => {
    setLanguage(value);
    window.localStorage.setItem("site-language", value);
    document.documentElement.lang = value;
  };

  const inquiryMessage =
    language === "de"
      ? "Hallo Prime Lane, ich möchte die Autovermietung anfragen.\n\nFahrzeug: Toyota Auris Hybrid\nPreis: 1'199 CHF / Monat\nKilometer: Unbegrenzt\nMindestmietdauer: 1 Monat\n\nBitte senden Sie mir weitere Informationen zur Verfügbarkeit."
      : "Hello Prime Lane, I would like to inquire about the car rental.\n\nVehicle: Toyota Auris Hybrid\nPrice: CHF 1,199 / month\nMileage: Unlimited\nMinimum rental period: 1 month\n\nPlease send me more information about availability.";

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(inquiryMessage)}`,
      "_blank",
      "noopener",
    );
  };

  const openEmail = () => {
    const subject = encodeURIComponent(
      language === "de" ? "Anfrage zur Autovermietung – Toyota Auris" : "Car rental inquiry – Toyota Auris",
    );
    window.location.href = `mailto:${INQUIRY_EMAIL}?subject=${subject}&body=${encodeURIComponent(inquiryMessage)}`;
  };

  return (
    <main className="rental-page min-h-screen bg-[#050506] text-white">
      <SiteHeader language={language} onLanguageChange={switchLanguage} />

      <section className="rental-page-hero section-shell">
        <div className="rental-page-card mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-[0_0_80px_rgba(255,255,255,0.04)] sm:p-10 lg:p-12">
          <div className="rental-page-heading">
            <div className="rental-page-icon" aria-hidden="true">
              <svg viewBox="0 0 48 48">
                <path d="M9 28.5 12.8 18a5 5 0 0 1 4.7-3.3h13a5 5 0 0 1 4.7 3.3L39 28.5" />
                <path d="M7.5 27.5h33v9h-33zM12 36.5v3M36 36.5v3M13 27.5l3.2-7.8h15.6l3.2 7.8" />
                <circle cx="14" cy="32" r="1.5" />
                <circle cx="34" cy="32" r="1.5" />
                <path d="M20 32h8" />
              </svg>
            </div>
            <div>
              <p className="eyebrow">{language === "de" ? "AUTOVERMIETUNG" : "CAR RENTAL"}</p>
              <h1 className="section-title rental-page-title">
                Toyota Auris <span className="gold-text">Hybrid</span>
              </h1>
              <p className="section-copy rental-page-intro">
                {language === "de"
                  ? "Komfortabel, sparsam und bereit für jeden Weg."
                  : "Comfortable, efficient, and ready for every journey."}
              </p>
            </div>
          </div>

          <div className="rental-offer-grid">
            <div className="rental-car-column">
              <div className="rental-car-stage">
                <span className="rental-car-halo" aria-hidden="true" />
                <Image
                  src={aurisImage}
                  alt={language === "de" ? "Schwarzer Toyota Auris Hybrid" : "Black Toyota Auris Hybrid"}
                  className="rental-car-image"
                  sizes="(max-width: 900px) 90vw, 680px"
                  priority
                />
                <span className="rental-car-shadow" aria-hidden="true" />
              </div>

              <div className="rental-details">
                <div className="rental-price-block">
                  <span>{language === "de" ? "PREIS" : "PRICE"}</span>
                  <strong>
                    {language === "de" ? "1'199 CHF" : "CHF 1,199"}
                    <small> / {language === "de" ? "Monat" : "month"}</small>
                  </strong>
                </div>
                <div className="rental-condition-grid">
                  <div className="rental-condition">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 17a8 8 0 1 1 16 0M12 9v5l3 2M4 17h16" />
                    </svg>
                    <span>
                      <strong>{language === "de" ? "Unbegrenzte Kilometer" : "Unlimited mileage"}</strong>
                      <small>{language === "de" ? "Fahren ohne Kilometerlimit" : "Drive without a mileage limit"}</small>
                    </span>
                  </div>
                  <div className="rental-condition">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 4h14v16H5zM8 2v4M16 2v4M5 9h14" />
                      <path d="M9 13h2v2H9z" />
                    </svg>
                    <span>
                      <strong>{language === "de" ? "Mindestens 1 Monat" : "Minimum 1 month"}</strong>
                      <small>{language === "de" ? "Mindestmietdauer" : "Minimum rental period"}</small>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="rental-collage-button group"
              onClick={() => setIsGalleryOpen(true)}
              aria-label={language === "de" ? "Fotogalerie vergrößern" : "Enlarge photo gallery"}
            >
              <Image
                src={aurisCollage}
                alt={language === "de" ? "Fotogalerie des Toyota Auris" : "Toyota Auris photo gallery"}
                className="rental-collage-image"
                sizes="(max-width: 900px) 90vw, 330px"
              />
              <span className="rental-collage-overlay" />
              <span className="rental-collage-label">
                <ExpandIcon />
                {language === "de" ? "Bilder ansehen" : "View photos"}
              </span>
            </button>
          </div>

          <div id="rental-inquiry" className="rental-inquiry-panel">
            <div className="spdrive-selected-vehicle rental-selected-vehicle">
              <span />
              {language === "de" ? "Gewählt" : "Selected"}: Toyota Auris Hybrid
            </div>
            <p>
              {language === "de"
                ? "Senden Sie uns eine unverbindliche Anfrage zur Verfügbarkeit."
                : "Send us a non-binding inquiry about availability."}
            </p>
            <div className="rental-inquiry-actions">
              <button className="spdrive-whatsapp-button" type="button" onClick={openWhatsApp}>
                <MessageIcon />
                <span>{language === "de" ? "Anfrage per WhatsApp senden" : "Send inquiry on WhatsApp"}</span>
              </button>
              <button className="spdrive-email-button" type="button" onClick={openEmail}>
                <MailIcon />
                <span>{language === "de" ? "Anfrage per E-Mail senden" : "Send inquiry per mail"}</span>
              </button>
            </div>
          </div>

          <Link href="/" className="rental-back-link">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14 6-6 6 6 6M8 12h11" />
            </svg>
            {language === "de" ? "Zurück zur Startseite" : "Back to home"}
          </Link>
        </div>
      </section>

      {isGalleryOpen ? (
        <div className="rental-gallery-backdrop" onMouseDown={() => setIsGalleryOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={language === "de" ? "Große Fotogalerie" : "Large photo gallery"}
            className="rental-gallery-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              ref={closeGalleryButtonRef}
              type="button"
              className="rental-gallery-close"
              onClick={() => setIsGalleryOpen(false)}
              aria-label={language === "de" ? "Galerie schließen" : "Close gallery"}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
            <Image
              src={aurisCollage}
              alt={language === "de" ? "Große Fotogalerie des Toyota Auris" : "Large Toyota Auris photo gallery"}
              className="rental-gallery-full-image"
              sizes="(max-width: 700px) 94vw, 620px"
              priority
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
