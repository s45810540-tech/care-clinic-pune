import { useEffect } from 'react';
import { SITE } from '../data/site';

/**
 * Sets document title + meta tags per route (SPA-friendly SEO).
 * The server-rendered crawler also reads sitemap.xml and robots.txt in /public.
 */
export function useSeo({ title, description, path = '/', image = '/images/og-cover.svg', noindex = false }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE.name}` : SITE.name;
    document.title = fullTitle;

    const set = (selector, attr, key, value) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute(attr === 'property' ? 'content' : 'content', value);
    };

    set('meta[name="description"]', 'name', 'description', description || '');
    set('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    set('meta[property="og:description"]', 'property', 'og:description', description || '');
    set('meta[property="og:url"]', 'property', 'og:url', `${SITE.origin}${path}`);
    set('meta[property="og:image"]', 'property', 'og:image', `${SITE.origin}${image}`);
    set('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    set('meta[name="twitter:description"]', 'name', 'twitter:description', description || '');

    let robots = document.head.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.content = noindex ? 'noindex, nofollow' : 'index, follow';

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = `${SITE.origin}${path}`;
  }, [title, description, path, image, noindex]);
}
