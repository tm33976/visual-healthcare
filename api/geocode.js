// Resolves an Indian PIN code to coordinates via Nominatim.
//
// This runs server-side rather than in the browser for two reasons: Nominatim's
// usage policy asks for an identifying User-Agent, which browsers will not let
// you set, and going same-origin removes CORS from the equation entirely.

const UA = "visual-healthcare/1.0 (https://visual-health-overview-main.vercel.app)";

export default async function handler(req, res) {
  const pin = String(req.query.pin || "");
  if (!/^[1-8][0-9]{5}$/.test(pin)) {
    return res.status(400).json({ error: "Invalid PIN code." });
  }

  try {
    const url =
      "https://nominatim.openstreetmap.org/search?format=json&limit=1&country=India&postalcode=" +
      encodeURIComponent(pin);
    const upstream = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "en" },
      signal: AbortSignal.timeout(15000),
    });
    if (!upstream.ok) throw new Error(`nominatim ${upstream.status}`);

    const data = await upstream.json();
    if (!data.length) return res.status(404).json({ error: `No location found for PIN ${pin}.` });

    // Cache at the edge; PIN centroids do not move.
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    return res.status(200).json({
      pin,
      lat: Number(data[0].lat),
      lon: Number(data[0].lon),
      label: data[0].display_name,
    });
  } catch (e) {
    return res.status(502).json({ error: "Could not look up that PIN code right now." });
  }
}
