import { Link, useLocation } from 'react-router-dom';
import { Phone, Siren } from 'lucide-react';

/** Always-reachable help on phones: one tap to call 108, one tap to the first-aid guide. Hidden on the emergency page itself. */
export function MobileEmergencyBar() {
  const { pathname } = useLocation();
  if (pathname === '/emergency') return null;
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_-12px_rgba(16,32,27,0.25)] backdrop-blur md:hidden"
      role="region"
      aria-label="Emergency actions"
    >
      <div className="grid grid-cols-2 gap-3">
        <a href="tel:108" className="btn btn-danger btn-sm">
          <Phone size={16} aria-hidden /> Call 108
        </a>
        <Link to="/emergency" className="btn btn-outline-danger btn-sm">
          <Siren size={16} aria-hidden /> Bitten? Get help
        </Link>
      </div>
    </div>
  );
}
