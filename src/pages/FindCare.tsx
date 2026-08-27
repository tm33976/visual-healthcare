import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader2, MapPin, Phone, Search, Globe } from "lucide-react";
import {
  fetchFacilities,
  isValidPin,
  lookupPin,
  TYPE_LABELS,
  type Facility,
  type FacilityType,
  type PinLocation,
} from "@/lib/findCare";

const FILTERS: Array<{ key: "all" | FacilityType; label: string }> = [
  { key: "all", label: "All" },
  { key: "hospital", label: "Hospitals" },
  { key: "clinic", label: "Clinics" },
  { key: "doctors", label: "Doctors" },
  { key: "pharmacy", label: "Pharmacies" },
];

const EMERGENCY = [
  { number: "102", label: "Ambulance" },
  { number: "108", label: "Emergency response" },
  { number: "112", label: "All emergencies" },
];

const FindCare = () => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState<PinLocation | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filter, setFilter] = useState<"all" | FacilityType>("all");

  const search = async () => {
    const value = pin.trim();
    if (!isValidPin(value)) {
      setError("Enter a six-digit Indian PIN code.");
      return;
    }

    setLoading(true);
    setError("");
    setFacilities([]);
    setLocation(null);

    try {
      const place = await lookupPin(value);
      setLocation(place);
      setFacilities(await fetchFacilities(place));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const shown = filter === "all" ? facilities : facilities.filter((f) => f.type === filter);
  const callable = facilities.filter((f) => f.phone).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Find Care</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Hospitals, clinics and pharmacies near an Indian PIN code.
      </p>

      {/* Real, and the only numbers here that always work. */}
      <Card className="mb-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900">
        <CardContent className="py-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-sm font-medium text-red-700 dark:text-red-300">
            In an emergency, call:
          </span>
          {EMERGENCY.map((e) => (
            <a
              key={e.number}
              href={`tel:${e.number}`}
              className="text-sm font-semibold text-red-700 dark:text-red-300 underline"
            >
              {e.number} <span className="font-normal">({e.label})</span>
            </a>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <Input
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="e.g. 560001"
          inputMode="numeric"
          aria-label="PIN code"
          className="sm:max-w-xs"
        />
        <Button onClick={search} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
          {loading ? "Searching" : "Search"}
        </Button>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>}

      {location && !loading && (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {facilities.length} found near {location.label.split(",").slice(0, 3).join(", ")} ·{" "}
            {callable} with a listed phone number
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {FILTERS.map((f) => {
              const count =
                f.key === "all"
                  ? facilities.length
                  : facilities.filter((x) => x.type === f.key).length;
              return (
                <Button
                  key={f.key}
                  size="sm"
                  variant={filter === f.key ? "default" : "outline"}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label} ({count})
                </Button>
              );
            })}
          </div>
        </>
      )}

      {location && !loading && facilities.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            OpenStreetMap has no health facilities mapped near this PIN code yet. Coverage is
            thinner in smaller towns.
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {shown.map((f) => (
          <Card key={f.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex flex-wrap items-center gap-2">
                {f.name}
                <Badge variant="secondary">{TYPE_LABELS[f.type]}</Badge>
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                  {f.distanceKm.toFixed(1)} km
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {f.address && (
                <p className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  {f.address}
                </p>
              )}
              {f.openingHours && (
                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 shrink-0" />
                  {f.openingHours}
                </p>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                {f.phone ? (
                  <Button asChild size="sm">
                    <a href={`tel:${f.phone.replace(/\s/g, "")}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      {f.phone}
                    </a>
                  </Button>
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                    No phone number listed
                  </span>
                )}
                <Button asChild size="sm" variant="outline">
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${f.lat}&mlon=${f.lon}#map=17/${f.lat}/${f.lon}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Directions
                  </a>
                </Button>
                {f.website && (
                  <Button asChild size="sm" variant="outline">
                    <a href={f.website} target="_blank" rel="noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
        Facility data © OpenStreetMap contributors, contributed by volunteers. Listings and phone
        numbers may be incomplete or out of date — confirm before travelling. Booking is by phone;
        this page does not make appointments.
      </p>
    </div>
  );
};

export default FindCare;
