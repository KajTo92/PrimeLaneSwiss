"use client";

import Image from "next/image";
import { Language } from "@/types/language";

type PaymentSectionProps = {
  language: Language;
};

const iban = "CH240020720711395901A";

export function PaymentSection({ language }: PaymentSectionProps) {
  return (
    <section id="payments" className="section-shell">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 rounded-3xl border border-white/12 bg-white/[0.035] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div>
            <p className="eyebrow">{language === "de" ? "ZAHLUNG" : "PAYMENT"}</p>
            <h2 className="section-title">
              {language === "de" ? (
                <>
                  Bequeme <span className="gold-text">Zahlungsarten</span>
                </>
              ) : (
                <>
                  Convenient <span className="gold-text">payment options</span>
                </>
              )}
            </h2>
            <p className="section-copy">
              {language === "de"
                ? "Sie konnen Ihre Fahrt einfach per Karte, TWINT oder Bankuberweisung bezahlen."
                : "You can pay for your ride by card, TWINT, or bank transfer."}
            </p>

            <div className="mt-8 rounded-2xl border border-[#f6d88b]/28 bg-[#f6d88b]/[0.08] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f6d88b]">
                {language === "de" ? "Bankverbindung" : "Bank details"}
              </p>
              <p className="mt-4 text-sm text-white/58">UBS Bankverbindung</p>
              <p className="mt-2 break-all font-mono text-lg font-semibold tracking-[0.08em] text-white sm:text-xl">
                {iban}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-white/12 bg-black/28 p-5">
              <div className="flex min-h-20 items-center justify-center rounded-xl border border-white/10 bg-white p-4">
                <Image
                  src="/media/visamaster.png"
                  alt="Visa and Mastercard"
                  width={751}
                  height={251}
                  className="max-h-14 w-full object-contain"
                  loading="lazy"
                />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {language === "de" ? "Kreditkarte" : "Card payment"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/66">
                {language === "de"
                  ? "Zahlung mit Visa und Mastercard moglich."
                  : "Visa and Mastercard payments are accepted."}
              </p>
            </article>

            <article className="rounded-2xl border border-white/12 bg-black/28 p-5">
              <div className="flex min-h-20 items-center justify-center rounded-xl border border-white/10 bg-white p-4">
                <Image
                  src="/media/twint1.png"
                  alt="TWINT"
                  width={407}
                  height={132}
                  className="max-h-14 w-full object-contain"
                  loading="lazy"
                />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">TWINT</h3>
              <p className="mt-2 text-sm leading-6 text-white/66">
                {language === "de"
                  ? "Schnell und direkt per TWINT bezahlen."
                  : "Pay quickly and directly with TWINT."}
              </p>
            </article>

            <article className="rounded-2xl border border-[#f6d88b]/24 bg-black/34 p-5 sm:col-span-2">
              <div className="grid items-center gap-5 sm:grid-cols-[auto_1fr]">
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-2xl border border-white/12 bg-white p-3 sm:mx-0">
                  <Image
                    src="/media/Twintqr.png"
                    alt="TWINT QR payment code"
                    width={466}
                    height={470}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f6d88b]">
                    TWINT QR
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    {language === "de" ? "QR-Code scannen" : "Scan the QR code"}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/68">
                    {language === "de"
                      ? "Scannen Sie den Code mit der TWINT App, um die Zahlung direkt auszufuhren."
                      : "Scan the code with the TWINT app to complete the payment directly."}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
