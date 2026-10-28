import { Link, useParams, Navigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useSeo } from '../utils/seo';
import { useReveals } from '../hooks/useScroll';
import { PageHeader } from '../components/ui';
import { POSTS } from '../data/content';
import Icon from '../components/Icon';

/** Single health-tip article. Unknown slugs fall back to a 404. */
export default function BlogPost() {
  const { slug } = useParams();
  const { t, L } = useI18n();
  const post = POSTS.find((p) => p.slug === slug);

  useSeo({
    title: post ? L(post.title) : 'Article not found',
    description: post ? L(post.excerpt) : '',
    path: `/blog/${slug || ''}`,
    noindex: !post,
  });
  useReveals([slug]);

  if (!post) return <Navigate to="/404" replace />;

  const published = new Date(post.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <PageHeader eyebrow={`${L(post.category)} · ${published}`} title={L(post.title)} sub={L(post.excerpt)}>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-mute">
          {t('common.readTime', { n: post.readMins })}
        </p>
      </PageHeader>

      <article className="container-page max-w-4xl py-12 sm:py-16">
        <div className="overflow-hidden rounded-[2rem] border border-brand-100 shadow-card" data-reveal="scale">
          <img src={post.image} alt="" width={1200} height={675} className="aspect-[16/9] w-full object-cover" />
        </div>

        <div className="prose-clinic mt-10" data-reveal>
          {post.body.map((block, i) => {
            if (block.type === 'h') return <h2 key={i}>{L(block.text)}</h2>;
            if (block.type === 'ul')
              return (
                <ul key={i}>
                  {block.items.map((it) => (
                    <li key={it.en}>{L(it)}</li>
                  ))}
                </ul>
              );
            if (block.type === 'ol')
              return (
                <ol key={i} className="list-decimal space-y-2 pl-6 marker:font-bold marker:text-brand-600">
                  {block.items.map((it) => (
                    <li key={it.en} className="pl-1">
                      <span className="before:hidden">{L(it)}</span>
                    </li>
                  ))}
                </ol>
              );
            if (block.type === 'note')
              return (
                <p key={i} className="rounded-2xl border border-accent-200 bg-accent-50 p-5 text-sm !text-ink">
                  <strong>Please note:</strong> {L(block.text)}
                </p>
              );
            return <p key={i}>{L(block.text)}</p>;
          })}
        </div>

        {/* Compliance line repeated on every article */}
        <p className="mt-8 rounded-2xl bg-brand-50 p-5 text-sm leading-relaxed text-ink-soft" data-reveal>
          {t('blog.disclaimer')} <Link to="/medical-disclaimer" className="font-bold text-brand-700 underline underline-offset-2">Medical Disclaimer</Link>
        </p>

        <div className="mt-8 flex flex-wrap gap-3" data-reveal>
          <Link to="/blog" className="btn-ghost" data-magnetic>
            <Icon name="chevronLeft" className="h-4 w-4" /> {t('blog.backToList')}
          </Link>
          <Link to="/book" className="btn-primary" data-magnetic>
            <Icon name="calendar" className="h-4 w-4" /> {t('common.bookNow')}
          </Link>
        </div>
      </article>
    </>
  );
}
