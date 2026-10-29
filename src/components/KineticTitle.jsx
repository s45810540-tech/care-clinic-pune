import { Fragment, useMemo } from 'react';

/**
 * Kinetic headline: each word arrives on its own beat and lifts under the
 * pointer. Words are real inline spans, so the text still reads as one sentence
 * to a screen reader and to search engines — only the paint is animated.
 *
 * `as` keeps the heading level correct (h1 on the hero, h2 in sections).
 */
export default function KineticTitle({ text = '', as: Tag = 'h1', className = '', delay = 0 }) {
  const words = useMemo(() => String(text).split(/\s+/).filter(Boolean), [text]);

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        /* The separating space must sit OUTSIDE the clipping wrapper — inside it,
           `overflow: hidden` trims the word gap and the heading reads as one
           run-on string to search engines and screen readers. */
        <Fragment key={`${word}-${i}`}>
          <span className="kinetic-word-wrap">
            <span
              className="kinetic-word"
              style={{ animationDelay: `${(delay + i * 0.06).toFixed(2)}s` }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}
