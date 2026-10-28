import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useSeo } from '../utils/seo';
import { useReveals } from '../hooks/useScroll';
import { PageHeader } from '../components/ui';
import Icon from '../components/Icon';

/** Custom 404 — keeps the brand look and offers useful exits. */
export default function NotFound() {
  const { t } = useI18n();
  useSeo({ title: 'Page not found', description: 'This page does not exist.', path: '/404', noindex: true });
  useReveals();

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/services', label: t('nav.services') },
    { to: '/book', label: t('nav.book') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <>
      <PageHeader eyebrow="404" title={t('notfound.title')} sub={t('notfound.sub')} />

      <section className="container-page py-16 sm:py-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="card group flex items-center justify-between p-5 transition hover:-translate-y-1 hover:border-brand-300"
              data-magnetic
            >
              <span className="font-bold text-ink">{l.label}</span>
              <Icon name="arrowRight" className="h-5 w-5 text-brand-600 transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
