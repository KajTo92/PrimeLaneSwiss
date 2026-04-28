import { NextRequest, NextResponse } from "next/server";

type RouteBody = {
  pickup: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
};

type OsrmResponse = {
  routes?: Array<{
    distance: number;
    duration: number;
  }>;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RouteBody;
  const { pickup, destination } = body;

  if (!pickup || !destination) {
    return NextResponse.json({ error: "Missing points" }, { status: 400 });
  }

  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?overview=false`;

  try {
    const response = await fetch(osrmUrl, { cache: "no-store" });
    if (!response.ok) {
      return NextResponse.json({ error: "Routing service unavailable" }, { status: 502 });
    }

    const data = (await response.json()) as OsrmResponse;
    const route = data.routes?.[0];

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    const distanceKm = route.distance / 1000;
    const durationMin = route.duration / 60;

    return NextResponse.json({
      distanceKm,
      durationMin,
    });
  } catch {
    return NextResponse.json({ error: "Failed to calculate route" }, { status: 500 });
  }
}
