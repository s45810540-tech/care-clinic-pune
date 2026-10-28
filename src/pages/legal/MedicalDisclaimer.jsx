import LegalShell from './LegalShell';

/**
 * Medical disclaimer — the most important compliance page.
 * No diagnosis, no cure claims, no doctor–patient relationship formed online.
 */
export default function MedicalDisclaimer() {
  return (
    <LegalShell
      title="Medical Disclaimer"
      path="/medical-disclaimer"
      description="Website content is general information only — not a diagnosis, not a substitute for consultation, and it does not create a doctor–patient relationship."
    >
      <p>
        <strong>Important:</strong> everything published on this website — including health tips, service descriptions,
        blog articles and any text you receive from us through a web form — is <strong>general information only</strong>.
      </p>

      <h2>1. Not a diagnosis or treatment</h2>
      <p>
        Nothing here is a diagnosis, prescription, treatment plan or medical advice for your particular situation. Do
        not start, stop or change any medicine based on this website. Always consult a qualified medical practitioner
        in person.
      </p>

      <h2>2. No doctor–patient relationship</h2>
      <p>
        Browsing this website, reading an article, sending an appointment request, or chatting on WhatsApp with the
        clinic <strong>does not create a doctor–patient relationship</strong>. A relationship begins only when a
        consultation actually takes place.
      </p>

      <h2>3. No guarantees</h2>
      <p>
        We do not promise or guarantee any outcome, cure, recovery time or result. Every patient’s condition is
        different, and results vary. Descriptions of services describe what the clinic offers — they are not
        testimonials, endorsements or warranties of success.
      </p>

      <h2>4. Emergencies</h2>
      <p>
        This website is not an emergency service and is not monitored 24/7. For an emergency, call
        <strong> 112</strong> or go to the nearest hospital immediately. Do not wait for a web form or WhatsApp reply.
      </p>

      <h2>5. Accuracy and updates</h2>
        <p>
        We aim to keep information accurate and current, but medical knowledge changes and errors are possible. The
        clinic, its hours, fees and services may change; the most reliable source of information is the clinic itself
        on 082755 73300. We are not liable for decisions made in reliance on this website to the extent permitted by
        law.
      </p>

      <h2>6. External content</h2>
      <p>
        Links to Google Maps, Google reviews, WhatsApp or other sites are provided for convenience. We do not endorse
        and are not responsible for external content.
      </p>

      <h2>7. Individual responsibility</h2>
      <p>
        You are responsible for seeking proper medical care for yourself and for people in your care, including
        children and elderly family members, and for following the advice of the practitioner who examines you.
      </p>

      <p>
        <strong>Doctor details:</strong> Dr. Swati Kamble — Qualifications: [QUALIFICATIONS] · Registration no.:
        [REG. NO.]. <em>[PLACEHOLDER: confirm both with the clinic before launch.]</em>
      </p>
    </LegalShell>
  );
}
