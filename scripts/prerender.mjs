// Runs after `vite build`. Produces one real HTML file per route (dist/<route>/index.html) with that page's
// own <title>, description, canonical, Open Graph/Twitter tags, JSON-LD and a plain-text summary of the page.
// Search engines and social-media crawlers that do not run JavaScript therefore see the right content,
// and the React app still takes over in the browser. Also writes sitemap.xml.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildHeadTags, buildJsonLd } from "../src/seo/jsonld.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const data = JSON.parse(fs.readFileSync(path.join(root, "src/seo/pages.json"), "utf8"));
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function staticBody(page, route) {
  const links = data.pages
    .filter((p) => p.path !== route && !["/privacy", "/terms"].includes(p.path))
    .map((p) => `<li><a href="${p.path}">${esc(p.h1)}</a></li>`)
    .join("");
  const faq =
    route === "/"
      ? `<h2>Frequently asked questions</h2>${data.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}`
      : "";
  return (
    `<main style="position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden">` +
    `<h1>${esc(page.h1)}</h1><p>${esc(page.summary)}</p>` +
    `<p><strong>Snakebite emergency:</strong> call <a href="tel:108">108</a> or <a href="tel:112">112</a> immediately.</p>` +
    `<nav aria-label="Pages"><ul>${links}</ul></nav>${faq}</main>`
  );
}

function render(route) {
  const page = data.pages.find((p) => p.path === route);
  let html = template;
  html = html.replace(
    /<!-- seo:start[\s\S]*?<!-- seo:end -->/,
    `<!-- seo:start -->\n    ${buildHeadTags(data, route)}\n    <!-- seo:end -->`
  );
  html = html.replace(
    /<script type="application\/ld\+json" id="ld-json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="ld-json">${JSON.stringify(buildJsonLd(data, route)).replace(/</g, "\\u003c")}</script>`
  );
  html = html.replace('<div id="root"></div>', `<div id="root">${staticBody(page, route)}</div>`);
  return html;
}

for (const page of data.pages) {
  const html = render(page.path);
  if (page.path === "/") {
    fs.writeFileSync(path.join(dist, "index.html"), html);
  } else {
    const dir = path.join(dist, page.path.slice(1));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
  }
  console.log("prerendered", page.path);
}

const today = new Date().toISOString().slice(0, 10);
const urls = data.pages
  .map(
    (p) =>
      `  <url>\n    <loc>${data.site.url}${p.path === "/" ? "/" : p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
  )
  .join("\n");
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);
console.log("sitemap.xml written with", data.pages.length, "urls");
