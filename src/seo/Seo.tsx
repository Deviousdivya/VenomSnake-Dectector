import { useEffect } from 'react';
import data from './pages.json';
import { buildJsonLd } from './jsonld.mjs';

function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

const meta = (key: 'name' | 'property', name: string, content: string) =>
  setTag(
    `meta[${key}="${name}"]`,
    () => {
      const m = document.createElement('meta');
      m.setAttribute(key, name);
      return m;
    },
    'content',
    content
  );

/** Keeps <title>, description, canonical, social tags and JSON-LD in sync with the current route (client-side navigation). */
export function Seo({ path, noindex = false }: { path: string; noindex?: boolean }) {
  useEffect(() => {
    const page = data.pages.find((p) => p.path === path) ?? data.pages[0];
    const url = data.site.url + (path === '/' ? '/' : path);

    document.title = page.title;
    meta('name', 'description', page.description);
    meta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    meta('property', 'og:title', page.title);
    meta('property', 'og:description', page.description);
    meta('property', 'og:url', url);
    meta('name', 'twitter:title', page.title);
    meta('name', 'twitter:description', page.description);
    setTag(
      'link[rel="canonical"]',
      () => {
        const l = document.createElement('link');
        l.setAttribute('rel', 'canonical');
        return l;
      },
      'href',
      url
    );

    let ld = document.getElementById('ld-json');
    if (!ld) {
      ld = document.createElement('script');
      ld.id = 'ld-json';
      ld.setAttribute('type', 'application/ld+json');
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(buildJsonLd(data, path));
  }, [path, noindex]);

  return null;
}

export const faq = data.faq;
export const siteUrl = data.site.url;
