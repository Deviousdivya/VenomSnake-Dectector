import { Link } from 'react-router-dom';
import { Camera, Eye, MapPin, Moon, Phone, Siren, TriangleAlert, X } from 'lucide-react';
import { Seo } from '../seo/Seo';
import { Reveal } from '../components/Reveal';
import { SnakePhoto } from '../components/SnakePhoto';
import { bigFour } from '../data/bigFour';

export default function BigFour() {
  return (
    <>
      <Seo path="/big-four" />

      <section className="grain relative overflow-hidden bg-brand-950 text-white">
        <div aria-hidden className="scales-light absolute inset-0" />
        <div aria-hidden className="drift absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-brand-700/40 blur-3xl" />
        <div className="container-x relative py-16 sm:py-24">
          <p className="eyebrow on-dark rise">Field guide</p>
          <h1 className="h-display rise rise-2 mt-5 max-w-3xl !text-white">
            India's <span className="italic-serif text-gold-300">Big Four</span> venomous snakes
          </h1>
          <p className="rise rise-3 mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
            Four species cause most serious snakebites in India, and the standard polyvalent anti-snake venom is made against them. Learn how to recognise them — but remember
            that <strong className="text-white">every snakebite needs a hospital, whichever snake it was.</strong>
          </p>
          <div className="rise rise-4 mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/identify" className="btn btn-gold"><Camera size={18} aria-hidden /> Identify a snake from a photo</Link>
            <Link to="/emergency" className="btn border border-white/30 text-white hover:bg-white/10"><Siren size={18} aria-hidden /> Bitten? First aid</Link>
          </div>
        </div>
      </section>

      <div className="container-x space-y-20 py-16 sm:space-y-28 sm:py-24">
        {bigFour.map((s, i) => (
          <Reveal as="article" key={s.id} className="grid items-center gap-10 lg:grid-cols-2">
            <div className={`overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-line ${i % 2 ? 'lg:order-2' : ''}`}>
              <SnakePhoto kind={s.id} className="h-72 w-full sm:h-96" />
            </div>
            <div>
              <p className="eyebrow">0{i + 1}</p>
              <h2 className="mt-3 text-4xl sm:text-5xl">{s.name}</h2>
              <p className="italic-serif mt-1 text-xl text-muted">{s.scientific}</p>
              <p className="mt-4"><span className="badge badge-danger"><TriangleAlert size={13} aria-hidden /> {s.venomShort}</span></p>
              <dl className="mt-7 space-y-5 text-[15.5px]">
                <div className="flex gap-3">
                  <Phone size={18} className="mt-1 shrink-0 text-danger-600" aria-hidden />
                  <div><dt className="font-extrabold">Its venom</dt><dd className="text-ink-2">{s.venom}</dd></div>
                </div>
                <div className="flex gap-3">
                  <Eye size={18} className="mt-1 shrink-0 text-brand-700" aria-hidden />
                  <div><dt className="font-extrabold">What it looks like</dt><dd className="text-ink-2">{s.look}</dd></div>
                </div>
                <div className="flex gap-3">
                  <MapPin size={18} className="mt-1 shrink-0 text-brand-700" aria-hidden />
                  <div><dt className="font-extrabold">Where you may meet it</dt><dd className="text-ink-2">{s.where}</dd></div>
                </div>
                <div className="flex gap-3">
                  <Moon size={18} className="mt-1 shrink-0 text-brand-700" aria-hidden />
                  <div><dt className="font-extrabold">Behaviour</dt><dd className="text-ink-2">{s.behaviour}</dd></div>
                </div>
              </dl>
              <p className="mt-6 rounded-2xl border border-gold-500/40 bg-gold-100 p-4 text-[15px] text-ink-2">
                <strong className="text-gold-700">Remember:</strong> {s.warning}
              </p>
            </div>
          </Reveal>
        ))}

        <Reveal className="rounded-[2rem] border border-danger-600/25 bg-danger-50 p-8 sm:p-12">
          <h2 className="text-3xl text-danger-700 sm:text-4xl">Not sure which snake it was? It doesn't matter.</h2>
          <p className="mt-4 max-w-3xl text-lg text-ink-2">
            Doctors treat according to the symptoms, so you do not need to identify or catch the snake. Call <a className="font-extrabold text-danger-700" href="tel:108">108</a> or{' '}
            <a className="font-extrabold text-danger-700" href="tel:112">112</a>, keep the person calm and the bitten limb still, and get to a hospital.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {['Do not cut the bite or suck out venom', 'Do not tie a tight tourniquet', 'Do not use herbs, ice or traditional remedies', 'Do not try to catch or kill the snake'].map((d) => (
              <li key={d} className="flex gap-3 text-[15px] text-ink-2"><X size={18} className="mt-0.5 shrink-0 text-danger-600" aria-hidden /> {d}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="tel:108" className="btn btn-danger pulse-ring"><Phone size={18} aria-hidden /> Call 108 — Ambulance</a>
            <Link to="/emergency" className="btn btn-outline-danger">Full first-aid guide &amp; nearby hospitals</Link>
          </div>
        </Reveal>

        <p className="mx-auto max-w-3xl text-center text-sm text-muted">
          General information for education, drawn from public-health guidance (WHO; India's National Centre for Disease Control). Skin-pattern pictures are illustrations, not photographs.
          Many harmless snakes resemble these species, so never rely on appearance alone.
        </p>
      </div>
    </>
  );
}
