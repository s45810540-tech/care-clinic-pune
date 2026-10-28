/**
 * All marketing content for the site.
 * Every translatable string is `{ en, mr }` so the language toggle can swap it in place.
 * Descriptions are factual and deliberately avoid cure/guarantee claims (see Medical Disclaimer).
 */

import { RATING } from './site';
import { photoSrc } from './photos';

/** Helper: pick the active language version of any `{en, mr}` object. */
export const L = (obj, lang) => (obj && (obj[lang] ?? obj.en)) ?? '';

/* ------------------------------------------------------------------ */
/* Services (each gets its own detail section on /services)            */
/* ------------------------------------------------------------------ */
export const SERVICES = [
  {
    slug: 'general-medicine',
    icon: 'stethoscope',
    title: { en: 'General Medicine', mr: 'सामान्य औषधशास्त्र' },
    short: {
      en: 'Consultation for everyday health concerns in adults — evaluation, examination and a clear plan for next steps.',
      mr: 'प्रौढांच्या रोजच्या आरोग्यसंबंधी समस्यांसाठी सल्ला, तपासणी आणि पुढील पावलांचा स्पष्ट नियोजन.',
    },
    points: [
      { en: 'Consultation for common illnesses and long-term conditions', mr: 'सामान्य आजार आणि दीर्घकालीन आजारांसाठी सल्ला' },
      { en: 'Physical examination and review of your existing reports', mr: 'शारीरिक तपासणी आणि आधीच्या रिपोर्टांचा अभ्यास' },
      { en: 'Referral for further tests or specialist care when needed', mr: 'गरज पडल्यास अधिक चाचण्या किंवा तज्ज्ञ सेवेसाठी मार्गदर्शन' },
    ],
    note: {
      en: 'Consultation does not replace emergency care. For emergencies call 112.',
      mr: 'सल्ला ही आणीबाणी सेवेचा पर्याय नाही. आणीबाणीसाठी 112 वर कॉल करा.',
    },
  },
  {
    slug: 'fever-infection',
    icon: 'thermometer',
    title: { en: 'Fever & Infection Treatment', mr: 'ताप व संसर्गाची उपचार' },
    short: {
      en: 'Assessment of fever, throat, chest, urinary and skin infections, with advice on tests and follow-up.',
      mr: 'ताप, घसा, छाती, मूत्रमार्ग व त्वचेच्या संसर्गांचे मूल्यांकन, चाचण्या व पुन्हा तपासणीबद्दल सल्ला.',
    },
    points: [
      { en: 'Same-day assessment for fever and related symptoms', mr: 'ताप व संबंधित लक्षणांसाठी त्याच दिवशी मूल्यांकन' },
      { en: 'Guidance on appropriate diagnostics before starting treatment', mr: 'उपचार सुरू करण्यापूर्वी योग्य निदानाबद्दल मार्गदर्शन' },
      { en: 'Follow-up review as advised by the doctor', mr: 'डॉक्टरांच्या सूचनेनुसार पुन्हा तपासणी' },
    ],
    note: {
      en: 'Persistent or high fever needs in-person assessment — please book a visit.',
      mr: 'सतत किंवा जास्त तापासाठी वैयक्तिक तपासणी आवश्यक आहे — कृपया वेळ बुक करा.',
    },
  },
  {
    slug: 'family-doctor',
    icon: 'home',
    title: { en: 'Family Doctor Care', mr: 'कुटुंब डॉक्टर सेवा' },
    short: {
      en: 'Continuity of care for the whole family — one clinic that knows your history across visits.',
      mr: 'संपूर्ण कुटुंबासाठी सातत्याने देखभाल — भेटींदरम्यान तुमचा इतिहास माहीत असणारी एकच क्लिनिक.',
    },
    points: [
      { en: 'Health check-ups and preventive advice for adults and elders', mr: 'प्रौढ व वृद्धांसाठी आरोग्य तपासणी व प्रतिबंधात्मक सल्ला' },
      { en: 'Regular review of diabetes, blood pressure and related conditions', mr: 'मधुमेह, रक्तदाब व संबंधित आजारांची नियमित पुन्हा तपासणी' },
      { en: 'Single point of contact for referrals and reports', mr: 'शिफारसी व रिपोर्टसाठी एकच संपर्क ठिकाण' },
    ],
    note: {
      en: 'Long-term conditions are managed with regular review, not one-time advice.',
      mr: 'दीर्घकालीन आजार नियमित तपासणीने व्यवस्थापित केले जातात, एकदाच्या सल्ल्याने नाही.',
    },
  },
  {
    slug: 'paediatric-daycare',
    icon: 'baby',
    title: { en: 'Paediatric Care & Day-Care Admission', mr: 'बालरोग सेवा व दिवसभर दाखला' },
    short: {
      en: 'Assessment for infants and children, with day-care admission for observation and short-term care.',
      mr: 'शिशू व मुलांचे मूल्यांकन, निरीक्षण व अल्पकालीन देखभालीसाठी दिवसभर दाखला उपलब्ध.',
    },
    points: [
      { en: 'Growth, feeding and routine immunisation guidance', mr: 'वाढ, आहार व नियमित लसीकरणाबद्दल मार्गदर्शन' },
      { en: 'Assessment of fever, cough, cold and tummy pain in children', mr: 'मुलांमधील ताप, खोकला, सर्दी व पोटदुखीचे मूल्यांकन' },
      { en: 'Day-care admission for observation and short procedures', mr: 'निरीक्षण व छोट्या प्रक्रियांसाठी दिवसभर दाखला' },
    ],
    note: {
      en: 'Bring previous vaccination records and reports to the first visit.',
      mr: 'पहिल्या भेटीला मागील लसीकरण नोंदी व रिपोर्ट घेऊन या.',
    },
  },
  {
    slug: 'piles-minor-surgery',
    icon: 'scalpel',
    title: { en: 'Piles / Anal Fissure & Minor Surgery', mr: 'बवासीर / गुदभ्रंश व लघुशस्त्रक्रिया' },
    short: {
      en: 'Private consultation for piles, fissure and related discomfort, with surgical options where indicated.',
      mr: 'बवासीर, गुदभ्रंश व संबंधित त्रासासाठी गोपनीय सल्ला; आवश्यक असल्यास शस्त्रक्रियेचे पर्याय.',
    },
    points: [
      { en: 'Confidential assessment and discussion of treatment options', mr: 'गोपनीय मूल्यांकन व उपचार पर्यायांची चर्चा' },
      { en: 'Minor surgical procedures with post-procedure instructions', mr: 'प्रक्रियेनंतर सूचनांसह लघुशस्त्रक्रिया' },
      { en: 'Follow-up dressing and review appointments', mr: 'पुढील बांधी व तपासणी अपॉइंटमेंट' },
    ],
    note: {
      en: 'Suitability for any procedure is decided only after an in-person examination.',
      mr: 'कोणतीही प्रक्रिया करता येईल का याचा निर्णय वैयक्तिक तपासणीनंतरच होतो.',
    },
  },
  {
    slug: 'ayurvedic',
    icon: 'leaf',
    title: { en: 'Ayurvedic Treatment', mr: 'आयुर्वेदिक उपचार' },
    short: {
      en: 'Ayurvedic consultation and therapy planned alongside your regular medical care.',
      mr: 'तुमच्या नियमित वैद्यकीय देखभालीसोबत नियोजित आयुर्वेदिक सल्ला व उपचार.',
    },
    points: [
      { en: 'Ayurvedic consultation for general well-being', mr: 'सामान्य आरोग्यासाठी आयुर्वेदिक सल्ला' },
      { en: 'Therapies planned with your existing prescriptions in mind', mr: 'सध्याच्या औषधांचा विचार करून नियोजित उपचार' },
      { en: 'Coordination with your other treatment where relevant', mr: 'गरजेनुसार इतर उपचारांशी समन्वय' },
    ],
    note: {
      en: 'Do not stop prescribed medicine without speaking to your doctor first.',
      mr: 'डॉक्टरांशी बोलल्याशिवाय नेमून दिलेली औषधे थांबवू नका.',
    },
  },
  {
    slug: 'diagnostics',
    icon: 'flask',
    title: { en: 'Diagnostics', mr: 'निदान सुविधा' },
    short: {
      en: 'Basic investigations — blood tests, sugar, ECG and other reports — read together with your consultation.',
      mr: 'मूलभूत चाचण्या — रक्त चाचणी, साखर, ECG व इतर रिपोर्ट — सल्ल्यासोबत वाचल्या जातात.',
    },
    points: [
      { en: 'Sample collection and common laboratory tests', mr: 'नमुना संकलन व सामान्य प्रयोगशाळा चाचण्या' },
      { en: 'Basic cardiac and vitals checks', mr: 'मूलभूत हृदय व स्वास्थ्य-सूचक तपासण्या' },
      { en: 'Reports explained in plain language at follow-up', mr: 'पुन्हा तपासणीला रिपोर्ट सोप्या भाषेत समजावून सांगितल्या जातात' },
    ],
    note: {
      en: 'Turnaround time depends on the test and the external laboratory.',
      mr: 'रिपोर्ट मिळण्याचा कालावधी चाचणी व बाहेरच्या प्रयोगशाळेवर अवलंबून असतो.',
    },
  },
];

