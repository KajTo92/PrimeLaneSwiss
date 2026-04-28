import { NextRequest, NextResponse } from "next/server";

type NominatimItem = {
  display_name: string;
  lat: string;
  lon: string;
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();
  const language = request.nextUrl.searchParams.get("lang") === "en" ? "en" : "de";

  if (!query || query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");
  url.searchParams.set("countrycodes", "ch");
  url.searchParams.set("accept-language", language);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "SwissPrimeLaneBooking/1.0 (contact@swissprimelane.ch)",
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json({ suggestions: [] }, { status: 200 });
    }

    const data = (await response.json()) as NominatimItem[];
    const suggestions = data.map((item) => ({
      label: item.display_name,
      lat: Number(item.lat),
      lng: Number(item.lon),
    }));

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] }, { status: 200 });
  }
}
