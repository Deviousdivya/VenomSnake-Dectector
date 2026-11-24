// Builds the schema.org JSON-LD for a page. Shared by the browser (src/seo/Seo.tsx) and the
// build-time prerender script (scripts/prerender.mjs) so crawlers see the same data either way.
// Only facts that are true and visible on the page are described here.

export function buildJsonLd(data, path) {
  const { site, pages, faq } = data;
  const page = pages.find((p) => p.path === path) || pages[0];
  const url = site.url + (path === "/" ? "/" : path);

  const graph = [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: `${site.url}/`,
      name: site.name,
      inLanguage: ["en", "hi"],
    },
    {
      "@type": "Organization",
      "@id": `${site.url}/#org`,
      name: site.name,
      url: `${site.url}/`,
      logo: `${site.url}/icon-512.png`,
    },
  ];

  if (path === "/" || path === "/identify") {
    graph.push({
      "@type": "WebApplication",
      "@id": `${site.url}/#app`,
      name: site.name,
      url: `${site.url}/`,
      applicationCategory: "HealthApplication",
      operatingSystem: "Any (web browser)",
      description: pages[0].description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      inLanguage: ["en", "hi"],
    });
  }

  if (path === "/") {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  if (path === "/emergency") {
    graph.push({
      "@type": "MedicalWebPage",
      url,
      name: page.title,
      description: page.description,
      about: { "@type": "MedicalCondition", name: "Snakebite envenoming" },
      audience: { "@type": "PeopleAudience", audienceType: "General public" },
    });
  }

  if (path === "/big-four") {
    graph.push({
      "@type": "Article",
      headline: page.h1,
      description: page.description,
      url,
      inLanguage: "en",
      about: { "@type": "MedicalCondition", name: "Snakebite envenoming" },
      publisher: { "@id": `${site.url}/#org` },
    });
  }

  if (path !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
        { "@type": "ListItem", position: 2, name: page.h1, item: url },
      ],
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

// <head> tags that differ per page. `noindex` is used for the 404 view.
export function buildHeadTags(data, path, { noindex = false } = {}) {
  const { site, pages } = data;
  const page = pages.find((p) => p.path === path) || pages[0];
  const url = site.url + (path === "/" ? "/" : path);
  const img = site.url + site.image;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta name="robots" content="${noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(site.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
  ].join("\n    ");
}
