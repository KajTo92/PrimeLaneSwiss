"use client";

import { useMemo } from "react";
import { CircleMarker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { Language } from "@/types/language";

type Coordinates = {
  lat: number;
  lng: number;
};

type MapPickerProps = {
  language: Language;
  activeField: "pickup" | "destination";
  pickup: Coordinates | null;
  destination: Coordinates | null;
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

export function MapPicker({ language, activeField, pickup, destination, onSelectPoint }: MapPickerProps) {
  const mapCenter = useMemo<[number, number]>(() => [46.8182, 8.2275], []);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12">
      <div className="border-b border-white/10 bg-black/40 px-4 py-3 text-xs tracking-[0.16em] text-white/65">
        {language === "de" ? "KARTEN AUSWAHL" : "MAP PICKER"} ·{" "}
        {language === "de" ? "AKTIV" : "ACTIVE"}: {activeField.toUpperCase()}
      </div>
      <MapContainer center={mapCenter} zoom={8} scrollWheelZoom className="h-80 w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onSelectPoint={onSelectPoint} />
        {pickup ? <CircleMarker center={[pickup.lat, pickup.lng]} radius={10} pathOptions={{ color: "#fff" }} /> : null}
        {destination ? (
          <CircleMarker center={[destination.lat, destination.lng]} radius={10} pathOptions={{ color: "#67e8f9" }} />
        ) : null}
      </MapContainer>
    </div>
  );
}
