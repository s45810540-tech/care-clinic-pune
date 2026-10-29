import { useI18n } from '../i18n/I18nContext';
import { useSeo } from '../utils/seo';
import { useReveals } from '../hooks/useScroll';
import { PageHeader, SectionHeading, PlaceholderTag } from '../components/ui';
import { DOCTORS, DOCTOR, PHONE_DISPLAY, PHONE_TEL, waLink } from '../data/site';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import Tilt from '../components/Tilt';
import DoctorPlate from '../components/DoctorPlate';
import { photoSrc } from '../data/photos';
import { GALLERY } from '../data/content';

const VALUES = ['about.v1T', 'about.v1B', 'about.v2T', 'about.v2B', 'about.v3T', 'about.v3B', 'about.v4T', 'about.v4B'];

export default function About() {
  const { t, L } = useI18n();
  useSeo({
    title: 'About the clinic & Dr. Swati Kamble',
    description:
      'Meet Dr. Swati Kamble at Care Clinic, Keshav Nagar, Mundhwa, Pune — general medicine, surgery and family care. Qualifications and registration details listed for verification.',
    path: '/about',
  });
  useReveals();

  const valuePairs = [
    { t: VALUES[0], b: VALUES[1] },
    { t: VALUES[2], b: VALUES[3] },
    { t: VALUES[4], b: VALUES[5] },
    { t: VALUES[6], b: VALUES[7] },
  ];

  return (
    <>
      <PageHeader eyebrow={t('nav.about')} title={t('about.title')} sub={t('about.sub')} />

      {/* Consultants — both doctors, with the registration numbers from the signboard */}
      <section className="container-page section">
        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.1fr] lg:gap-16">
          <div data-reveal="left">
            <DoctorPlate doctor={DOCTOR} />
          </div>

          <div data-reveal="right">
            <span className="eyebrow">
              <span className="eyebrow-dot" aria-hidden />
              {t('home.doctorTitle')}
            </span>
            <h2 className="mt-5 title-lg">{t('about.doctorTitle')}</h2>

            <ul className="mt-6 space-y-4">
              {DOCTORS.map((doc) => (
                <li key={doc.id} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <h3 className="text-lg">{doc.name}</h3>
                    <span className="chip tabular">
                      {doc.qualifications} · {t('about.regNo')} {doc.regNo}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-brand-700">{L(doc.role)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-mute">{L(doc.focus)}</p>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-sm leading-relaxed text-ink-mute sm:text-base">{t('home.doctorBody')}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/book" className="btn-primary" data-magnetic>
                <Icon name="calendar" className="h-4 w-4" /> {t('common.bookNow')}
              </Link>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-ghost" data-magnetic>
                <Icon name="whatsapp" className="h-4 w-4" fill="currentColor" strokeWidth={0} />{' '}
                {t('common.whatsapp')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The team photograph — the whole clinic staff, in one 3D frame */}
      <section className="container-page pb-14 sm:pb-20">
        <Tilt max={4} scale={1.01} className="overflow-hidden rounded-4xl border border-line shadow-lift" data-reveal="3d">
          <img
            src={photoSrc('team', '/images/gallery-3.svg')}
            alt={t('about.teamPhotoAlt')}
            width={1700}
            height={662}
            loading="lazy"
            className="aspect-[21/9] w-full object-cover"
          />
        </Tilt>
        <p className="mt-3 text-center text-xs font-semibold text-ink-mute">{t('about.teamPhotoAlt')}</p>
      </section>

      {/* Story */}
      <section className="bg-brand-50/60 py-14 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div data-reveal="left">
            <span className="eyebrow">{t('about.ourStory')}</span>
            <h2 className="mt-5 text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">{t('about.sub')}</h2>
          </div>
          <div className="prose-clinic" data-reveal="right">
            <p>
              The clinic serves the Sasane Colony, Keshav Nagar and Mundhwa neighbourhoods with outpatient
              consultation every day of the week, closing at 10 pm so that working families and school-going
              children can be seen after their day ends.
            </p>
            <p>
              Care is provided across general medicine, fever and infection treatment, family doctor services,
              paediatric assessment with day-care admission, piles and anal fissure consultation with minor
              surgery, Ayurvedic treatment and basic diagnostics.
            </p>
            <p>
              <strong>On this website we publish no patient testimonials and no superlatives</strong> — only the
              aggregate rating Google shows for our listing, because Indian medical advertising rules restrict
              how clinics may present patient feedback.{' '}
              <Link to="/reviews">{t('common.seeReviews')}</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container-page py-14 sm:py-20">
        <SectionHeading eyebrow="Care Clinic" title={t('about.valuesTitle')} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {valuePairs.map((v, i) => (
            <article key={v.t} className="card p-6" data-reveal data-delay={i * 0.06} data-magnetic>
              <span
                className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100"
              >
                <Icon name={['users', 'info', 'arrowUpRight', 'shield'][i]} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl">{t(v.t)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-mute">{t(v.b)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Clinic images preview */}
      <section className="bg-sand py-14 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow={t('gallery.title')} title={t('about.clinicTitle')} sub={t('gallery.sub')} />
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {GALLERY.slice(0, 4).map((g, i) => (
              <div key={g.src} className="overflow-hidden rounded-2xl" data-reveal data-delay={i * 0.05}>
                <img src={g.src} alt={L(g.caption)} loading="lazy" width={640} height={480} className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/gallery" className="btn-ghost" data-magnetic>
              {t('common.viewAll')} <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="container-page py-14 text-center sm:py-16">
        <p className="text-lg font-bold text-ink" data-reveal>
          {t('common.daily')} · {PHONE_DISPLAY}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a href={`tel:${PHONE_TEL}`} className="btn-dark" data-magnetic>
            <Icon name="phone" className="h-4 w-4" /> {t('common.call')}
          </a>
          <Link to="/contact" className="btn-ghost" data-magnetic>
            {t('contact.getDirections')}
          </Link>
        </div>
      </section>
    </>
  );
}
