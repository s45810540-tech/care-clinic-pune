import { useI18n } from '../i18n/I18nContext';
import { SERVICES } from '../data/content';

/**
 * Oversized kinetic band. Decorative in intent (the same words are listed
 * properly further down the page), so the duplicate half is hidden from
 * assistive tech and the whole strip is aria-hidden.
 */
export default function Ticker({ reverse = false }) {
  const { L } = useI18n();
  const items = SERVICES.map((s) => L(s.title));

  const Half = ({ hidden }) => (
    <span className="flex shrink-0 items-center" aria-hidden={hidden ? 'true' : undefined}>
      {items.map((label, i) => (
        <span key={`${label}-${i}`} className="flex items-center">
          <span className="ticker-word">{label}</span>
          <span className="ticker-dot" aria-hidden />
        </span>
      ))}
    </span>
  );

  return (
    <div className="ticker" aria-hidden="true">
      <div className={`ticker-track ${reverse ? 'ticker-track--reverse' : ''}`}>
        <Half />
        <Half hidden />
      </div>
    </div>
  );
}
