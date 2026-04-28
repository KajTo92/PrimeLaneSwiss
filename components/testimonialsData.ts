import { Language } from "@/types/language";

export type Testimonial = {
  name: string;
  route: Record<Language, string>;
  text: Record<Language, string>;
};

export const testimonials: Testimonial[] = [
  {
    name: "Lukas M.",
    route: {
      de: "Flughafen Zurich -> Basel",
      en: "Zurich Airport -> Basel",
    },
    text: {
      de: "Ich habe einen Transfer vom Flughafen Zurich nach Basel gebucht und alles war perfekt organisiert. Der Fahrer war punktlich, das Fahrzeug makellos sauber und die Fahrt verlief ruhig, sicher und absolut stressfrei.",
      en: "I booked a transfer from Zurich Airport to Basel and everything was perfectly organized. The driver was punctual, the vehicle was spotless, and the journey was smooth, safe, and completely stress-free.",
    },
  },
  {
    name: "Emma R.",
    route: {
      de: "Genf -> Lausanne",
      en: "Geneva -> Lausanne",
    },
    text: {
      de: "Fur einen wichtigen Geschaftstermin brauchte ich einen zuverlassigen Fahrservice zwischen Genf und Lausanne. Swiss Prime Lane war bisher der beste Transportservice, den ich in der Schweiz gebucht habe.",
      en: "I needed a reliable chauffeur service from Geneva to Lausanne for an important business meeting. Swiss Prime Lane is the best transport company I have booked in Switzerland so far.",
    },
  },
  {
    name: "Daniela S.",
    route: {
      de: "Luzern -> Zurich HB",
      en: "Lucerne -> Zurich HB",
    },
    text: {
      de: "Die Fahrt von Luzern nach Zurich HB war hervorragend. Der Chauffeur fuhr sehr vorausschauend, half mit dem Gepack und sorgte dafur, dass ich entspannt und rechtzeitig am Bahnhof ankam.",
      en: "The transfer from Lucerne to Zurich HB was excellent. The chauffeur drove very smoothly, helped with the luggage, and made sure I arrived relaxed and on time.",
    },
  },
  {
    name: "Patrick W.",
    route: {
      de: "St. Gallen -> Flughafen Zurich",
      en: "St. Gallen -> Zurich Airport",
    },
    text: {
      de: "Fruhmorgendliche Abholung, freundlicher Kontakt und ein sehr angenehmes Fahrgefuhl. Man merkt sofort, dass Sicherheit, Diskretion und Service bei dieser Firma wirklich ernst genommen werden.",
      en: "Early morning pickup, friendly communication, and a very comfortable ride. You can tell immediately that safety, discretion, and service are taken seriously by this company.",
    },
  },
  {
    name: "Sophie K.",
    route: {
      de: "Bern -> Interlaken",
      en: "Bern -> Interlaken",
    },
    text: {
      de: "Wir haben den Service fur einen privaten Ausflug nach Interlaken genutzt und waren begeistert. Das Auto war elegant, der Fahrer professionell, und die gesamte Fahrt verlief absolut reibungslos.",
      en: "We used the service for a private trip to Interlaken and were impressed. The car was elegant, the driver was professional, and the entire journey was seamless.",
    },
  },
  {
    name: "Nadine F.",
    route: {
      de: "Zug -> Flughafen Basel",
      en: "Zug -> Basel Airport",
    },
    text: {
      de: "Ich buche selten zweimal denselben Fahrdienst, aber hier mache ich gern eine Ausnahme. Vom ersten Kontakt bis zur Ankunft am Flughafen Basel war alles professionell, freundlich und auf hohem Niveau.",
      en: "I rarely book the same transport service twice, but this company is an easy exception. From the first message to arrival at Basel Airport, everything felt professional, friendly, and premium.",
    },
  },
  {
    name: "Michael T.",
    route: {
      de: "Winterthur -> Zurich City",
      en: "Winterthur -> Zurich City",
    },
    text: {
      de: "Die Reservierung war unkompliziert, der Preis transparent und der Transfer nach Zurich City absolut zuverlassig. Fur mich ganz klar einer der hochwertigsten Fahrservices, die ich bisher genutzt habe.",
      en: "Booking was simple, pricing was transparent, and the transfer to Zurich City was absolutely reliable. For me, this is clearly one of the highest-quality chauffeur services I have used.",
    },
  },
];
