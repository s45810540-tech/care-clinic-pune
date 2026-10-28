import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useSeo } from '../utils/seo';
import { useReveals } from '../hooks/useScroll';
import { PageHeader } from '../components/ui';
import { POSTS } from '../data/content';
import Icon from '../components/Icon';

/** Health tips index — 3 sample articles (see data/content.js POSTS). */
export default function Blog() {
  const { t, L } = useI18n();
  useSeo({
    title: 'Health tips',
    description: 'Plain-language health articles for patients in Keshav Nagar, Mundhwa, Pune — general information only.',
    path: '/blog',
  });
  useReveals();

  const [featured, ...rest] = POSTS;

  return (
    <>
      <PageHeader eyebrow={t('nav.blog')} title={t('blog.title')} sub={t('blog.sub')} />

      <section className="container-page py-14 sm:py-20">
        {/* Featured article */}
        <Link
          to={`/blog/${featured.slug}`}
          className="group grid overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-card transition hover:-translate-y-1 lg:grid-cols-2"
          data-reveal
          data-magnetic
        >
          <img
            src={featured.image}
            alt=""
            width={960}
            height={540}
            className="aspect-[16/9] w-full object-cover lg:aspect-auto lg:h-full"
          />
          <div className="p-7 sm:p-10">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-wide text-brand-700">
              <span className="rounded-full bg-brand-50 px-3 py-1">{L(featured.category)}</span>
              <span className="text-ink-mute">
                {new Date(featured.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                {' · '}
                {t('common.readTime', { n: featured.readMins })}
              </span>
            </div>
            <h2 className="mt-4 text-3xl leading-[1.1] transition group-hover:text-brand-700 sm:text-4xl">
              {L(featured.title)}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-mute">{L(featured.excerpt)}</p>
            <span className="mt-5 inline-flex items-center gap-2 font-bold text-brand-700">
              {t('common.learnMore')} <Icon name="arrowRight" className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        {/* Remaining articles */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {rest.map((post, i) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-card transition hover:-translate-y-1"
              data-reveal
              data-delay={(i + 1) * 0.08}
              data-magnetic
            >
              <img src={post.image} alt="" width={640} height={360} loading="lazy" className="aspect-[16/9] w-full object-cover" />
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-wide text-brand-700">
                  <span className="rounded-full bg-brand-50 px-3 py-1">{L(post.category)}</span>
                  <span className="text-ink-mute">{t('common.readTime', { n: post.readMins })}</span>
                </div>
                <h3 className="mt-3 text-xl leading-snug transition group-hover:text-brand-700">{L(post.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-mute">{L(post.excerpt)}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-10 rounded-3xl border border-accent-200 bg-accent-50 p-5 text-center text-sm leading-relaxed text-ink" data-reveal>
          {t('blog.sub')}
        </p>
      </section>
    </>
  );
}
