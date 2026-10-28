import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

/**
 * Dismiss the static pre-paint shell (index.html) once the first real page
 * heading is on screen. Waiting for `#root h1` means the visitor never sees a
 * blank frame between the shell and the actual page; the 4 s cap is a safety
 * net so a failed render can never leave the shell stuck on screen.
 */
function useDismissBootShell() {
  useEffect(() => {
    const boot = document.getElementById('boot');
    if (!boot) return undefined;
    const started = performance.now();
    let raf;
    const check = () => {
      if (document.querySelector('#root h1') || performance.now() - started > 4000) {
        // Two frames: let the freshly painted page sit behind the shell first.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            boot.classList.add('boot--gone');
            setTimeout(() => boot.remove(), 450);
          })
        );
        return;
      }
      raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(check);
    return () => cancelAnimationFrame(raf);
  }, []);
}

// Route-level code splitting: only the home bundle pulls in the 3D chunk.
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const BookAppointment = lazy(() => import('./pages/BookAppointment'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Faq = lazy(() => import('./pages/Faq'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/legal/Terms'));
const MedicalDisclaimer = lazy(() => import('./pages/legal/MedicalDisclaimer'));
const CookiePolicy = lazy(() => import('./pages/legal/CookiePolicy'));
const CancellationPolicy = lazy(() => import('./pages/legal/CancellationPolicy'));
const Accessibility = lazy(() => import('./pages/legal/Accessibility'));

/** Lightweight route transition state while the chunk downloads. */
function RouteFallback() {
  return (
    <div className="container-page py-32">
      <div className="h-10 w-2/3 animate-pulse-soft rounded-xl bg-brand-100" />
      <div className="mt-4 h-4 w-1/2 animate-pulse-soft rounded-lg bg-brand-50" />
      <div className="mt-2 h-4 w-1/3 animate-pulse-soft rounded-lg bg-brand-50" />
    </div>
  );
}

export default function App() {
  useDismissBootShell();
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Legal (India) */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/medical-disclaimer" element={<MedicalDisclaimer />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/accessibility" element={<Accessibility />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
