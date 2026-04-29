"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Language } from "@/types/language";

type Coordinates = {
  lat: number;
  lng: number;
};

type LocationSuggestion = Coordinates & {
  label: string;
};

type RouteResult = {
  distanceKm: number;
  durationMin: number;
  estimatedPrice: number;
};

type CarOption = {
  id: "tesla-x" | "tesla-y" | "mercedes-v-class" | "prius";
  name: string;
  ratePerKm: number;
};

const MapPicker = dynamic(() => import("@/components/MapPicker").then((module) => module.MapPicker), {
  ssr: false,
});

const toCoordString = (coords: Coordinates | null) =>
  coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : "";

const carOptions: CarOption[] = [
  { id: "tesla-x", name: "Tesla X", ratePerKm: 3 },
  { id: "tesla-y", name: "Tesla Y", ratePerKm: 3 },
  { id: "mercedes-v-class", name: "Mercedes V-Class", ratePerKm: 3 },
  { id: "prius", name: "Toyota Prius", ratePerKm: 1.5 },
];

type BookingSectionProps = {
  language: Language;
};

export function BookingSection({ language }: BookingSectionProps) {
  const formRef = useRef<HTMLDivElement | null>(null);
  const [pickupText, setPickupText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [pickup, setPickup] = useState<Coordinates | null>(null);
  const [destination, setDestination] = useState<Coordinates | null>(null);
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<LocationSuggestion[]>([]);
  const [isPickupLoading, setIsPickupLoading] = useState(false);
  const [isDestinationLoading, setIsDestinationLoading] = useState(false);
  const [activeField, setActiveField] = useState<"pickup" | "destination">("pickup");
  const [selectedCarId, setSelectedCarId] = useState<CarOption["id"]>("tesla-x");
  const [dateTime, setDateTime] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [routeInfo, setRouteInfo] = useState<string>("");
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string>("");

  const skipPickupQueryRef = useRef(false);
  const skipDestinationQueryRef = useRef(false);

  const selectedCar = useMemo(
    () => carOptions.find((car) => car.id === selectedCarId) ?? carOptions[0],
    [selectedCarId]
  );

  const canCalculate = useMemo(() => pickup && destination, [pickup, destination]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!formRef.current) {
        return;
      }
      const target = event.target as Node;
      if (!formRef.current.contains(target)) {
        setPickupSuggestions([]);
        setDestinationSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!pickupText.trim() || pickupText.trim().length < 3) {
      setPickupSuggestions([]);
      return;
    }
    if (skipPickupQueryRef.current) {
      skipPickupQueryRef.current = false;
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsPickupLoading(true);
      try {
        const response = await fetch(
          `/api/location-suggestions?query=${encodeURIComponent(pickupText)}&lang=${language}`
        );
        const data = (await response.json()) as { suggestions: LocationSuggestion[] };
        setPickupSuggestions(data.suggestions ?? []);
      } finally {
        setIsPickupLoading(false);
      }
    }, 320);

    return () => clearTimeout(timeoutId);
  }, [pickupText, language]);

  useEffect(() => {
    if (!destinationText.trim() || destinationText.trim().length < 3) {
      setDestinationSuggestions([]);
      return;
    }
    if (skipDestinationQueryRef.current) {
      skipDestinationQueryRef.current = false;
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsDestinationLoading(true);
      try {
        const response = await fetch(
          `/api/location-suggestions?query=${encodeURIComponent(destinationText)}&lang=${language}`
        );
        const data = (await response.json()) as { suggestions: LocationSuggestion[] };
        setDestinationSuggestions(data.suggestions ?? []);
      } finally {
        setIsDestinationLoading(false);
      }
    }, 320);

    return () => clearTimeout(timeoutId);
  }, [destinationText, language]);

  useEffect(() => {
    setRouteResult((current) => {
      if (!current) {
        return current;
      }
      return {
        ...current,
        estimatedPrice: current.distanceKm * selectedCar.ratePerKm,
      };
    });
  }, [selectedCar.ratePerKm]);

  const handleSelectPoint = (coords: Coordinates) => {
    if (activeField === "pickup") {
      setPickup(coords);
      setPickupText(toCoordString(coords));
      setPickupSuggestions([]);
      return;
    }

    setDestination(coords);
    setDestinationText(toCoordString(coords));
    setDestinationSuggestions([]);
  };

  const selectPickupSuggestion = (suggestion: LocationSuggestion) => {
    skipPickupQueryRef.current = true;
    setPickupText(suggestion.label);
    setPickup({ lat: suggestion.lat, lng: suggestion.lng });
    setPickupSuggestions([]);
  };

  const selectDestinationSuggestion = (suggestion: LocationSuggestion) => {
    skipDestinationQueryRef.current = true;
    setDestinationText(suggestion.label);
    setDestination({ lat: suggestion.lat, lng: suggestion.lng });
    setDestinationSuggestions([]);
  };

  const handleSelectMapAddress = (suggestion: LocationSuggestion) => {
    if (activeField === "pickup") {
      skipPickupQueryRef.current = true;
      setPickupText(suggestion.label);
      setPickup({ lat: suggestion.lat, lng: suggestion.lng });
      setPickupSuggestions([]);
      return;
    }

    skipDestinationQueryRef.current = true;
    setDestinationText(suggestion.label);
    setDestination({ lat: suggestion.lat, lng: suggestion.lng });
    setDestinationSuggestions([]);
  };

  const handleCalculateRoute = async () => {
    if (!canCalculate) {
      setRouteInfo(
        language === "de"
          ? "Bitte Abholort und Zielort aus den Vorschlagen oder per Karte auswahlen."
          : "Please select pickup and destination from suggestions or map."
      );
      setRouteResult(null);
      return;
    }

    setRouteInfo(language === "de" ? "Route wird berechnet..." : "Calculating route...");

    try {
      const response = await fetch("/api/calculate-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup,
          destination,
        }),
      });

      if (!response.ok) {
        throw new Error("Route error");
      }

      const data = (await response.json()) as {
        distanceKm: number;
        durationMin: number;
      };
      const estimatedPrice = data.distanceKm * selectedCar.ratePerKm;
      const result: RouteResult = {
        distanceKm: data.distanceKm,
        durationMin: data.durationMin,
        estimatedPrice,
      };
      setRouteResult(result);
      setRouteInfo(
        language === "de"
          ? `Distanz: ${result.distanceKm.toFixed(1)} km · Dauer: ${result.durationMin.toFixed(
              0
            )} min · Preis: CHF ${result.estimatedPrice.toFixed(2)}`
          : `Distance: ${result.distanceKm.toFixed(1)} km · Duration: ${result.durationMin.toFixed(
              0
            )} min · Price: CHF ${result.estimatedPrice.toFixed(2)}`
      );
      setBookingMessage("");
    } catch {
      setRouteResult(null);
      setRouteInfo(
        language === "de"
          ? "Route konnte nicht berechnet werden. Bitte erneut versuchen."
          : "Could not calculate route. Please try again."
      );
    }
  };

  const handleBookNow = async () => {
    if (!routeResult) {
      setBookingMessage(
        language === "de"
          ? "Bitte zuerst die Route berechnen."
          : "Please calculate the route first."
      );
      return;
    }

    if (!customerEmail.trim() || !customerPhone.trim()) {
      setBookingMessage(
        language === "de"
          ? "Bitte E-Mail und Telefonnummer eingeben."
          : "Please provide email and phone number."
      );
      return;
    }

    const content = `
Neue Buchungsanfrage

Abholort: ${pickupText}
Zielort: ${destinationText}
Datum/Uhrzeit: ${dateTime || "Nicht angegeben"}
Kunden E-Mail: ${customerEmail || "Nicht angegeben"}
Kunden Telefon: ${customerPhone || "Nicht angegeben"}
Fahrzeug: ${selectedCar.name}
Preis pro km: CHF ${selectedCar.ratePerKm.toFixed(2)}
Distanz: ${routeResult.distanceKm.toFixed(2)} km
Fahrzeit: ${routeResult.durationMin.toFixed(0)} min
Geschatzter Preis: CHF ${routeResult.estimatedPrice.toFixed(2)}
`;

    const formData = new FormData();
    formData.append("access_key", "e549531d-071d-4fb4-b851-ca1854aa3802");
    formData.append("subject", "Neue Fahrtanfrage - Swiss Prime Lane");
    formData.append("from_name", "Swiss Prime Lane Website");
    formData.append("name", customerEmail);
    formData.append("email", customerEmail);
    formData.append("phone", customerPhone);
    formData.append("Abholort", pickupText);
    formData.append("Zielort", destinationText);
    formData.append("Datum/Uhrzeit", dateTime || "Nicht angegeben");
    formData.append("Kunden E-Mail", customerEmail || "Nicht angegeben");
    formData.append("Kunden Telefon", customerPhone || "Nicht angegeben");
    formData.append("Fahrzeug", selectedCar.name);
    formData.append("Preis pro km", `CHF ${selectedCar.ratePerKm.toFixed(2)}`);
    formData.append("Distanz", `${routeResult.distanceKm.toFixed(2)} km`);
    formData.append("Fahrzeit", `${routeResult.durationMin.toFixed(0)} min`);
    formData.append("Geschatzter Preis", `CHF ${routeResult.estimatedPrice.toFixed(2)}`);
    formData.append("message", content);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { success?: boolean };

      if (!response.ok || !data.success) {
        setBookingMessage(
          language === "de"
            ? "Buchung konnte nicht gesendet werden. Bitte erneut versuchen."
            : "Booking request could not be sent. Please try again."
        );
        return;
      }
    } catch {
      setBookingMessage(
        language === "de"
          ? "Buchung konnte nicht gesendet werden. Bitte erneut versuchen."
          : "Booking request could not be sent. Please try again."
      );
      return;
    }

    setRouteInfo(
      language === "de"
        ? "Nachricht wurde gesendet. Wir kontaktieren Sie innerhalb einer Stunde."
        : "Message sent successfully. We will contact you within one hour."
    );
    setBookingMessage(
      language === "de"
        ? "Vielen Dank. Ihre Anfrage wurde an unser Team ubermittelt."
        : "Thank you. Your request has been forwarded to our team."
    );
  };

  return (
    <section id="booking" className="section-shell">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-3xl border border-white/12 bg-white/[0.03] p-6 sm:p-8"
        >
          <p className="eyebrow">{language === "de" ? "BUCHUNG" : "BOOKING"}</p>
          <h2 className="section-title">
            {language === "de" ? (
              <>
                Plane deine <span className="gold-text">Premiumfahrt</span>
              </>
            ) : (
              <>
                Plan Your <span className="gold-text">Premium Ride</span>
              </>
            )}
          </h2>

          <div className="mt-6">
            <MapPicker
              language={language}
              activeField={activeField}
              pickup={pickup}
              destination={destination}
              onActiveFieldChange={setActiveField}
              onSelectAddress={handleSelectMapAddress}
              onSelectPoint={handleSelectPoint}
            />
          </div>

          <div ref={formRef} className="mt-6 space-y-4">
            <div className="relative">
              <label className="field-label">
                {language === "de" ? "Abholort" : "Pickup location"}
                <input
                  className="field-input"
                  value={pickupText}
                  onFocus={() => setActiveField("pickup")}
                  onBlur={() => setTimeout(() => setPickupSuggestions([]), 120)}
                  onChange={(event) => {
                    setPickupText(event.target.value);
                    setPickup(null);
                  }}
                  placeholder={language === "de" ? "Zurich HB, Bahnhofplatz" : "Zurich HB, Bahnhofplatz"}
                />
              </label>
              {pickupSuggestions.length > 0 ? (
                <div className="suggestion-dropdown">
                  {pickupSuggestions.map((suggestion) => (
                    <button
                      key={`${suggestion.lat}-${suggestion.lng}-${suggestion.label}`}
                      type="button"
                      className="suggestion-item"
                      onClick={() => selectPickupSuggestion(suggestion)}
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              ) : null}
              {isPickupLoading ? (
                <p className="mt-1 text-xs text-white/55">{language === "de" ? "Suche..." : "Searching..."}</p>
              ) : null}
            </div>

            <div className="relative">
              <label className="field-label">
                {language === "de" ? "Zielort" : "Destination"}
                <input
                  className="field-input"
                  value={destinationText}
                  onFocus={() => setActiveField("destination")}
                  onBlur={() => setTimeout(() => setDestinationSuggestions([]), 120)}
                  onChange={(event) => {
                    setDestinationText(event.target.value);
                    setDestination(null);
                  }}
                  placeholder={language === "de" ? "Flughafen Genf" : "Geneva Airport"}
                />
              </label>
              {destinationSuggestions.length > 0 ? (
                <div className="suggestion-dropdown">
                  {destinationSuggestions.map((suggestion) => (
                    <button
                      key={`${suggestion.lat}-${suggestion.lng}-${suggestion.label}`}
                      type="button"
                      className="suggestion-item"
                      onClick={() => selectDestinationSuggestion(suggestion)}
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              ) : null}
              {isDestinationLoading ? (
                <p className="mt-1 text-xs text-white/55">{language === "de" ? "Suche..." : "Searching..."}</p>
              ) : null}
            </div>

            <label className="field-label">
              {language === "de" ? "Datum & Uhrzeit" : "Date & time"}
              <input
                className="field-input"
                type="datetime-local"
                value={dateTime}
                onChange={(event) => setDateTime(event.target.value)}
              />
            </label>

            <label className="field-label">
              {language === "de" ? "E-Mail Adresse" : "Email address"}
              <input
                className="field-input"
                type="email"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                placeholder={language === "de" ? "kunde@email.ch" : "customer@email.ch"}
              />
            </label>

            <label className="field-label">
              {language === "de" ? "Telefonnummer" : "Phone number"}
              <input
                className="field-input"
                type="tel"
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                placeholder={language === "de" ? "+41 79 123 45 67" : "+41 79 123 45 67"}
              />
            </label>

            <div>
              <p className="field-label">{language === "de" ? "Fahrzeugwahl" : "Select vehicle"}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {carOptions.map((car) => (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => setSelectedCarId(car.id)}
                    className={`vehicle-card ${selectedCarId === car.id ? "vehicle-card-active" : ""}`}
                  >
                    <span className="vehicle-dot" />
                    <span className="text-sm font-medium text-white">{car.name}</span>
                    <span className="text-xs text-white/70">CHF {car.ratePerKm.toFixed(1)} / km</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-300/45 bg-amber-300/20 px-4 py-2 text-sm font-semibold text-amber-100 shadow-[0_0_24px_rgba(251,191,36,0.25)]">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                {language === "de" ? "Gewahlt" : "Selected"}: {selectedCar.name} (CHF{" "}
                {selectedCar.ratePerKm.toFixed(1)} / km)
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={handleCalculateRoute} className="btn-premium">
              {language === "de" ? "Route berechnen" : "Calculate Route"}
            </button>
            <button type="button" onClick={handleBookNow} className="btn-book-now">
              {language === "de" ? "Jetzt buchen" : "Book Now"}
            </button>
          </div>

          {routeInfo ? <p className="mt-4 text-sm text-white/75">{routeInfo}</p> : null}
          {bookingMessage ? <p className="mt-2 rounded-xl bg-emerald-500/15 p-3 text-sm text-emerald-200">{bookingMessage}</p> : null}

          {routeResult ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/45 bg-amber-300/20 px-3 py-1.5 text-xs font-semibold text-amber-100">
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                {language === "de" ? "Tarif" : "Tariff"}: {selectedCar.name} · CHF{" "}
                {selectedCar.ratePerKm.toFixed(1)} / km
              </div>
              <p>
                {language === "de" ? "Distanz" : "Distance"}: {routeResult.distanceKm.toFixed(2)} km
              </p>
              <p>
                {language === "de" ? "Fahrzeit" : "Travel time"}: {routeResult.durationMin.toFixed(0)} min
              </p>
              <p>
                {language === "de" ? "Geschatzter Preis" : "Estimated price"}: CHF{" "}
                <span className="gold-text">{routeResult.estimatedPrice.toFixed(2)}</span>
              </p>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
