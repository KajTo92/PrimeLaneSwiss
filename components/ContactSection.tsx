"use client";

import { FormEvent, useState } from "react";
import { Language } from "@/types/language";

type ContactSectionProps = {
  language: Language;
};

export function ContactSection({ language }: ContactSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusMessage(
        language === "de"
          ? "Bitte alle Felder ausfullen."
          : "Please fill in all fields."
      );
      return;
    }

    setStatusMessage(language === "de" ? "Nachricht wird gesendet..." : "Sending message...");

    const formData = new FormData();
    formData.append("access_key", "e549531d-071d-4fb4-b851-ca1854aa3802");
    formData.append("subject", "Neue Kontaktanfrage - Swiss Prime Lane");
    formData.append("from_name", "Swiss Prime Lane Website");
    formData.append("name", name);
    formData.append("email", email);
    formData.append("Name", name);
    formData.append("E-Mail", email);
    formData.append("Nachricht", message);
    formData.append("message", `Neue Kontaktanfrage\n\nName: ${name}\nE-Mail: ${email}\nNachricht: ${message}`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { success?: boolean };

      if (!response.ok || !data.success) {
        setStatusMessage(
          language === "de"
            ? "Nachricht konnte nicht gesendet werden. Bitte erneut versuchen."
            : "Message could not be sent. Please try again."
        );
        return;
      }

      setName("");
      setEmail("");
      setMessage("");
      setStatusMessage(
        language === "de"
          ? "Vielen Dank. Ihre Nachricht wurde gesendet."
          : "Thank you. Your message has been sent."
      );
    } catch {
      setStatusMessage(
        language === "de"
          ? "Nachricht konnte nicht gesendet werden. Bitte erneut versuchen."
          : "Message could not be sent. Please try again."
      );
    }
  };

  return (
    <section id="contact" className="section-shell">
      <div className="mx-auto max-w-5xl rounded-3xl border border-white/12 bg-white/[0.03] p-8 sm:p-10">
        <p className="eyebrow">{language === "de" ? "KONTAKT" : "CONTACT"}</p>
        <h2 className="section-title">
          {language === "de" ? (
            <>
              Lass uns deine <span className="gold-text">nachste Fahrt</span> organisieren
            </>
          ) : (
            <>
              Let us organize your <span className="gold-text">next ride</span>
            </>
          )}
        </h2>

        <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="field-label">
            {language === "de" ? "Name" : "Name"}
            <input
              className="field-input"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Max Muster"
              required
            />
          </label>
          <label className="field-label">
            {language === "de" ? "E-Mail" : "Email"}
            <input
              className="field-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
            />
          </label>
          <label className="field-label sm:col-span-2">
            {language === "de" ? "Nachricht" : "Message"}
            <textarea
              className="field-input min-h-36 resize-none"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={language === "de" ? "Ihre Anfrage..." : "Your message..."}
              required
            />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-premium">
              {language === "de" ? "Nachricht senden" : "Submit"}
            </button>
            {statusMessage ? <p className="mt-3 text-sm text-white/75">{statusMessage}</p> : null}
          </div>
        </form>
      </div>

      <a
        id="partners"
        href="https://www.google.com/maps/search/?api=1&query=T%20Plus%20Service%2C%20Mattenstrasse%2011%2C%205734%20Reinach%2C%20Switzerland"
        target="_blank"
        rel="noreferrer"
        className="partner-tile group mx-auto mt-6 max-w-3xl"
        aria-label={`${language === "de" ? "Partner" : "Partner"}: T Plus Service`}
      >
        <span className="service-tile-glow" aria-hidden="true" />
        <span className="service-tile-icon partner-tile-icon">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M18.2 20.2 23 15.4a5.2 5.2 0 0 1 7.4 0l2.2 2.2" />
            <path d="m29.8 27.8-4.8 4.8a5.2 5.2 0 0 1-7.4 0l-2.2-2.2" />
            <path d="m20.8 27.2 6.4-6.4M12 16l-4 4 8.5 8.5 4-4M36 32l4-4-8.5-8.5-4 4" />
          </svg>
        </span>
        <span className="service-tile-content">
          <span className="service-tile-kicker">{language === "de" ? "UNSER PARTNER" : "OUR PARTNER"}</span>
          <span className="service-tile-title">T Plus Service</span>
          <span className="partner-address">
            Mattenstrasse 11
            <br />
            5734 Reinach
          </span>
        </span>
        <span className="service-tile-arrow">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 5h5v5M19 5l-9 9M19 14v5H5V5h5" />
          </svg>
        </span>
      </a>
    </section>
  );
}
