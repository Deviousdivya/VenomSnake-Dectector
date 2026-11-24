import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import NodeCache from 'node-cache';

const app = express();

// Trust the reverse proxy to correctly identify client IPs
app.set('trust proxy', 1);

// -- 🚀 1. PERFORMANCE LAYER: Caching (Simulated Redis) --
const apiCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 }); // Cache for 1 hour

// -- 🛡️ 2. SECURITY SHIELD (Protection) --
app.use(helmet({
  contentSecurityPolicy: false, 
}));

app.use(cors());
app.use(express.json({ limit: '15mb' })); // Increased for image uploads

// Rate Limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// -- 📡 4. GLOBAL INTEL & SIGHTINGS --
app.post('/api/sightings', async (req, res) => {
  const { species, location } = req.body ?? {};
  // Validate input: a missing or malformed body used to throw here and crash the request.
  if (
    typeof species !== 'string' || species.length === 0 || species.length > 120 ||
    typeof location?.lat !== 'number' || typeof location?.lng !== 'number' ||
    Math.abs(location.lat) > 90 || Math.abs(location.lng) > 180
  ) {
    return res.status(400).json({ error: 'A species name and valid coordinates are required.' });
  }
  console.log(`[Bio-Sighting] ${species} detected at ${location.lat}, ${location.lng}`);
  res.json({ status: 'recorded' });
});

app.get('/api/news', async (req, res) => {
  // No made-up headlines: when no live news is available the site shows trusted resource links instead.
  const fallbackNews: any[] = [];

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.json({ articles: fallbackNews, status: 'fallback' });
  }

  try {
    const response = await fetch(`https://newsapi.org/v2/everything?q=snakes+antivenom+herpetology&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`);
    const data = await response.json();

    if (data.status === 'ok' && data.articles.length > 0) {
      const articles = data.articles.map((art: any, idx: number) => ({
        id: idx.toString(),
        title: art.title,
        excerpt: art.description,
        imageUrl: art.urlToImage || undefined,
        url: art.url,
        category: 'Field Report', // NEWSAPI doesn't provide this, so we tag it
        date: new Date(art.publishedAt).toLocaleDateString()
      }));
      res.json({ articles });
    } else {
      console.warn("NewsAPI empty or failed. Using fallback.");
      res.json({ articles: fallbackNews, status: 'fallback' });
    }
  } catch (error) {
    console.error("News sync failed", error);
    res.json({ articles: fallbackNews, status: 'fallback' });
  }
});

// -- 🏥 NEARBY HOSPITALS (OpenStreetMap Overpass) --
// Done on the server so the request carries an identifying User-Agent (the Overpass operators ask for one and rate-limit
// anonymous traffic), results are cached, and coordinates travel in a POST body rather than a loggable URL.
const hospitalCache = new NodeCache({ stdTTL: 6 * 3600, checkperiod: 600 });
// Public Overpass servers are best-effort and sometimes slow or unavailable, so several are tried in turn.
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

app.post('/api/hospitals', async (req, res) => {
  const { lat, lng, radius } = req.body ?? {};
  if (
    typeof lat !== 'number' || typeof lng !== 'number' ||
    !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180
  ) {
    return res.status(400).json({ error: 'Valid coordinates are required.' });
  }
  const r = radius === 50000 ? 50000 : 15000;
  const key = `${lat.toFixed(3)},${lng.toFixed(3)},${r}`; // ~100 m grid: nearby requests share one lookup
  const hit = hospitalCache.get<any[]>(key);
  if (hit) return res.json({ elements: hit, cached: true });

  const q = `[out:json][timeout:20];(node["amenity"="hospital"](around:${r},${lat},${lng});way["amenity"="hospital"](around:${r},${lat},${lng}););out center tags 40;`;
  for (const url of OVERPASS_ENDPOINTS) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 9000);
      const upstream = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': '*/*',
          'User-Agent': 'VenomSnakeDetector/1.0 (+https://venom-snake-dectector.vercel.app; snakebite help app)',
        },
        body: 'data=' + encodeURIComponent(q),
        signal: ctrl.signal,
      }).finally(() => clearTimeout(timer));
      if (!upstream.ok) throw new Error(`Overpass ${upstream.status}`);
      const data: any = await upstream.json();
      hospitalCache.set(key, data.elements ?? []);
      return res.json({ elements: data.elements ?? [] });
    } catch (e) {
      console.warn(`Overpass lookup failed at ${url}:`, (e as Error).message);
    }
  }
  res.status(502).json({ error: 'Hospital lookup is unavailable right now.' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), memory: process.memoryUsage().rss });
});

// Export for Vercel
export default app;
