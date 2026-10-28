import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useSeo } from '../utils/seo';
import { useReveals } from '../hooks/useScroll';
import { PageHeader } from '../components/ui';
import { FORM_CONFIG, HOURS, PHONE_DISPLAY, PHONE_TEL, waLink } from '../data/site';
import { SERVICES } from '../data/content';
import { isOpenNow, formatTime, formatDate, localISODate, minutesToHHMM } from '../utils/clinic';
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

const todayISO = () => localISODate();

const maxISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return localISODate(d);
};

/**
 * Every bookable slot for a date, grouped by OPD session.
 *
 * Two rules matter here and both used to be wrong:
 *  • "today" is the visitor's LOCAL date. Comparing against
 *    `new Date().toISOString()` shifted the day in IST (+5:30), so between
 *    midnight and 5:30 am yesterday's slots were offered as still bookable.
 *  • slots follow HOURS.sessions, so the 2–5 pm break is excluded instead of
 *    being offered as an appointment.
 */
function buildSessions(dateStr) {
  const now = new Date();
  const isToday = dateStr === localISODate(now);
  const nowMins = now.getHours() * 60 + now.getMinutes();

  return HOURS.sessions.map(({ open, close }) => {
    const start = toMinutes(open);
    const end = toMinutes(close);
    const slots = [];
    for (let m = start; m + SLOT_STEP_MIN <= end; m += SLOT_STEP_MIN) {
      slots.push({
        value: minutesToHHMM(m),
        disabled: isToday && m - nowMins < LEAD_MINUTES,
      });
    }
    return { open, close, slots };
  });
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */
function validate(values, t, sessions) {
  const errors = {};
  if (!values.name || values.name.trim().length < 2) errors.name = t('book.errName');

  const digits = values.phone.replace(/\D/g, '').replace(/^91/, '');
  if (!/^[6-9]\d{9}$/.test(digits)) errors.phone = t('book.errPhone');

  const age = Number(values.age);
  if (!values.age || Number.isNaN(age) || age < 0 || age > 120) errors.age = t('book.errAge');

  if (!values.service) errors.service = t('book.errService');
  if (!values.date) errors.date = t('book.errDate');

  if (!values.time) {
    errors.time = t('book.errTime');
  } else {
    const slot = sessions.flatMap((s) => s.slots).find((s) => s.value === values.time);
    // The slot existed when the page loaded but may have passed while typing.
    if (!slot || slot.disabled) errors.time = t('book.errSlot');
  }

  if (!values.consent) errors.consent = t('book.errConsent');
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
    description:
      'Book a consultation at Care Clinic, Keshav Nagar, Mundhwa, Pune — choose a service, date and time slot. Open daily, 10 am–2 pm and 5 pm–10 pm.',
    path: '/book',
  });
  useReveals();

  const sessions = useMemo(() => buildSessions(values.date), [values.date]);
  const allSlots = useMemo(() => sessions.flatMap((s) => s.slots), [sessions]);
  const noSlotsToday = allSlots.every((s) => s.disabled);
  const openNow = isOpenNow();
  const serviceTitle = SERVICES.find((s) => s.slug === values.service)?.title;

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((err) => ({ ...err, [key]: undefined }));
  };

  // Keep the chosen slot valid when the date changes underneath it.
  useEffect(() => {
    if (!values.time) return;
    const slot = allSlots.find((s) => s.value === values.time);
    if (!slot || slot.disabled) setValues((v) => ({ ...v, time: '' }));
  }, [values.date]); // eslint-disable-line react-hooks/exhaustive-deps

  const whatsappMessage = (data) =>
    `Hello, I'd like to book an appointment: Name: ${data.name}, Date: ${formatDate(
      data.date,
      'en'
    )}, Time: ${data.time}, Service: ${
      SERVICES.find((s) => s.slug === data.service)?.title.en || data.service
    }${data.age ? `, Age: ${data.age}` : ''}${data.symptoms ? `, Symptoms: ${data.symptoms}` : ''}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values, t, sessions);
    if (Object.keys(found).length) {
      setErrors(found);
      // Move focus to the first invalid field for keyboard/AT users.
      const firstKey = Object.keys(found)[0];
      document.querySelector(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setStatus('sending');
    const message = whatsappMessage(values);

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
        // No backend configured yet — WhatsApp carries the booking.
        // eslint-disable-next-line no-console
        console.warn('[booking] No form backend configured — set VITE_FORM_ACCESS_KEY (Web3Forms) or VITE_FORM_ENDPOINT (Formspree).');
        setServerNote(
          'Demo mode: no form backend is configured yet, so this request reaches the clinic on WhatsApp only. [PLACEHOLDER: add your free Web3Forms access key.]'
        );
      }
      setConfirmation({ ...values, message, serviceTitle });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[booking] submit failed', err);
      setConfirmation({ ...values, message, serviceTitle });
      setServerNote(
        'We could not reach the form service, so please tap the WhatsApp button to send your request — your details are already filled in. [PLACEHOLDER: check the form backend key.]'
      );
    } finally {
      setStatus('done');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* ------------------------- Confirmation ------------------------- */
  if (status === 'done' && confirmation) {
    return (
      <>
        <PageHeader eyebrow={t('common.bookNow')} title={t('book.successTitle')} sub={t('book.successSub')} />
        <section className="container-page max-w-3xl section">
          <div className="panel" data-reveal="scale">
            <div className="flex items-start gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Icon name="check" className="h-7 w-7" strokeWidth={2.4} />
              </span>
              <div>
                <h2 className="title-md">{t('book.successTitle')}</h2>
                <p className="mt-2 text-ink-mute">{t('book.successSub')}</p>
              </div>
            </div>

            {serverNote && (
              <p
                className="mt-6 rounded-2xl border border-accent-200 bg-accent-50 p-4 text-sm leading-relaxed text-ink"
                role="status"
              >
                {serverNote}
              </p>
            )}

            <h3 className="mt-8 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-700">
              {t('book.successDetails')}
            </h3>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                [t('book.name'), confirmation.name],
                [t('book.phone'), confirmation.phone],
                [t('book.age'), confirmation.age],
                [t('book.service'), confirmation.serviceTitle ? L(confirmation.serviceTitle) : confirmation.service],
                [t('book.date'), formatDate(confirmation.date, lang)],
                [t('book.time'), formatTime(confirmation.time, lang)],
                [t('book.symptoms'), confirmation.symptoms || '—'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-sand p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-ink-mute">{label}</dt>
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
              <button
                type="button"
                onClick={() => {
                  setStatus('idle');
                  setConfirmation(null);
                  setServerNote('');
                }}
                className="btn-ghost !py-4"
                data-magnetic
              >
                {t('book.newBooking')}
              </button>
            </div>

            <p className="mt-6 rounded-2xl bg-brand-50 p-4 text-sm leading-relaxed text-ink-soft">{t('book.urgent')}</p>
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-ink-mute">
            {t('book.needHelp', { phone: PHONE_DISPLAY })}{' '}
            <Link to="/cancellation-policy" className="font-bold text-brand-700 underline underline-offset-2">
              {t('footer.cancelLink')}
            </Link>
          </p>
        </section>
      </>
    );
  }

  /* --------------------------- The form --------------------------- */
  return (
    <>
      <PageHeader eyebrow={t('nav.book')} title={t('book.title')} sub={t('book.sub')}>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="chip tabular">
            <Icon name="clock" className="h-4 w-4 text-brand-600" />
            {t('common.daily')} {formatTime(HOURS.sessions[0].open, lang)} – {formatTime(HOURS.sessions[0].close, lang)}
            {' · '}
            {formatTime(HOURS.sessions[1].open, lang)} – {formatTime(HOURS.sessions[1].close, lang)}
          </span>
          {!openNow && (
            <span className="chip !border-accent-200 !bg-accent-50 !text-accent-800">
              <Icon name="info" className="h-4 w-4" /> {t('book.slotsClosed')}
            </span>
          )}
        </div>
      </PageHeader>

      <section className="section">
        <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
          {/* ------------------------------- Form ------------------------------- */}
          <form onSubmit={handleSubmit} noValidate className="panel" data-reveal="left">
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

            {/* Step 1 — who */}
            <fieldset>
              <legend className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-700">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-700 text-[10px] text-white">1</span>
                {t('book.name')} · {t('book.phone')}
              </legend>
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
                  {errors.name && (
                    <span id="name-error" className="field-error">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="field-label">
                    {t('book.phone')} *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
                    className="field-input tabular"
                    value={values.phone}
                    onChange={set('phone')}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && (
                    <span id="phone-error" className="field-error">
                      {errors.phone}
                    </span>
                  )}
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
                    className="field-input tabular"
                    value={values.age}
                    onChange={set('age')}
                    aria-invalid={!!errors.age}
                    aria-describedby={errors.age ? 'age-error' : undefined}
                  />
                  {errors.age && (
                    <span id="age-error" className="field-error">
                      {errors.age}
                    </span>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Step 2 — what and when */}
            <fieldset className="mt-8 border-t border-line pt-8">
              <legend className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-700">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-700 text-[10px] text-white">2</span>
                {t('book.service')} · {t('book.date')} · {t('book.time')}
              </legend>

              <div className="grid gap-5">
                <div>
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
                    aria-describedby={errors.service ? 'service-error' : undefined}
                  >
                    <option value="">— {t('book.selectService')} —</option>
                    {SERVICES.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {L(s.title)}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <span id="service-error" className="field-error">
                      {errors.service}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="date" className="field-label">
                    {t('book.date')} *
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    className="field-input tabular"
                    min={todayISO()}
                    max={maxISO()}
                    value={values.date}
                    onChange={set('date')}
                    aria-invalid={!!errors.date}
                  />
                  {errors.date && <span className="field-error">{errors.date}</span>}
                </div>

                {/* Slot chips, grouped by OPD session */}
                <div>
                  <span className="field-label" id="time-label">
                    {t('book.pickSlot')} *
                  </span>
                  <div
                    className="mt-1 space-y-4"
                    role="radiogroup"
                    aria-labelledby="time-label"
                    aria-invalid={!!errors.time}
                    aria-describedby={errors.time ? 'time-error' : undefined}
                  >
                    {sessions.map((session, idx) => (
                      <div key={session.open}>
                        <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-mute">
                          <Icon name="clock" className="h-3.5 w-3.5 text-brand-500" />
                          {idx === 0 ? t('book.sessionMorning') : t('book.sessionEvening')}
                          <span className="tabular font-semibold normal-case tracking-normal text-ink-mute/70">
                            {formatTime(session.open, lang)} – {formatTime(session.close, lang)}
                          </span>
                        </p>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {session.slots.map((slot) => {
                            const active = values.time === slot.value;
                            return (
                              <label
                                key={slot.value}
                                className={`relative flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border px-2 text-[13px] font-bold transition duration-200 ease-brand ${
                                  slot.disabled
                                    ? 'cursor-not-allowed border-line bg-sand text-ink-mute/45 line-through'
                                    : active
                                      ? 'border-brand-700 bg-brand-700 text-white shadow-glow'
                                      : 'border-line bg-white text-ink-soft hover:border-brand-300 hover:bg-brand-50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="time"
                                  value={slot.value}
                                  checked={active}
                                  disabled={slot.disabled}
                                  onChange={set('time')}
                                  className="sr-only"
                                />
                                <span className="tabular">{formatTime(slot.value, lang)}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.time && (
                    <span id="time-error" className="field-error">
                      {errors.time}
                    </span>
                  )}
                  {noSlotsToday && (
                    <p className="mt-3 rounded-xl bg-sand p-3 text-xs font-semibold text-ink-soft">
                      {t('book.noSlots')}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Step 3 — notes + consent */}
            <fieldset className="mt-8 border-t border-line pt-8">
              <legend className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-700">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-700 text-[10px] text-white">3</span>
                {t('book.symptoms')}
              </legend>

              <label htmlFor="symptoms" className="sr-only">
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

              <label className="mt-4 flex items-start gap-3 rounded-2xl border border-line bg-sand p-4">
                <input
                  type="checkbox"
                  name="consent"
                  checked={values.consent}
                  onChange={set('consent')}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-brand-700"
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? 'consent-error' : undefined}
                />
                <span className="text-sm leading-relaxed text-ink-soft">{t('book.consent')}</span>
              </label>
              {errors.consent && (
                <span id="consent-error" className="field-error">
                  {errors.consent}
                </span>
              )}
            </fieldset>

            <div aria-live="polite">
              {Object.values(errors).some(Boolean) && (
                <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800" role="alert">
                  {t('book.errorPrefix')}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary mt-6 w-full !py-4 text-base"
              data-magnetic
            >
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
              {t('book.privacyNote')}{' '}
              <Link to="/privacy-policy" className="font-bold text-brand-700 underline underline-offset-2">
                {t('footer.privacyLink')}
              </Link>
            </p>
          </form>

          {/* ----------------------------- Sidebar ----------------------------- */}
          <aside className="space-y-5 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]" data-reveal="right">
            {/* Live summary — the form's own answers, echoed back. */}
            <div className="panel !p-6">
              <h2 className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-700">
                <Icon name="calendar" className="h-4 w-4" />
                {t('book.summary')}
              </h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                {[
                  [t('book.service'), serviceTitle ? L(serviceTitle) : null],
                  [t('book.date'), values.date ? formatDate(values.date, lang) : null],
                  [t('book.time'), values.time ? formatTime(values.time, lang) : null],
                  [t('book.name'), values.name || null],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 border-b border-line/70 pb-2.5 last:border-0 last:pb-0">
                    <dt className="text-xs font-semibold text-ink-mute">{label}</dt>
                    <dd className={`text-right font-bold ${value ? 'text-ink' : 'text-ink-mute/50'}`}>
                      {value || '—'}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="panel-tint">
              <h2 className="text-lg">{t('book.helpTitle')}</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
                {[t('book.tip1'), t('book.tip2'), t('book.tip3')].map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {tip}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-2">
                <a href={`tel:${PHONE_TEL}`} className="btn-dark !py-3">
                  <Icon name="phone" className="h-4 w-4" /> {PHONE_DISPLAY}
                </a>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-emerald-700 !py-3 text-white hover:bg-emerald-800"
                >
                  <Icon name="whatsapp" className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                  {t('common.whatsappShort')}
                </a>
              </div>
            </div>

            <div className="rounded-4xl border border-accent-200 bg-accent-50 p-6">
              <h2 className="flex items-center gap-2 text-lg">
                <Icon name="info" className="h-5 w-5 text-accent-700" />
                {t('common.emergency')}
              </h2>
              <a href="tel:112" className="btn mt-4 w-full bg-red-600 text-white hover:bg-red-700">
                <Icon name="phone" className="h-4 w-4" /> 112
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
