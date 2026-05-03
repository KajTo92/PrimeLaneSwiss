import Image from "next/image";
import { Language } from "@/types/language";

type FooterProps = {
  language: Language;
};

export function Footer({ language }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-black/50">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-white/60 sm:px-6 lg:px-8">
        <div className="flex flex-col items-end gap-3 text-right">
          <p className="text-white/85">
            <span className="gold-text">Prime Lane</span> GmbH - Swiss
          </p>
          <p>{language === "de" ? "Standort: Schweiz" : "Location: Switzerland"}</p>
          <p>Email: Primelaneswiss@gmail.com</p>
          <p>Phone: +41 77 203 76 43</p>
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
  );
}
