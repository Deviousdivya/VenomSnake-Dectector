import { Link } from 'react-router-dom';
import {
  Camera, CircleCheck, ExternalLink, Globe, Hospital, Info, MapPin, Phone, ScanSearch, Siren, Smartphone, Stethoscope, TriangleAlert, X,
} from 'lucide-react';
import { Seo, faq } from '../seo/Seo';
import { useLanguage } from '../context/LanguageContext';

function SampleResult() {
  return (
    <div className="rise rise-3 relative">
      <div aria-hidden className="absolute -inset-4 rounded-[32px] bg-brand-200/50 blur-2xl" />
      <article className="card shadow-lift relative overflow-hidden" aria-label="Example of an identification result">
        <div className="flex items-center justify-between border-b border-line bg-paper px-5 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Sample result</span>
          <span className="badge badge-danger">
            <TriangleAlert size={13} aria-hidden /> Venomous
          </span>
        </div>
        <div className="p-6">
          <p className="font-serif text-3xl font-semibold leading-tight">Indian Cobra</p>
          <p className="font-serif text-lg italic text-muted">Naja naja</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-paper p-3">
              <dt className="text-muted">Venom effect</dt>
              <dd className="font-semibold">Neurotoxic, with local tissue damage</dd>
            </div>
            <div className="rounded-xl bg-paper p-3">
              <dt className="text-muted">Risk</dt>
              <dd className="font-semibold">High — act fast</dd>
            </div>
          </dl>
          <div className="mt-4 rounded-xl border border-danger-600/25 bg-danger-50 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-danger-700">
              <Siren size={16} aria-hidden /> If bitten
            </p>
            <p className="mt-1 text-sm text-ink-2">Call 108 now. Keep the limb still. Don't cut or suck the wound.</p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-line p-3 text-sm">
            <span className="flex items-center gap-2">
              <Hospital size={16} className="text-brand-700" aria-hidden /> Nearest hospitals
            </span>
            <span className="font-semibold text-ink-2">listed for your location</span>
          </div>
        </div>
      </article>
    </div>
  );
}

const steps = [
  { icon: Camera, title: 'Take or upload a photo', body: 'From at least two metres away, with the whole snake in view and good light. Never touch or corner it.' },
  { icon: ScanSearch, title: 'Get an identification', body: 'See the likely species, whether it is venomous, and practical precautions in your language.' },
  { icon: Hospital, title: 'Get help nearby', body: 'For venomous snakes you also see hospitals closest to you, call buttons, and rescue contacts.' },
];

