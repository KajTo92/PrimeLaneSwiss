"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Language } from "@/types/language";

const fleet = [
  {
    name: "Tesla Model X",
    de: "Luxurioses Elektro-SUV mit maximalem Komfort.",
    en: "Luxury electric SUV, premium comfort.",
    image:
      "/media/modelx.png",
    chauffeurs: [{ name: "Peter", avatar: "/media/szoferavatar1.png" }],
  },
  {
    name: "Tesla Model S",
    de: "Luxurioses Elektro-SUV mit maximalem Komfort.",
    en: "Luxury electric SUV, premium comfort.",
    image:
      "/media/teslas.jpg",
    chauffeurs: [{ name: "Martin", avatar: "/media/szoferavatar4.png" }],
  },
  {
    name: "Tesla Model Y",
    de: "Modern, effizient und komfortabel fur jede Strecke.",
    en: "Modern, efficient, and comfortable.",
    image:
      "/media/modely.png",
    chauffeurs: [{ name: "Jan", avatar: "/media/szoferavatar3.png" }],
  },
  {
    name: "Mercedes V-Class",
    de: "Maximum komfort und platz fur 7 personen.",
    en: "Maximum comfort and space for 7 people.",
    image:
      "/media/vclass.jpg",
    chauffeurs: [{ name: "Martin", avatar: "/media/szoferavatar4.png" }],
  },
  {
    name: "Toyota Prius Plus",
    de: "Zuverlassig und umweltfreundlich",
    en: "Reliable and eco-friendly",
    image:
      "/media/priusplus.png",
    chauffeurs: [
      { name: "Peter", avatar: "/media/szoferavatar1.png" },
      
    ],
  },
  {
    name: "Toyota Prius Plus Hybrid",
    de: "Zuverlassig und umweltfreundlich",
    en: "Reliable and eco-friendly",
    image:
      "/media/priusplus2.png",
    chauffeurs: [
      
      { name: "Gregor", avatar: "/media/szoferavatar2.png" },
    ],
  },
];

type FleetSectionProps = {
  language: Language;
};

export function FleetSection({ language }: FleetSectionProps) {
  return (
    <section id="fleet" className="section-shell">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow text-center">{language === "de" ? "UNSERE FLOTTE" : "OUR FLEET"}</p>
        <h2 className="section-title text-center">
          {language === "de" ? (
            <>
              Eleganz und <span className="gold-text">Effizienz</span> auf jeder Strecke
            </>
          ) : (
            <>
              Elegance and <span className="gold-text">Efficiency</span> on Every Route
            </>
          )}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {fleet.map((car, index) => (
            <motion.article
              key={car.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.15, duration: 0.65 }}
              whileHover={{ scale: 1.03, y: -6 }}
              className="group rounded-3xl border border-white/12 bg-white/[0.03] shadow-[0_0_20px_rgba(255,255,255,0.03)] transition-shadow hover:shadow-[0_0_36px_rgba(255,255,255,0.15)]"
            >
              <div className="relative">
                <div
                  className="h-52 rounded-t-3xl bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${car.image})` }}
                />

                <div className="absolute -top-7 right-4 flex items-start gap-2">
                  {car.chauffeurs.map((chauffeur, avatarIndex) => (
                    <div key={`${car.name}-chauffeur-${avatarIndex}`} className="flex flex-col items-center">
                      <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-amber-200/80 bg-black/25 shadow-[0_0_20px_rgba(251,191,36,0.35)]">
                        <Image
                          src={chauffeur.avatar}
                          alt={`${chauffeur.name} chauffeur`}
                          width={56}
                          height={56}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="mt-1 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-medium text-amber-100">
                        {chauffeur.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">
                  {car.name.includes("Tesla") ? <span className="gold-text">{car.name}</span> : car.name}
                </h3>
                <p className="mt-3 text-sm text-white/70">{language === "de" ? car.de : car.en}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
