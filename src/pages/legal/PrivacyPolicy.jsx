import LegalShell from './LegalShell';

/**
 * Privacy Policy — aligned to the Digital Personal Data Protection Act, 2023 (India).
 * Plain language, with all client-specific values in [BRACKETS].
 */
export default function PrivacyPolicy() {
  return (
    <LegalShell
      title="Privacy Policy"
      path="/privacy-policy"
      description="How Care Clinic collects, uses, stores and deletes your personal data, and how you can withdraw consent under the DPDP Act, 2023."
    >
      <p>
        This Privacy Policy explains what personal data <strong>Care Clinic for General Medicine &amp; Surgery</strong> (“the
        Clinic”, “we”) collects when you use this website, why we collect it, how long we keep it, and the choices you
        have. It follows the <strong>Digital Personal Data Protection Act, 2023</strong> (DPDP Act) and the rules made
        under it.
      </p>

      <h2>1. What data we collect</h2>
      <ul>
        <li>
          <strong>Booking details:</strong> your name, mobile number, age, the service you chose, your preferred date
          and time, and any symptoms you choose to type in the form.
        </li>
        <li>
          <strong>Messages:</strong> anything you send us on WhatsApp, by phone, or by e-mail.
        </li>
        <li>
          <strong>Technical data (only with your consent):</strong> aggregated, anonymised analytics such as pages
          visited, device type and approximate location. Analytics scripts load <strong>only after</strong> you accept
          cookies in the banner.
        </li>
        <li>
          <strong>Health information:</strong> only what you share for your own care. We treat it as sensitive and
          restrict access to the treating doctor and authorised staff.
        </li>
      </ul>
      <p>
        We do <strong>not</strong> knowingly collect data from children without the consent of a parent or lawful
        guardian, and we do not sell, rent or trade personal data.
      </p>

      <h2>2. Why we use it (purpose and lawful basis)</h2>
      <ul>
        <li>To book, confirm, reschedule or cancel your appointment and to contact you about it.</li>
        <li>To provide care you have asked for, including diagnostics and follow-up.</li>
        <li>To meet legal and professional obligations that apply to a medical clinic in India.</li>
        <li>To understand, with your consent, how people use this website so we can improve it.</li>
      </ul>
      <p>
        We use your data only for the purpose it was collected for, and only for as long as that purpose is lawful.
      </p>

      <h2>3. Consent</h2>
      <p>
        You give consent by ticking the consent box when you submit an appointment request, or by choosing “Accept
        analytics” in the cookie banner. Consent is voluntary — you may refuse, and refusing does not stop you from
        calling the clinic on <a href="tel:+918275573300">082755 73300</a> or visiting us in person.
      </p>
      <p>
        You may withdraw your consent at any time by writing to [GRIEVANCE EMAIL] or messaging us on WhatsApp. We will
        stop the relevant processing within a reasonable time, except where we must keep the data to meet another legal
        obligation.
      </p>

      <h2>4. Who we share it with</h2>
      <ul>
        <li>
          <strong>Our form service provider</strong> [FORM PROVIDER NAME — e.g. Web3Forms], which only transmits the
          message to us.
        </li>
        <li>
          <strong>WhatsApp / Meta</strong>, when you choose to message us — your use of WhatsApp is governed by Meta’s
          own policies.
        </li>
        <li>
          <strong>Laboratories or hospitals</strong> if you ask us to share reports for your care, or where the law
          requires it.
        </li>
        <li>
          <strong>Authorities</strong> where disclosure is required by law, court order or to protect life and health.
        </li>
      </ul>
      <p>We do not use your data for automated decision-making or profiling that produces legal effects.</p>

      <h2>5. How long we keep it</h2>
      <p>
        Appointment request records: <strong>[RETENTION PERIOD — e.g. 24 months]</strong>. Medical records: as required
        by the clinic record-keeping rules applicable in India <strong>[CONFIRM WITH YOUR LAWYER]</strong>. Analytics
        data: as configured in our analytics tool <strong>[e.g. 14 months]</strong>. When a retention period ends, the
        data is deleted or irreversibly anonymised.
      </p>

      <h2>6. Your rights</h2>
      <ul>
        <li><strong>Access</strong> — ask what personal data we hold about you.</li>
        <li><strong>Correction</strong> — ask us to correct inaccurate data.</li>
        <li><strong>Erasure</strong> — ask us to delete personal data, subject to legal record-keeping duties.</li>
        <li><strong>Grievance redressal</strong> — raise a complaint if you are unhappy with how we handled your data.</li>
        <li><strong>Nomination</strong> — appoint someone to exercise your rights in case of death or incapacity.</li>
      </ul>
      <p>We respond to verified requests within 30 days, or sooner if the law requires.</p>

      <h2>7. Grievance contact</h2>
      <p>
        Grievance Officer: <strong>[NAME]</strong>, Care Clinic for General Medicine &amp; Surgery, {ADDRESS_PLACEHOLDER}
        . E-mail: <strong>[GRIEVANCE EMAIL]</strong> · Phone: <strong>082755 73300</strong>. If you are not satisfied,
        you may complain to the Data Protection Board of India established under the DPDP Act, 2023.
      </p>

      <h2>8. Security</h2>
      <p>
        We use reasonable technical and organisational measures — restricted access, secure devices and HTTPS on this
        website. No method of transmission is completely secure, so please avoid sending very sensitive information
        through WhatsApp or a web form; call us instead.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We will update this page when our practices change and revise the “Last updated” date at the top. Continued use
        of the website after a change means you have seen the new version.
      </p>

      <h2>10. Cookies</h2>
      <p>See our <a href="/cookie-policy">Cookie Policy</a> for details on the cookies this website uses.</p>
    </LegalShell>
  );
}

// Local shorthand so the address reads correctly inside the legal text.
const ADDRESS_PLACEHOLDER =
  'Shop No.5, Sainagari Society, Survey No.5, opposite Janseva Bank, Sasane Colony, Keshav Nagar, Mundhwa, Pune, Maharashtra 411036';
