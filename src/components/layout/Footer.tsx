import { Link } from 'react-router-dom';
import { Info, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  const col = 'space-y-3 text-[15px]';
  const link = 'text-white/70 no-underline transition hover:text-gold-300';

  return (
    <footer className="relative mt-24 overflow-hidden bg-brand-950 pb-28 text-white md:pb-0">
      <div aria-hidden className="scales-light absolute inset-0 opacity-70" />
      <div className="container-wide relative grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="" width={34} height={34} />
            <span className="font-serif text-2xl font-medium">VenomSnake <span className="italic text-gold-300">Detector</span></span>
          </div>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/65">
            AI-assisted snake identification and snakebite help, with the nearest hospitals and emergency contacts when it matters.
          </p>
        </div>

        <nav aria-label="Tools" className={col}>
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-300">Tools</p>
          <ul className="space-y-3">
            <li><Link className={link} to="/identify">{t('nav_identify')}</Link></li>
            <li><Link className={link} to="/symptom-checker">{t('nav_symptoms')}</Link></li>
            <li><Link className={link} to="/emergency">{t('nav_emergency')}</Link></li>
            <li><Link className={link} to="/big-four">Big Four snakes</Link></li>
            <li><Link className={link} to="/insights">{t('nav_news')}</Link></li>
          </ul>
        </nav>

        <nav aria-label="About" className={col}>
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-300">About</p>
          <ul className="space-y-3">
            <li><Link className={link} to="/about">How it works</Link></li>
            <li><Link className={link} to="/privacy">Privacy policy</Link></li>
            <li><Link className={link} to="/terms">Terms &amp; disclaimer</Link></li>
          </ul>
        </nav>

        <div className="space-y-4">
          <div className="rounded-2xl border border-danger-600/40 bg-danger-600/15 p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-danger-100">
              <Phone size={16} aria-hidden /> Snakebite emergency
            </p>
            <p className="mt-2 text-sm text-white/80">
              Call <a className="font-bold text-white underline" href="tel:108">108</a> (ambulance) or{' '}
              <a className="font-bold text-white underline" href="tel:112">112</a> (national emergency).
            </p>
          </div>
          <p className="flex gap-2 text-xs leading-relaxed text-white/55">
            <Info size={14} aria-hidden className="mt-0.5 shrink-0" />
            <span>
              <strong className="text-white/80">{t('disclaimer_title')}.</strong> {t('disclaimer_body')}
            </span>
          </p>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-wide flex flex-col items-center justify-between gap-2 py-5 text-sm text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} VenomSnake Detector. Emergency numbers shown are for India.</p>
          <p>Hospital data © OpenStreetMap contributors · Photos credited on each image</p>
        </div>
      </div>
    </footer>
  );
}
