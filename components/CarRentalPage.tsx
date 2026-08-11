"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Language } from "@/types/language";
import aurisImage from "@/Media/vermietung/auris.png";
import aurisCollage from "@/Media/vermietung/kolazauris.jpg";
import priusImage from "@/Media/vermietung/prius.png";
import peugeotBoxerImage from "@/Media/vermietung/peugeotboxer.png";
import teslaModelSImage from "@/Media/vermietung/teslas.png";
import teslaModelSCollage from "@/Media/vermietung/kolazteslas.jpg";

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

function ConditionIcon({ type }: { type: "clock" | "calendar" | "charging" | "deposit" }) {
  if (type === "deposit") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16v12H4zM4 10h16M16 14h4" />
        <path d="M7 7V5h10v2" />
      </svg>
    );
  }

  if (type === "charging") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 2 6 13h6l-1 9 7-12h-6l1-8Z" />
      </svg>
    );
  }

  if (type === "calendar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4h14v16H5zM8 2v4M16 2v4M5 9h14" />
        <path d="M9 13h2v2H9z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 17a8 8 0 1 1 16 0M12 9v5l3 2M4 17h16" />
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
  const [galleryCarId, setGalleryCarId] = useState<string | null>(null);
  const [selectedCarId, setSelectedCarId] = useState("toyota-auris");
  const closeGalleryButtonRef = useRef<HTMLButtonElement | null>(null);

  const rentalCars = [
    {
      id: "toyota-auris",
      brand: "Toyota Auris",
      model: "Hybrid",
      name: "Toyota Auris Hybrid",
      image: aurisImage,
      galleryImage: aurisCollage,
      usesPlaceholderGallery: false,
      intro:
        language === "de"
          ? "Komfortabel, sparsam und bereit für jeden Weg."
          : "Comfortable, efficient, and ready for every journey.",
      imageAlt: language === "de" ? "Schwarzer Toyota Auris Hybrid" : "Black Toyota Auris Hybrid",
      price: language === "de" ? "1'199 CHF" : "CHF 1,199",
      priceSuffix: language === "de" ? "Monat" : "month",
      conditions: [
        {
          type: "clock" as const,
          title: language === "de" ? "Unbegrenzte Kilometer" : "Unlimited mileage",
          description:
            language === "de" ? "Fahren ohne Kilometerlimit" : "Drive without a mileage limit",
        },
        {
          type: "calendar" as const,
          title: language === "de" ? "Mindestens 1 Monat" : "Minimum 1 month",
          description: language === "de" ? "Mindestmietdauer" : "Minimum rental period",
        },
        {
          type: "deposit" as const,
          title: language === "de" ? "Kaution – 1'000 CHF" : "Deposit – CHF 1,000",
          description: language === "de" ? "Rückzahlbare Kaution" : "Refundable deposit",
        },
      ],
      inquiryDetails:
        language === "de"
          ? "Preis: 1'199 CHF / Monat\nKaution: 1'000 CHF\nKilometer: Unbegrenzt\nMindestmietdauer: 1 Monat"
          : "Price: CHF 1,199 / month\nDeposit: CHF 1,000\nMileage: Unlimited\nMinimum rental period: 1 month",
    },
    {
      id: "toyota-prius-plus",
      brand: "Toyota Prius",
      model: "Plus",
      name: "Toyota Prius Plus",
      image: priusImage,
      galleryImage: priusImage,
      usesPlaceholderGallery: true,
      intro:
        language === "de"
          ? "Geräumiger Hybrid für komfortable und sparsame Fahrten."
          : "A spacious hybrid for comfortable and efficient journeys.",
      imageAlt: language === "de" ? "Weißer Toyota Prius Plus" : "White Toyota Prius Plus",
      price: language === "de" ? "1'099 CHF" : "CHF 1,099",
      priceSuffix: language === "de" ? "Monat" : "month",
      conditions: [
        {
          type: "clock" as const,
          title: language === "de" ? "Unbegrenzte Kilometer" : "Unlimited mileage",
          description:
            language === "de" ? "Fahren ohne Kilometerlimit" : "Drive without a mileage limit",
        },
        {
          type: "calendar" as const,
          title: language === "de" ? "Mindestens 1 Monat" : "Minimum 1 month",
          description: language === "de" ? "Mindestmietdauer" : "Minimum rental period",
        },
        {
          type: "deposit" as const,
          title: language === "de" ? "Kaution – 1'000 CHF" : "Deposit – CHF 1,000",
          description: language === "de" ? "Rückzahlbare Kaution" : "Refundable deposit",
        },
      ],
      inquiryDetails:
        language === "de"
          ? "Preis: 1'099 CHF / Monat\nKaution: 1'000 CHF\nKilometer: Unbegrenzt\nMindestmietdauer: 1 Monat"
          : "Price: CHF 1,099 / month\nDeposit: CHF 1,000\nMileage: Unlimited\nMinimum rental period: 1 month",
    },
    {
      id: "tesla-model-s",
      brand: "Tesla",
      model: "Model S",
      name: "Tesla Model S",
      image: teslaModelSImage,
      galleryImage: teslaModelSCollage,
      usesPlaceholderGallery: false,
      intro:
        language === "de"
          ? "Elektrische Premium-Mobilität mit kostenlosem Laden."
          : "Premium electric mobility with free charging.",
      imageAlt: language === "de" ? "Tesla Model S zur Miete" : "Tesla Model S for rent",
      price: language === "de" ? "1'999 CHF" : "CHF 1,999",
      priceSuffix: language === "de" ? "Monat" : "month",
      conditions: [
        {
          type: "charging" as const,
          title: language === "de" ? "Kostenloses Laden" : "Free charging",
          description:
            language === "de" ? "Im monatlichen Mietpreis enthalten" : "Included in the monthly rental price",
        },
        {
          type: "calendar" as const,
          title: language === "de" ? "Monatliche Miete" : "Monthly rental",
          description: language === "de" ? "Klarer Monatspreis" : "Clear monthly price",
        },
        {
          type: "deposit" as const,
          title: language === "de" ? "Kaution – 2'000 CHF" : "Deposit – CHF 2,000",
          description: language === "de" ? "Rückzahlbare Kaution" : "Refundable deposit",
        },
      ],
      inquiryDetails:
        language === "de"
          ? "Preis: 1'999 CHF / Monat\nKaution: 2'000 CHF\nLaden: Kostenlos"
          : "Price: CHF 1,999 / month\nDeposit: CHF 2,000\nCharging: Free",
    },
    {
      id: "peugeot-boxer",
      brand: "Peugeot",
      model: "Boxer",
      name: "Peugeot Boxer",
      image: peugeotBoxerImage,
      galleryImage: peugeotBoxerImage,
      usesPlaceholderGallery: true,
      intro:
        language === "de"
          ? "Viel Platz und flexible Mietzeiten für Ihren Transport."
          : "Plenty of space and flexible rental times for your transport.",
      imageAlt: language === "de" ? "Peugeot Boxer zur Miete" : "Peugeot Boxer for rent",
      price: "80 CHF",
      priceSuffix: language === "de" ? "6 Stunden" : "6 hours",
      conditions: [
        {
          type: "clock" as const,
          title: language === "de" ? "Halber Tag – 80 CHF" : "Half day – CHF 80",
          description: language === "de" ? "6 Stunden" : "6 hours",
        },
        {
          type: "clock" as const,
          title: language === "de" ? "Ganzer Tag – 120 CHF" : "Full day – CHF 120",
          description: language === "de" ? "12 Stunden" : "12 hours",
        },
        {
          type: "deposit" as const,
          title: language === "de" ? "Kaution – 100 CHF" : "Deposit – CHF 100",
          description: language === "de" ? "Rückzahlbare Kaution" : "Refundable deposit",
        },
      ],
      inquiryDetails:
        language === "de"
          ? "Halber Tag (6 Stunden): 80 CHF\nGanzer Tag (12 Stunden): 120 CHF\nKaution: 100 CHF"
          : "Half day (6 hours): CHF 80\nFull day (12 hours): CHF 120\nDeposit: CHF 100",
    },
  ];

  const selectedCar = rentalCars.find((car) => car.id === selectedCarId) ?? rentalCars[0];
  const galleryCar = rentalCars.find((car) => car.id === galleryCarId);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!galleryCarId) {
      return;
    }

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeGalleryButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setGalleryCarId(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [galleryCarId]);

  const switchLanguage = (value: Language) => {
    setLanguage(value);
    window.localStorage.setItem("site-language", value);
    document.documentElement.lang = value;
  };

  const inquiryMessage =
    language === "de"
      ? `Hallo Prime Lane, ich möchte die Autovermietung anfragen.\n\nFahrzeug: ${selectedCar.name}\n${selectedCar.inquiryDetails}\n\nBitte senden Sie mir weitere Informationen zur Verfügbarkeit.`
      : `Hello Prime Lane, I would like to inquire about the car rental.\n\nVehicle: ${selectedCar.name}\n${selectedCar.inquiryDetails}\n\nPlease send me more information about availability.`;

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(inquiryMessage)}`,
      "_blank",
      "noopener",
    );
  };

  const openEmail = () => {
    const subject = encodeURIComponent(
      language === "de"
        ? `Anfrage zur Autovermietung – ${selectedCar.name}`
        : `Car rental inquiry – ${selectedCar.name}`,
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
                {language === "de" ? (
                  <>
                    Fahrzeuge für <span className="gold-text">jeden Bedarf</span>
                  </>
                ) : (
                  <>
                    Vehicles for <span className="gold-text">every need</span>
                  </>
                )}
              </h1>
              <p className="section-copy rental-page-intro">
                {language === "de"
                  ? "Wählen Sie das passende Fahrzeug und senden Sie uns Ihre Anfrage."
                  : "Choose the right vehicle and send us your inquiry."}
              </p>
            </div>
          </div>

          <div className="rental-vehicle-list">
            {rentalCars.map((car, index) => (
              <article key={car.id} id={car.id} className="rental-vehicle-offer">
                <div className="rental-vehicle-heading">
                  <p className="eyebrow">{language === "de" ? "MIETFAHRZEUG" : "RENTAL VEHICLE"}</p>
                  <h2 className="section-title rental-vehicle-title">
                    {car.brand} <span className="gold-text">{car.model}</span>
                  </h2>
                  <p className="section-copy rental-page-intro">{car.intro}</p>
                </div>

                <div className="rental-offer-grid">
                  <div className="rental-car-column">
                    <div className="rental-car-stage">
                      <span className="rental-car-halo" aria-hidden="true" />
                      <Image
                        src={car.image}
                        alt={car.imageAlt}
                        className="rental-car-image"
                        sizes="(max-width: 900px) 90vw, 680px"
                        priority={index === 0}
                      />
                      <span className="rental-car-shadow" aria-hidden="true" />
                    </div>

                    <div className="rental-details">
                      <div className="rental-price-block">
                        <span>{language === "de" ? "PREIS" : "PRICE"}</span>
                        <strong>
                          {car.price}
                          <small> / {car.priceSuffix}</small>
                        </strong>
                      </div>
                      <div className="rental-condition-grid">
                        {car.conditions.map((condition) => (
                          <div key={`${condition.title}-${condition.description}`} className="rental-condition">
                            <ConditionIcon type={condition.type} />
                            <span>
                              <strong>{condition.title}</strong>
                              <small>{condition.description}</small>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`rental-collage-button group${car.usesPlaceholderGallery ? " is-placeholder" : ""}`}
                    onClick={() => setGalleryCarId(car.id)}
                    aria-label={
                      language === "de"
                        ? `Fotogalerie des ${car.name} vergrößern`
                        : `Enlarge ${car.name} photo gallery`
                    }
                  >
                    <Image
                      src={car.galleryImage}
                      alt={language === "de" ? `Fotogalerie des ${car.name}` : `${car.name} photo gallery`}
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
              </article>
            ))}
          </div>

          <div id="rental-inquiry" className="rental-inquiry-panel">
            <div className="rental-vehicle-picker" role="group" aria-label={language === "de" ? "Fahrzeug auswählen" : "Select vehicle"}>
              <p>{language === "de" ? "Fahrzeug auswählen" : "Select vehicle"}</p>
              <div className="rental-vehicle-picker-grid">
                {rentalCars.map((car) => (
                  <button
                    key={car.id}
                    type="button"
                    className={`rental-vehicle-option${selectedCarId === car.id ? " is-active" : ""}`}
                    onClick={() => setSelectedCarId(car.id)}
                    aria-pressed={selectedCarId === car.id}
                  >
                    <span className="rental-vehicle-option-dot" />
                    <strong>{car.name}</strong>
                  </button>
                ))}
              </div>
            </div>
            <div className="spdrive-selected-vehicle rental-selected-vehicle">
              <span />
              {language === "de" ? "Gewählt" : "Selected"}: {selectedCar.name}
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

      {galleryCar ? (
        <div className="rental-gallery-backdrop" onMouseDown={() => setGalleryCarId(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={
              language === "de" ? `Große Fotogalerie des ${galleryCar.name}` : `Large ${galleryCar.name} photo gallery`
            }
            className="rental-gallery-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              ref={closeGalleryButtonRef}
              type="button"
              className="rental-gallery-close"
              onClick={() => setGalleryCarId(null)}
              aria-label={language === "de" ? "Galerie schließen" : "Close gallery"}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
            <Image
              src={galleryCar.galleryImage}
              alt={
                language === "de"
                  ? `Große Fotogalerie des ${galleryCar.name}`
                  : `Large ${galleryCar.name} photo gallery`
              }
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
