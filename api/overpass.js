// Proxies an Overpass query, trying mirrors in turn.
//
// The public instances rate-limit by IP and their error pages carry no CORS
// headers, so a throttled request looks like a CORS failure to the browser.
// Server-side there is no CORS, and a dead mirror is bounded by a timeout
// instead of hanging the page.

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

const UA = "visual-healthcare/1.0 (https://visual-health-overview-main.vercel.app)";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });

  const query = typeof req.body === "string" ? req.body : req.body?.query;
  if (!query || query.length > 2000) {
    return res.status(400).json({ error: "Missing or oversized query." });
  }

  let lastStatus = 0;
  for (const endpoint of ENDPOINTS) {
    try {
      const upstream = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain", "User-Agent": UA },
        body: query,
        signal: AbortSignal.timeout(25000),
      });
      lastStatus = upstream.status;
      if (!upstream.ok) continue;

      const data = await upstream.json();
      res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
      return res.status(200).json(data);
    } catch {
      // try the next mirror
    }
  }

  return res
    .status(503)
    .json({ error: "The map service is busy right now. Wait a few seconds and search again.", lastStatus });
}
