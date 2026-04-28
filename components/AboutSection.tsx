import { Language } from "@/types/language";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";

type AboutSectionProps = {
  language: Language;
};

export function AboutSection({ language }: AboutSectionProps) {
  return (
    <section id="about" className="section-shell">
      <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_0_80px_rgba(255,255,255,0.04)] sm:p-12">
        <p className="eyebrow">{language === "de" ? "UBER UNS" : "ABOUT US"}</p>
        <h2 className="section-title">
          {language === "de" ? (
            <>
              Premium <span className="gold-text">Personentransport</span>
            </>
          ) : (
            <>
              Premium <span className="gold-text">Passenger Transport</span>
            </>
          )}
        </h2>
        <p className="section-copy max-w-3xl">
          {language === "de"
            ? "Wir sind spezialisiert auf sicheren und premium Personenverkehr in der gesamten Schweiz. Unsere Fahrer sind hochqualifizierte Profis und garantieren Komfort, Punktlichkeit und Diskretion. Wir bieten einen professionellen Transportdienst für Kinder von zu Hause zur Schule sowie zu verschiedenen Therapien an... Außerdem sind wir auf den Transport von Kindern mit besonderen Bedürfnissen zu Förderschulen sowie von allen anderen Kindern zu staatlichen und privaten Schulen spezialisiert."
            : "We specialize in safe and premium passenger transportation across Switzerland. Our drivers are highly qualified professionals ensuring comfort, punctuality, and discretion. We offer a professional transport service for children from home to school as well as to various therapies... We are also specialized in the transport of children with special needs to special schools as well as from all other children to state and private schools."}
        </p>

        <TestimonialsCarousel language={language} />
      </div>
    </section>
  );
}
