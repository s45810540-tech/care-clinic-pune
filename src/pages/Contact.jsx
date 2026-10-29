import { useI18n } from '../i18n/I18nContext';
import { useSeo } from '../utils/seo';
import { useReveals } from '../hooks/useScroll';
import { PageHeader, SectionHeading, RatingBadge } from '../components/ui';
import { ADDRESS, MAPS_LINK, PHONE_DISPLAY, PHONE_TEL, RATING, waLink } from '../data/site';
import { photoSrc } from '../data/photos';
import { hoursSummary } from '../utils/clinic';
import Icon from '../components/Icon';
import Tilt from '../components/Tilt';
import { Link } from 'react-router-dom';

export default function Contact() {
  const { t, lang } = useI18n();
  useSeo({
    title: 'Contact & directions',
    description:
      'Care Clinic, Shop No.5, Sainagari Society, opposite Janseva Bank, Sasane Colony, Keshav Nagar, Mundhwa, Pune 411036. Call 082755 73300 — open daily till 10 pm.',
    path: '/contact',
  });
  useReveals();

  const hours = hoursSummary(lang);

  const cards = [
    {
      icon: 'phone',
      title: t('common.phone'),
      body: PHONE_DISPLAY,
      sub: 'Tap to call · daily till 10 pm',
      href: `tel:${PHONE_TEL}`,
      primary: true,
    },
    {
      icon: 'whatsapp',
      title: t('common.whatsappShort'),
      body: 'wa.me/918275573300',
      sub: 'Appointments, reports, rescheduling',
      href: waLink(),
      external: true,
      green: true,
    },
    {
      icon: 'mapPin',
      title: t('contact.getDirections'),
      body: 'Open in Google Maps',
      sub: 'Turn-by-turn navigation',
      href: MAPS_LINK,
      external: true,
      sky: true,
    },
  ];

  return (
    <>
      <PageHeader eyebrow={t('nav.contact')} title={t('contact.title')} sub={t('contact.sub')}>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`tel:${PHONE_TEL}`} className="btn-primary" data-magnetic>
            <Icon name="phone" className="h-5 w-5" /> {PHONE_DISPLAY}
          </a>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-emerald-700 text-white hover:bg-emerald-800"
            data-magnetic
          >
            <Icon name="whatsapp" className="h-5 w-5" fill="currentColor" strokeWidth={0} />
            {t('common.whatsapp')}
          </a>
        </div>
      </PageHeader>

      {/* Quick contact cards */}
      <section className="container-page py-14 sm:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((c, i) => (
            <a
              key={c.title}
              href={c.href}
              target={c.external ? '_blank' : undefined}
              rel={c.external ? 'noopener noreferrer' : undefined}
              className="card group p-6 transition hover:-translate-y-1.5 hover:border-brand-300"
              data-reveal
              data-delay={i * 0.07}
              data-magnetic
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl ${
                  c.green ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-50 text-brand-700'
                }`}
              >
                <Icon
                  name={c.icon}
                  className="h-6 w-6"
                  fill={c.icon === 'whatsapp' ? 'currentColor' : 'none'}
                  strokeWidth={c.icon === 'whatsapp' ? 0 : 1.7}
                />
              </span>
              <h3 className="mt-5 text-lg">{c.title}</h3>
              <p className="mt-1 font-bold text-brand-800">{c.body}</p>
              <p className="mt-1 text-sm text-ink-mute">{c.sub}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 transition group-hover:gap-2.5">
                {t('common.learnMore')} <Icon name="arrowRight" className="h-4 w-4" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Address + hours */}
      <section className="bg-brand-50/70 py-14 sm:py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div data-reveal="left">
            <span className="eyebrow">{t('contact.findUs')}</span>
            <h2 className="mt-4 text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">{t('common.address')}</h2>
            <address className="mt-5 text-lg not-italic leading-relaxed text-ink-soft">
              {ADDRESS.line1},<br />
              {ADDRESS.line2},<br />
              {ADDRESS.line3}<br />
              {ADDRESS.region} – {ADDRESS.pincode}
            </address>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-white p-4 shadow-card">
              <Icon name="clock" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
              <div>
                <p className="font-bold text-ink">
                  {t('common.daily')} · {hours}
                </p>
                <p className="text-sm text-ink-mute">Open every day, including Sunday. [PLACEHOLDER: confirm timings.]</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <RatingBadge />
            </div>

            <p className="mt-6 text-sm font-semibold text-ink-soft">
              Landmark: opposite Janseva Bank, Sasane Colony. [PLACEHOLDER: add a second landmark if available.]
            </p>

            {/* Wayfinding card: the actual board above the entrance (real photo
                once src/assets/photos/signboard.* exists, placeholder art until). */}
            <Tilt max={6} className="mt-6 max-w-md rounded-2xl" data-reveal="scale">
              <figure className="m-0 -rotate-1 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-card">
                <img
                  src={photoSrc('signboard', '/images/gallery-4.svg')}
                  alt={t('contact.lookFor')}
                  loading="lazy"
                  width={1200}
                  height={1070}
                  /* contain, not cover: the whole board carries the timings and
                     both registration numbers, so cropping it would hide them. */
                  className="aspect-[5/4] w-full rounded-xl bg-white object-contain"
                />
                <figcaption className="px-2 py-2.5 text-sm font-bold text-ink-soft">{t('contact.lookFor')}</figcaption>
              </figure>
            </Tilt>
          </div>

          <div data-reveal="right">
            <div className="overflow-hidden rounded-[2rem] border border-brand-100 bg-white p-4 shadow-card">
              <div className="flex items-center justify-between px-2 pb-3">
                <p className="font-bold text-ink">{t('contact.mapTitle')}</p>
                <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-brand-700">
                  {t('contact.getDirections')} <Icon name="arrowUpRight" className="inline h-4 w-4" />
                </a>
              </div>
              <iframe
                title="Care Clinic on Google Maps"
                src={RATING.mapEmbed}
                width="100%"
                height="440"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[340px] w-full rounded-2xl border-0 sm:h-[440px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp block */}
      <section className="container-page py-14 sm:py-16">
        <div className="grid items-center gap-6 rounded-[2rem] border border-brand-100 bg-white p-7 shadow-card sm:p-10 lg:grid-cols-[1.4fr_1fr]" data-reveal>
          <div>
            <h2 className="text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">{t('contact.sendMessage')}</h2>
            <p className="mt-3 leading-relaxed text-ink-mute">{t('contact.sendMessageSub')}</p>
            <p className="mt-4 rounded-2xl bg-sand p-4 text-sm text-ink-soft">
              <strong>Tip:</strong> include your name, preferred date and service in the message and we can confirm
              your slot directly on WhatsApp.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={waLink('Hello, I would like to book an appointment at Care Clinic.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-emerald-700 !py-4 text-white hover:bg-emerald-800"
              data-magnetic
            >
              <Icon name="whatsapp" className="h-5 w-5" fill="currentColor" strokeWidth={0} />
              {t('common.whatsapp')}
            </a>
            <Link to="/book" className="btn-primary !py-4" data-magnetic>
              <Icon name="calendar" className="h-5 w-5" /> {t('common.bookNow')}
            </Link>
            <a href={`tel:${PHONE_TEL}`} className="btn-ghost !py-4" data-magnetic>
              <Icon name="phone" className="h-5 w-5" /> {t('common.call')}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="container-page pb-16 text-center">
        <SectionHeading eyebrow={t('nav.faq')} title={t('faq.title')} sub={t('faq.sub')} />
        <div className="mt-6">
          <Link to="/faq" className="btn-ghost" data-magnetic>
            {t('nav.faq')} <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
