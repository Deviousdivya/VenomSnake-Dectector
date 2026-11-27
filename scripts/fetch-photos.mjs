// One-off helper that downloads real, openly licensed photographs from Wikimedia Commons for:
//   1. the Big Four at a larger size (full-screen sections), and
//   2. every species the identifier can name, so a result can show a reference photo.
// Only CC BY, CC BY-SA, CC0 and public-domain files are kept, and the author + licence are written to
// src/data/photoCredits.json so the site can show the credit its licence requires.
//
//   node scripts/fetch-photos.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "images");
const UA = "VenomSnakeDetector-photo-fetch/1.0 (educational project; https://github.com/Deviousdivya/VenomSnake-Dectector)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(base, params) {
  const url = `${base}?${new URLSearchParams({ format: "json", origin: "*", ...params })}`;
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.status === 429) {
      await sleep(4000 * (attempt + 1));
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.json();
  }
  throw new Error("rate limited: " + url);
}

const strip = (html) => String(html ?? "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const okLicense = (l) => /^(CC BY(-SA)?( \d\.\d)?|CC0|Public domain|PD)/i.test(l) || /public domain/i.test(l);

async function commonsInfo(fileTitle, width) {
  const j = await api("https://commons.wikimedia.org/w/api.php", {
    action: "query",
    titles: fileTitle.startsWith("File:") ? fileTitle : `File:${fileTitle}`,
    prop: "imageinfo",
    iiprop: "url|extmetadata|size",
    iiurlwidth: String(width),
  });
  const page = Object.values(j.query.pages)[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) return null;
  const meta = ii.extmetadata ?? {};
  return {
    url: ii.thumburl || ii.url,
    page: ii.descriptionurl,
    author: strip(meta.Artist?.value) || "Unknown",
    license: strip(meta.LicenseShortName?.value) || "Unknown",
  };
}

async function download(url, file) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.status === 429) {
      await sleep(5000 * (attempt + 1));
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error("not a JPEG: " + url);
    fs.writeFileSync(file, buf);
    return buf.length;
  }
  throw new Error("rate limited: " + url);
}

const credits = {};

// 1. Big Four, large
const BIG_FOUR = {
  cobra: "Cobra,_Naja-naja.jpg",
  krait: "Common_Krait(Bungarus_Caeruleus)_in_Parassinikadavu_Snake_Park.jpg",
  russell: "Daboia_russelii_2014.jpg",
  sawscaled: "15.Saw_Scaled_Viper.jpg",
};
for (const [id, title] of Object.entries(BIG_FOUR)) {
  const info = await commonsInfo(title, 1800);
  if (!info || !okLicense(info.license)) {
    console.log("skip", id, info?.license);
    continue;
  }
  const bytes = await download(info.url, path.join(outDir, `big4-${id}-lg.jpg`));
  credits[`big4-${id}-lg`] = { src: `/images/big4-${id}-lg.jpg`, author: info.author, license: info.license, page: info.page };
  console.log("big4", id, Math.round(bytes / 1024) + "KB", info.license);
  await sleep(1500);
}

// 2. Reference photo for every identifiable species
const species = fs
  .readFileSync(path.join(root, "src", "data", "speciesKb.ts"), "utf8")
  .match(/scientific: '([^']+)'/g)
  .map((m) => m.match(/'([^']+)'/)[1]);

fs.mkdirSync(path.join(outDir, "species"), { recursive: true });
for (const sci of species) {
  try {
    const slug = sci.toLowerCase().replace(/\s+/g, "-");
    const pi = await api("https://en.wikipedia.org/w/api.php", { action: "query", prop: "pageimages", piprop: "name", titles: sci, redirects: "1" });
    const page = Object.values(pi.query.pages)[0];
    let file = page?.pageimage;
    if (!file) {
      console.log("no lead image", sci);
      continue;
    }
    const info = await commonsInfo(file, 1100);
    if (!info || !okLicense(info.license)) {
      console.log("licence not usable", sci, info?.license);
      continue;
    }
    const bytes = await download(info.url, path.join(outDir, "species", `${slug}.jpg`));
    credits[sci] = { src: `/images/species/${slug}.jpg`, author: info.author, license: info.license, page: info.page };
    console.log("ok", sci, Math.round(bytes / 1024) + "KB", info.license);
  } catch (e) {
    console.log("fail", sci, String(e.message).slice(0, 90));
  }
  await sleep(1500);
}

fs.writeFileSync(path.join(root, "src", "data", "photoCredits.json"), JSON.stringify(credits, null, 2));
console.log("credits written:", Object.keys(credits).length);
