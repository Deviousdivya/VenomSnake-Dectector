import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Camera, CircleCheck, ExternalLink, Globe, Hospital, Info, MapPin, Phone, ScanSearch, Siren, Smartphone, Stethoscope, X,
} from 'lucide-react';
import { Seo, faq } from '../seo/Seo';
import { useLanguage } from '../context/LanguageContext';
import { Reveal, trackSpotlight } from '../components/Reveal';
import { HeroDemo } from '../components/HeroDemo';
import { SnakeLine } from '../components/SnakeLine';
import { SkinPattern } from '../components/SkinPattern';
import { bigFour } from '../data/bigFour';

const steps = [
  { icon: Camera, title: 'Take or upload a photo', body: 'From at least two metres away, with the whole snake in view and good light. Never touch or corner it.' },
  { icon: ScanSearch, title: 'Get an identification', body: 'See the likely species, whether it is venomous, and practical precautions in your language.' },
  { icon: Hospital, title: 'Get help nearby', body: 'For venomous snakes you also see hospitals closest to you, call buttons, and rescue contacts.' },
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

export default function Home() {
  const { t } = useLanguage();
  // the headline is three short sentences - style each one differently
  const lines = t('home_h1').split(/(?<=[.।])\s+/);

  return (
    <>
      <Seo path="/" />

      {/* Hero */}
      <section className="grain relative overflow-hidden">
        <div aria-hidden className="scales absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div aria-hidden className="drift absolute -right-48 -top-48 h-[640px] w-[640px] rounded-full bg-brand-100/80 blur-3xl" />
        <div aria-hidden className="drift absolute -left-40 top-1/2 h-[420px] w-[420px] rounded-full bg-gold-100/90 blur-3xl [animation-delay:-8s]" />
        <SnakeLine className="pointer-events-none absolute -right-24 top-0 hidden h-[760px] opacity-[0.22] lg:block" />

        <div className="container-x relative grid items-center gap-16 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
          <div>
            <p className="eyebrow rise">Snakebite safety · Made for India</p>
            <h1 className="h-display rise rise-2 mt-5">
              {lines.map((l, i) => (
                <span key={i} className={['block', i === 1 ? 'italic-serif text-gold-700' : i === 2 ? 'text-brand-700' : ''].join(' ')}>
                  {l}
                </span>
              ))}
            </h1>
            <p className="lead rise rise-3 mt-7 max-w-xl">{t('home_sub')}</p>
            <div className="rise rise-4 mt-10 flex flex-col gap-3 sm:flex-row">
              <Link to="/identify" className="btn btn-primary group !px-7 !py-4 text-base">
                <Camera size={19} aria-hidden /> {t('cta_identify')} <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/emergency" className="btn btn-outline-danger !px-7 !py-4 text-base">
                <Siren size={19} aria-hidden /> {t('cta_bitten')}
              </Link>
            </div>
            <ul className="rise rise-4 mt-7 flex flex-wrap gap-2 text-[13px] font-bold text-ink-2">
              {['Free', 'No sign-up', 'Works on any phone', 'English · हिन्दी'].map((c) => (
                <li key={c} className="rounded-full border border-line bg-surface/80 px-3.5 py-1.5 backdrop-blur">{c}</li>
              ))}
            </ul>
            <p className="rise rise-4 mt-6 flex max-w-xl items-start gap-2 text-sm text-muted">
              <Info size={16} className="mt-0.5 shrink-0" aria-hidden /> {t('home_warning')}
            </p>
          </div>
          <HeroDemo />
        </div>
      </section>

      {/* Ticker */}
      <div className="overflow-hidden border-y border-brand-900 bg-brand-900 py-4 text-brand-100" aria-hidden>
        <div className="marquee">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center">
              {ticker.map((s) => (
                <Fragment key={s}>
                  <span className="whitespace-nowrap px-6 font-serif text-xl italic">{s}</span>
                  <span className="text-gold-300">◆</span>
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section className="section" aria-labelledby="how-title">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2 id="how-title" className="h-section mt-4 max-w-2xl">From a photo to help, in three steps</h2>
          </Reveal>
          <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
            <div aria-hidden className="absolute left-[16%] right-[16%] top-[3.1rem] hidden border-t-2 border-dashed border-gold-300 md:block" />
            {steps.map((s, i) => (
              <Reveal key={s.title} as="li" delay={i * 120} onMouseMove={trackSpotlight} className="card card-pad spotlight card-hover relative">
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-brand-700 text-white shadow-[0_12px_24px_-10px_rgba(15,97,73,0.7)]">
                  <s.icon size={26} aria-hidden />
                </span>
                <span className="absolute right-7 top-5 font-serif text-6xl font-medium text-gold-100" aria-hidden>{i + 1}</span>
                <h3 className="relative mt-6 text-2xl">{s.title}</h3>
                <p className="relative mt-2 text-[15px] text-ink-2">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Features - bento */}
      <section className="section bg-surface" aria-labelledby="features-title">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">What you get</p>
            <h2 id="features-title" className="h-section mt-4 max-w-2xl">Everything for the moments that matter</h2>
          </Reveal>
          <ul className="mt-14 grid gap-5 md:grid-cols-6">
            {[
              { span: 'md:col-span-3', icon: ScanSearch, tone: 'bg-brand-900 text-white', title: 'Species identification', body: 'AI-assisted identification from a single photo, with a clear venomous or non-venomous result and the precautions that go with it.', dark: true },
              { span: 'md:col-span-3', icon: MapPin, tone: 'bg-gold-100', title: 'Nearest hospitals', body: 'Real hospitals around your location, nearest first, with directions and phone numbers where known. Always call ahead to confirm antivenom.' },
              { span: 'md:col-span-2', icon: Phone, tone: 'bg-surface', title: 'One-tap emergency calls', body: 'Call 108 or 112 straight away, and send your GPS location by message or share sheet.' },
              { span: 'md:col-span-2', icon: Stethoscope, tone: 'bg-surface', title: 'Symptom checker', body: 'No photo? Mark the bite site, tick symptoms and get a plain-language summary and a PDF for your doctor.' },
              { span: 'md:col-span-2', icon: Smartphone, tone: 'bg-surface', title: 'Light and installable', body: 'Works well on slow connections and can be added to your home screen. Scans need internet access.' },
              { span: 'md:col-span-6', icon: Globe, tone: 'bg-brand-50', title: 'English and Hindi', body: 'The interface is in English and Hindi, and AI answers are written in the language you choose.' },
            ].map((f, i) => (
              <Reveal key={f.title} as="li" delay={(i % 3) * 100} className={`${f.span}`}>
                <div onMouseMove={trackSpotlight} className={`spotlight card-hover h-full rounded-3xl border border-line p-7 shadow-card ${f.tone}`}>
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl ${f.dark ? 'bg-white/10 text-gold-300 ring-1 ring-white/15' : 'bg-brand-100 text-brand-800'}`}>
                    <f.icon size={22} aria-hidden />
                  </span>
                  <h3 className={`mt-5 text-2xl ${f.dark ? '!text-white' : ''}`}>{f.title}</h3>
                  <p className={`mt-2 max-w-md text-[15px] ${f.dark ? 'text-white/80' : 'text-ink-2'}`}>{f.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Big Four */}
      <section className="section" aria-labelledby="big4-title">
        <div className="container-x">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Know the dangerous four</p>
              <h2 id="big4-title" className="h-section mt-4 max-w-2xl">India's “Big Four” venomous snakes</h2>
              <p className="lead mt-4 max-w-2xl">Most serious snakebites in India are from just four species. Learn what they look like — and why every bite needs a hospital.</p>
            </div>
            <Link to="/big-four" className="btn btn-outline">
              Full guide <ArrowRight size={16} aria-hidden />
            </Link>
          </Reveal>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bigFour.map((s, i) => (
              <Reveal key={s.id} as="li" delay={i * 110}>
                <Link to="/big-four" className="card card-hover group block h-full overflow-hidden no-underline">
                  <div className="h-36 overflow-hidden">
                    <SkinPattern kind={s.id} className="h-full w-full transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-[1.45rem]">{s.name}</h3>
                    <p className="italic-serif text-muted">{s.scientific}</p>
                    <p className="mt-4"><span className="badge badge-danger">{s.venomShort}</span></p>
                    <p className="mt-4 text-sm text-ink-2">{s.look}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* First aid */}
      <section className="scales-light relative bg-brand-950 py-20 text-white sm:py-28" aria-labelledby="aid-title">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow on-dark">First aid</p>
            <h2 id="aid-title" className="h-section mt-4 max-w-2xl !text-white">If someone has been bitten</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal className="rounded-3xl bg-white/[0.06] p-8 ring-1 ring-white/15">
              <h3 className="flex items-center gap-2 font-sans text-lg font-extrabold tracking-normal !text-white">
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
              <h3 className="flex items-center gap-2 font-sans text-lg font-extrabold tracking-normal !text-white">
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
                  <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-100 text-xl text-gold-700 transition duration-300 group-open:rotate-45 group-open:bg-brand-700 group-open:text-white">
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
      <section className="section">
        <div className="container-x">
          <Reveal className="grain relative overflow-hidden rounded-[2rem] bg-brand-900 px-6 py-16 text-center sm:px-12">
            <div aria-hidden className="scales-light absolute inset-0" />
            <div className="relative">
              <h2 className="h-section mx-auto max-w-2xl !text-white">Spotted a snake? Find out what it is.</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">Upload a photo and get a result in moments. Keep your distance.</p>
              <Link to="/identify" className="btn btn-gold mt-9 !px-8 !py-4 text-base">
                <Camera size={19} aria-hidden /> {t('cta_identify')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
