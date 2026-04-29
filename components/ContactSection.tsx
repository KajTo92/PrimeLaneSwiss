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
    </section>
  );
}
