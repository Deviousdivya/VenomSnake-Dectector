import { ReactNode } from 'react';

/** A dark, photographic page header used across the site so every page opens the same way. */
export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  position = '50% 50%',
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  image?: string;
  position?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 text-white">
      {image && <img src={image} alt="" loading="eager" decoding="async" className="ken-burns absolute inset-0 -z-10 h-full w-full object-cover opacity-30" style={{ objectPosition: position }} />}
      <div aria-hidden className="scales-light absolute inset-0 -z-10 opacity-60" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950 via-brand-950/80 to-brand-950/30" />
      <div className="container-wide relative pb-14 pt-14 sm:pb-20 sm:pt-20">
        <p className="eyebrow on-dark rise">{eyebrow}</p>
        <h1 className="rise rise-2 mt-5 max-w-3xl text-[2.6rem] font-medium leading-[1.04] !text-white sm:text-6xl">{title}</h1>
        {lead && <p className="rise rise-3 mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">{lead}</p>}
        {children && <div className="rise rise-4 mt-8">{children}</div>}
      </div>
    </section>
  );
}
