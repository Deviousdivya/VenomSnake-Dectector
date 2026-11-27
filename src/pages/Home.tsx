import { Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Camera, CircleCheck, ExternalLink, Globe, Hospital, Info, MapPin, Phone, ScanSearch, Siren, Smartphone, Stethoscope, TriangleAlert, X } from 'lucide-react';
import { Seo, faq } from '../seo/Seo';
import { useLanguage } from '../context/LanguageContext';
import { Reveal, trackSpotlight } from '../components/Reveal';
import { CountUp } from '../components/CountUp';
import { ParallaxPhoto } from '../components/ParallaxPhoto';
import { BigFourShowcase } from '../components/BigFourShowcase';
import { bigFourPhotos } from '../data/bigFour';

const steps = [
  { icon: Camera, title: 'Take or upload a photo', body: 'From at least two metres away, with the whole snake in view and good light. Never touch or corner it.' },
  { icon: ScanSearch, title: 'Get a clear answer', body: 'One plain verdict: venomous, not venomous, or not sure. With the species and what to do next, in your language.' },
  { icon: Hospital, title: 'Get help nearby', body: 'For venomous snakes you also see the hospitals closest to you, one-tap call buttons, and rescue contacts.' },
];

const dos = [
  'Call 108 or 112 straight away.',
  'Keep the person calm and the bitten limb still.',
  'Remove rings, watches and tight clothing near the bite.',
  'Note the time of the bite and any symptoms.',
  'Get to a hospital quickly — by ambulance if you can.',
];
const donts = [
  'Cut the bite or try to suck out the venom.',
  'Tie a tight tourniquet.',
  'Apply ice, heat, herbs or traditional remedies.',
  'Try to catch or kill the snake.',
  'Wait for symptoms before asking for help.',
];

const ticker = ['Indian cobra', "Russell's viper", 'Common krait', 'Saw-scaled viper', 'King cobra', 'Indian rock python', 'Rat snake', 'Green vine snake', 'Checkered keelback', 'Wolf snake'];

