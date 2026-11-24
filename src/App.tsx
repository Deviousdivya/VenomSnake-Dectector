/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, ErrorInfo, lazy, ReactNode, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CircleAlert, RefreshCw, WifiOff } from 'lucide-react';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileEmergencyBar } from './components/layout/MobileEmergencyBar';
import { ConnectionProvider, useConnection } from './context/ConnectionContext';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';

// Everything except the home page is loaded on demand, which keeps the first visit light.
const Identify = lazy(() => import('./pages/Identify'));
const SymptomChecker = lazy(() => import('./pages/SymptomChecker'));
const Emergency = lazy(() => import('./pages/Emergency'));
const Insights = lazy(() => import('./pages/Insights'));
const About = lazy(() => import('./pages/About'));
const BigFour = lazy(() => import('./pages/BigFour'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Privacy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Terms })));

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unexpected error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="grid min-h-screen place-items-center bg-paper p-6 text-center">
        <div className="card max-w-md p-10">
          <CircleAlert size={40} className="mx-auto text-danger-600" aria-hidden />
          <h1 className="mt-4 text-3xl">Something went wrong</h1>
          <p className="mt-3 text-ink-2">The page hit an unexpected problem. Reloading usually fixes it.</p>
          <p className="mt-3 rounded-xl bg-danger-50 p-3 text-sm text-ink-2">
            Has someone been bitten? Don't wait — call <a className="font-bold text-danger-700" href="tel:108">108</a> or{' '}
            <a className="font-bold text-danger-700" href="tel:112">112</a>.
          </p>
          <button type="button" onClick={() => window.location.reload()} className="btn btn-primary mt-6">
            <RefreshCw size={18} aria-hidden /> Reload page
          </button>
        </div>
      </div>
    );
  }
}

/** On navigation: scroll to the top and move keyboard/screen-reader focus to the new page. */
function RouteEffects({ mainRef }: { mainRef: React.RefObject<HTMLElement | null> }) {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, mainRef]);
  return null;
}

function OfflineBanner() {
  const { isOffline } = useConnection();
  if (!isOffline) return null;
  return (
    <div role="status" className="flex items-center justify-center gap-2 bg-warn-50 px-4 py-2 text-center text-sm font-medium text-warn-600">
      <WifiOff size={16} aria-hidden /> You're offline. First-aid guidance still works, but AI scans and hospital search need internet. To call, dial 108.
    </div>
  );
}

function Loading() {
  return (
    <div className="container-x py-16" role="status" aria-label="Loading">
      <div className="skeleton h-4 w-24 rounded-lg" />
      <div className="skeleton mt-5 h-12 w-2/3 max-w-xl rounded-xl" />
      <div className="skeleton mt-4 h-5 w-full max-w-2xl rounded-lg" />
      <div className="skeleton mt-2 h-5 w-5/6 max-w-2xl rounded-lg" />
      <div className="skeleton mt-10 h-56 w-full max-w-3xl rounded-3xl" />
    </div>
  );
}

function Shell() {
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only rounded-full bg-brand-700 px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200]"
      >
        Skip to content
      </a>
      <Header />
      <OfflineBanner />
      <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        <RouteEffects mainRef={mainRef} />
        <Suspense fallback={<Loading />}>
          <div key={pathname} className="page-enter">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/identify" element={<Identify />} />
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/big-four" element={<BigFour />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </div>
        </Suspense>
      </main>
      <Footer />
      <MobileEmergencyBar />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ConnectionProvider>
          <BrowserRouter>
            <Shell />
          </BrowserRouter>
        </ConnectionProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
