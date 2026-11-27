import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Camera, Eye, MapPin, Moon, Phone, Siren, TriangleAlert, X } from 'lucide-react';
import { Seo } from '../seo/Seo';
import { Reveal } from '../components/Reveal';
import { ParallaxPhoto } from '../components/ParallaxPhoto';
import { bigFour, bigFourPhotos } from '../data/bigFour';

export default function BigFour() {
  const reduce = useReducedMotion();
  const { hash } = useLocation();
  const hero = bigFourPhotos.russell;

  // /big-four#krait should land on the krait
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
  }, [hash]);

  return (
    <>
      <Seo path="/big-four" />

      {/* Hero */}
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-brand-950 text-white">
        <img src={hero.lg} alt={hero.alt} fetchPriority="high" decoding="async" className="ken-burns absolute inset-0 -z-10 h-full w-full object-cover" style={{ objectPosition: hero.position }} />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950 via-brand-950/75 to-brand-950/10" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950 via-transparent to-brand-950/50" />
        <div className="container-wide w-full pb-16 pt-40 sm:pb-24">
          <p className="eyebrow on-dark rise">Field guide</p>
          <h1 className="h-display rise rise-2 mt-5 max-w-4xl !text-white">
            India's <span className="italic-serif text-gold-300">Big Four</span> venomous snakes
          </h1>
          <p className="rise rise-3 mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            Four species cause most serious snakebites in India, and the standard polyvalent anti-snake venom is made against them. Learn how to recognise them — but remember that{' '}
            <strong className="text-white">every snakebite needs a hospital, whichever snake it was.</strong>
          </p>
          <div className="rise rise-4 mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/identify" className="btn btn-gold">
              <Camera size={18} aria-hidden /> Identify a snake from a photo
            </Link>
            <Link to="/emergency" className="btn btn-light">
              <Siren size={18} aria-hidden /> Bitten? First aid
            </Link>
          </div>
          <nav aria-label="Jump to a snake" className="rise rise-5 mt-10 flex flex-wrap gap-2">
            {bigFour.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className="rounded-full border border-white/25 bg-white/5 px-4 py-2 text-[13px] font-medium text-white/90 no-underline backdrop-blur transition hover:border-gold-300 hover:text-gold-300">
                0{i + 1} · {s.name}
              </a>
            ))}
          </nav>
        </div>
        <p className="absolute bottom-3 right-4 rounded bg-black/50 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm">
          Photo: {hero.author} · {hero.license}
        </p>
      </section>

      {/* One chapter per snake: photo and text slide in from opposite sides */}
      <div className="container-wide space-y-28 py-20 sm:space-y-40 sm:py-32">
        {bigFour.map((s, i) => {
          const flip = i % 2 === 1;
          const dir = flip ? 1 : -1;
          return (
            <article key={s.id} id={s.id} className="grid scroll-mt-28 items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <motion.div
                initial={reduce ? false : { opacity: 0, x: dir * 90 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-12%' }}
                transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
                className={flip ? 'lg:order-2' : ''}
              >
                <ParallaxPhoto kind={s.id} className="h-[26rem] shadow-lift sm:h-[34rem] lg:h-[40rem]" />
              </motion.div>

              <motion.div
                initial={reduce ? false : { opacity: 0, x: -dir * 90 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-12%' }}
                transition={{ duration: 1, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <p className="font-serif text-7xl font-medium leading-none text-gold-300" aria-hidden>
                  0{i + 1}
                </p>
                <h2 className="mt-4 text-5xl sm:text-6xl">{s.name}</h2>
                <p className="italic-serif mt-2 text-xl text-muted">{s.scientific}</p>
                <p className="mt-5">
                  <span className="badge badge-danger">
                    <TriangleAlert size={13} aria-hidden /> {s.venomShort}
                  </span>
                </p>
                <dl className="mt-8 space-y-6 text-[15.5px]">
                  <div className="flex gap-4">
                    <Phone size={18} className="mt-1 shrink-0 text-danger-600" aria-hidden />
                    <div>
                      <dt className="font-semibold">Its venom</dt>
                      <dd className="mt-0.5 text-ink-2">{s.venom}</dd>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Eye size={18} className="mt-1 shrink-0 text-brand-700" aria-hidden />
                    <div>
                      <dt className="font-semibold">What it looks like</dt>
                      <dd className="mt-0.5 text-ink-2">{s.look}</dd>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPin size={18} className="mt-1 shrink-0 text-brand-700" aria-hidden />
                    <div>
                      <dt className="font-semibold">Where you may meet it</dt>
                      <dd className="mt-0.5 text-ink-2">{s.where}</dd>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Moon size={18} className="mt-1 shrink-0 text-brand-700" aria-hidden />
                    <div>
                      <dt className="font-semibold">Behaviour</dt>
                      <dd className="mt-0.5 text-ink-2">{s.behaviour}</dd>
                    </div>
                  </div>
                </dl>
                <p className="mt-7 rounded-2xl border border-gold-500/40 bg-gold-100 p-5 text-[15px] leading-relaxed text-ink-2">
                  <strong className="text-gold-700">Remember:</strong> {s.warning}
                </p>
              </motion.div>
            </article>
          );
        })}
      </div>

      <div className="container-x pb-8">
        <Reveal className="rounded-[2rem] border border-danger-600/25 bg-danger-50 p-8 sm:p-12">
          <h2 className="text-3xl text-danger-700 sm:text-4xl">Not sure which snake it was? It doesn't matter.</h2>
          <p className="mt-4 max-w-3xl text-lg text-ink-2">
            Doctors treat according to the symptoms, so you do not need to identify or catch the snake. Call <a className="font-bold text-danger-700" href="tel:108">108</a> or{' '}
            <a className="font-bold text-danger-700" href="tel:112">112</a>, keep the person calm and the bitten limb still, and get to a hospital.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {['Do not cut the bite or suck out venom', 'Do not tie a tight tourniquet', 'Do not use herbs, ice or traditional remedies', 'Do not try to catch or kill the snake'].map((d) => (
              <li key={d} className="flex gap-3 text-[15px] text-ink-2">
                <X size={18} className="mt-0.5 shrink-0 text-danger-600" aria-hidden /> {d}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="tel:108" className="btn btn-danger pulse-ring">
              <Phone size={18} aria-hidden /> Call 108 — Ambulance
            </a>
            <Link to="/emergency" className="btn btn-outline-danger">
              Full first-aid guide &amp; nearby hospitals
            </Link>
          </div>
        </Reveal>

        <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-muted">
          General information for education, drawn from public-health guidance (WHO; India's National Centre for Disease Control). Photographs are credited on each image. Many harmless
          snakes resemble these species, so never rely on appearance alone.
        </p>
      </div>
    </>
  );
}