function Hero() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], ['0px', '-80px']);
  const p = bigFourPhotos.cobra;
  // the headline is three short sentences - style each one differently
  const lines = t('home_h1').split(/(?<=[.।])\s+/);

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-brand-950 text-white">
      <motion.div style={{ y: reduce ? 0 : imgY }} className="absolute inset-0 -z-10">
        <img
          src={p.lg}
          alt={p.alt}
          fetchPriority="high"
          decoding="async"
          className="ken-burns h-full w-full object-cover object-[68%_55%]"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950 via-brand-950/70 to-transparent" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950 via-transparent to-brand-950/45" />
      <div aria-hidden className="grain absolute inset-0 -z-10 opacity-60" />

      <motion.div style={{ opacity: reduce ? 1 : fade, y: reduce ? 0 : lift }} className="container-wide relative w-full pb-24 pt-40 sm:pb-28">
        <p className="eyebrow on-dark rise">Snakebite safety · Made for India</p>
        <h1 className="h-display rise rise-2 mt-6 max-w-4xl !text-white">
          {lines.map((l, i) => (
            <span key={i} className={['block', i === 1 ? 'italic-serif text-gold-300' : ''].join(' ')}>
              {l}
            </span>
          ))}
        </h1>
        <p className="rise rise-3 mt-7 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">{t('home_sub')}</p>
        <div className="rise rise-4 mt-10 flex flex-col gap-3 sm:flex-row">
          <Link to="/identify" className="btn btn-gold group !px-8 !py-4 text-base">
            <Camera size={19} aria-hidden /> {t('cta_identify')} <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/emergency" className="btn btn-light !px-8 !py-4 text-base">
            <Siren size={19} aria-hidden /> {t('cta_bitten')}
          </Link>
        </div>
        <ul className="rise rise-5 mt-8 flex flex-wrap gap-2 text-[12.5px] font-medium text-white/80">
          {['Free', 'No sign-up', 'Works on any phone', 'English · हिन्दी'].map((c) => (
            <li key={c} className="rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 backdrop-blur">
              {c}
            </li>
          ))}
        </ul>
        <p className="rise rise-5 mt-6 flex max-w-xl items-start gap-2 text-sm text-white/60">
          <Info size={16} className="mt-0.5 shrink-0" aria-hidden /> {t('home_warning')}
        </p>
      </motion.div>

      <div aria-hidden className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50 md:flex">
        Scroll
        <span className="relative block h-9 w-px overflow-hidden bg-white/20">
          <span className="scroll-cue absolute inset-x-0 top-0 h-3 bg-gold-300" />
        </span>
      </div>
      <p className="absolute bottom-3 right-4 rounded bg-black/50 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm">
        Photo: {p.author} ·{' '}
        <a className="underline" href={p.page} target="_blank" rel="noopener noreferrer">
          {p.license}
        </a>
      </p>
    </section>
  );
}

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <Seo path="/" />
      <Hero />

      {/* Ticker */}
      <div className="overflow-hidden border-y border-gold-500/30 bg-brand-950 py-5 text-white/80" aria-hidden>
        <div className="marquee">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center">
              {ticker.map((s) => (
                <Fragment key={s}>
                  <span className="whitespace-nowrap px-7 font-serif text-2xl italic">{s}</span>
                  <span className="text-gold-300">◆</span>
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Why it matters */}
      <section className="section" aria-labelledby="matters-title">
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Why it matters</p>
            <h2 id="matters-title" className="h-section mt-4">
              Fast, calm action <span className="italic-serif text-gold-700">saves lives</span>
            </h2>
            <p className="lead mt-5">
              Snakebite is one of India's most overlooked emergencies, and most deaths are preventable with quick transport to a hospital that has anti-snake venom.
            </p>
          </Reveal>
          <dl className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-line sm:grid-cols-3">
            {[
              { n: 58000, suffix: '', label: 'people die of snakebite in India every year (average, 2000–2019)', note: 'Million Death Study, eLife 2020' },
              { n: 4, suffix: '', label: 'species — the “Big Four” — cause most serious bites', note: 'Cobra · Krait · Russell’s viper · Saw-scaled viper' },
              { n: 108, suffix: '', label: 'is the number to call, before anything else', note: 'Or 112, the national emergency number' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 120} className="bg-surface p-8 sm:p-10">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <p className="font-serif text-6xl font-medium text-brand-800 sm:text-7xl">
                    <CountUp to={s.n} />
                  </p>
                  <p className="mt-4 text-[15.5px] leading-snug text-ink">{s.label}</p>
                  <p className="mt-3 text-xs uppercase tracking-wider text-muted">{s.note}</p>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Big Four — slides past full-screen */}
      <section aria-labelledby="big4-title" className="bg-brand-950 pt-24 text-white sm:pt-32">
        <div className="container-wide pb-14 sm:pb-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow on-dark">Know the dangerous four</p>
              <h2 id="big4-title" className="h-section mt-4 max-w-3xl !text-white">
                India's “Big Four” <span className="italic-serif text-gold-300">venomous snakes</span>
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
                Most serious snakebites in India come from just four species. Learn what they look like — and why every bite needs a hospital.
              </p>
            </div>
            <Link to="/big-four" className="btn btn-light">
              Full field guide <ArrowRight size={16} aria-hidden />
            </Link>
          </Reveal>
        </div>
        <BigFourShowcase />
      </section>

      {/* How it works */}
      <section className="section" aria-labelledby="how-title">
        <div className="container-wide grid items-start gap-14 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <Reveal>
              <p className="eyebrow">How it works</p>
              <h2 id="how-title" className="h-section mt-4 max-w-xl">
                From a photo to help, <span className="italic-serif text-gold-700">in three steps</span>
              </h2>
            </Reveal>
            <ol className="mt-12 space-y-4">
              {steps.map((s, i) => (
                <Reveal key={s.title} as="li" delay={i * 120} onMouseMove={trackSpotlight} className="card spotlight card-hover flex gap-6 p-6 sm:p-8">
                  <span className="font-serif text-6xl font-medium leading-none text-gold-300" aria-hidden>
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="flex items-center gap-3 text-2xl">
                      <s.icon size={22} className="text-brand-700" aria-hidden /> {s.title}
                    </h3>
                    <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal className="lg:sticky lg:top-28">
            <ParallaxPhoto kind="russell" className="h-[26rem] sm:h-[34rem] lg:h-[40rem]" />
          </Reveal>
        </div>
      </section>

      {/* Sample answer */}
      <section className="relative overflow-hidden bg-brand-900 py-24 text-white sm:py-32" aria-labelledby="answer-title">
        <div aria-hidden className="scales-light absolute inset-0" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow on-dark">A simple answer</p>
            <h2 id="answer-title" className="h-section mt-4 !text-white">
              No jargon. <span className="italic-serif text-gold-300">Just what to do.</span>
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/75">
              You get one clear verdict, the likely species, and the next step. The details are there if you want them, tucked behind a single tap.
            </p>
            <Link to="/identify" className="btn btn-gold mt-9">
              <Camera size={18} aria-hidden /> {t('cta_identify')}
            </Link>
          </Reveal>

          <Reveal delay={150}>
            <div className="overflow-hidden rounded-3xl bg-surface text-ink shadow-lift">
              <div className="flex items-center gap-3 bg-danger-600 px-6 py-4 text-white">
                <TriangleAlert size={22} aria-hidden />
                <p className="font-serif text-xl font-medium">Venomous — keep away</p>
              </div>
              <div className="grid sm:grid-cols-[0.9fr_1fr]">
                <div className="relative h-52 sm:h-auto">
                  <img src={bigFourPhotos.cobra.src} alt={bigFourPhotos.cobra.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: bigFourPhotos.cobra.position }} />
                </div>
                <div className="p-6">
                  <p className="font-serif text-3xl">Indian cobra</p>
                  <p className="italic-serif text-muted">Naja naja</p>
                  <p className="mt-4 text-sm font-semibold text-ink">How sure: High</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full w-[88%] rounded-full bg-brand-700" /></div>
                  <ul className="mt-5 space-y-2 text-sm text-ink-2">
                    <li className="flex gap-2"><CircleCheck size={16} className="mt-0.5 shrink-0 text-brand-700" aria-hidden /> Stay 2 metres away. Don't touch it.</li>
                    <li className="flex gap-2"><CircleCheck size={16} className="mt-0.5 shrink-0 text-brand-700" aria-hidden /> If bitten, call 108 straight away.</li>
                  </ul>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-white/50">Example of a result. Real results depend on your photo.</p>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="section" aria-labelledby="features-title">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">What you get</p>
            <h2 id="features-title" className="h-section mt-4 max-w-2xl">Everything for the moments that matter</h2>
          </Reveal>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: ScanSearch, title: 'Species identification', body: 'AI-assisted identification from a single photo, with a clear venomous or non-venomous result.' },
              { icon: MapPin, title: 'Nearest hospitals', body: 'Real hospitals around you, nearest first, with directions and phone numbers where known. Always call ahead to confirm antivenom.' },
              { icon: Phone, title: 'One-tap emergency calls', body: 'Call 108 or 112 straight away, and send your GPS location by message or share sheet.' },
              { icon: Stethoscope, title: 'Symptom checker', body: 'No photo? Mark the bite site, answer a few questions and get a plain-language summary and a PDF for your doctor.' },
              { icon: Smartphone, title: 'Light and installable', body: 'Works well on slow connections and can be added to your home screen. Scans need internet access.' },
              { icon: Globe, title: 'English and Hindi', body: 'The interface is in English and Hindi, and AI answers are written in the language you choose.' },
            ].map((f, i) => (
              <Reveal key={f.title} as="li" delay={(i % 3) * 100}>
                <div onMouseMove={trackSpotlight} className="card spotlight card-hover h-full p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-800 text-gold-300">
                    <f.icon size={21} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-2xl">{f.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* First aid */}
      <section className="scales-light relative bg-brand-950 py-24 text-white sm:py-32" aria-labelledby="aid-title">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow on-dark">First aid</p>
            <h2 id="aid-title" className="h-section mt-4 max-w-2xl !text-white">If someone has been bitten</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal className="rounded-3xl bg-white/[0.06] p-8 ring-1 ring-white/15">
              <h3 className="flex items-center gap-2 font-sans text-lg font-bold tracking-normal !text-white">
                <CircleCheck size={20} className="text-brand-200" aria-hidden /> Do
              </h3>
              <ul className="mt-5 space-y-3.5">
                {dos.map((d) => (
                  <li key={d} className="flex gap-3 text-[15px] text-white/90">
                    <CircleCheck size={18} className="mt-0.5 shrink-0 text-brand-200" aria-hidden /> {d}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120} className="rounded-3xl bg-white/[0.06] p-8 ring-1 ring-white/15">
              <h3 className="flex items-center gap-2 font-sans text-lg font-bold tracking-normal !text-white">
                <X size={20} className="text-danger-100" aria-hidden /> Don't
              </h3>
              <ul className="mt-5 space-y-3.5">
                {donts.map((d) => (
                  <li key={d} className="flex gap-3 text-[15px] text-white/90">
                    <X size={18} className="mt-0.5 shrink-0 text-danger-100" aria-hidden /> {d}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="tel:108" className="btn btn-danger pulse-ring">
              <Phone size={18} aria-hidden /> {t('call_ambulance')}
            </a>
            <Link to="/emergency" className="btn bg-white text-brand-900 hover:bg-gold-100">
              Full first-aid guide
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Trusted sources */}
      <section className="section" aria-labelledby="sources-title">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Guidance you can trust</p>
            <h2 id="sources-title" className="h-section mt-4 max-w-2xl">Our first-aid advice follows public-health guidance</h2>
            <p className="lead mt-4 max-w-2xl">Read the sources yourself — and always follow the instructions of the emergency operator and your doctor.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="btn btn-outline" href="https://www.who.int/news-room/fact-sheets/detail/snakebite-envenoming" target="_blank" rel="noopener noreferrer">
                WHO — Snakebite envenoming <ExternalLink size={15} aria-hidden />
              </a>
              <a
                className="btn btn-outline"
                href="https://ncdc.mohfw.gov.in/wp-content/uploads/2024/07/NATIONAL-ACTION-PLAN-FOR-PREVENTION-AND-CONTROL-OF-SNAKEBITE-ENVENOMING-NAPSE.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                India — National Action Plan (NCDC) <ExternalLink size={15} aria-hidden />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-surface" aria-labelledby="faq-title">
        <div className="container-x max-w-3xl">
          <Reveal>
            <p className="eyebrow">Questions</p>
            <h2 id="faq-title" className="h-section mt-4">Frequently asked questions</h2>
          </Reveal>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {faq.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl font-medium marker:hidden">
                  {f.q}
                  <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-100 text-xl text-gold-700 transition duration-300 group-open:rotate-45 group-open:bg-brand-800 group-open:text-white">
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-12 text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative isolate overflow-hidden bg-brand-950 py-28 text-center text-white sm:py-36">
        <img src={bigFourPhotos.sawscaled.lg} alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35" style={{ objectPosition: bigFourPhotos.sawscaled.position }} />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-950 via-brand-950/60 to-brand-950" />
        <div className="container-x">
          <Reveal>
            <h2 className="h-section mx-auto max-w-3xl !text-white sm:!text-[3.6rem]">
              Spotted a snake? <span className="italic-serif text-gold-300">Find out what it is.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">Upload a photo and get a result in moments. Keep your distance.</p>
            <Link to="/identify" className="btn btn-gold mt-10 !px-9 !py-4 text-base">
              <Camera size={19} aria-hidden /> {t('cta_identify')}
            </Link>
          </Reveal>
        </div>
        <p className="absolute bottom-3 right-4 text-[10px] text-white/50">
          Photo: {bigFourPhotos.sawscaled.author} · {bigFourPhotos.sawscaled.license}
        </p>
      </section>
    </>
  );
}
