import { Language } from "@/types/language";

type FooterProps = {
  language: Language;
};

export function Footer({ language }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-black/50">
      <div className="mx-auto flex max-w-7xl flex-col items-end gap-3 px-4 py-8 text-right text-sm text-white/60 sm:px-6 lg:px-8">
        <p className="text-white/85">
           <span className="gold-text">Prime Lane</span> GmbH - Swiss
        </p>
        <p>{language === "de" ? "Standort: Schweiz" : "Location: Switzerland"}</p>
        <p>Email: Primelaneswiss@gmail.com 
        </p>
        <p>Phone: +41 77 203 76 43</p>
      </div>
    </footer>
  );
}
