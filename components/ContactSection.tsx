import { Language } from "@/types/language";

type ContactSectionProps = {
  language: Language;
};

export function ContactSection({ language }: ContactSectionProps) {
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

        <form className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="field-label">
            {language === "de" ? "Name" : "Name"}
            <input className="field-input" type="text" placeholder="Max Muster" />
          </label>
          <label className="field-label">
            {language === "de" ? "E-Mail" : "Email"}
            <input className="field-input" type="email" placeholder="name@example.com" />
          </label>
          <label className="field-label sm:col-span-2">
            {language === "de" ? "Nachricht" : "Message"}
            <textarea
              className="field-input min-h-36 resize-none"
              placeholder={language === "de" ? "Ihre Anfrage..." : "Your message..."}
            />
          </label>
          <div className="sm:col-span-2">
            <button type="button" className="btn-premium">
              {language === "de" ? "Nachricht senden" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
