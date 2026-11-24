// Finds real hospitals near a coordinate using OpenStreetMap data (Overpass API). It needs no API key and works
// independently of the AI service, so the "nearest hospital" help still works if the AI is unavailable.
// OpenStreetMap does not know antivenom stock - callers must tell people to phone ahead or call 108.

export interface NearbyHospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
  phone?: string;
  government: boolean;
  emergency: boolean;
  address?: string;
  directionsUrl: string;
}



export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Goes through our own /api/hospitals endpoint, which asks OpenStreetMap's Overpass service (with an identifying
// User-Agent, caching and a fallback mirror) - see api/server.ts.
async function query(radiusM: number, lat: number, lng: number, signal: AbortSignal) {
  const res = await fetch('/api/hospitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng, radius: radiusM }),
    signal,
  });
  if (!res.ok) throw new Error(`Hospital lookup ${res.status}`);
  return (await res.json()) as { elements: any[] };
}

export async function findNearbyHospitals(lat: number, lng: number, limit = 6): Promise<NearbyHospital[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  try {
    let data = await query(15000, lat, lng, controller.signal);
    if (data.elements.length < 3) data = await query(50000, lat, lng, controller.signal); // rural: widen the search

    const seen = new Set<string>();
    const hospitals: NearbyHospital[] = [];
    for (const el of data.elements) {
      const hLat = el.lat ?? el.center?.lat;
      const hLng = el.lon ?? el.center?.lon;
      if (typeof hLat !== "number" || typeof hLng !== "number") continue;
      const tags = el.tags || {};
      const name: string = tags["name:en"] || tags.name || "";
      if (!name) continue; // unnamed buildings are not useful in an emergency
      const key = `${name.toLowerCase()}|${hLat.toFixed(3)}|${hLng.toFixed(3)}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const operatorType = String(tags["operator:type"] || "").toLowerCase();
      const operator = String(tags.operator || "").toLowerCase();
      const address = [tags["addr:street"], tags["addr:suburb"] || tags["addr:city"]].filter(Boolean).join(", ");
      hospitals.push({
        id: `${el.type}-${el.id}`,
        name,
        lat: hLat,
        lng: hLng,
        distanceKm: haversineKm(lat, lng, hLat, hLng),
        phone: tags.phone || tags["contact:phone"] || undefined,
        government: ["government", "public"].includes(operatorType) || /government|govt|civil|district|aiims|municipal/.test(operator + " " + name.toLowerCase()),
        emergency: tags.emergency === "yes",
        address: address || undefined,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${hLat},${hLng}`,
      });
    }
    return hospitals.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, limit);
  } finally {
    clearTimeout(timer);
  }
}

export function mapsSearchUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/hospital/@${lat},${lng},13z`;
}
