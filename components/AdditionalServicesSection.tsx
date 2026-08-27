"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Language } from "@/types/language";

type AdditionalServicesSectionProps = {
  language: Language;
  isJobsOpen: boolean;
  onOpenJobs: () => void;
  onCloseJobs: () => void;
};

function CarIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M9 28.5 12.8 18a5 5 0 0 1 4.7-3.3h13a5 5 0 0 1 4.7 3.3L39 28.5" />
      <path d="M7.5 27.5h33v9h-33zM12 36.5v3M36 36.5v3M13 27.5l3.2-7.8h15.6l3.2 7.8" />
      <circle cx="14" cy="32" r="1.5" />
      <circle cx="34" cy="32" r="1.5" />
      <path d="M20 32h8" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 18.5h32v20H8z" />
      <path d="M18 18.5v-4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4M8 27.5c10.5 5 21.5 5 32 0" />
      <path d="M22 29h4v5h-4z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function AdditionalServicesSection({
  language,
  isJobsOpen,
  onOpenJobs,
  onCloseJobs,
}: AdditionalServicesSectionProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isJobsOpen) {
      return;
    }

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseJobs();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [isJobsOpen, onCloseJobs]);

  return (
    <>
      <section className="additional-services" aria-labelledby="additional-services-title">
        <h2 id="additional-services-title" className="sr-only">
          {language === "de" ? "Weitere Angebote" : "Additional services"}
        </h2>
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          <Link id="car-rental" href="/autovermietung" className="service-tile group">
            <span className="service-tile-glow" aria-hidden="true" />
            <span className="service-tile-icon">
              <CarIcon />
            </span>
            <span className="service-tile-content">
              <span className="service-tile-kicker">
                {language === "de" ? "PREMIUM MOBILITÄT" : "PREMIUM MOBILITY"}
              </span>
              <span className="service-tile-title">
                {language === "de" ? "Autovermietung" : "Car Rental"}
              </span>
              <span className="service-tile-copy">
                {language === "de"
                  ? "Premiumfahrzeuge für Ihre individuellen Pläne."
                  : "Premium vehicles for your individual plans."}
              </span>
            </span>
            <span className="service-tile-arrow">
              <ArrowIcon />
            </span>
          </Link>

          <button id="jobs" type="button" onClick={onOpenJobs} className="service-tile group text-left">
            <span className="service-tile-glow" aria-hidden="true" />
            <span className="service-tile-icon">
              <BriefcaseIcon />
            </span>
            <span className="service-tile-content">
              <span className="service-tile-kicker">
                {language === "de" ? "WERDEN SIE TEIL DES TEAMS" : "JOIN OUR TEAM"}
              </span>
              <span className="service-tile-title">{language === "de" ? "Jobs" : "Careers"}</span>
              <span className="service-tile-copy">
                {language === "de"
                  ? "Entdecken Sie Ihre Karrierechance bei Prime Lane."
                  : "Discover your career opportunity at Prime Lane."}
              </span>
            </span>
            <span className="service-tile-arrow">
              <ArrowIcon />
            </span>
          </button>
        </div>
      </section>

      {isJobsOpen ? (
        <div className="jobs-modal-backdrop" onMouseDown={onCloseJobs}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="jobs-modal-title"
            className="jobs-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="jobs-modal-orbit" aria-hidden="true" />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onCloseJobs}
              className="jobs-modal-close"
              aria-label={language === "de" ? "Fenster schließen" : "Close dialog"}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
            <span className="service-tile-icon jobs-modal-icon">
              <BriefcaseIcon />
            </span>
            <p className="eyebrow">{language === "de" ? "KARRIERE" : "CAREERS"}</p>
            <h2 id="jobs-modal-title" className="section-title">
              {language === "de" ? (
                <>
                  Arbeiten Sie mit <span className="gold-text">uns</span>
                </>
              ) : (
                <>
                  Work with <span className="gold-text">us</span>
                </>
              )}
            </h2>
            <p className="jobs-modal-copy">
              {language === "de"
                ? "Wir stellen disziplinierte, selbstständige und verantwortungsbewusste Personen ein."
                : "We are hiring disciplined, independent, and responsible people."}
            </p>
            <p className="jobs-modal-contact">
              {language === "de" ? "Weitere Informationen:" : "More information:"}{" "}
              <a href="mailto:Primelaneswiss@gmail.com">Primelaneswiss@gmail.com</a>
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