/* ------------------------------------------------------------------ */
/* How your visit works — animated timeline                            */
/* ------------------------------------------------------------------ */
export const VISIT_STEPS = [
  {
    step: '01',
    title: { en: 'Choose a time', mr: 'वेळ निवडा' },
    body: {
      en: 'Book online or send a WhatsApp message. You will see only the slots the clinic is actually open for.',
      mr: 'ऑनलाइन बुक करा किंवा WhatsApp संदेश पाठवा. क्लिनिक ज्या वेळी उघडे असते त्याच वेळ दिसतील.',
    },
  },
  {
    step: '02',
    title: { en: 'Check-in at the desk', mr: 'डेस्कवर नोंदणी' },
    body: {
      en: 'Arrive a few minutes early with your previous prescriptions and reports, if any.',
      mr: 'काही मिनिटे लवकर या व मागील औषधपत्रे व रिपोर्ट घेऊन आल्यास चांगले.',
    },
  },
  {
    step: '03',
    title: { en: 'Consultation', mr: 'सल्ला' },
    body: {
      en: 'The doctor examines you, reviews your history and explains the next steps in simple terms.',
      mr: 'डॉक्टर तपासणी करतात, इतिहास पाहतात व पुढील पावले सोप्या शब्दांत समजावून सांगतात.',
    },
  },
  {
    step: '04',
    title: { en: 'Tests, if needed', mr: 'गरजेनुसार चाचण्या' },
    body: {
      en: 'Diagnostics are advised only when they add information. Reports are discussed with you afterwards.',
      mr: 'निदान फायदेशीर असल्यासच सुचवले जाते. नंतर रिपोर्ट तुमच्याशी चर्चा केली जाते.',
    },
  },
  {
    step: '05',
    title: { en: 'Follow-up', mr: 'पुन्हा तपासणी' },
    body: {
      en: 'A follow-up visit or a WhatsApp check-in is scheduled so progress can be reviewed.',
      mr: 'प्रगती पाहण्यासाठी पुन्हा तपासणी किंवा WhatsApp वर संपर्क ठरवला जातो.',
    },
  },
];

