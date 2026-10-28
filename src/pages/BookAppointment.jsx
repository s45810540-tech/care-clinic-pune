import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useSeo } from '../utils/seo';
import { useReveals } from '../hooks/useScroll';
import { PageHeader } from '../components/ui';
import { FORM_CONFIG, HOURS, PHONE_DISPLAY, PHONE_TEL, waLink } from '../data/site';
import { SERVICES } from '../data/content';
import { isOpenNow, formatTime, formatDate } from '../utils/clinic';
import Icon from '../components/Icon';

/* ------------------------------------------------------------------ */
/* Slot generation                                                     */
/* ------------------------------------------------------------------ */
const SLOT_STEP_MIN = 30;
const LEAD_MINUTES = 30; // no online booking closer than 30 minutes before a slot

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const minutesToLabel = (mins) =>
  `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

/** Every slot inside opening hours for the chosen date, with past/closed slots disabled. */
function buildSlots(dateStr) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const isToday = dateStr === todayStr;
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const start = toMinutes(HOURS.openingTime);
  const end = toMinutes(HOURS.closingTime);

  const slots = [];
  for (let m = start; m + SLOT_STEP_MIN <= end; m += SLOT_STEP_MIN) {
    const disabled = isToday && m - nowMins < LEAD_MINUTES;
    slots.push({ value: minutesToLabel(m), disabled });
  }
  return slots;
}

const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const maxISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */
function validate(values) {
  const errors = {};
  if (!values.name || values.name.trim().length < 2) errors.name = 'Please enter your full name / पूर्ण नाव लिहा.';

  const digits = values.phone.replace(/\D/g, '').replace(/^91/, '');
  if (!/^[6-9]\d{9}$/.test(digits)) errors.phone = 'Enter a valid 10-digit Indian mobile number.';

  const age = Number(values.age);
  if (!values.age || Number.isNaN(age) || age < 0 || age > 120) errors.age = 'Age must be between 0 and 120.';

  if (!values.service) errors.service = 'Please choose a service.';
  if (!values.date) errors.date = 'Please choose a preferred date.';
  if (!values.time) errors.time = 'Please choose a time slot.';
  if (!values.consent) errors.consent = 'Consent is required so we can contact you about this booking.';
  if (values.honeypot) errors.honeypot = 'spam'; // hidden field — silently reject bots
  return errors;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function BookAppointment() {
  const { t, L, lang } = useI18n();
  const [params] = useSearchParams();
  const presetService = params.get('service');

  const [values, setValues] = useState({
    name: '',
    phone: '',
    age: '',
    service: SERVICES.find((s) => s.slug === presetService)?.slug || '',
    date: todayISO(),
    time: '',
    symptoms: '',
    consent: false,
    honeypot: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [serverNote, setServerNote] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  useSeo({
    title: 'Book an appointment',
    description: 'Book a consultation at Care Clinic, Keshav Nagar, Mundhwa, Pune — choose a service, date and time slot.',
    path: '/book',
  });
  useReveals();

  const slots = useMemo(() => buildSlots(values.date), [values.date]);
  const closedNow = !isOpenNow();
  const openLabel = formatTime(HOURS.openingTime, lang);
  const closeLabel = formatTime(HOURS.closingTime, lang);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const whatsappMessage = (data) =>
    `Hello, I'd like to book an appointment: Name: ${data.name}, Date: ${formatDate(
      data.date,
      'en'
    )}, Time: ${data.time}, Service: ${
      SERVICES.find((s) => s.slug === data.service)?.title.en || data.service
    }${data.age ? `, Age: ${data.age}` : ''}${data.symptoms ? `, Symptoms: ${data.symptoms}` : ''}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    if (Object.keys(found).length) {
      setErrors(found);
      // Move focus to the first invalid field for keyboard/AT users.
      const firstKey = Object.keys(found)[0];
      document.querySelector(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setStatus('sending');
    const message = whatsappMessage(values);

    // Open WhatsApp synchronously (inside the click) so pop-up blockers allow it.
    window.open(waLink(message), '_blank', 'noopener,noreferrer');

    const payload = {
      ...values,
      message,
      page: window.location.href,
      clinic: 'Care Clinic for General Medicine & Surgery',
      language: lang,
    };

    try {
      if (FORM_CONFIG.provider === 'formspree' && FORM_CONFIG.endpoint) {
        // Option B — Formspree endpoint form
        const res = await fetch(FORM_CONFIG.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Formspree ${res.status}`);
        setServerNote('');
      } else if (FORM_CONFIG.accessKey && !FORM_CONFIG.accessKey.startsWith('[')) {
        // Option A (default) — Web3Forms
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: FORM_CONFIG.accessKey,
            subject: `New appointment request — ${values.name}`,
            from_name: 'Care Clinic website',
            ...payload,
          }),
        });
        const json = await res.json();
        if (!json.success) throw new Error('Web3Forms rejected the submission');
        setServerNote('');
      } else {
        // No backend configured yet — WhatsApp still carries the booking.
        // eslint-disable-next-line no-console
        console.warn('[booking] No form backend configured — set VITE_FORM_ACCESS_KEY (Web3Forms) or VITE_FORM_ENDPOINT (Formspree).');
        setServerNote(
          'Demo mode: no form backend is configured yet, so this request was sent to the clinic on WhatsApp only. [PLACEHOLDER: add your free Web3Forms access key.]'
        );
      }
      setConfirmation({ ...values, message });
      setStatus('done');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[booking] submit failed', err);
      setConfirmation({ ...values, message });
      setServerNote(
        'We could not reach the form service, so please tap the WhatsApp button below to confirm your request — your details are already filled in. [PLACEHOLDER: check the form backend key.]'
      );
      setStatus('done');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* ------------------------- Confirmation ------------------------- */
  if (status === 'done' && confirmation) {
    const serviceTitle = SERVICES.find((s) => s.slug === confirmation.service)?.title;
    return (
      <>
        <PageHeader eyebrow={t('common.bookNow')} title={t('book.successTitle')} sub={t('book.successSub')} />
        <section className="container-page max-w-3xl py-14 sm:py-16">
          <div className="rounded-[2rem] border border-brand-100 bg-white p-7 shadow-card sm:p-10" data-reveal="scale">
            <div className="flex items-start gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Icon name="check" className="h-7 w-7" strokeWidth={2.4} />
              </span>
              <div>
                <h2 className="text-3xl leading-[1.1] sm:text-4xl">{t('book.successTitle')}</h2>
                <p className="mt-2 text-ink-mute">{t('book.successSub')}</p>
              </div>
            </div>

            {serverNote && (
              <p className="mt-6 rounded-2xl border border-accent-200 bg-accent-50 p-4 text-sm leading-relaxed text-ink">
                {serverNote}
              </p>
            )}

            <h3 className="mt-8 text-sm font-extrabold uppercase tracking-[0.16em] text-brand-700">
              {t('book.successDetails')}
            </h3>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                [t('book.name'), confirmation.name],
                [t('book.phone'), confirmation.phone],
                [t('book.age'), confirmation.age],
                [t('book.service'), serviceTitle ? L(serviceTitle) : confirmation.service],
                [t('book.date'), formatDate(confirmation.date, lang)],
                [t('book.time'), confirmation.time],
                [t('book.symptoms'), confirmation.symptoms || '—'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-sand p-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-ink-mute">{label}</dt>
                  <dd className="mt-1 font-bold text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={waLink(confirmation.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-emerald-700 !py-4 text-white hover:bg-emerald-800"
                data-magnetic
              >
                <Icon name="whatsapp" className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                {t('book.successWhatsApp')}
              </a>
              <button type="button" onClick={() => { setStatus('idle'); setConfirmation(null); }} className="btn-ghost !py-4" data-magnetic>
                {t('book.newBooking')}
              </button>
            </div>

            <p className="mt-6 rounded-2xl bg-brand-50 p-4 text-sm text-ink-soft">{t('book.urgent')}</p>
          </div>

          <p className="mt-6 text-center text-xs text-ink-mute">
            Need help? Call {PHONE_DISPLAY} or read our{' '}
            <Link to="/cancellation-policy" className="font-bold text-brand-700 underline underline-offset-2">
              Cancellation &amp; Rescheduling policy
            </Link>
            .
          </p>
        </section>
      </>
    );
  }

  /* --------------------------- The form --------------------------- */
  return (
    <>
      <PageHeader eyebrow={t('nav.book')} title={t('book.title')} sub={t('book.sub')}>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-ink-soft">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-card">
            <Icon name="clock" className="h-4 w-4 text-brand-600" />
            {t('common.daily')} {openLabel} – {closeLabel}
          </span>
          {closedNow && (
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-4 py-2 text-accent-700">
              <Icon name="info" className="h-4 w-4" /> {t('book.slotsClosed')}
            </span>
          )}
        </div>
      </PageHeader>

      <section className="container-page grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.5fr_1fr]">
        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card sm:p-8" data-reveal="left">
          {/* Honeypot — hidden from humans, catches naive bots */}
          <input
            type="text"
            name="honeypot"
            value={values.honeypot}
            onChange={set('honeypot')}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="field-label">
                {t('book.name')} *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Priya Sharma"
                className="field-input"
                value={values.name}
                onChange={set('name')}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && <span id="name-error" className="field-error">{errors.name}</span>}
            </div>

            <div>
              <label htmlFor="phone" className="field-label">
                {t('book.phone')} *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="10-digit mobile number"
                className="field-input"
                value={values.phone}
                onChange={set('phone')}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && <span id="phone-error" className="field-error">{errors.phone}</span>}
            </div>

            <div>
              <label htmlFor="age" className="field-label">
                {t('book.age')} *
              </label>
              <input
                id="age"
                name="age"
                type="number"
                inputMode="numeric"
                min="0"
                max="120"
                placeholder="e.g. 34"
                className="field-input"
                value={values.age}
                onChange={set('age')}
                aria-invalid={!!errors.age}
                aria-describedby={errors.age ? 'age-error' : undefined}
              />
              {errors.age && <span id="age-error" className="field-error">{errors.age}</span>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="service" className="field-label">
                {t('book.service')} *
              </label>
              <select
                id="service"
                name="service"
                className="field-input"
                value={values.service}
                onChange={set('service')}
                aria-invalid={!!errors.service}
              >
                <option value="">— {t('book.selectService')} —</option>
                {SERVICES.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {L(s.title)}
                  </option>
                ))}
              </select>
              {errors.service && <span className="field-error">{errors.service}</span>}
            </div>

            <div>
              <label htmlFor="date" className="field-label">
                {t('book.date')} *
              </label>
              <input
                id="date"
                name="date"
                type="date"
                className="field-input"
                min={todayISO()}
                max={maxISO()}
                value={values.date}
                onChange={(e) => {
                  set('date')(e);
                  setValues((v) => ({ ...v, time: '' }));
                }}
                aria-invalid={!!errors.date}
              />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>

            <div>
              <label htmlFor="time" className="field-label">
                {t('book.time')} *
              </label>
              <select
                id="time"
                name="time"
                className="field-input"
                value={values.time}
                onChange={set('time')}
                aria-invalid={!!errors.time}
                disabled={slots.every((s) => s.disabled)}
              >
                <option value="">— Select a slot —</option>
                {slots.map((s) => (
                  <option key={s.value} value={s.value} disabled={s.disabled}>
                    {formatTime(s.value, lang)}
                    {s.disabled ? ' (unavailable)' : ''}
                  </option>
                ))}
              </select>
              {errors.time && <span className="field-error">{errors.time}</span>}
              {slots.every((s) => s.disabled) && <span className="field-error">{t('book.noSlots')}</span>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="symptoms" className="field-label">
                {t('book.symptoms')}
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                rows={4}
                maxLength={600}
                placeholder={t('book.symptomsPh')}
                className="field-input resize-y"
                value={values.symptoms}
                onChange={set('symptoms')}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-start gap-3 rounded-2xl border border-brand-100 bg-sand p-4">
                <input
                  type="checkbox"
                  name="consent"
                  checked={values.consent}
                  onChange={set('consent')}
                  className="mt-1 h-5 w-5 shrink-0 accent-brand-700"
                  aria-invalid={!!errors.consent}
                />
                <span className="text-sm leading-relaxed text-ink-soft">{t('book.consent')}</span>
              </label>
              {errors.consent && <span className="field-error">{errors.consent}</span>}
            </div>
          </div>

          {Object.values(errors).some(Boolean) && (
            <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800" role="alert">
              {t('book.errorPrefix')}
            </p>
          )}

          <button type="submit" disabled={status === 'sending'} className="btn-primary mt-6 w-full !py-4 text-base" data-magnetic>
            {status === 'sending' ? (
              <>
                <Icon name="clock" className="h-5 w-5 animate-spin" /> {t('book.sending')}
              </>
            ) : (
              <>
                <Icon name="check" className="h-5 w-5" /> {t('book.submit')}
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs leading-relaxed text-ink-mute">
            Your details are used only to arrange this appointment — see our{' '}
            <Link to="/privacy-policy" className="font-bold text-brand-700 underline underline-offset-2">
              Privacy Policy
            </Link>{' '}
            (DPDP Act, 2023).
          </p>
        </form>

        {/* Sidebar */}
        <aside className="space-y-5" data-reveal="right">
          <div className="rounded-3xl border border-brand-100 bg-brand-50 p-6">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-brand-700 shadow-card">
              <Icon name="clock" className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-xl">{t('common.hours')}</h3>
            <p className="mt-2 text-sm text-ink-soft">
              {t('common.daily')} {openLabel} – {closeLabel}
            </p>
            <p className="mt-1 text-sm text-ink-mute">{t('common.emergency')}</p>
          </div>

          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-card">
            <h3 className="text-xl">{t('faq.title')}</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-mute">
              <li>• Bring previous prescriptions and reports.</li>
              <li>• Arrive 10 minutes before your slot.</li>
              <li>• To reschedule, message us on WhatsApp at least 4 hours ahead.</li>
            </ul>
            <Link to="/faq" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
              {t('common.viewAll')} <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-accent-200 bg-accent-50 p-6">
            <h3 className="text-xl">Emergency?</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t('common.emergency')}</p>
            <div className="mt-4 flex flex-col gap-2">
              <a href="tel:112" className="btn bg-red-600 text-white hover:bg-red-700">
                <Icon name="phone" className="h-4 w-4" /> Call 112
              </a>
              <a href={`tel:${PHONE_TEL}`} className="btn-dark">
                <Icon name="phone" className="h-4 w-4" /> {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
