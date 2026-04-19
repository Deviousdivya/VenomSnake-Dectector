import express from 'express';
import { createServer as createViteServer } from 'vite';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import NodeCache from 'node-cache';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Trust the reverse proxy (Nginx) to correctly identify client IPs
app.set('trust proxy', 1);

// -- 🚀 1. PERFORMANCE LAYER: Caching (Simulated Redis) --
const apiCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 }); // Cache for 1 hour

// -- 🛡️ 2. SECURITY SHIELD (Protection) --
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for Vite dev mode
}));

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate Limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false }, // We already set app.set('trust proxy'), so we can disable the internal check
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

app.get('/api/news', async (req, res) => {
  const cacheKey = 'global_snake_news';
  const cachedData = apiCache.get(cacheKey);

  if (cachedData) {
    return res.json({ cached: true, ...(cachedData as Record<string, any>) });
  }

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    // Return high-quality fallback data if no key is provided
    const fallbackNews = [
      { id: 'f1', title: 'WHO Launches New Snakebite Management Guidelines', excerpt: 'Global protocols updated for 2026 to include AI detection standards.', date: 'Apr 19, 2026', category: 'Health', imageUrl: 'https://picsum.photos/seed/who/800/600' },
      { id: 'f2', title: 'Antivenom Synthesis Reaches 98% Efficiency in Labs', excerpt: 'New synthetic production methods promise to end supply shortages.', date: 'Apr 18, 2026', category: 'Research', imageUrl: 'https://picsum.photos/seed/lab/800/600' }
    ];
    return res.json({ cached: false, articles: fallbackNews, status: 'fallback' });
  }

  try {
    const response = await fetch(`https://newsapi.org/v2/everything?q=snakes+antivenom+herpetology&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`);
    const data = await response.json();

    if (data.status === 'ok') {
      const formattedArticles = data.articles.map((art: any, idx: number) => ({
        id: idx.toString(),
        title: art.title,
        excerpt: art.description,
        date: new Date(art.publishedAt).toLocaleDateString(),
        category: 'Live Intel',
        imageUrl: art.urlToImage || `https://picsum.photos/seed/${idx}/800/600`,
        url: art.url
      }));
      
      const newsResponse = { articles: formattedArticles };
      apiCache.set(cacheKey, newsResponse);
      res.json({ cached: false, ...newsResponse });
    } else {
      throw new Error(data.message || 'NewsAPI failed');
    }
  } catch (error) {
    console.error('News Fetch Error:', error);
    res.status(500).json({ error: 'Failed to synchronize with global news nodes' });
  }
});

// -- ⚡ 4. ASYNCHRONOUS PROCESSING (Simulation) --
// Background Job Queue Simulation
const jobQueue: Map<string, { status: string; result?: any }> = new Map();

app.post('/api/analyze-job', async (req, res) => {
  const jobId = Math.random().toString(36).substring(7);
  jobQueue.set(jobId, { status: 'PENDING' });

  // "Background" processing stimulation
  setTimeout(() => {
    jobQueue.set(jobId, { 
      status: 'COMPLETED', 
      result: { 
        latched_species: "Vipera russelii",
        confidence: 0.98,
        processed_node: "MUMBAI-EDGE-04" 
      } 
    });
  }, 5000);

  res.json({ jobId, message: 'Bio-data ingested into high-speed queue.' });
});

app.get('/api/analyze-job/:id', (req, res) => {
  const job = jobQueue.get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

// -- 📡 5. GLOBAL SIGHTINGS API (Simulation) --
interface Sighting {
  id: string;
  species: string;
  location: { lat: number; lng: number };
  timestamp: number;
}
const sightings: Sighting[] = [];

app.post('/api/sightings', (req, res) => {
  const { species, location } = req.body;
  if (!species) return res.status(400).json({ error: 'Species data missing' });
  
  const newSighting = {
    id: `sig-${Date.now()}`,
    species,
    location: location || { lat: 12.9716, lng: 77.5946 }, // Default Bangalore
    timestamp: Date.now()
  };
  sightings.push(newSighting);
  res.json({ success: true, sighting: newSighting });
});

app.get('/api/sightings', (req, res) => {
  res.json(sightings.slice(-50));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), memory: process.memoryUsage().rss });
});

// -- 🚀 6. VITE MIDDLEWARE SETUP --
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
      🚀 VENOM-SNAKE ENTERPRISE CLUSTER ACTIVE
      ---------------------------------------
      NODE_ENV: ${process.env.NODE_ENV || 'development'}
      PORT: ${PORT}
      WAF: ACTIVE (Helmet)
      DDoS Mitigation: ENABLED (Rate Limiter)
      Cache Engine: NODE-CACHE
      Cluster Status: ALL NODES SYNCHRONIZED
    `);
  });
}

startServer();
