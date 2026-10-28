import LegalShell from './LegalShell';

/** Cookie Policy — essential cookies always on, analytics only after consent. */
export default function CookiePolicy() {
  return (
    <LegalShell
      title="Cookie Policy"
      path="/cookie-policy"
      description="Which cookies this website uses, and how you can change your choice. Analytics load only after you accept."
    >
      <p>
        Cookies are small text files stored on your device when you visit a website. This site uses as few as possible,
        and gives you a choice before anything non-essential runs.
      </p>

      <h2>1. Cookies we use</h2>
      <ul>
        <li>
          <strong>Strictly necessary (always on):</strong>
          <br />
          <code>care-clinic-cookie-consent</code> — remembers whether you accepted or rejected analytics.
          <br />
          <code>care-clinic-lang</code> — remembers your language choice (English / मराठी).
          <br />
          These are required for the site to work; they cannot be switched off through our banner.
        </li>
        <li>
          <strong>Analytics (only after consent):</strong>
          <br />
          Google Analytics cookies (such as <code>_ga</code>, <code>_ga_*</code>) help us understand which pages people
          read, in aggregate, so we can improve the site. They load <strong>only after</strong> you press “Accept
          analytics”. <em>[PLACEHOLDER: replace with your own GA4 measurement ID or remove this block.]</em>
        </li>
      </ul>
      <p>
        We do not use advertising, retargeting or profiling cookies, and we do not sell browsing data.
      </p>

      <h2>2. Third-party content</h2>
      <p>
        Google Maps embeds and the WhatsApp click-to-chat link may set their own cookies when you interact with them.
        Those are controlled by Google and Meta under their policies.
      </p>

      <h2>3. Changing your mind</h2>
      <p>
        To change your choice, clear this site’s cookies and site data in your browser settings — the banner will ask
        again on your next visit. You can also block or delete cookies entirely in your browser; the site will still
        work, but your language and consent choices will not be remembered.
      </p>

      <h2>4. Do Not Track / Global Privacy Control</h2>
      <p>
        We treat a valid Global Privacy Control signal as a refusal of analytics, the same as pressing “Essential only”.
        <em>[PLACEHOLDER: confirm this behaviour with your lawyer before launch.]</em>
      </p>

      <h2>5. Updates</h2>
      <p>
        If we add a new cookie, we will update this page and revise the “Last updated” date before enabling it.
      </p>
    </LegalShell>
  );
}