const features = [
  { icon: ScanSearch, title: 'Species identification', body: 'AI-assisted identification from a single photo, with a clear venomous or non-venomous result.' },
  { icon: MapPin, title: 'Nearest hospitals', body: 'Real hospitals around your location, nearest first, with directions and phone numbers where known.' },
  { icon: Phone, title: 'One-tap emergency calls', body: 'Call 108 or 112 straight away, and send your GPS location by message or share sheet.' },
  { icon: Stethoscope, title: 'Symptom checker', body: 'No photo? Mark the bite site, tick your symptoms and get a plain-language summary and a PDF for your doctor.' },
  { icon: Globe, title: 'English and Hindi', body: 'The interface is in English and Hindi, and AI results are written in the language you choose.' },
  { icon: Smartphone, title: 'Light and installable', body: 'Works well on slow connections and can be added to your home screen. AI scans need internet access.' },
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

export default function Home() {
  const { t } = useLanguage();
  return (
    <>
      <Seo path="/" />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="scales absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
        <div aria-hidden className="absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-brand-100/80 blur-3xl" />
        <div className="container-x relative grid items-center gap-14 py-14 sm:py-20 lg:grid-cols-[1.12fr_0.88fr] lg:py-28">
          <div>
            <p className="eyebrow rise">Snakebite safety · Made for India</p>
            <h1 className="h-display rise rise-2 mt-4">{t('home_h1')}</h1>
            <p className="lead rise rise-3 mt-6 max-w-xl">{t('home_sub')}</p>
            <div className="rise rise-4 mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/identify" className="btn btn-primary">
                <Camera size={18} aria-hidden /> {t('cta_identify')}
              </Link>
              <Link to="/emergency" className="btn btn-outline-danger">
                <Siren size={18} aria-hidden /> {t('cta_bitten')}
              </Link>
            </div>
            <p className="rise rise-4 mt-6 flex max-w-xl items-start gap-2 text-sm text-muted">
              <Info size={16} className="mt-0.5 shrink-0" aria-hidden /> {t('home_warning')}
            </p>
          </div>
          <SampleResult />
        </div>
      </section>

      {/* How it works */}
      <section className="section" aria-labelledby="how-title">
        <div className="container-x">
          <p className="eyebrow">How it works</p>
          <h2 id="how-title" className="h-section mt-3 max-w-2xl">
            From photo to help in three steps
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="card card-pad relative">
                <span className="absolute right-6 top-5 font-serif text-5xl font-semibold text-brand-100" aria-hidden>
                  {i + 1}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-brand-800">
                  <s.icon size={24} aria-hidden />
                </span>
                <h3 className="mt-5 text-xl">{s.title}</h3>
                <p className="mt-2 text-[15px] text-ink-2">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section className="section bg-white" aria-labelledby="features-title">
        <div className="container-x">
          <p className="eyebrow">What you get</p>
          <h2 id="features-title" className="h-section mt-3 max-w-2xl">
            Built for the moments that matter
          </h2>
          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <li key={f.title} className="flex gap-4">
                <span className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-200">
                  <f.icon size={20} aria-hidden />
                </span>
                <div>
                  <h3 className="font-sans text-lg font-bold tracking-normal">{f.title}</h3>
                  <p className="mt-1 text-[15px] text-ink-2">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* First aid */}
      <section className="section bg-brand-900 text-white" aria-labelledby="aid-title">
        <div className="container-x">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-200">First aid</p>
          <h2 id="aid-title" className="h-section mt-3 max-w-2xl !text-white">
            If someone has been bitten
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-white/[0.07] p-7 ring-1 ring-white/15">
              <h3 className="flex items-center gap-2 font-sans text-lg font-bold tracking-normal !text-white">
                <CircleCheck size={20} className="text-brand-200" aria-hidden /> Do
              </h3>
              <ul className="mt-4 space-y-3">
                {dos.map((d) => (
                  <li key={d} className="flex gap-3 text-[15px] text-white/90">
                    <CircleCheck size={18} className="mt-0.5 shrink-0 text-brand-200" aria-hidden /> {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white/[0.07] p-7 ring-1 ring-white/15">
              <h3 className="flex items-center gap-2 font-sans text-lg font-bold tracking-normal !text-white">
                <X size={20} className="text-danger-100" aria-hidden /> Don't
              </h3>
              <ul className="mt-4 space-y-3">
                {donts.map((d) => (
                  <li key={d} className="flex gap-3 text-[15px] text-white/90">
                    <X size={18} className="mt-0.5 shrink-0 text-danger-100" aria-hidden /> {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="tel:108" className="btn btn-danger">
              <Phone size={18} aria-hidden /> {t('call_ambulance')}
            </a>
            <Link to="/emergency" className="btn bg-white text-brand-900 hover:bg-brand-50">
              Full first-aid guide
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted sources */}
      <section className="section" aria-labelledby="sources-title">
        <div className="container-x">
          <p className="eyebrow">Guidance you can trust</p>
          <h2 id="sources-title" className="h-section mt-3 max-w-2xl">
            Our first-aid advice follows public-health guidance
          </h2>
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
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white" aria-labelledby="faq-title">
        <div className="container-x max-w-3xl">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-title" className="h-section mt-3">
            Frequently asked questions
          </h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {faq.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl font-semibold marker:hidden">
                  {f.q}
                  <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-10 text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section">
        <div className="container-x">
          <div className="card scales overflow-hidden bg-brand-50 px-6 py-14 text-center sm:px-12">
            <h2 className="h-section mx-auto max-w-2xl">Spotted a snake? Find out what it is.</h2>
            <p className="lead mx-auto mt-4 max-w-xl">Upload a photo and get a result in moments. Keep your distance.</p>
            <Link to="/identify" className="btn btn-primary mt-8">
              <Camera size={18} aria-hidden /> {t('cta_identify')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
