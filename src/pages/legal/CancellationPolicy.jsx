import LegalShell from './LegalShell';

/** Cancellation & rescheduling policy — keeps the wording neutral and factual. */
export default function CancellationPolicy() {
  return (
    <LegalShell
      title="Cancellation & Rescheduling Policy"
      path="/cancellation-policy"
      description="How to change or cancel an appointment at Care Clinic, how much notice we ask for, and what happens if you miss a slot."
    >
      <p>
        Plans change — we would rather you tell us than simply not come. This policy applies to appointments booked
        through this website, by WhatsApp, by phone or in person.
      </p>

      <h2>1. Changing or cancelling an appointment</h2>
      <ul>
        <li>
          Message us on WhatsApp at <strong>wa.me/918275573300</strong> or call <strong>082755 73300</strong>.
        </li>
        <li>
          Please give at least <strong>[4 HOURS]</strong> notice <em>[PLACEHOLDER: confirm the notice period with the
          clinic]</em> so the slot can be offered to another patient.
        </li>
        <li>Include your name and the date and time of the appointment so we can find it quickly.</li>
      </ul>

      <h2>2. Rescheduling</h2>
      <p>
        We will do our best to move you to another slot on the same day or a nearby day, subject to availability. A
        rescheduled appointment is confirmed only when we reply with the new time.
      </p>

      <h2>3. If you are running late</h2>
      <p>
        Let us know — we will see you as soon as we can, though other patients may need to be seen first. If you are
        more than <strong>[15 MINUTES]</strong> late and have not told us, we may need to give the slot to someone else
        and book you a new time.
      </p>

      <h2>4. No-shows</h2>
      <p>
        If you cannot make it and do not inform us, the appointment is recorded as a no-show. Repeated no-shows may
        mean we ask you to book a fresh slot before the next visit.
        <em> [PLACEHOLDER: add any no-show fee only if the clinic actually charges one — do not add a fee you do not
        collect.]</em>
      </p>

      <h2>5. Cancellation by the clinic</h2>
      <p>
        If we must cancel or move your appointment (doctor unavailable, power cut, emergency, public holiday), we will
        contact you on the number you gave and offer the earliest alternative. If you prefer a refund of any fee already
        paid, we will return it by the same method within <strong>[7 WORKING DAYS]</strong>.
      </p>

      <h2>6. Fees</h2>
      <p>
        Consultation fees, diagnostic charges and procedure charges are as communicated at the clinic
        <strong> [PLACEHOLDER: confirm the fee and refund policy]</strong>. Fees already paid for a procedure are
        handled case by case, in line with Indian consumer protection law.
      </p>

      <h2>7. How to reach us</h2>
      <p>
        WhatsApp: wa.me/918275573300 · Phone: 082755 73300 · Address: Shop No.5, Sainagari Society, Survey No.5,
        opposite Janseva Bank, Sasane Colony, Keshav Nagar, Mundhwa, Pune, Maharashtra 411036.
      </p>

      <h2>8. Governing law</h2>
      <p>
        This policy is governed by the laws of India, and the courts of <strong>Pune, Maharashtra</strong> have
        exclusive jurisdiction over any dispute.
      </p>
    </LegalShell>
  );
}
