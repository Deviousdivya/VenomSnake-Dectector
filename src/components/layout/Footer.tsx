import { Link } from 'react-router-dom';
import { Info, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  const col = 'space-y-3 text-[15px]';
  const link = 'text-ink-2 no-underline hover:text-brand-700 hover:underline underline-offset-2';

  return (
    <footer className="mt-24 border-t border-line bg-white pb-28 md:pb-0">
      <div className="container-x grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="" width={32} height={32} />
            <span className="font-serif text-xl font-semibold">VenomSnake Detector</span>
          </div>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
            AI-assisted snake identification and snakebite help, with the nearest hospitals and emergency contacts when it matters.
          </p>
        </div>

        <nav aria-label="Tools" className={col}>
          <p className="text-sm font-semibold uppercase tracking-wider text-ink">Tools</p>
          <ul className="space-y-3">
            <li><Link className={link} to="/identify">{t('nav_identify')}</Link></li>
            <li><Link className={link} to="/symptom-checker">{t('nav_symptoms')}</Link></li>
            <li><Link className={link} to="/emergency">{t('nav_emergency')}</Link></li>
            <li><Link className={link} to="/big-four">Big Four snakes</Link></li>
            <li><Link className={link} to="/insights">{t('nav_news')}</Link></li>
          </ul>
        </nav>

        <nav aria-label="About" className={col}>
          <p className="text-sm font-semibold uppercase tracking-wider text-ink">About</p>
          <ul className="space-y-3">
            <li><Link className={link} to="/about">How it works</Link></li>
            <li><Link className={link} to="/privacy">Privacy policy</Link></li>
            <li><Link className={link} to="/terms">Terms &amp; disclaimer</Link></li>
          </ul>
        </nav>

        <div className="space-y-4">
          <div className="rounded-2xl border border-danger-600/20 bg-danger-50 p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-danger-700">
              <Phone size={16} aria-hidden /> Snakebite emergency
            </p>
            <p className="mt-2 text-sm text-ink-2">
              Call <a className="font-bold text-danger-700" href="tel:108">108</a> (ambulance) or{' '}
              <a className="font-bold text-danger-700" href="tel:112">112</a> (national emergency).
            </p>
          </div>
          <p className="flex gap-2 text-xs leading-relaxed text-muted">
            <Info size={14} aria-hidden className="mt-0.5 shrink-0" />
            <span>
              <strong className="text-ink-2">{t('disclaimer_title')}.</strong> {t('disclaimer_body')}
            </span>
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} VenomSnake Detector. Emergency numbers shown are for India.</p>
          <p>Hospital data © OpenStreetMap contributors</p>
        </div>
      </div>
    </footer>
  );
}
