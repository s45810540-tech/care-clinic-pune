import LegalShell from './LegalShell';

/** Accessibility Statement — WCAG 2.1 AA intent, known limits, and a feedback route. */
export default function Accessibility() {
  return (
    <LegalShell
      title="Accessibility Statement"
      path="/accessibility"
      description="Our commitment to making this website usable by everyone, including people who use screen readers, keyboards or reduced-motion settings."
    >
      <p>
        We want as many people as possible to use this website, including people who use a screen reader, a keyboard
        only, or who need larger text or reduced motion. We aim to meet <strong>WCAG 2.1 level AA</strong>.
      </p>

      <h2>1. What we have done</h2>
      <ul>
        <li>Colour contrast of at least 4.5:1 for normal text, checked against WCAG AA.</li>
        <li>Everything can be operated by keyboard, with a visible focus outline.</li>
        <li>Page structure uses real headings, landmarks and labels; form fields have visible labels and error messages.</li>
        <li>Images that carry meaning have alternative text; decorative images are hidden from screen readers.</li>
        <li>The site honours the operating system’s “reduce motion” setting — animations, smooth scrolling and the 3D
          hero are switched off automatically.</li>
        <li>Text can be zoomed to 200% without losing content, and layout works from 320px wide upwards.</li>
        <li>Tap targets on mobile are at least 44px, and a sticky bar keeps Call, WhatsApp, Book and Directions one
          tap away.</li>
      </ul>

      <h2>2. Known limitations</h2>
      <ul>
        <li>Google Maps embeds are provided by Google and may not be fully navigable with every assistive technology.
          The address and a “Get directions” link are given in plain text on the same page as a fallback.</li>
        <li>Some older articles may not yet have full alternative text for every image.</li>
        <li>
          <strong>[PLACEHOLDER: list any known issue here after a real audit — e.g. “PDF reports are not tagged for
          screen readers”.]</strong>
        </li>
      </ul>

      <h2>3. Languages</h2>
      <p>
        The site is available in English and मराठी (Marathi); the language toggle is in the header. Legal documents are
        currently published in English only.
      </p>

      <h2>4. Need this information in another format?</h2>
      <p>
        If you need a page read out to you, printed in larger type, or explained in Marathi or Hindi, please call
        <strong> 082755 73300</strong> or message us on WhatsApp at <strong>wa.me/918275573300</strong>. We will do our
        best to help.
      </p>

      <h2>5. Feedback</h2>
      <p>
        If you find a part of this website that is difficult to use, tell us what happened and which page it was on:
        <strong> [ACCESSIBILITY CONTACT EMAIL]</strong> or 082755 73300. We aim to respond within
        <strong> [10 WORKING DAYS]</strong>.
      </p>

      <h2>6. Statement details</h2>
      <p>
        This statement was prepared on <strong>27 October 2026</strong> and is reviewed after any significant change to
        the website. <em>[PLACEHOLDER: schedule a manual audit with a screen reader before launch and update this
        statement.]</em>
      </p>
    </LegalShell>
  );
}
