<div align="center">

# 🐍 VenomSnake Detector
### AI-Assisted Snake Identification & Snakebite Emergency Help for India

[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![ONNX Runtime](https://img.shields.io/badge/ONNX_Runtime_Web-005CED?style=for-the-badge&logo=onnx&logoColor=white)](https://onnxruntime.ai/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<p align="center">
  <b>Snap a photo to find out what the snake is and whether it is venomous, then get the nearest hospitals, one-tap emergency calls and first-aid guidance for where you are.</b>
</p>

<p align="center">
  🌐 <b>Live demo:</b> <a href="https://venom-snake-dectector.vercel.app">venom-snake-dectector.vercel.app</a>
</p>

> ⚠️ **Safety first.** This is an information tool, not medical advice. AI identification can be wrong. If someone has been bitten, call **108** (ambulance) or **112** (national emergency number) immediately.

[Key Features](#-key-features) • [System Architecture](#-system-architecture) • [Identification Engine](#-identification-engine) • [Quick Start](#-quick-start-guide) • [API Reference](#-api-reference) • [SEO & Performance](#-seo--performance)

---

</div>

## 📌 Overview

India records some of the world's highest numbers of snakebite deaths, and most happen where antivenom and a doctor are hours away. In the minutes that matter, people need three answers fast: **what snake was that, is it dangerous, and where is the nearest hospital?**

**VenomSnake Detector** answers all three from a single phone photo. It identifies the species with a **free on-device model**, calls a cloud AI only when the photo is unclear, and always attaches an honest **confidence score**. If a snake is venomous, it immediately surfaces emergency call buttons, first-aid steps and nearby hospitals. If it cannot tell, it says so plainly and tells the user to keep away.

```
   ┌──────────────┐
   │ Snake photo  │  (upload or camera)
   └──────┬───────┘
          ▼
   ┌───────────────────────────────┐   confident &       ┌─────────────────────┐
   │  1. On-device model            │   clear-cut  ─────► │ Result + confidence │
   │  SwinV2 (int8, ONNX/WASM)      │                     │ meters + alternatives│
   │  + head for 21 Indian species  │                     └─────────┬───────────┘
   └──────────────┬────────────────┘                               │ if VENOMOUS
                  │ unsure (blurry, dark, unfamiliar)              ▼
                  ▼                                     ┌─────────────────────────┐
   ┌───────────────────────────────┐                    │ Call 108/112 · first aid │
   │  2. Gemini (cloud AI)          │ ──────────────────►│ nearest hospitals (OSM)  │
   └──────────────┬────────────────┘                    └─────────────────────────┘
                  │ unavailable (quota / offline)
                  ▼
   ┌───────────────────────────────┐
   │  3. "Not sure — keep away"     │  best guess + chance it is venomous
   └───────────────────────────────┘
```

---

## ✨ Key Features

| Page | What it does |
| :--- | :--- |
| **🔍 Identify** (`/identify`) | Upload or capture a photo and get the species, *venomous / non-venomous / not sure*, species-confidence and chance-venomous meters, alternative candidates, precautions and emergency steps. Venomous results also show call buttons, antivenom information and the nearest hospitals. |
| **🩺 Symptom checker** (`/symptom-checker`) | No photo? Tap the bite site on a body diagram, tick symptoms and get a plain-language summary plus a **PDF** to show a doctor. Falls back to cautious built-in rules when the AI is unavailable. |
| **🚑 Emergency** (`/emergency`) | One-tap 108 / 112, first-aid steps and a "do not" list, share your GPS location by share sheet or SMS, request wildlife rescue, find nearby hospitals. |
| **📖 Big Four** (`/big-four`) | Field guide to India's four most dangerous snakes (cobra, krait, Russell's viper, saw-scaled viper) with real photographs, venom type, habits and warnings. |
| **📰 Insights** (`/insights`) | Trusted WHO and NCDC guidance, plus live news when a NewsAPI key is configured. |
| **About · Privacy · Terms** | How it works and its limits, what data is used, medical disclaimer. |

**Also included**
- 🌐 English and Hindi interface (cloud AI answers in the chosen language)
- 📲 Installable **PWA** with an offline-aware banner
- ♿ Keyboard and screen-reader friendly, reduced-motion support
- ⚡ Branded loading screen with no unstyled flash

---

## 🏗️ System Architecture

```
VenomSnake-Dectector/
├── api/
│   └── server.ts              # Express API (also the Vercel serverless function)
├── public/
│   ├── models/                # snake-swin-int8.onnx (59 MB) + head.json (species head)
│   └── images/                # Real, licensed snake photographs
├── scripts/
│   ├── prerender.mjs          # Per-route HTML + sitemap after `vite build`
│   └── copy-ort.mjs           # Copies the ONNX Runtime WASM into public/ort on install
├── src/
│   ├── pages/                 # Home, Identify, SymptomChecker, Emergency, BigFour, Insights, About, Legal
│   ├── components/            # SnakeResult, HospitalList, BodyMap, CameraCapture, layout/ ...
│   ├── services/
│   │   ├── identifyService.ts # The identification ladder (local → Gemini → not sure)
│   │   ├── localModel.ts      # On-device model (onnxruntime-web)
│   │   ├── geminiService.ts   # Cloud step (+ geminiFallback.ts model retry)
│   │   ├── diagnosisService.ts / localTriage.ts   # Symptom summary + offline rules
│   │   └── hospitalService.ts # Nearby hospital client
│   ├── data/                  # speciesKb.ts (21 species), bigFour.ts
│   ├── seo/                   # pages.json + JSON-LD builders
│   └── locales/               # English (complete), Hindi (core screens), others partial
└── docs/identification-model-evaluation.md   # How the model was built and measured
```

---

## 🧠 Identification Engine

Identification is a **ladder**, so a single exhausted free quota can never stop the app:

1. **On-device model**: the SnakeCLEF 2024 baseline (SwinV2-tiny, MIT licence), quantised to int8 (122 MB → 59 MB), runs in the browser via WebAssembly with a small softmax head trained on 21 Indian species (10 dangerous). No API key, no quota, and the photo never leaves the device. Its answer is accepted only when it is *confident and clear-cut*.
2. **Gemini (cloud)** handles everything the local model is unsure about: blurry, dark, low-resolution or ambiguous photos. If the preview model is overloaded, it retries on a stable one.
3. **"Not sure — treat it as venomous"**: if Gemini is also unavailable, the app shows its best guess, the **chance the snake is venomous** and the likely candidates, and tells the user not to approach.

A "harmless" answer that the cloud AI itself is unsure about (< 60%) is automatically downgraded to *not sure*.

### Measured results (held-out photos, 248 images, 21 species)

| Check | Result |
| :--- | :--- |
| On-device species accuracy, first guess | 74% |
| Clear photos answered on-device (no cloud call) | ~61% |
| Dangerous snakes wrongly called **harmless** by the gate | **0 of 130** |
| Blurred or 40-pixel photos sent to Gemini instead of guessed | 93–97% |
| Non-snake animals still given a confident snake answer | 8 of 54 *(known limitation)* |

Full method, caveats and the gating thresholds are in [`docs/identification-model-evaluation.md`](docs/identification-model-evaluation.md).

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js 18+** and **npm**
- A **Google Gemini API key** ([get one free](https://aistudio.google.com/app/apikey)). The app still identifies common species without it, but the cloud step and the symptom summary need it.

### Step 1: Clone the repository

```bash
git clone https://github.com/Deviousdivya/VenomSnake-Dectector.git
cd VenomSnake-Dectector
```

### Step 2: Install and configure

```bash
npm install                    # also copies the ONNX Runtime WASM into public/ort
cp .env.example .env.local     # then add your GEMINI_API_KEY
```

### Step 3: Run

```bash
npm run dev                    # Express API + Vite on http://localhost:3000
```

| Script | Purpose |
| :--- | :--- |
| `npm run dev` | Full dev server (API + app). Set `PORT` to change the port. |
| `npm run dev:web` | Frontend only (no `/api`). |
| `npm run build` | Production build, then per-route prerender and sitemap. |
| `npm run lint` | Type-check with `tsc --noEmit`. |

### Environment variables

| Name | Required | Purpose |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | For the cloud step | Snake identification fallback and symptom summary. |
| `NEWS_API_KEY` | No | Live headlines on the Insights page. |
| `PORT` | No | Dev server port (default 3000). |

### ☁️ Deploy on Vercel
Import the repository in Vercel, add the environment variables above and deploy. `vercel.json` rewrites `/api/*` to the Express function, serves the SPA, and sets long-lived cache headers for `/assets`, `/models` and `/ort`.

---

## 🔌 API Reference

### `POST /api/hospitals`
Finds hospitals near a point. Two sources (OpenStreetMap Overpass and Nominatim) are queried in parallel and the first answer wins; results are cached for 6 hours per ~100 m grid cell.

```json
// Request
{ "lat": 28.6692, "lng": 77.4538, "radius": 15000 }
```

```json
// Response
{ "elements": [ { "type": "node", "lat": 28.676, "lon": 77.46, "tags": { "name": "...", "phone": "..." } } ], "cached": false }
```
`radius` accepts `15000` (default) or `50000` metres. Errors: `400` for invalid coordinates, `502` when every source is down (the UI then offers a Google Maps search link).

### `POST /api/sightings`
Records a reported sighting after validating the input.

```json
{ "species": "Indian cobra", "location": { "lat": 28.67, "lng": 77.45 } }
```
Returns `{ "status": "recorded" }`, or `400` for a missing species or invalid coordinates.

### `GET /api/news`
Returns `{ "articles": [...] }` from NewsAPI, or `{ "articles": [], "status": "fallback" }` when no key is configured (the UI then shows trusted resource links; no placeholder headlines are made up).

### `GET /api/health`
Returns `{ "status": "ok", "uptime": ..., "memory": ... }`.

---

## 🔎 SEO & Performance

- **Per-route prerendered HTML** is generated at build time (`scripts/prerender.mjs`), each with its own `<title>`, description, canonical URL, Open Graph and Twitter tags, JSON-LD (`WebSite`, `Organization`, `WebApplication`, `FAQPage`, `MedicalWebPage`, `BreadcrumbList`) and a crawlable text summary.
- Generated `sitemap.xml`, `robots.txt`, social image, web manifest and icons; `noindex` on the 404 view.
- Pages other than Home are code-split; the PDF library loads only when a report is saved; the 59 MB model preloads in the background on the Identify page and is cached for return visits. It is skipped on data-saver or very slow connections, which go straight to the cloud step.
- Semantic landmarks, one `h1` per page, skip link, focus management and labelled controls.

---

## 🛠️ Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 6, React Router 7, Tailwind CSS 4, Lucide icons |
| **On-device ML** | ONNX Runtime Web (WASM), SwinV2-tiny (SnakeCLEF 2024 baseline, int8) + softmax head |
| **Cloud AI** | Google Gemini via `@google/genai` (stable-model retry) |
| **Backend** | Express (also the Vercel function), node-cache |
| **Maps & data** | OpenStreetMap Overpass + Nominatim for hospitals |
| **Output** | jsPDF (lazy-loaded) for symptom reports |
| **PWA & SEO** | vite-plugin-pwa, build-time prerender, JSON-LD |
| **Deployment** | Vercel |

---

## ⚠️ Limitations & Roadmap

- The on-device model knows **21 species**; unknown species can be matched to the nearest known one, and some non-snake animals can still get a snake answer. A "harmless" result is never a guarantee of safety.
- **Move the Gemini calls to the server.** The key is currently built into the public JavaScript. Until then, restrict it to this site's domain and set a spend limit.
- Medical review of first-aid wording and of translated emergency steps; more Indian-language translations with native speakers.
- More labelled photos per species to improve the on-device model.

> For education and identification only. It does not replace a doctor, an ambulance service or a trained snake handler.

---

## 🙏 Credits

Snake photographs are from Wikimedia Commons under their respective licences (credits are shown on each photo). The base model is the SnakeCLEF 2024 organisers' baseline (MIT).

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'feat: Add AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.
