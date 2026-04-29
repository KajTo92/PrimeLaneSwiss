"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { Language } from "@/types/language";

type Coordinates = {
  lat: number;
  lng: number;
};

type LocationSuggestion = Coordinates & {
  label: string;
};

type MapPickerProps = {
  language: Language;
  activeField: "pickup" | "destination";
  pickup: Coordinates | null;
  destination: Coordinates | null;
  onActiveFieldChange: (field: "pickup" | "destination") => void;
  onSelectAddress: (suggestion: LocationSuggestion) => void;
  onSelectPoint: (coords: Coordinates) => void;
};

function ClickHandler({
  onSelectPoint,
}: {
  onSelectPoint: (coords: Coordinates) => void;
}) {
  useMapEvents({
    click(event) {
      onSelectPoint({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}

function MapFocus({ target }: { target: Coordinates | null }) {
  const map = useMap();

  useEffect(() => {
    if (!target) {
      return;
    }

    map.flyTo([target.lat, target.lng], 14, {
      duration: 0.8,
    });
  }, [map, target]);

  return null;
}

export function MapPicker({
  language,
  activeField,
  pickup,
  destination,
  onActiveFieldChange,
  onSelectAddress,
  onSelectPoint,
}: MapPickerProps) {
  const mapCenter = useMemo<[number, number]>(() => [46.8182, 8.2275], []);
  const activePoint = activeField === "pickup" ? pickup : destination;
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const skipSearchRef = useRef(false);

  useEffect(() => {
    setSearchText("");
    setSuggestions([]);
  }, [activeField]);

  useEffect(() => {
    const query = searchText.trim();

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/location-suggestions?query=${encodeURIComponent(query)}&lang=${language}`);
        const data = (await response.json()) as { suggestions: LocationSuggestion[] };
        setSuggestions(data.suggestions ?? []);
      } finally {
        setIsSearching(false);
      }
    }, 320);

    return () => window.clearTimeout(timeoutId);
  }, [language, searchText]);

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    skipSearchRef.current = true;
    setSearchText(suggestion.label);
    setSuggestions([]);
    onSelectAddress(suggestion);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12">
      <div className="relative z-[1000] border-b border-white/10 bg-black/40 px-4 py-3">
        <p className="text-xs tracking-[0.16em] text-white/65">
          {language === "de" ? "KARTEN AUSWAHL" : "MAP PICKER"} ·{" "}
          {language === "de" ? "AKTIV" : "ACTIVE"}: {activeField.toUpperCase()}
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onActiveFieldChange("pickup")}
            className={`btn-secondary ${activeField === "pickup" ? "btn-active" : ""}`}
          >
            {language === "de" ? "Abholort auf Karte wahlen" : "Select Pickup on Map"}
          </button>
          <button
            type="button"
            onClick={() => onActiveFieldChange("destination")}
            className={`btn-secondary ${activeField === "destination" ? "btn-active" : ""}`}
          >
            {language === "de" ? "Zielort auf Karte wahlen" : "Select Destination on Map"}
          </button>
        </div>
        <div className="relative mt-4">
          <input
            className="field-input"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder={
              activeField === "pickup"
                ? language === "de"
                  ? "Abholadresse suchen"
                  : "Search pickup address"
                : language === "de"
                  ? "Zieladresse suchen"
                  : "Search destination address"
            }
          />
          {suggestions.length > 0 ? (
            <div className="suggestion-dropdown">
              {suggestions.map((suggestion) => (
                <button
                  key={`${suggestion.lat}-${suggestion.lng}-${suggestion.label}`}
                  type="button"
                  className="suggestion-item"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          ) : null}
          {isSearching ? (
            <p className="mt-1 text-xs text-white/55">{language === "de" ? "Suche..." : "Searching..."}</p>
          ) : null}
        </div>
      </div>
      <MapContainer center={mapCenter} zoom={8} scrollWheelZoom className="relative z-0 h-80 w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFocus target={activePoint} />
        <ClickHandler onSelectPoint={onSelectPoint} />
        {pickup ? <CircleMarker center={[pickup.lat, pickup.lng]} radius={10} pathOptions={{ color: "#fff" }} /> : null}
        {destination ? (
          <CircleMarker center={[destination.lat, destination.lng]} radius={10} pathOptions={{ color: "#67e8f9" }} />
        ) : null}
      </MapContainer>
    </div>
  );
}
