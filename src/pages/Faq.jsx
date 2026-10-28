import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useSeo } from '../utils/seo';
import { useReveals } from '../hooks/useScroll';
import { PageHeader, SectionHeading } from '../components/ui';
import { FAQS } from '../data/content';
import { waLink, PHONE_DISPLAY, PHONE_TEL } from '../data/site';
import Icon from '../components/Icon';

/** FAQ page — accessible accordion (button + aria-expanded + region). */
export default function Faq() {
  const { t, L } = useI18n();
  const [open, setOpen] = useState(0);

  useSeo({
    title: 'FAQ',
    description: 'Clinic timings, appointments, directions, languages, payment and privacy — answers to common questions.',
    path: '/faq',
  });
  useReveals();

  return (
    <>
      <PageHeader eyebrow={t('nav.faq')} title={t('faq.title')} sub={t('faq.sub')} />

      <section className="container-page py-14 sm:py-20">
        <div className="mx-auto max-w-3xl divide-y divide-brand-100 rounded-[2rem] border border-brand-100 bg-white shadow-card">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q.en} data-reveal="fade">
                <h2>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition hover:bg-brand-50/60"
                  >
                    <span className="text-base font-bold text-ink sm:text-lg">{L(item.q)}</span>
                    <span
                      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full transition ${
                        isOpen ? 'rotate-45 bg-brand-700 text-white' : 'bg-brand-100 text-brand-800'
                      }`}
                    >
                      <Icon name="plus" className="h-4 w-4" strokeWidth={2.4} />
                    </span>
                  </button>
                </h2>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm leading-relaxed text-ink-mute sm:text-base">{L(item.a)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-4 rounded-3xl bg-brand-50 p-6 text-center sm:flex-row sm:justify-between sm:text-left" data-reveal>
          <div>
            <p className="font-bold text-ink">Still have a question?</p>
            <p className="text-sm text-ink-mute">Message us on WhatsApp or call {PHONE_DISPLAY}.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn bg-emerald-700 text-white hover:bg-emerald-800" data-magnetic>
              <Icon name="whatsapp" className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              {t('common.whatsappShort')}
            </a>
            <a href={`tel:${PHONE_TEL}`} className="btn-ghost" data-magnetic>
              <Icon name="phone" className="h-4 w-4" /> {t('common.call')}
            </a>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-3xl text-center">
          <Link to="/book" className="btn-primary" data-magnetic>
            <Icon name="calendar" className="h-4 w-4" /> {t('common.bookNow')}
          </Link>
        </div>
      </section>
    </>
  );
}
