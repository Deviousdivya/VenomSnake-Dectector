import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Languages, Menu, Siren, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../context/LanguageContext';
import { languages, LanguageCode } from '../../locales/translations';

/** Pages that open with a full-screen photograph: the header floats over it, then turns solid on scroll. */
export const OVERLAY_ROUTES = ['/', '/big-four'];

function LanguageSelect({ className, dark }: { className?: string; dark: boolean }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div className={cn('relative', className)}>
      <label htmlFor="lang-select" className="sr-only">
        Language
      </label>
      <Languages size={15} aria-hidden className={cn('pointer-events-none absolute left-3 top-1/2 -translate-y-1/2', dark ? 'text-gold-300' : 'text-brand-700')} />
      <select
        id="lang-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
        className={cn(
          'h-10 cursor-pointer appearance-none rounded-full border pl-9 pr-8 text-sm font-medium transition',
          dark ? 'border-white/25 bg-white/10 text-white backdrop-blur hover:border-gold-300 [&>option]:text-ink' : 'border-line bg-surface text-ink hover:border-brand-600'
        )}
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
      <ChevronDown size={14} aria-hidden className={cn('pointer-events-none absolute right-3 top-1/2 -translate-y-1/2', dark ? 'text-white/70' : 'text-muted')} />
    </div>
  );
}

export function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const overlay = OVERLAY_ROUTES.includes(pathname);
  // light text on a transparent header over a photo; dark text on the ivory header elsewhere
  const dark = overlay && !scrolled && !open;

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const links = [
    { to: '/identify', label: t('nav_identify') },
    { to: '/symptom-checker', label: t('nav_symptoms') },
    { to: '/big-four', label: 'Big Four' },
    { to: '/emergency', label: t('nav_emergency') },
    { to: '/insights', label: t('nav_news') },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative whitespace-nowrap px-3.5 py-2 text-[14px] font-medium tracking-wide no-underline transition',
      'after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold-300 after:transition-transform after:duration-300 hover:after:scale-x-100',
      isActive && 'after:scale-x-100',
      dark ? 'text-white/85 hover:text-white' : 'text-ink-2 hover:text-ink'
    );

  return (
    <header
      className={cn(
        'z-40 w-full transition-all duration-500',
        overlay ? 'fixed inset-x-0 top-0' : 'sticky top-0',
        dark
          ? 'border-b border-transparent bg-gradient-to-b from-black/55 to-transparent'
          : overlay
            ? 'border-b border-white/10 bg-brand-950/92 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.7)] backdrop-blur-md'
            : 'border-b border-line bg-paper/90 backdrop-blur-md'
      )}
    >
      <div className="container-wide flex h-[72px] items-center justify-between gap-3">
        <Link to="/" className="group flex items-center gap-2.5 no-underline" aria-label="VenomSnake Detector - home">
          <img src="/favicon.svg" alt="" width={34} height={34} className="transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
          <span className={cn('whitespace-nowrap font-serif text-[22px] font-medium leading-none tracking-tight', dark || overlay ? 'text-white' : 'text-ink')}>
            VenomSnake<span className={cn('hidden italic sm:inline xl:hidden 2xl:inline', dark || overlay ? 'text-gold-300' : 'text-brand-700')}> Detector</span>
          </span>
        </Link>

        <nav aria-label="Primary" className={cn('hidden items-center gap-0.5 xl:flex', overlay && !dark ? '[&_a]:text-white/85 [&_a:hover]:text-white' : '')}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelect className="hidden shrink-0 sm:block" dark={overlay} />
          <Link to="/emergency" className="btn btn-danger btn-sm hidden whitespace-nowrap sm:inline-flex">
            <Siren size={16} aria-hidden /> {t('cta_get_help')}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={cn('grid h-11 w-11 place-items-center rounded-full border xl:hidden', overlay ? 'border-white/25 bg-white/10 text-white backdrop-blur' : 'border-line bg-surface text-ink')}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className={cn('border-t xl:hidden', overlay ? 'border-white/10 bg-brand-950' : 'border-line bg-paper')}>
          <nav aria-label="Mobile" className="container-x flex flex-col gap-1 py-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn('rounded-xl px-3 py-3 text-base font-medium no-underline', overlay ? 'text-white/90 hover:bg-white/10' : 'text-ink-2 hover:bg-brand-50', isActive && (overlay ? 'bg-white/10' : 'bg-brand-100 text-brand-900'))
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-3 flex items-center gap-3 sm:hidden">
              <LanguageSelect className="flex-1 [&_select]:w-full" dark={overlay} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
