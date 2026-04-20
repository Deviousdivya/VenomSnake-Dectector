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
  const { species, location } = req.body;
  console.log(`[Bio-Sighting] ${species} detected at ${location.lat}, ${location.lng}`);
  res.json({ status: 'Uplinked' });
});

app.get('/api/news', async (req, res) => {
  const fallbackNews = [
    { id: 'f1', title: 'WHO Launches New Snakebite Management Guidelines', excerpt: 'Global protocols updated for 2026 to include AI detection standards.', date: 'Apr 19, 2026', category: 'Health', imageUrl: 'https://picsum.photos/seed/who/800/600' },
    { id: 'f2', title: 'Antivenom Synthesis Reaches 98% Efficiency in Labs', excerpt: 'New synthetic production methods promise to end supply shortages.', date: 'Apr 18, 2026', category: 'Research', imageUrl: 'https://picsum.photos/seed/lab/800/600' },
    { id: 'f3', title: 'Rural Clinics Get Solar-Powered Antivenom Fridges', excerpt: 'Technology enabling lifesaving storage in remote areas without electricity.', date: 'Apr 17, 2026', category: 'Tech', imageUrl: 'https://picsum.photos/seed/tech/800/600' }
  ];

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.json({ articles: fallbackNews, status: 'fallback' });
  }

  try {
    const response = await fetch(`https://newsapi.org/v2/everything?q=snakes+antivenom+herpetology&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`);
    const data = await response.json();

    if (data.status === 'ok') {
      const articles = data.articles.map((art: any, idx: number) => ({
        id: idx.toString(),
        title: art.title,
        excerpt: art.description,
        imageUrl: art.urlToImage || `https://picsum.photos/seed/${idx}/800/600`,
        url: art.url
      }));
      res.json({ articles });
    } else {
      console.warn("NewsAPI Error:", data.message || "Unknown error");
      res.json({ articles: fallbackNews, status: 'fallback' });
    }
  } catch (error) {
    console.error("News sync failed", error);
    res.json({ articles: fallbackNews, status: 'fallback' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), memory: process.memoryUsage().rss });
});

// Export for Vercel
export default app;
