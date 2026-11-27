import { useEffect, useState } from 'react';
import { Calendar, ExternalLink, FileText, Loader2, Newspaper } from 'lucide-react';
import { Seo } from '../seo/Seo';
import { PageHero } from '../components/PageHero';
import { bigFourPhotos } from '../data/bigFour';
import { NewsItem } from '../types';

const resources = [
  {
    org: 'World Health Organization',
    title: 'Snakebite envenoming — fact sheet',
    body: 'A global overview of snakebite: how common it is, how it is treated, antivenom, and prevention.',
    href: 'https://www.who.int/news-room/fact-sheets/detail/snakebite-envenoming',
  },
  {
    org: 'NCDC, Ministry of Health (India)',
    title: 'National Action Plan for Prevention and Control of Snakebite Envenoming',
    body: "India's national plan for preventing and controlling snakebite envenoming.",
    href: 'https://ncdc.mohfw.gov.in/wp-content/uploads/2024/07/NATIONAL-ACTION-PLAN-FOR-PREVENTION-AND-CONTROL-OF-SNAKEBITE-ENVENOMING-NAPSE.pdf',
  },
  {
    org: 'NCDC, Ministry of Health (India)',
    title: 'Standard Treatment Guidelines: Management of Snake Bite',
    body: 'Clinical guidelines for health workers on managing snakebite.',
    href: 'https://ncdc.mohfw.gov.in/uploads/pdf/Standard-Treatment-Guidelines-for-Management-of-Snake-Bite.pdf',
  },
];

export default function Insights() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/news', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => setNews(Array.isArray(d.articles) ? d.articles : []))
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  return (
    <>
      <Seo path="/insights" />
      <PageHero eyebrow="Learn more" title="Snakebite insights and trusted resources" lead="Read the guidance that public-health bodies publish — and the latest news — to stay prepared." image={bigFourPhotos.russell.lg} position={bigFourPhotos.russell.position} />
      <div className="container-x py-12 sm:py-16">

        <section className="mt-12" aria-labelledby="res-title">
          <h2 id="res-title" className="text-2xl">Trusted resources</h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {resources.map((r) => (
              <li key={r.href} className="card flex flex-col p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-brand-800">
                  <FileText size={22} aria-hidden />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">{r.org}</p>
                <h3 className="mt-1 text-xl">{r.title}</h3>
                <p className="mt-2 flex-1 text-[15px] text-ink-2">{r.body}</p>
                <a className="btn btn-outline btn-sm mt-5 self-start" href={r.href} target="_blank" rel="noopener noreferrer">
                  Read <ExternalLink size={14} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="news-title">
          <h2 id="news-title" className="text-2xl">Latest news</h2>
          {loading && (
            <p className="mt-6 flex items-center gap-2 text-muted" role="status">
              <Loader2 size={18} className="animate-spin" aria-hidden /> Loading news…
            </p>
          )}
          {!loading && news.length === 0 && (
            <p className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-6 text-ink-2 ring-1 ring-line">
              <Newspaper size={22} className="shrink-0 text-brand-700" aria-hidden />
              <span>
                Live news isn't available right now.{' '}
                <a
                  className="font-semibold text-brand-700 underline"
                  href="https://news.google.com/search?q=snakebite+antivenom"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Search the latest snakebite news
                </a>
                .
              </span>
            </p>
          )}
          {news.length > 0 && (
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {news.map((n) => (
                <li key={n.id} className="card overflow-hidden">
                  <a href={n.url} target="_blank" rel="noopener noreferrer" className="flex h-full flex-col no-underline sm:flex-row">
                    {n.imageUrl && (
                      <img src={n.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-44 w-full object-cover sm:h-auto sm:w-40" />
                    )}
                    <div className="p-5">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                        <Calendar size={13} aria-hidden /> {n.date}
                      </p>
                      <h3 className="mt-2 text-lg leading-snug text-ink">{n.title}</h3>
                      {n.excerpt && <p className="mt-2 line-clamp-3 text-sm text-ink-2">{n.excerpt}</p>}
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                        Read article <ExternalLink size={13} aria-hidden />
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
