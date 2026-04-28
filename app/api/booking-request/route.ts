import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type BookingBody = {
  pickupLabel: string;
  destinationLabel: string;
  dateTime: string;
  customerEmail: string;
  customerPhone: string;
  carName: string;
  ratePerKm: number;
  distanceKm: number;
  estimatedPrice: number;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as BookingBody;

  const companyEmail = process.env.COMPANY_BOOKING_EMAIL ?? "contact@swissprimelane.ch";
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM ?? companyEmail;

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
Geschaftzter Preis: CHF ${body.estimatedPrice.toFixed(2)}
`;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: fromEmail,
        to: companyEmail,
        subject: "Neue Fahrtanfrage - Swiss Prime Lane",
        text: content,
      });

      return NextResponse.json({ success: true, sent: true });
    } catch {
      return NextResponse.json({ success: false, sent: false }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, sent: false, simulated: true });
}
