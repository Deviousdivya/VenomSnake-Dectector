# VenomSnake Detector

AI-assisted snake identification and snakebite help for India. Upload a photo to find out what the snake is and whether it is venomous — and if it is, get the nearest hospitals, one-tap emergency calls and first-aid guidance for your location.

**Live:** https://venom-snake-dectector.vercel.app

> **Safety first.** This is an information tool, not medical advice. AI identification can be wrong. If someone has been bitten, call **108** (ambulance) or **112** (national emergency number) immediately.

## Features

| Page | What it does |
| --- | --- |
| **Identify** (`/identify`) | Upload or capture a photo → species, venomous / non-venomous / unknown, precautions and emergency steps. For venomous snakes it also shows call buttons, AI-suggested antivenom and contacts (clearly marked *verify*), and the **nearest hospitals** for your location. |
| **Symptom checker** (`/symptom-checker`) | No photo? Tap the bite site on a body diagram, tick symptoms, get a plain-language summary and a **PDF** to show a doctor. |
| **Emergency** (`/emergency`) | Call 108 / 112, first-aid steps and a "do not" list, share your GPS location (share sheet / SMS), request wildlife rescue by SMS, find nearby hospitals. |
| **Big Four** (`/big-four`) | Field guide to India's four most dangerous snakes: how to recognise them, their venom, habits and warnings. |
| **Insights** (`/insights`) | Trusted WHO and NCDC (India) guidance, plus live news when a NewsAPI key is configured. |
| About, Privacy, Terms | How it works and its limits, what data is used, medical disclaimer. |

Also: English and Hindi interface (AI answers in the chosen language), installable PWA, offline-aware banner, keyboard- and screen-reader-friendly UI.

## Tech stack

Fraunces + Manrope type · React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · React Router 7 · Google Gemini (`@google/genai`) · Express (API) · OpenStreetMap Overpass (hospitals) · jsPDF · vite-plugin-pwa · deployed on Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local     # add your GEMINI_API_KEY
npm run dev                    # Express API + Vite on http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Full dev server (API + app). Set `PORT` to change the port. |
| `npm run dev:web` | Frontend only (no `/api`). |
| `npm run build` | Production build, then `scripts/prerender.mjs` (see SEO below). |
| `npm run lint` | Type-check with `tsc --noEmit`. |

### Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | yes | Snake identification and symptom summary. |
| `NEWS_API_KEY` | no | Live headlines on the Insights page. |
| `PORT` | no | Dev server port (default 3000). |

## How it works

```
photo ─► on-device model ─(unsure)─► Gemini ─(unavailable)─► "not sure, keep away" ─► { species, venom status, precautions, ... }
                                                 └─ if VENOMOUS ─► /api/hospitals ─► OpenStreetMap (Overpass) ─► nearest hospitals
```

* `src/services/identifyService.ts` – the identification ladder; `src/services/localModel.ts` – on-device model; `src/services/geminiService.ts` – cloud step. Results are cached in `localStorage`, keyed by a hash of the whole image.
* `src/services/diagnosisService.ts` – symptom summary.
* `src/services/hospitalService.ts` + `api/server.ts` (`POST /api/hospitals`) – nearby hospitals. The server sends an identifying User-Agent, caches results for a few hours by approximate location and tries several public Overpass mirrors. Public Overpass servers are best-effort; the UI falls back to a Google Maps search link if none respond.
* `api/server.ts` – Express app (also the Vercel function): `/api/news`, `/api/sightings`, `/api/hospitals`, `/api/health`.

## SEO and performance

* A **per-route HTML file** is generated at build time (`scripts/prerender.mjs`) with each page's own `<title>`, description, canonical URL, Open Graph / Twitter tags, JSON-LD and a plain-text summary, so crawlers and link previews that don't run JavaScript see the right content. The React app takes over in the browser.
* Page copy and meta live in `src/seo/pages.json`; JSON-LD (`WebSite`, `Organization`, `WebApplication`, `FAQPage`, `MedicalWebPage`, `BreadcrumbList`) is built in `src/seo/jsonld.mjs`.
* `sitemap.xml` (generated), `robots.txt`, canonical URLs, `noindex` on the 404 view, social image, web manifest and icons.
* Pages other than Home are code-split; the PDF library loads only when you save a report. No 3D/WebGL.
* Semantic landmarks, one `h1` per page, skip link, focus management on navigation, labelled controls, reduced-motion support.

## Project structure

```
api/server.ts            Express API / Vercel function
scripts/prerender.mjs    per-route HTML + sitemap after `vite build`
src/pages/               Home, Identify, SymptomChecker, Emergency, Insights, About, Legal, NotFound
src/components/          layout/, BodyMap, CameraCapture, HospitalList, SnakeResult
src/services/            gemini, diagnosis, hospital (antivenomService is currently unused)
src/seo/                 page metadata + JSON-LD
src/locales/             translations (English complete; Hindi for core screens; others partial)
```

## Identification engine

Identification is a ladder: an **on-device model** (SnakeCLEF baseline + a head trained on 21 Indian species, int8, runs in the browser via WebAssembly, no key or quota) answers when it is confident; otherwise **Gemini** is asked; if Gemini is unavailable the app shows a "Not sure — treat it as venomous" result with the chance it is venomous. Every result carries confidence meters. Measured numbers and limitations are in [`docs/identification-model-evaluation.md`](docs/identification-model-evaluation.md).

## Roadmap

* **Move the Gemini calls to the server.** `vite.config.ts` currently inlines `GEMINI_API_KEY` into the public JavaScript. Until that changes, restrict the key to this site's domain and set a spend limit.
* Enable billing on the Gemini key (removes free-tier limits for the cloud step) and improve the on-device model with more photos per species.
* Re-check model names (`gemini-3.1-flash-lite-preview` is a preview model) and verify end-to-end with a fresh key.
* Medical review of first-aid wording and of the translated emergency steps.
* Complete the remaining Indian-language translations with native speakers.

## Disclaimer

For education and identification only. It does not replace a doctor, an ambulance service or a trained snake handler. See `/terms`.
