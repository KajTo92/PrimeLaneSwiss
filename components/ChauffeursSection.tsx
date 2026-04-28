"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Language } from "@/types/language";

const chauffeurs = [
  {
    name: "Peter",
    initials: "P",
    avatar: "/media/szoferavatar1.png",
    de: "Hervorragend im Stadtzentrum gelegen, auch bei starkem Verkehrsaufkommen. Langjähriger Erfahrung im Transport von Kindern, auch von Kindern mit Behinderung.",
    en: "Calm and reliable driver focused on discretion and passenger comfort.",
  },
  {
    name: "Gregor",
    initials: "G",
    avatar: "/media/szoferavatar2.png",
    de: "Ruhiger, zuverlassiger Fahrer mit starkem Fokus auf Diskretion und Komfort. Langjähriger Erfahrung im Transport von Kindern",
    en: "Experienced in long-distance transfers, always punctual and professional.",
  },
  {
    name: "Jan",
    initials: "J",
    avatar: "/media/szoferavatar3.png",
    de: "Premium-Service mit freundlichem Auftreten und hoher Sicherheitskultur.",
    en: "Premium service with a friendly approach and strong safety standards.",
  },
  {
    name: "Martin",
    initials: "M",
    avatar: "/media/szoferavatar4.png",
    de: "Premium-Service mit freundlichem Auftreten und hoher Sicherheitskultur.",
    en: "Premium service with a friendly approach and strong safety standards.",
  },
];

type ChauffeursSectionProps = {
  language: Language;
};

export function ChauffeursSection({ language }: ChauffeursSectionProps) {
  const [brokenAvatars, setBrokenAvatars] = useState<Record<string, boolean>>({});

  return (
    <section id="chauffeurs" className="section-shell pt-1">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow text-center">{language === "de" ? "UNSERE CHAUFFEURE" : "OUR CHAUFFEURS"}</p>
        <h2 className="section-title mx-auto mt-4 max-w-5xl text-center">
          {language === "de"
            ? "Wir bilden ein Team professioneller und qualifizierter Fahrer, das auf maximalen Komfort und Sicherheit fur Fahrgaste ausgerichtet ist. Wir alle verfugen uber umfangreiche Erfahrung im Personentransport und sind seit vielen Jahren in diesem Bereich tatig."
            : "We form a team of professional and highly qualified drivers focused on delivering maximum comfort and safety for passengers. All of us have extensive experience in passenger transport and have been working in this field for many years."}
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {chauffeurs.map((chauffeur, index) => (
            <motion.article
              key={chauffeur.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-white/12 bg-white/[0.03] p-6 text-center shadow-[0_0_24px_rgba(255,255,255,0.05)]"
            >
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-amber-200/45 bg-gradient-to-br from-amber-300/30 to-white/5 shadow-[0_0_24px_rgba(251,191,36,0.25)]">
                {brokenAvatars[chauffeur.name] ? (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-amber-100">
                    {chauffeur.initials}
                  </div>
                ) : (
                  <Image
                    src={chauffeur.avatar}
                    alt={`${chauffeur.name} portrait`}
                    width={96}
                    height={96}
                    unoptimized
                    className="h-full w-full object-cover"
                    onError={() =>
                      setBrokenAvatars((prev) => ({
                        ...prev,
                        [chauffeur.name]: true,
                      }))
                    }
                  />
                )}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{chauffeur.name}</h3>
              <p className="mt-2 text-sm text-white/72">{language === "de" ? chauffeur.de : chauffeur.en}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
