import LegalShell from './LegalShell';

/** Terms & Conditions of use for the clinic website (India). */
export default function Terms() {
  return (
    <LegalShell
      title="Terms & Conditions"
      path="/terms"
      description="The rules for using the Care Clinic website, and the limits of what this site does and does not provide."
    >
      <p>
        By using this website you agree to these Terms &amp; Conditions. If you do not agree, please do not use the
        site. These terms are governed by the laws of India.
      </p>

      <h2>1. Who we are</h2>
      <p>
        This website is operated by <strong>Care Clinic for General Medicine &amp; Surgery</strong>, Shop No.5,
        Sainagari Society, Survey No.5, opposite Janseva Bank, Sasane Colony, Keshav Nagar, Mundhwa, Pune, Maharashtra
        411036. Phone: 082755 73300.
      </p>

      <h2>2. What this website is for</h2>
      <ul>
        <li>Providing general information about the clinic, its services and the doctor.</li>
        <li>Letting you request an appointment online or through WhatsApp.</li>
        <li>Publishing general health information for education only.</li>
      </ul>
      <p>
        The website is <strong>not</strong> a medical service. It does not provide diagnosis, treatment, emergencies or
        prescriptions. See our <a href="/medical-disclaimer">Medical Disclaimer</a>.
      </p>

      <h2>3. Appointments</h2>
      <ul>
        <li>An online request is <strong>not a confirmed booking</strong>. Your appointment is confirmed only when the
          clinic replies on WhatsApp or by phone.</li>
        <li>Time slots shown are subject to availability and the clinic’s opening hours.</li>
        <li>Please see the <a href="/cancellation-policy">Cancellation &amp; Rescheduling Policy</a> for changes and
          no-shows.</li>
      </ul>

      <h2>4. Acceptable use</h2>
      <ul>
        <li>Do not submit false, misleading or someone else’s personal details.</li>
        <li>Do not attempt to interfere with, damage or gain unauthorised access to the website.</li>
        <li>Do not copy, scrape or republish website content for commercial use without written permission.</li>
        <li>Do not use the contact forms or WhatsApp number for unsolicited marketing or unlawful content.</li>
      </ul>

      <h2>5. Intellectual property</h2>
      <p>
        The text, design, logo and graphics on this site belong to the Clinic or are used with permission. You may read
        and share links to our health articles for personal, non-commercial use, with attribution.
      </p>

      <h2>6. Third-party links and embeds</h2>
      <p>
        The site embeds Google Maps and links to Google reviews and WhatsApp. Those services have their own terms and
        privacy policies; we are not responsible for their content or practices.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        The website is provided on an “as is” basis. To the extent permitted by law, the Clinic is not liable for loss
        arising from reliance on the general information published here, from temporary unavailability of the site, or
        from anything outside our reasonable control. Nothing in these terms limits liability that cannot be limited
        under Indian law, including under the Consumer Protection Act, 2019.
      </p>

      <h2>8. Emergency use</h2>
      <p>
        This website is not monitored for emergencies. If you have a medical emergency, call <strong>112</strong> or go
        to the nearest hospital immediately.
      </p>

      <h2>9. Changes</h2>
      <p>We may update these terms from time to time. The “Last updated” date at the top of this page shows the latest revision.</p>

      <h2>10. Governing law and jurisdiction</h2>
      <p>
        These terms are governed by Indian law, and the courts of <strong>Pune, Maharashtra</strong> have exclusive
        jurisdiction over any dispute arising from the use of this website.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms: <strong>[CONTACT EMAIL]</strong> or 082755 73300, at the address above.
      </p>
    </LegalShell>
  );
}
