"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Language } from "@/types/language";

type BookingSectionProps = {
  language: Language;
};

type TranslationKey =
  | "eyebrow"
  | "headline"
  | "pickupLabel"
  | "pickupPlaceholder"
  | "destinationLabel"
  | "destinationPlaceholder"
  | "calculateButton"
  | "distance"
  | "duration"
  | "price"
  | "whatsappButton"
  | "emailButton"
  | "emailSubject"
  | "nameLabel"
  | "namePlaceholder"
  | "telephoneLabel"
  | "telephonePlaceholder"
  | "pickupScheduleLabel"
  | "pickupSchedulePlaceholder"
  | "pickupDateLabel"
  | "pickupTimeLabel"
  | "confirmSchedule"
  | "previousMonth"
  | "nextMonth"
  | "routeNote"
  | "calculating"
  | "calculated"
  | "geocodeError"
  | "missingRoute"
  | "notProvided"
  | "searchingPlaces"
  | "noPlaces"
  | "notCalculated"
  | "onRequest"
  | "selectVehicle"
  | "selectedVehicle"
  | "passengersLabel"
  | "passengersPlaceholder"
  | "luggageLabel"
  | "luggagePlaceholder"
  | "vehicleAvailabilityNote";

type PhotonFeature = {
  geometry: {
    coordinates: [number, number];
  };
  properties?: {
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    state?: string;
    country?: string;
    countrycode?: string;
  };
};

type RouteResult = {
  pickup: string;
  destination: string;
  distanceKm: number | null;
  durationSeconds: number | null;
};

type CarOption = {
  id: "tesla-s" | "tesla-x" | "tesla-y" | "mercedes-v-class" | "toyota-prius-plus";
  name: string;
  startFee: number;
  upTo20Rate: number;
  over20Rate: number;
};

type IconName = "map-pin" | "flag" | "route" | "swap" | "user" | "phone" | "message" | "mail" | "calendar" | "clock";

const WHATSAPP_NUMBER = "41772037643";
const INQUIRY_EMAIL = "Primelaneswiss@gmail.com";
const SHORT_DISTANCE_LIMIT_KM = 20;
const AUTOCOMPLETE_MIN_LENGTH = 2;
const AUTOCOMPLETE_DEBOUNCE_MS = 220;
const SUPPORTED_ROUTE_COUNTRIES = new Set(["CH", "DE", "AT", "IT", "FR", "LI"]);