/* ------------------------------------------------------------------ */
/* FAQ (bilingual)                                                     */
/* ------------------------------------------------------------------ */
export const FAQS = [
  {
    q: { en: 'What are the clinic timings?', mr: 'क्लिनिकच्या वेळा काय आहेत?' },
    a: {
      en: 'The clinic is open every day and closes at 10 pm. Opening time is shown in the header. [PLACEHOLDER: confirm the exact opening time with the clinic.]',
      mr: 'क्लिनिक दररोज उघडे असून रात्री 10 वाजता बंद होते. सुरुवातीची वेळ हेडरमध्ये दिली आहे. [PLACEHOLDER: क्लिनिककडून अचूक वेळ पडताळा.]',
    },
  },
  {
    q: { en: 'Do I need an appointment?', mr: 'अपॉइंटमेंट आवश्यक आहे का?' },
    a: {
      en: 'Booking a slot is recommended so you are not kept waiting, but walk-ins are seen when the schedule allows. You can book on this site or send a WhatsApp message.',
      mr: 'वाट न पाहिली जावी म्हणून वेळ बुक करणे चांगले, परंतु वेळापत्रकात जागा असल्यास अपॉइंटमेंटशिवायही भेट दिली जाते. या साइटवर किंवा WhatsApp वरून बुक करता येते.',
    },
  },
  {
    q: { en: 'How do I reach the clinic?', mr: 'क्लिनिकपर्यंत कसे पोहोचायचे?' },
    a: {
      en: 'We are at Shop No.5, Sainagari Society, Survey No.5, opposite Janseva Bank, Sasane Colony, Keshav Nagar, Mundhwa, Pune 411036. Use the Directions button on the Contact page for turn-by-turn navigation.',
      mr: 'आम्ही Shop No.5, Sainagari Society, Survey No.5, Janseva Bank समोर, Sasane Colony, Keshav Nagar, Mundhwa, Pune 411036 येथे आहोत. स्थलांकन पाहण्यासाठी Contact पृष्ठावरील Directions बटण वापरा.',
    },
  },
  {
    q: { en: 'Which languages are spoken?', mr: 'कोणत्या भाषा बोलल्या जातात?' },
    a: {
      en: 'Consultations are available in Marathi, Hindi and English. [PLACEHOLDER: confirm with the clinic.]',
      mr: 'सल्ला मराठी, हिंदी व इंग्रजी या भाषांमध्ये उपलब्ध आहे. [PLACEHOLDER: क्लिनिककडून पडताळा.]',
    },
  },
  {
    q: { en: 'What should I bring to the first visit?', mr: 'पहिल्या भेटीला काय घेऊन यावे?' },
    a: {
      en: 'Any previous prescriptions, discharge summaries, blood reports and a list of medicines you currently take. Children should bring their vaccination record.',
      mr: 'मागील औषधपत्रे, दाखल-सुट्ट्या, रक्त रिपोर्ट व सध्या सेवारत औषधांची यादी. मुलांसाठी लसीकरण नोंदी घेऊन याव्यात.',
    },
  },
  {
    q: { en: 'How do I pay?', mr: 'पेमेंट कसे करावे?' },
    a: {
      en: 'Fees can be paid at the clinic. [PLACEHOLDER: list the accepted modes — cash / UPI / card — as confirmed by the clinic.]',
      mr: 'फी क्लिनिकवर भरता येते. [PLACEHOLDER: क्लिनिकने पडताळलेले पेमेंट पर्याय — रोख / UPI / कार्ड — यादी करा.]',
    },
  },
  {
    q: { en: 'Is my information kept private?', mr: 'माहिती गोपनीय ठेवली जाते का?' },
    a: {
      en: 'Yes. Your personal and health information is handled only for your care and is protected as described in our Privacy Policy, which follows the Digital Personal Data Protection Act, 2023.',
      mr: 'होय. तुमची वैयक्तिक व आरोग्य माहिती केवळ तुमच्या देखभालीसाठी वापरली जाते आणि Digital Personal Data Protection Act, 2023 नुसार आमच्या गोपनीयता धोरणाने सुरक्षित ठेवली जाते.',
    },
  },
  {
    q: { en: 'Can I cancel or reschedule my visit?', mr: 'भेट रद्द किंवा बदलू शकतो का?' },
    a: {
      en: 'Yes. Please tell us at least [4] hours in advance on WhatsApp or by phone so the slot can be offered to someone else. Full details are on the Cancellation & Rescheduling page.',
      mr: 'होय. वेळ दुसऱ्याला देता यावी म्हणून कृपया किमान [4] तास आधी WhatsApp किंवा फोनवर सांगा. संपूर्ण माहिती Cancellation & Rescheduling पृष्ठावर आहे.',
    },
  },
  {
    q: { en: 'Do you treat children?', mr: 'मुलांचे उपचार होतात का?' },
    a: {
      en: 'Yes — paediatric assessment, day-care admission and growth follow-up are available. For emergencies in infants, go straight to the nearest hospital and call 112.',
      mr: 'होय — बालरोग मूल्यांकन, दिवसभर दाखला व वाढ तपासणी उपलब्ध आहे. शिशूंच्या आणीबाणीसाठी लगेच जवळच्या रुग्णालयात जा आणि 112 वर कॉल करा.',
    },
  },
  {
    q: { en: 'Is the Google rating shown on this site a testimonial?', mr: 'या साइटवर दिलेले Google गुण शिफारस आहेत का?' },
    a: {
      en: 'No. We only display the aggregate rating Google shows for the clinic and link to the public reviews page. Individual patient testimonials are not published on this website, in line with Indian medical advertising rules.',
      mr: 'नाही. आम्ही केवळ Google वर क्लिनिकसाठी दिसणारे एकूण गुण दाखवतो व सार्वजनिक प्रतिक्रिया पृष्ठाला लिंक देतो. भारतीय वैद्यकीय जाहिरात नियमांनुसार वैयक्तिक रुग्ण शिफारसी या साइटवर प्रकाशित केल्या जात नाहीत.',
    },
  },
];

