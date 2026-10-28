/**
 * Single source of truth for clinic details.
 *
 * ⚠️ EVERY value flagged [PLACEHOLDER] must be confirmed by the clinic before launch.
 * The README keeps a full checklist of them.
 */

export const SITE = {
  name: 'Care Clinic for General Medicine & Surgery',
  nameMr: 'केअर क्लिनिक',
  shortName: 'Care Clinic',
  // [PLACEHOLDER] swap for the real production domain before launch (also used in sitemap.xml / canonical / JSON-LD).
  origin: 'https://care-clinic.example.com',
  tagline: { en: 'Caring for your family, every day', mr: 'तुमच्या कुटुंबाची काळजी, रोज' },
};

export const ADDRESS = {
  line1: 'Shop No.5, Sainagari Society, Survey No.5',
  line2: 'opposite Janseva Bank, Sasane Colony',
  line3: 'Keshav Nagar, Mundhwa, Pune',
  region: 'Maharashtra',
  pincode: '411036',
  full: 'Shop No.5, Sainagari Society, Survey No.5, opposite Janseva Bank, Sasane Colony, Keshav Nagar, Mundhwa, Pune, Maharashtra 411036',
};

export const PHONE_DISPLAY = '082755 73300';
export const PHONE_TEL = '+918275573300';
export const WHATSAPP_NUMBER = '918275573300';
/** Build a wa.me click-to-chat link (free — no WhatsApp Business API needed). */
export const waLink = (message = '') =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const HOURS = {
  // [PLACEHOLDER] Opening time was not supplied — replace "09:00" with the clinic's real opening time.
  openingTime: '09:00',
  closingTime: '22:00', // "closes 10 pm" (given)
  openAllDays: true,
};

export const EMERGENCY_NUMBER = '112';

export const DOCTOR = {
  name: 'Dr. Swati Kamble',
  role: { en: 'Consultant — General Medicine & Surgery', mr: 'सल्लागार — सामान्य औषधशास्त्र व शस्त्रक्रिया' },
  // [PLACEHOLDER] Client must supply the actual degrees/diplomas.
  qualifications: '[QUALIFICATIONS]',
  // [PLACEHOLDER] Client must supply the Maharashtra State Medical Council registration number.
  regNo: '[REG. NO.]',
  photo: '/images/doctor-portrait.svg', // [PLACEHOLDER] replace with a real photograph (WebP, 800×1000)
};

export const RATING = {
  value: 4.9,
  count: 600,
  // [PLACEHOLDER] Replace with the exact Google Business Profile "Write a review" share URL.
  googleUrl: 'https://www.google.com/maps/search/?api=1&query=Care+Clinic+for+General+Medicine+%26+Surgery+Keshav+Nagar+Mundhwa+Pune',
  mapEmbed:
    'https://www.google.com/maps?q=' +
    encodeURIComponent('Shop No.5, Sainagari Society, opposite Janseva Bank, Sasane Colony, Keshav Nagar, Mundhwa, Pune 411036') +
    '&output=embed',
};

/** Appointment form backend — pick ONE, free tier. */
export const FORM_CONFIG = {
  // Option A (recommended): Web3Forms — https://web3forms.com — create a free access key and
  // paste it here (or set it as VITE_FORM_ACCESS_KEY in the host's env vars).
  provider: 'web3forms',
  accessKey: import.meta.env.VITE_FORM_ACCESS_KEY || '[WEB3FORMS_ACCESS_KEY]',
  // Option B: Formspree — replace endpoint with e.g. 'https://formspree.io/f/xxxxxxx'
  endpoint: import.meta.env.VITE_FORM_ENDPOINT || '',
};

/** Figures below are placeholders — replace with confirmed clinic numbers (see README). */
export const STATS = [
  // [PLACEHOLDER]
  { value: 12, suffix: '+', label: { en: 'Years of care in Keshav Nagar', mr: 'केशव नगरात वर्षांची सेवा' } },
  // [PLACEHOLDER]
  { value: 15000, suffix: '+', label: { en: 'Patients seen', mr: 'भेटलेल्या रुग्ण' } },
  { value: RATING.value, suffix: '', label: { en: 'Google rating', mr: 'Google गुणांक' }, decimals: 1 },
  { value: RATING.count, suffix: '+', label: { en: 'Google reviews', mr: 'Google प्रतिक्रिया' } },
];

/** Quick contact / directions deep links */
export const MAPS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS.full)}`;

export const SOCIAL = {
  // [PLACEHOLDER] add real profiles or delete unused entries.
  facebook: '',
  instagram: '',
};
