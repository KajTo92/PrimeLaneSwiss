import type { Metadata } from "next";
import { CarRentalPage } from "@/components/CarRentalPage";

export const metadata: Metadata = {
  title: "Autovermietung | PRIME LANE GMBH SWISS",
  description: "Premium car rental in Switzerland.",
};

export default function AutovermietungPage() {
  return <CarRentalPage />;
}
