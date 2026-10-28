import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileBottomBar from './MobileBottomBar';
import WhatsAppFab from './WhatsAppFab';
import CookieConsent from './CookieConsent';
import MagneticCursor from './MagneticCursor';
import ScrollToTop from './ScrollToTop';
import { useSmoothScroll } from '../hooks/useScroll';

export default function Layout() {
  // Lenis + GSAP ticker live for the whole session.
  useSmoothScroll();
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <Header />
      <MagneticCursor />

      {/* Header is fixed: reserve its height. Bottom padding keeps content clear of the mobile bar. */}
      <main id="main" className="flex-1 pt-[96px] pb-24 md:pb-0">
        <div key={pathname}>
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
