import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { useSeo } from '../../utils/seo';
import { useReveals } from '../../hooks/useScroll';
import { PageHeader } from '../../components/ui';
import { ADDRESS, PHONE_DISPLAY, PHONE_TEL, SITE } from '../../data/site';
import Icon from '../../components/Icon';

/** [PLACEHOLDER] — the date every legal page shows as "Last updated". */
export const LAST_UPDATED = '27 October 2026';

const DISCLAIMER_TYPES = {
  info: 'This document is a plain-language draft prepared for the website. Have a qualified Indian lawyer review it before the site goes live.',
};

/**
 * Shared wrapper for the six legal pages: page header, "last updated" line,
 * mandatory draft-review notice, and the governing-law footer.
 */
export default function LegalShell({
  title,
  description,
  path,
  children,
  type = 'info',
}) {
  const { t } = useI18n();
  useSeo({ title, description, path });

  return (
    <>
      <PageHeader eyebrow={t('footer.legal')} title={title} sub={description} />

      <article className="container-page max-w-4xl py-12 sm:py-16">
        <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-mute" data-reveal="fade">
          <Icon name="clock" className="h-4 w-4" />
          {t('common.lastUpdated')}: {LAST_UPDATED}
        </p>

        {/* Mandatory review notice — visible on every legal page */}
        <div
          className="mt-6 flex items-start gap-3 rounded-2xl border border-accent-300 bg-accent-50 p-4"
          role="note"
          data-reveal="fade"
        >
          <Icon name="info" className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" />
          <p className="text-sm font-semibold leading-relaxed text-ink">
            <strong>[PLACEHOLDER — DRAFT]:</strong> {DISCLAIMER_TYPES[type]}
          </p>
        </div>

        <div className="prose-clinic mt-8" data-reveal>
          {children}
        </div>

        <footer className="mt-12 rounded-3xl border border-brand-100 bg-brand-50 p-6" data-reveal="fade">
          <h2 className="text-lg">Governing law</h2>
          <p className="!text-sm">
            This document is governed by the laws of India. Any dispute is subject to the exclusive jurisdiction of
            the courts of <strong>Pune, Maharashtra</strong>.
          </p>
          <p className="!text-sm">
            Questions about this document: {SITE.shortName}, {ADDRESS.line1}, {ADDRESS.line3} – {ADDRESS.pincode}.{' '}
            <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>.
          </p>
          <p className="!text-sm">
            <Link to="/" className="font-bold text-brand-700 underline underline-offset-2">
              {t('common.backHome')}
            </Link>
          </p>
        </footer>
      </article>
    </>
  );
}
