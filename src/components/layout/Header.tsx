import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Languages, Menu, Siren, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../context/LanguageContext';
import { languages, LanguageCode } from '../../locales/translations';

function LanguageSelect({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div className={cn('relative', className)}>
      <label htmlFor="lang-select" className="sr-only">
        Language
      </label>
      <Languages size={16} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-700" />
      <select
        id="lang-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
        className="h-10 cursor-pointer appearance-none rounded-full border border-line bg-white pl-9 pr-8 text-sm font-medium text-ink hover:border-brand-600"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
      <ChevronDown size={14} aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
    </div>
  );
}

export function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { to: '/identify', label: t('nav_identify') },
    { to: '/symptom-checker', label: t('nav_symptoms') },
    { to: '/emergency', label: t('nav_emergency') },
    { to: '/insights', label: t('nav_news') },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-full px-4 py-2 text-[15px] font-medium no-underline transition',
      isActive ? 'bg-brand-100 text-brand-900' : 'text-ink-2 hover:bg-brand-50 hover:text-ink'
    );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="container-x flex h-[68px] items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2.5 no-underline" aria-label="VenomSnake Detector - home">
          <img src="/favicon.svg" alt="" width={36} height={36} />
          <span className="font-serif text-[22px] font-semibold leading-none tracking-tight text-ink">
            VenomSnake<span className="hidden text-brand-700 sm:inline"> Detector</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelect className="hidden sm:block" />
          <Link to="/emergency" className="btn btn-danger btn-sm hidden sm:inline-flex">
            <Siren size={16} aria-hidden /> {t('cta_get_help')}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-ink lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-paper lg:hidden">
          <nav aria-label="Mobile" className="container-x flex flex-col gap-1 py-4">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => cn(linkClass({ isActive }), 'py-3 text-base')}>
                {l.label}
              </NavLink>
            ))}
            <div className="mt-3 flex items-center gap-3 sm:hidden">
              <LanguageSelect className="flex-1 [&_select]:w-full" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