const carOptions: CarOption[] = [
  { id: "tesla-s", name: "Tesla Model S", startFee: 7, upTo20Rate: 3, over20Rate: 2 },
  { id: "tesla-x", name: "Tesla Model X", startFee: 7, upTo20Rate: 3, over20Rate: 2 },
  { id: "tesla-y", name: "Tesla Model Y", startFee: 7, upTo20Rate: 2.5, over20Rate: 1.8 },
  { id: "mercedes-v-class", name: "Mercedes V-Class", startFee: 10, upTo20Rate: 3.4, over20Rate: 2.5 },
  { id: "toyota-prius-plus", name: "Toyota Prius Plus", startFee: 6, upTo20Rate: 2, over20Rate: 1.5 },
];

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    eyebrow: "Private transfers in Switzerland",
    headline: "Book your ride",
    pickupLabel: "Pickup location",
    pickupPlaceholder: "Zurich Airport",
    destinationLabel: "Destination",
    destinationPlaceholder: "St. Moritz",
    calculateButton: "Show route and price",
    distance: "Distance",
    duration: "Travel time",
    price: "Estimated price",
    whatsappButton: "Send inquiry on WhatsApp",
    emailButton: "Send inquiry per mail",
    emailSubject: "Prime Lane transfer inquiry",
    nameLabel: "Name",
    namePlaceholder: "John Smith",
    telephoneLabel: "Telephone number",
    telephonePlaceholder: "+41 79 123 45 67",
    pickupScheduleLabel: "Pickup date and time",
    pickupSchedulePlaceholder: "Select date and time",
    pickupDateLabel: "Pickup date",
    pickupTimeLabel: "Pickup time",
    confirmSchedule: "Confirm",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    routeNote: "Enter pickup and destination to calculate route.",
    calculating: "Calculating route...",
    calculated: "Estimated transfer price. Final quote will be confirmed by Swiss Prime Lane.",
    geocodeError: "Route distance could not be calculated. You can still send the inquiry.",
    missingRoute: "Please enter both pickup and destination.",
    notProvided: "Not provided",
    searchingPlaces: "Searching...",
    noPlaces: "No matching place found",
    notCalculated: "Not calculated",
    onRequest: "On request",
    selectVehicle: "Select vehicle",
    selectedVehicle: "Selected",
    passengersLabel: "Number of passengers",
    passengersPlaceholder: "2",
    luggageLabel: "Number of suitcases",
    luggagePlaceholder: "2",
    vehicleAvailabilityNote:
      "If the desired vehicle is not available at the requested time, we will offer you another vehicle and send you the adjusted price.",
  },
  de: {
    eyebrow: "Private Transfers in der Schweiz",
    headline: "Fahrt buchen",
    pickupLabel: "Abholort",
    pickupPlaceholder: "Flughafen Zurich",
    destinationLabel: "Zielort",
    destinationPlaceholder: "St. Moritz",
    calculateButton: "Route und Preis anzeigen",
    distance: "Distanz",
    duration: "Fahrzeit",
    price: "Geschatzter Preis",
    whatsappButton: "Anfrage per WhatsApp senden",
    emailButton: "Anfrage per E-Mail senden",
    emailSubject: "Prime Lane Transfer Anfrage",
    nameLabel: "Name",
    namePlaceholder: "Max Muster",
    telephoneLabel: "Telefonnummer",
    telephonePlaceholder: "+41 79 123 45 67",
    pickupScheduleLabel: "Abholdatum und Uhrzeit",
    pickupSchedulePlaceholder: "Datum und Uhrzeit auswahlen",
    pickupDateLabel: "Abholdatum",
    pickupTimeLabel: "Abholzeit",
    confirmSchedule: "Bestätigen",
    previousMonth: "Vorheriger Monat",
    nextMonth: "Nachster Monat",
    routeNote: "Geben Sie Abholort und Ziel ein, um die Route zu berechnen.",
    calculating: "Route wird berechnet...",
    calculated: "Geschatzter Transferpreis. Das finale Angebot wird von Swiss Prime Lane bestatigt.",
    geocodeError:
      "Die Routendistanz konnte nicht berechnet werden. Sie konnen die Anfrage trotzdem senden.",
    missingRoute: "Bitte geben Sie Abholort und Ziel ein.",
    notProvided: "Nicht angegeben",
    searchingPlaces: "Suche...",
    noPlaces: "Kein passender Ort gefunden",
    notCalculated: "Nicht berechnet",
    onRequest: "Auf Anfrage",
    selectVehicle: "Fahrzeug wahlen",
    selectedVehicle: "Gewahlt",
    passengersLabel: "Anzahl Personen",
    passengersPlaceholder: "2",
    luggageLabel: "Anzahl Gepackstucke",
    luggagePlaceholder: "2",
    vehicleAvailabilityNote:
      "Falls das gewunschte Fahrzeug im gewunschten Zeitraum nicht verfugbar ist, bieten wir Ihnen ein anderes Fahrzeug an und senden Ihnen den angepassten Preis zu.",
  },
};

const iconPaths: Record<IconName, string> = {
  "map-pin":
    "M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  flag: "M5 21V4m0 0h11l-1.5 4L16 12H5",
  route:
    "M4 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm16-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM7 16h3.5a3.5 3.5 0 0 0 0-7H13",
  swap: "M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4m4 4H4",
  user: "M20 21a8 8 0 0 0-16 0m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  phone:
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z",
  message:
    "M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm18 3-10 6L2 7",
  calendar: "M7 2v3m10-3v3M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  clock: "M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
};

