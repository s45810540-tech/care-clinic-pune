import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileBottomBar from './MobileBottomBar';
import WhatsAppFab from './WhatsAppFab';
import CookieConsent from './CookieConsent';
import MagneticCursor from './MagneticCursor';
import ScrollToTop from './ScrollToTop';
import ScrollProgress from './ScrollProgress';
import { useSmoothScroll } from '../hooks/useScroll';

export default function Layout() {
  // Lenis + GSAP ticker live for the whole session.
  useSmoothScroll();
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      {/* First thing in the tab order (WCAG 2.4.1). */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full
                   focus:bg-brand-900 focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to content
      </a>

      <ScrollToTop />
      <ScrollProgress />
      <Header />
      <MagneticCursor />

      {/* Header publishes its real height as --header-h; the bottom padding keeps
          the last section clear of the sticky mobile action bar. */}
      <main id="main" className="flex-1 pb-24 pt-[var(--header-h)] md:pb-0">
        <div key={pathname} className="animate-fade-up motion-reduce:animate-none">
          <Outlet />
        </div>
      </main>

      <Footer />
      <MobileBottomBar />
      <WhatsAppFab />
      <CookieConsent />
    </div>
  );
}
