/**
 * Find Care data layer.
 *
 * Facilities come from OpenStreetMap via Overpass, and PIN codes are resolved
 * to coordinates with Nominatim. Both are free and need no key. Results are
 * cached in localStorage because Nominatim's usage policy asks callers to
 * cache rather than repeat identical lookups.
 */

export type FacilityType = "hospital" | "clinic" | "doctors" | "pharmacy";

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  phone?: string;
  address?: string;
  openingHours?: string;
  website?: string;
  lat: number;
  lon: number;
  distanceKm: number;
}

export interface PinLocation {
  pin: string;
  lat: number;
  lon: number;
  label: string;
}

const CACHE_PREFIX = "findcare:";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const SEARCH_RADIUS_M = 6000;

/** Indian PINs are six digits and never start with 0 or 9. */
export function isValidPin(pin: string): boolean {
  return /^[1-8][0-9]{5}$/.test(pin.trim());
}

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { at, value } = JSON.parse(raw);
    if (Date.now() - at > CACHE_TTL_MS) return null;
    return value as T;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: unknown) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ at: Date.now(), value }));
  } catch {
    // storage full or unavailable — caching is best effort
  }
}

function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export async function lookupPin(pin: string): Promise<PinLocation> {
  const cached = readCache<PinLocation>(`pin:${pin}`);
  if (cached) return cached;

  const res = await fetch(`/api/geocode?pin=${encodeURIComponent(pin)}`);
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error || "Could not look up that PIN code right now.");

  const location = body as PinLocation;
  writeCache(`pin:${pin}`, location);
  return location;
}

function tagAddress(tags: Record<string, string>): string | undefined {
  const parts = [
    [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" "),
    tags["addr:suburb"] || tags["addr:neighbourhood"],
    tags["addr:city"],
    tags["addr:postcode"],
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : undefined;
}

export async function fetchFacilities(location: PinLocation): Promise<Facility[]> {
  const cached = readCache<Facility[]>(`facilities:${location.pin}`);
  if (cached) return cached;

  const filter = '["amenity"~"^(hospital|clinic|doctors|pharmacy)$"]';
  const around = `(around:${SEARCH_RADIUS_M},${location.lat},${location.lon})`;
  const query =
    `[out:json][timeout:25];(node${filter}${around};way${filter}${around};);out center tags 600;`;

  const res = await fetch("/api/overpass", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: query,
  });
  const raw = await res.json();
  if (!res.ok) {
    throw new Error(
      raw?.error || "The map service is busy right now. Wait a few seconds and search again."
    );
  }

  const data = raw as {
    elements: Array<{
      type: string;
      id: number;
      lat?: number;
      lon?: number;
      center?: { lat: number; lon: number };
      tags?: Record<string, string>;
    }>;
  };

  const facilities = data.elements
    .map((el) => {
      const tags = el.tags || {};
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      if (!tags.name || lat === undefined || lon === undefined) return null;

      const facility: Facility = {
        id: `${el.type}/${el.id}`,
        name: tags.name,
        type: tags.amenity as FacilityType,
        phone: tags.phone || tags["contact:phone"],
        address: tagAddress(tags),
        openingHours: tags.opening_hours,
        website: tags.website || tags["contact:website"],
        lat,
        lon,
        distanceKm: haversineKm(location.lat, location.lon, lat, lon),
      };
      return facility;
    })
    .filter((f): f is Facility => f !== null)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  writeCache(`facilities:${location.pin}`, facilities);
  return facilities;
}

export const TYPE_LABELS: Record<FacilityType, string> = {
  hospital: "Hospital",
  clinic: "Clinic",
  doctors: "Doctor",
  pharmacy: "Pharmacy",
};