const Icon = ({ name }: { name: IconName }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="spdrive-icon">
    <path d={iconPaths[name]} />
  </svg>
);

const calculatePrice = (distanceKm: number, car: CarOption) => {
  const rate = distanceKm <= SHORT_DISTANCE_LIMIT_KM ? car.upTo20Rate : car.over20Rate;
  return car.startFee + distanceKm * rate;
};

const getRouteMapZoom = (distanceKm?: number | null) => {
  if (!distanceKm) {
    return 8;
  }
  if (distanceKm <= 20) {
    return 11;
  }
  if (distanceKm <= 80) {
    return 9;
  }
  if (distanceKm <= 200) {
    return 8;
  }
  if (distanceKm <= 400) {
    return 7;
  }
  return 6;
};

const getGoogleMapsRouteSrc = (pickup: string, destination: string, distanceKm?: number | null) => {
  if (!pickup || !destination) {
    return "https://www.google.com/maps?output=embed&q=Switzerland";
  }

  const url = new URL("https://www.google.com/maps");
  url.searchParams.set("output", "embed");
  url.searchParams.set("f", "d");
  url.searchParams.set("source", "s_d");
  url.searchParams.set("saddr", pickup);
  url.searchParams.set("daddr", destination);
  url.searchParams.set("dirflg", "d");
  url.searchParams.set("z", String(getRouteMapZoom(distanceKm)));
  return url.toString();
};

const getPhotonUrl = (query: string, language: Language, limit = 5) => {
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("lang", language);
  url.searchParams.set("q", query);
  return url;
};

const getPlaceTitle = (properties: PhotonFeature["properties"] = {}) =>
  properties.name ||
  [properties.street, properties.housenumber].filter(Boolean).join(" ") ||
  properties.city ||
  properties.postcode ||
  "Switzerland";

const getPlaceDetail = (properties: PhotonFeature["properties"] = {}) =>
  [properties.street, properties.housenumber, properties.postcode, properties.city].filter(Boolean).join(", ");

const getPlaceValue = (feature: PhotonFeature) => {
  const properties = feature.properties || {};
  const title = getPlaceTitle(properties);
  const detail = getPlaceDetail(properties);
  return [title, detail || properties.state || properties.country].filter(Boolean).join(", ");
};

const fetchPlaceFeatures = async (query: string, language: Language, limit = 5) => {
  const response = await fetch(getPhotonUrl(query, language, limit));
  if (!response.ok) {
    throw new Error("Geocoding failed");
  }

  const data = (await response.json()) as { features?: PhotonFeature[] };
  return (data.features || []).filter((feature) =>
    SUPPORTED_ROUTE_COUNTRIES.has(feature.properties?.countrycode ?? "")
  );
};

const geocode = async (query: string, language: Language) => {
  const features = await fetchPlaceFeatures(query, language, 5);
  const result = features[0];

  if (!result) {
    throw new Error("Location not found");
  }

  const [lon, lat] = result.geometry.coordinates;
  return { lat: Number(lat), lon: Number(lon) };
};

const getDrivingRoute = async (pickup: string, destination: string, language: Language) => {
  const [origin, target] = await Promise.all([geocode(pickup, language), geocode(destination, language)]);
  const coordinates = `${origin.lon},${origin.lat};${target.lon},${target.lat}`;
  const routeUrls = [
    `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=false`,
    `https://routing.openstreetmap.de/routed-car/route/v1/driving/${coordinates}?overview=false`,
  ];

  for (const routeUrl of routeUrls) {
    try {
      const response = await fetch(routeUrl);
      if (!response.ok) {
        continue;
      }
      const data = (await response.json()) as { routes?: Array<{ distance: number; duration: number }> };
      const [route] = data.routes || [];
      if (route) {
        return {
          distanceKm: route.distance / 1000,
          durationSeconds: route.duration,
        };
      }
    } catch {
      // Try the next routing provider.
    }
  }

  throw new Error("Route not found");
};

const toDateValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const fromDateValue = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const pickupHourOptions = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, "0"));
const pickupMinuteOptions = ["00", "30"];

export function BookingSection({ language }: BookingSectionProps) {
  const t = useCallback((key: TranslationKey) => translations[language][key], [language]);
  const formRef = useRef<HTMLDivElement | null>(null);
  const scheduleRef = useRef<HTMLDivElement | null>(null);
  const skipPickupSearchRef = useRef(false);
  const skipDestinationSearchRef = useRef(false);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [passengers, setPassengers] = useState("");
  const [luggage, setLuggage] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState<PhotonFeature[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<PhotonFeature[]>([]);
  const [isPickupSearching, setIsPickupSearching] = useState(false);
  const [isDestinationSearching, setIsDestinationSearching] = useState(false);
  const [note, setNote] = useState<{ key: TranslationKey; isError: boolean }>({
    key: "routeNote",
    isError: false,
  });
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<CarOption["id"]>("toyota-prius-plus");
  const [mapSrc, setMapSrc] = useState(getGoogleMapsRouteSrc("", ""));
  const todayValue = toDateValue(new Date());

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
    ];
  }, [visibleMonth]);

  const formattedSchedule = useMemo(() => {
    if (!pickupDate) {
      return "";
    }
    const formattedDate = new Intl.DateTimeFormat(language === "de" ? "de-CH" : "en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(fromDateValue(pickupDate));
    return pickupTime ? `${formattedDate}, ${pickupTime}` : formattedDate;
  }, [language, pickupDate, pickupTime]);

  const selectedCar = useMemo(
    () => carOptions.find((car) => car.id === selectedCarId) ?? carOptions[carOptions.length - 1],
    [selectedCarId]
  );

  const distanceValue = useMemo(() => {
    if (!route) {
      return "--";
    }
    if (route.distanceKm === null) {
      return t("notCalculated");
    }
    return `${route.distanceKm.toLocaleString(language === "de" ? "de-CH" : "en-CH", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    })} km`;
  }, [language, route, t]);

  const durationValue = useMemo(() => {
    if (!route) {
      return "--";
    }
    if (route.durationSeconds === null) {
      return t("notCalculated");
    }

    const minutes = Math.max(1, Math.round(route.durationSeconds / 60));
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return language === "de" ? `${mins} Min.` : `${mins} min`;
    }

    return language === "de" ? `${hours} Std. ${mins} Min.` : `${hours} hr ${mins} min`;
  }, [language, route, t]);

  const priceValue = useMemo(() => {
    if (!route) {
      return "--";
    }
    if (route.distanceKm === null) {
      return t("onRequest");
    }
    return `CHF ${Math.round(calculatePrice(route.distanceKm, selectedCar)).toLocaleString("de-CH")}`;
  }, [route, selectedCar, t]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!scheduleRef.current?.contains(target)) {
        setIsCalendarOpen(false);
      }
      if (formRef.current?.contains(target)) {
        return;
      }
      setPickupSuggestions([]);
      setDestinationSuggestions([]);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    const query = pickup.trim();
    if (query.length < AUTOCOMPLETE_MIN_LENGTH) {
      setPickupSuggestions([]);
      setIsPickupSearching(false);
      return;
    }
    if (skipPickupSearchRef.current) {
      skipPickupSearchRef.current = false;
      setPickupSuggestions([]);
      setIsPickupSearching(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsPickupSearching(true);
      try {
        setPickupSuggestions(await fetchPlaceFeatures(query, language, 7));
      } catch {
        setPickupSuggestions([]);
      } finally {
        setIsPickupSearching(false);
      }
    }, AUTOCOMPLETE_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [language, pickup]);

  useEffect(() => {
    const query = destination.trim();
    if (query.length < AUTOCOMPLETE_MIN_LENGTH) {
      setDestinationSuggestions([]);
      setIsDestinationSearching(false);
      return;
    }
    if (skipDestinationSearchRef.current) {
      skipDestinationSearchRef.current = false;
      setDestinationSuggestions([]);
      setIsDestinationSearching(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsDestinationSearching(true);
      try {
        setDestinationSuggestions(await fetchPlaceFeatures(query, language, 7));
      } catch {
        setDestinationSuggestions([]);
      } finally {
        setIsDestinationSearching(false);
      }
    }, AUTOCOMPLETE_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [destination, language]);

  const resetRoute = () => {
    setRoute(null);
    setNote({ key: "routeNote", isError: false });
  };

  const updateMap = (nextPickup: string, nextDestination: string, distanceKm?: number | null) => {
    setMapSrc(getGoogleMapsRouteSrc(nextPickup, nextDestination, distanceKm));
  };

  const selectPickupSuggestion = (feature: PhotonFeature) => {
    skipPickupSearchRef.current = true;
    setPickup(getPlaceValue(feature));
    setPickupSuggestions([]);
    resetRoute();
  };

  const selectDestinationSuggestion = (feature: PhotonFeature) => {
    skipDestinationSearchRef.current = true;
    setDestination(getPlaceValue(feature));
    setDestinationSuggestions([]);
    resetRoute();
  };

  const handleSwapRoute = () => {
    setPickup(destination);
    setDestination(pickup);
    setPickupSuggestions([]);
    setDestinationSuggestions([]);
    setRoute(null);
    updateMap(destination.trim(), pickup.trim());
    setNote({ key: "routeNote", isError: false });
  };

  const handleRouteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextPickup = pickup.trim();
    const nextDestination = destination.trim();

    if (!nextPickup || !nextDestination) {
      setRoute(null);
      setNote({ key: "missingRoute", isError: true });
      return;
    }

    setRoute(null);
    setNote({ key: "calculating", isError: false });

    try {
      const result = await getDrivingRoute(nextPickup, nextDestination, language);
      updateMap(nextPickup, nextDestination, result.distanceKm);
      setRoute({
        pickup: nextPickup,
        destination: nextDestination,
        distanceKm: result.distanceKm,
        durationSeconds: result.durationSeconds,
      });
      setNote({ key: "calculated", isError: false });
    } catch {
      updateMap(nextPickup, nextDestination);
      setRoute({
        pickup: nextPickup,
        destination: nextDestination,
        distanceKm: null,
        durationSeconds: null,
      });
      setNote({ key: "geocodeError", isError: true });
    }
  };

  const getInquiryPayload = () => {
    const fallback = t("notProvided");
    const nextPickup = pickup.trim();
    const nextDestination = destination.trim();

    return {
      pickup: nextPickup || fallback,
      destination: nextDestination || fallback,
      distance: route ? distanceValue : fallback,
      duration: route ? durationValue : fallback,
      price: route ? priceValue : fallback,
      vehicle: selectedCar.name,
      name: customerName.trim() || fallback,
      telephone: telephone.trim() || fallback,
      schedule: formattedSchedule || fallback,
      passengers: passengers.trim() || fallback,
      luggage: luggage.trim() || fallback,
    };
  };

  const getInquiryMessage = (payload: ReturnType<typeof getInquiryPayload>) =>
    language === "de"
      ? `Hallo Prime Lane, ich mochte einen Transfer anfragen.\n\nName: ${payload.name}\nTelefon: ${payload.telephone}\nAbholdatum und Uhrzeit: ${payload.schedule}\nAnzahl Personen: ${payload.passengers}\nAnzahl Gepackstucke: ${payload.luggage}\nAbholung: ${payload.pickup}\nZiel: ${payload.destination}\nFahrzeug: ${payload.vehicle}\nDistanz: ${payload.distance}\nFahrzeit: ${payload.duration}\nGeschatzter Preis: ${payload.price}\n\nBitte senden Sie mir Verfugbarkeit und ein finales Angebot.`
      : `Hello Prime Lane, I would like to request a transfer.\n\nName: ${payload.name}\nTelephone: ${payload.telephone}\nPickup date and time: ${payload.schedule}\nNumber of passengers: ${payload.passengers}\nNumber of suitcases: ${payload.luggage}\nPickup: ${payload.pickup}\nDestination: ${payload.destination}\nVehicle: ${payload.vehicle}\nDistance: ${payload.distance}\nTravel time: ${payload.duration}\nEstimated price: ${payload.price}\n\nPlease send me availability and a final quote.`;

  const openWhatsApp = () => {
    const payload = getInquiryPayload();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(getInquiryMessage(payload))}`, "_blank", "noopener");
  };

  const openEmail = () => {
    const payload = getInquiryPayload();
    const subject = encodeURIComponent(t("emailSubject"));
    const body = encodeURIComponent(getInquiryMessage(payload));
    window.location.href = `mailto:${INQUIRY_EMAIL}?subject=${subject}&body=${body}`;
  };

  const renderSuggestions = (
    features: PhotonFeature[],
    isLoading: boolean,
    onSelect: (feature: PhotonFeature) => void
  ) => {
    if (isLoading) {
      return <div className="spdrive-autocomplete-empty">{t("searchingPlaces")}</div>;
    }

    if (!features.length) {
      return <div className="spdrive-autocomplete-empty">{t("noPlaces")}</div>;
    }

    return features.map((feature, index) => {
      const properties = feature.properties || {};
      const title = getPlaceTitle(properties);
      const detail = getPlaceDetail(properties) || properties.state || properties.country || "";

      return (
        <button
          className="spdrive-autocomplete-option"
          key={`${feature.geometry.coordinates.join("-")}-${index}`}
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onSelect(feature)}
        >
          <strong>{title}</strong>
          <span>{detail}</span>
        </button>
      );
    });
  };

  return (
    <section id="booking" className="section-shell spdrive-section">
      <div className="spdrive-booking-grid" ref={formRef}>
        <div className="spdrive-booking-panel">
          <p className="spdrive-eyebrow">{t("eyebrow")}</p>
          <h2>{t("headline")}</h2>

          <form className="spdrive-route-form" onSubmit={handleRouteSubmit}>
            <label className="spdrive-field">
              <span>{t("pickupLabel")}</span>
              <Icon name="map-pin" />
              <input
                value={pickup}
                onChange={(event) => {
                  setPickup(event.target.value);
                  resetRoute();
                }}
                onFocus={() => {
                  if (pickup.trim().length >= AUTOCOMPLETE_MIN_LENGTH) {
                    setPickupSuggestions((current) => current);
                  }
                }}
                type="text"
                role="combobox"
                autoComplete="off"
                aria-autocomplete="list"
                aria-controls="spdrive-pickup-suggestions"
                aria-expanded={pickupSuggestions.length > 0 || isPickupSearching}
                placeholder={t("pickupPlaceholder")}
              />
              {pickup.trim().length >= AUTOCOMPLETE_MIN_LENGTH && (pickupSuggestions.length > 0 || isPickupSearching) ? (
                <div className="spdrive-autocomplete-list" id="spdrive-pickup-suggestions" role="listbox">
                  {renderSuggestions(pickupSuggestions, isPickupSearching, selectPickupSuggestion)}
                </div>
              ) : null}
            </label>

            <button
              className="spdrive-swap-button"
              type="button"
              onClick={handleSwapRoute}
              aria-label={language === "de" ? "Route tauschen" : "Swap route"}
            >
              <Icon name="swap" />
            </button>

            <label className="spdrive-field">
              <span>{t("destinationLabel")}</span>
              <Icon name="flag" />
              <input
                value={destination}
                onChange={(event) => {
                  setDestination(event.target.value);
                  resetRoute();
                }}
                type="text"
                role="combobox"
                autoComplete="off"
                aria-autocomplete="list"
                aria-controls="spdrive-destination-suggestions"
                aria-expanded={destinationSuggestions.length > 0 || isDestinationSearching}
                placeholder={t("destinationPlaceholder")}
              />
              {destination.trim().length >= AUTOCOMPLETE_MIN_LENGTH &&
              (destinationSuggestions.length > 0 || isDestinationSearching) ? (
                <div className="spdrive-autocomplete-list" id="spdrive-destination-suggestions" role="listbox">
                  {renderSuggestions(destinationSuggestions, isDestinationSearching, selectDestinationSuggestion)}
                </div>
              ) : null}
            </label>

            <p className={`spdrive-route-note${note.isError ? " is-error" : ""}`}>{t(note.key)}</p>

            <button className="spdrive-primary-button" type="submit">
              <Icon name="route" />
              <span>{t("calculateButton")}</span>
            </button>
          </form>

          <div className="spdrive-route-summary" aria-live="polite">
            <div>
              <span>{t("distance")}</span>
              <strong>{distanceValue}</strong>
            </div>
            <div>
              <span>{t("duration")}</span>
              <strong>{durationValue}</strong>
            </div>
            <div>
              <span>{t("price")}</span>
              <strong>{priceValue}</strong>
            </div>
          </div>

          {route ? (
            <div className="spdrive-vehicle-picker" aria-label={t("selectVehicle")}>
              <p>{t("selectVehicle")}</p>
              <div className="spdrive-vehicle-grid">
                {carOptions.map((car) => (
                  <button
                    key={car.id}
                    type="button"
                    className={`spdrive-vehicle-card${selectedCarId === car.id ? " is-active" : ""}`}
                    onClick={() => setSelectedCarId(car.id)}
                    aria-pressed={selectedCarId === car.id}
                  >
                    <span className="spdrive-vehicle-dot" />
                    <strong>{car.name}</strong>
                  </button>
                ))}
              </div>
              <div className="spdrive-selected-vehicle">
                <span />
                {t("selectedVehicle")}: {selectedCar.name}
              </div>
              <p className="spdrive-vehicle-note">{t("vehicleAvailabilityNote")}</p>
            </div>
          ) : null}
        </div>

        <div className="spdrive-map-wrap" aria-label="Route map">
          <iframe
            title="Google Maps route"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
          />
        </div>

        <div className={`spdrive-contact-panel${isCalendarOpen ? " is-calendar-open" : ""}`}>
          <label className="spdrive-field">
            <span>{t("nameLabel")}</span>
            <Icon name="user" />
            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              type="text"
              autoComplete="name"
              placeholder={t("namePlaceholder")}
            />
          </label>

          <label className="spdrive-field">
            <span>{t("telephoneLabel")}</span>
            <Icon name="phone" />
            <input
              value={telephone}
              onChange={(event) => setTelephone(event.target.value)}
              type="tel"
              autoComplete="tel"
              placeholder={t("telephonePlaceholder")}
            />
          </label>

          <div
            className={`spdrive-schedule${isCalendarOpen ? " is-open" : ""}`}
            ref={scheduleRef}
          >
            <span className="spdrive-schedule-label">{t("pickupScheduleLabel")}</span>
            <button
              className={`spdrive-schedule-trigger${isCalendarOpen ? " is-open" : ""}`}
              type="button"
              onClick={() => setIsCalendarOpen((current) => !current)}
              aria-haspopup="dialog"
              aria-expanded={isCalendarOpen}
            >
              <Icon name="calendar" />
              <span className={formattedSchedule ? "" : "is-placeholder"}>
                {formattedSchedule || t("pickupSchedulePlaceholder")}
              </span>
            </button>

            {isCalendarOpen ? (
              <div
                className="spdrive-calendar"
                role="dialog"
                aria-label={t("pickupScheduleLabel")}
                onPointerDown={(event) => event.stopPropagation()}
              >
                <div className="spdrive-calendar-header">
                  <button
                    type="button"
                    aria-label={t("previousMonth")}
                    onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                    disabled={
                      visibleMonth.getFullYear() === new Date().getFullYear() &&
                      visibleMonth.getMonth() === new Date().getMonth()
                    }
                  >
                    ‹
                  </button>
                  <strong>
                    {new Intl.DateTimeFormat(language === "de" ? "de-CH" : "en-GB", {
                      month: "long",
                      year: "numeric",
                    }).format(visibleMonth)}
                  </strong>
                  <button
                    type="button"
                    aria-label={t("nextMonth")}
                    onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                  >
                    ›
                  </button>
                </div>

                <div className="spdrive-calendar-weekdays" aria-hidden="true">
                  {(language === "de" ? ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]).map(
                    (day) => <span key={day}>{day}</span>
                  )}
                </div>
                <div className="spdrive-calendar-days">
                  {calendarDays.map((date, index) => {
                    if (!date) {
                      return <span key={`empty-${index}`} />;
                    }
                    const value = toDateValue(date);
                    return (
                      <button
                        key={value}
                        type="button"
                        className={pickupDate === value ? "is-selected" : ""}
                        disabled={value < todayValue}
                        onClick={() => {
                          setPickupDate(value);
                        }}
                        aria-pressed={pickupDate === value}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>

                <div className="spdrive-calendar-time" role="group" aria-label={t("pickupTimeLabel")}>
                  <span>{t("pickupTimeLabel")}</span>
                  <div className="spdrive-time-picker">
                    <label>
                      <span>{language === "de" ? "Stunde" : "Hour"}</span>
                      <select
                        value={pickupTime.split(":")[0] || ""}
                        onChange={(event) => {
                          const minute = pickupTime.split(":")[1] || "00";
                          setPickupTime(event.target.value ? `${event.target.value}:${minute}` : "");
                        }}
                        aria-label={language === "de" ? "Stunde" : "Hour"}
                      >
                        <option value="">--</option>
                        {pickupHourOptions.map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                    </label>
                    <span aria-hidden="true">:</span>
                    <label>
                      <span>{language === "de" ? "Minute" : "Minute"}</span>
                      <select
                        value={pickupTime.split(":")[1] || ""}
                        onChange={(event) => {
                          const hour = pickupTime.split(":")[0] || "00";
                          setPickupTime(event.target.value ? `${hour}:${event.target.value}` : "");
                        }}
                        aria-label={language === "de" ? "Minute" : "Minute"}
                      >
                        <option value="">--</option>
                        {pickupMinuteOptions.map((minute) => (
                          <option key={minute} value={minute}>
                            {minute}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Icon name="clock" />
                  </div>
                  <button
                    className="spdrive-calendar-confirm"
                    type="button"
                    onClick={() => setIsCalendarOpen(false)}
                  >
                    {t("confirmSchedule")}
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="spdrive-contact-inline-fields">
            <label className="spdrive-field">
              <span>{t("passengersLabel")}</span>
              <input
                value={passengers}
                onChange={(event) => setPassengers(event.target.value)}
                type="number"
                min="1"
                inputMode="numeric"
                placeholder={t("passengersPlaceholder")}
              />
            </label>

            <label className="spdrive-field">
              <span>{t("luggageLabel")}</span>
              <input
                value={luggage}
                onChange={(event) => setLuggage(event.target.value)}
                type="number"
                min="0"
                inputMode="numeric"
                placeholder={t("luggagePlaceholder")}
              />
            </label>
          </div>

          <button className="spdrive-whatsapp-button" type="button" onClick={openWhatsApp}>
            <Icon name="message" />
            <span>{t("whatsappButton")}</span>
          </button>

          <button className="spdrive-email-button" type="button" onClick={openEmail}>
            <Icon name="mail" />
            <span>{t("emailButton")}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
