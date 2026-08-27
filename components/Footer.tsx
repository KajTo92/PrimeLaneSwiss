"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Language } from "@/types/language";

type FooterProps = {
  language: Language;
};

export function Footer({ language }: FooterProps) {
  const [openLegalTab, setOpenLegalTab] = useState<"privacy" | "imprint" | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!openLegalTab) {
      return;
    }

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenLegalTab(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [openLegalTab]);

  const legalTitle =
    openLegalTab === "privacy"
      ? language === "de"
        ? "Datenschutz"
        : "Privacy Policy"
      : language === "de"
        ? "Impressum"
        : "Legal Notice";

  return (
    <>
      <footer className="border-t border-white/10 bg-black/50">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-white/60 sm:px-6 lg:px-8">
          <div className="flex flex-col items-end gap-3 text-right">
            <p className="text-white/85">
              <span className="gold-text">Prime Lane</span> GmbH - Swiss
            </p>
            <p>{language === "de" ? "Standort: Schweiz" : "Location: Switzerland"}</p>
            <p>Email: Primelaneswiss@gmail.com</p>
            <p>Phone: +41 77 203 76 43</p>
            <div className="footer-legal-links">
              <button type="button" onClick={() => setOpenLegalTab("privacy")}>
                {language === "de" ? "Datenschutz" : "Privacy Policy"}
              </button>
              <button type="button" onClick={() => setOpenLegalTab("imprint")}>
                {language === "de" ? "Impressum" : "Legal Notice"}
              </button>
            </div>
          </div>
          <a
            href="http://spacecode.ch/"
            target="_blank"
            rel="noreferrer"
            className="spacecode-credit"
            aria-label="Made by SpaceCode"
          >
            <span>Made by</span>
            <Image src="/media/spacecode.png" alt="SpaceCode" width={158} height={46} className="spacecode-logo-image" />
          </a>
        </div>
      </footer>

      {openLegalTab ? (
        <div className="jobs-modal-backdrop" onMouseDown={() => setOpenLegalTab(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
            className="jobs-modal legal-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="jobs-modal-orbit" aria-hidden="true" />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpenLegalTab(null)}
              className="jobs-modal-close"
              aria-label={language === "de" ? "Fenster schließen" : "Close dialog"}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
            <p className="eyebrow">PRIME LANE SWISS</p>
            <h2 id="legal-modal-title" className="section-title gold-text">
              {legalTitle}
            </h2>
          </div>
        </div>
      ) : null}
    </>
  );
}
