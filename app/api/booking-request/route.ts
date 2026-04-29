import { NextRequest, NextResponse } from "next/server";

type BookingBody = {
  pickupLabel: string;
  destinationLabel: string;
  dateTime: string;
  customerEmail: string;
  customerPhone: string;
  carName: string;
  ratePerKm: number;
  distanceKm: number;
  durationMin: number;
  estimatedPrice: number;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as BookingBody;

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY ?? "e549531d-071d-4fb4-b851-ca1854aa3802";

  const content = `
Neue Buchungsanfrage

Abholort: ${body.pickupLabel}
Zielort: ${body.destinationLabel}
Datum/Uhrzeit: ${body.dateTime || "Nicht angegeben"}
Kunden E-Mail: ${body.customerEmail || "Nicht angegeben"}
Kunden Telefon: ${body.customerPhone || "Nicht angegeben"}
Fahrzeug: ${body.carName}
Preis pro km: CHF ${body.ratePerKm.toFixed(2)}
Distanz: ${body.distanceKm.toFixed(2)} km
Fahrzeit: ${body.durationMin.toFixed(0)} min
Geschatzter Preis: CHF ${body.estimatedPrice.toFixed(2)}
`;

  const formData = new FormData();
  formData.append("access_key", accessKey);
  formData.append("subject", "Neue Fahrtanfrage - Swiss Prime Lane");
  formData.append("from_name", "Swiss Prime Lane Website");
  formData.append("email", body.customerEmail);
  formData.append("Abholort", body.pickupLabel);
  formData.append("Zielort", body.destinationLabel);
  formData.append("Datum/Uhrzeit", body.dateTime || "Nicht angegeben");
  formData.append("Kunden E-Mail", body.customerEmail || "Nicht angegeben");
  formData.append("Kunden Telefon", body.customerPhone || "Nicht angegeben");
  formData.append("Fahrzeug", body.carName);
  formData.append("Preis pro km", `CHF ${body.ratePerKm.toFixed(2)}`);
  formData.append("Distanz", `${body.distanceKm.toFixed(2)} km`);
  formData.append("Fahrzeit", `${body.durationMin.toFixed(0)} min`);
  formData.append("Geschatzter Preis", `CHF ${body.estimatedPrice.toFixed(2)}`);
  formData.append("message", content);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = (await response.json()) as { success?: boolean; message?: string };

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { success: false, message: data.message ?? "Web3Forms request failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, sent: true });
  } catch {
    return NextResponse.json({ success: false, message: "Web3Forms request failed" }, { status: 500 });
  }
}