/* ------------------------------------------------------------------ */
/* Blog — 3 sample health-tip articles                                */
/* ------------------------------------------------------------------ */
export const POSTS = [
  {
    slug: 'when-to-see-a-doctor-for-fever',
    title: {
      en: 'Fever in adults: when to see a doctor',
      mr: 'प्रौढांमधील ताप: डॉक्टरांना कधी भेटावे',
    },
    excerpt: {
      en: 'Most fevers settle with rest and fluids. These are the signs that mean you should book a consultation instead of waiting.',
      mr: 'बहुतेक ताप विश्रांती व पाण्याने कमी होतो. वाट पाहण्याऐवजी सल्ला घ्यावा हे कोणते लक्षण दर्शवतात ते इथे आहे.',
    },
    date: '2026-09-12',
    readMins: 4,
    image: '/images/blog-fever.svg',
    category: { en: 'Everyday health', mr: 'रोजचे आरोग्य' },
    body: [
      { type: 'p', text: { en: 'A fever is the body’s way of responding to an infection. In most cases it is short-lived and improves with rest, fluids and the medicines your doctor has advised.', mr: 'ताप हा संसर्गाप्रतिशरीराची प्रतिक्रिया असते. बहुतेक संदर्भात तो कमी असतो व विश्रांती, पाणी आणि डॉक्टरांनी सुचवलेल्या औषधांनून कमी होतो.' } },
      { type: 'h', text: { en: 'Book a consultation if you notice', mr: 'खालील लक्षण दिसल्यास सल्ला बुक करा' } },
      { type: 'ul', items: [
        { en: 'Fever lasting more than three days, or that keeps returning', mr: 'तीन दिवसांपेक्षा जास्त किंवा वारंवार परत येणारा ताप' },
        { en: 'Very high temperature, shivering, or confusion', mr: 'अत्यंत जास्त उष्णता, कंप किंवा गोंधळ' },
        { en: 'A stiff neck, rash, breathlessness or chest pain', mr: 'जड मान, चकरी, श्वास घेण्यास त्रास किंवा छातीत दुखत' },
        { en: 'Not passing urine, or feeling very weak', mr: 'लघवी येणे बंद असणे किंवा अत्यंत कमकुवतपणा' },
        { en: 'Underlying conditions such as diabetes, heart disease or pregnancy', mr: 'मधुमेह, हृदयविकार किंवा गर्भधारणा यांसारखी आधीची आजार' },
      ] },
      { type: 'h', text: { en: 'While you recover', mr: 'आरोग्य प्राप्तीच्या काळात' } },
      { type: 'p', text: { en: 'Drink water often, rest in a cool room and follow the dosage your doctor has written down. Avoid self-medicine, antibiotic sharing and duplicate doses — they can hide what is actually happening.', mr: 'नेहमी पाणी प्या, हुशार खोलीत विश्रांती घ्या आणि डॉक्टरांनी लिहिलेल्या प्रमाणात औषध घ्या. स्वतःहून औषध, एंटिबायोटिक वाटणे आणि डोस दोनदा घेणे टाळा — यामुळे खरे कारण लपले जाऊ शकते.' } },
      { type: 'note', text: { en: 'This article is general information, not a diagnosis. If you feel very unwell, contact the clinic on 082755 73300 or call 112 for an emergency.', mr: 'हा लेख सामान्य माहिती आहे, निदान नाही. अत्यंत अस्वस्थ वाटत असल्यास क्लिनिकशी 082755 73300 वर संपर्क साधा किंवा आणीबाणीसाठी 112 वर कॉल करा.' } },
    ],
  },
  {
    slug: 'managing-blood-pressure-at-home',
    title: { en: 'Five everyday habits that support healthy blood pressure', mr: 'रक्तदाब सांभाळण्यासाठी पाच सोप्या सवयी' },
    excerpt: {
      en: 'Small, repeatable changes at home — salt, movement, sleep, stress and follow-up — matter more than any single remedy.',
      mr: 'घरच्या घरी केलेल्या छोट्या बदल — मीठ, हालचाल, झोप, तणाव व तपासणी — कोणत्याही एका उपायापेक्षा महत्त्वाचे.',
    },
    date: '2026-08-30',
    readMins: 5,
    image: '/images/blog-bp.svg',
    category: { en: 'Prevention', mr: 'प्रतिबंध' },
    body: [
      { type: 'p', text: { en: 'Blood pressure readings move through the day. A single high number is not a diagnosis — but repeated high readings deserve a proper review.', mr: 'रक्तदाब दिवसातून बदलत असतो. एकदाच जास्त आकडा निदान नाही — परंतु वारंवार जास्त आकडे म्हणजे योग्य तपासणीची गरज आहे.' } },
      { type: 'h', text: { en: 'The five habits', mr: 'पाच सवयी' } },
      { type: 'ol', items: [
        { en: 'Reduce added salt. Taste food before adding more, and cut down on pickles, papad and packaged snacks.', mr: 'जादा मीठ कमी करा. अजून मीठ घालण्यापूर्वी आधी चव पाहा, लोणचे, पापड व पॅकेज्ड स्नॅक्स कमी करा.' },
        { en: 'Move for 30 minutes most days — a brisk walk counts.', mr: 'बहुतेक दिवस 30 मिनिटे हालचाल करा — चालणे योग्य आहे.' },
        { en: 'Keep a regular sleep time; short, broken sleep pushes pressure up.', mr: 'नेहमी एकाच वेळी झोपा; थोडी व खंडित झोप दाब वाढवते.' },
        { en: 'Take your prescribed medicine at the same time daily, without skipping.', mr: 'नेमून दिलेली औषधे रोज एकाच वेळी घ्या, सुट्टी केल्या नाहीत.' },
        { en: 'Come back for the review visit your doctor has advised.', mr: 'डॉक्टरांनी सुचवलेली पुन्हा तपासणी करण्यासाठी परत या.' },
      ] },
      { type: 'p', text: { en: 'Home readings are useful when taken the same way each time: seated, relaxed for five minutes, arm supported at heart level. Write them down and bring the log to your appointment.', mr: 'घरचे आकडे उपयोगी ठरतात जर ते नेहमी त्याच पद्धतीने घेतले गेले: बसलेल्या पणे, पाच मिनिटे शांत राहून, हात मनाच्या उंचीवर टेकलेला. आकडे लिहून ठेवा व अपॉइंटमेंटला घेऊन या.' } },
      { type: 'note', text: { en: 'This article is general information, not a diagnosis or a treatment plan. Bring your readings to a consultation for advice specific to you.', mr: 'हा लेख सामान्य माहिती आहे — निदान किंवा उपचार योजना नाही. तुमच्यासाठी योग्य सल्ल्यासाठी आकडे घेऊन सल्ल्याला या.' } },
    ],
  },
  {
    slug: 'child-fever-what-parents-should-know',
    title: { en: 'Child with fever: what parents should know', mr: 'मुलाला ताप: पालकांनी काय माहित असावे' },
    excerpt: {
      en: 'How to observe a child safely at home, which symptoms need same-day review, and what to carry to the clinic.',
      mr: 'घरी मुलाचे निरीक्षण कसे करावे, कोणती लक्षण त्याच दिवशी तपासणी मागतात आणि क्लिनिकला काय घेऊन यावे.',
    },
    date: '2026-08-04',
    readMins: 4,
    image: '/images/blog-child.svg',
    category: { en: 'Child health', mr: 'बालआरोग्य' },
    body: [
      { type: 'p', text: { en: 'Children get more infections than adults because their immune system is still learning. Most are viral and settle with supportive care — but children can also deteriorate quickly, so observation matters.', mr: 'मुलांची प्रतिरक्षा प्रणाली अजून शिकत असल्यामुळे त्यांना प्रौढांपेक्षा जास्त संसर्ग होतात. बहुतेक व्हायरल असून सहाय्यक देखभालीने कमी होतात — परंतु मुले पटकन बिघडू शकतात, म्हणून निरीक्षण महत्त्वाचे आहे.' } },
      { type: 'h', text: { en: 'Watch for these and contact us the same day', mr: 'ही लक्षण पाहा आणि त्याच दिवशी आमच्याशी संपर्क साधा' } },
      { type: 'ul', items: [
        { en: 'Fever in a baby under 3 months', mr: '3 महिन्यांखालील शिशूला ताप' },
        { en: 'Not drinking fluids, or far fewer wet nappies', mr: 'पाणी/दूध न पिणे किंवा लवकर कमी लघवी' },
        { en: 'Breathing fast, grunting, or pulling in the chest', mr: 'लवकर श्वास घेणे, जोरात श्वास घेणे किंवा छाती आत ओढली जाणे' },
        { en: 'A rash that does not fade when pressed with a glass', mr: 'काचेने दाबल्यावर जाणारी नसलेली चकरी' },
        { en: 'Extreme sleepiness, floppiness or a high-pitched cry', mr: 'अत्यंत झोपेचेपणा, शिथिलपणा किंवा तीव्र रडणे' },
      ] },
      { type: 'h', text: { en: 'Carry to the visit', mr: 'भेटीला घेऊन यावे' } },
      { type: 'p', text: { en: 'The vaccination record, any previous prescriptions, and a note of when the fever started and what was given. If the child has been vomiting, note that too.', mr: 'लसीकरण नोंदी, मागील औषधपत्रे, ताप कधी सुरू झाला व काय दिले याची नोंद. मुलाने उलटी केली असेल तर तेही लिहा.' } },
      { type: 'note', text: { en: 'This article is general information and cannot examine your child. For emergencies call 112 or go to the nearest hospital.', mr: 'हा लेख सामान्य माहिती असून तुमच्या मुलाची तपासणी करू शकत नाही. आणीबाणीसाठी 112 वर कॉल करा किंवा जवळच्या रुग्णालयात जा.' } },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */
export const GALLERY = [
  // The first four slots are wired to the real photographs in
  // src/assets/photos/ (see its README) and fall back to placeholder art.
  { photo: 'storefront', src: '/images/gallery-6.svg', caption: { en: 'The entrance — opposite Janseva Bank, Sasane Colony', mr: 'प्रवेशद्वार — जनसेवा बँकेसमोर, सासने कॉलनी' } },
  { photo: 'interior', src: '/images/gallery-2.svg', caption: { en: 'Consultation room', mr: 'सल्ला खोली' } },
  { photo: 'team', src: '/images/gallery-3.svg', caption: { en: 'The clinic team', mr: 'क्लिनिकची टीम' } },
  { photo: 'signboard', src: '/images/gallery-4.svg', caption: { en: 'Look for this board above the door', mr: 'दरवाजावरील हे बोर्ड लक्षात ठेवा' } },
  { src: '/images/gallery-5.svg', caption: { en: 'Pharmacy guidance desk', mr: 'औषध मार्गदर्शन डेस्क' } },
  { src: '/images/gallery-1.svg', caption: { en: 'Reception and waiting area', mr: 'प्रवेशद्वार व वेटिंग क्षेत्र' } },
  // Resolve at module load: `src` becomes the real photo when present.
].map((item) => ({ ...item, src: photoSrc(item.photo, item.src) }));

/* ------------------------------------------------------------------ */
/* Reviews page copy                                                   */
/* ------------------------------------------------------------------ */
export const REVIEW_COPY = {
  heading: { en: 'What patients say on Google', mr: 'Google वर रुग्ण म्हणतात ते' },
  compliance: {
    en: 'Why we do not publish testimonials here: Indian medical advertising rules restrict how clinics may present patient feedback. This page therefore shows only the aggregate rating Google displays for our listing, and links out to the public reviews. Please read them on Google.',
    mr: 'इथे शिफारसी का प्रकाशित केल्या जात नाहीत: भारतीय वैद्यकीय जाहिरात नियम क्लिनिकला रुग्णांच्या अभिप्रायाचे स्वरूप ठरवण्याची मर्यादा लादतात. म्हणून या पृष्ठावर केवळ Google वर दिसणारे एकूण गुण दिले आहेत व सार्वजनिक प्रतिक्रियांची लिंक दिली आहे. कृपया Google वर त्या वाचा.',
  },
  rating: RATING,
};
