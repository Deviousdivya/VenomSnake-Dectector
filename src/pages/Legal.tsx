import { Link } from 'react-router-dom';
import { Seo } from '../seo/Seo';

const UPDATED = '24 November 2026';

function Shell({ path, title, children }: { path: string; title: string; children: React.ReactNode }) {
  return (
    <>
      <Seo path={path} />
      <div className="container-x max-w-3xl py-12 sm:py-16">
        <p className="eyebrow">Legal</p>
        <h1 className="h-section mt-3 sm:!text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted">Last updated {UPDATED}</p>
        <div className="prose-lite mt-8">{children}</div>
      </div>
    </>
  );
}

export function Privacy() {
  return (
    <Shell path="/privacy" title="Privacy Policy">
      <p>This page explains what VenomSnake Detector does with your information. There are no accounts, no advertising and no analytics trackers on this site.</p>

      <h2>Photos</h2>
      <p>
        When you scan a snake, the photo is resized in your browser and sent to Google's Gemini API for analysis. VenomSnake does not store your photo. Google's own terms and
        privacy policy apply to data sent to its API.
      </p>

      <h2>Location</h2>
      <p>Your browser asks for permission before sharing your location, and you can say no. If you allow it, your coordinates are used to:</p>
      <ul>
        <li>give the AI context for local rescue and hospital suggestions (sent as text with your scan);</li>
        <li>
          find hospitals near you (sent as coordinates to our server, which asks the OpenStreetMap Overpass service; the coordinates are not stored, and the hospital list is cached in
          memory for a few hours by approximate location);
        </li>
        <li>build the SOS or rescue message you choose to share;</li>
        <li>record a sighting, only if you press “Report this sighting” — the species and coordinates are sent to our server and recorded in its logs.</li>
      </ul>

      <h2>Data stored in your browser</h2>
      <p>
        Your language choice, recent scan results and cached answers are stored in your browser's local storage so the site works faster and you can revisit results. The site can also
        be installed as an app and keeps a copy of its pages for faster loading. You can clear all of this in your browser settings.
      </p>

      <h2>Third-party services</h2>
      <ul>
        <li>Google Gemini — photo and symptom analysis.</li>
        <li>OpenStreetMap (Overpass API) — hospital search.</li>
        <li>Google Fonts — fonts are loaded from Google, which receives your IP address.</li>
        <li>Google Maps — only if you open a directions or map link.</li>
        <li>NewsAPI — headlines on the Insights page are fetched by our server; your device does not contact it directly.</li>
      </ul>

      <h2>Questions</h2>
      <p>
        Open an issue on <a href="https://github.com/Deviousdivya/VenomSnake-Dectector/issues" target="_blank" rel="noopener noreferrer">GitHub</a>. See also the{' '}
        <Link to="/terms">terms and medical disclaimer</Link>.
      </p>
    </Shell>
  );
}

export function Terms() {
  return (
    <Shell path="/terms" title="Terms of Use & Medical Disclaimer">
      <div className="mb-6 rounded-2xl border border-danger-600/25 bg-danger-50 p-5 text-ink-2">
        <p className="!mb-0">
          <strong className="text-danger-700">In an emergency, call 108 (ambulance) or 112 (national emergency number) first.</strong> Do not wait for a result from this website.
        </p>
      </div>

      <h2>Not medical advice</h2>
      <p>
        VenomSnake Detector is an information and educational tool. It does not provide medical advice, diagnosis or treatment, and it does not replace a doctor, an ambulance service or
        a trained snake handler.
      </p>

      <h2>AI can be wrong</h2>
      <p>
        Species identification, venom status, antivenom, hospital and contact information suggested by the AI may be wrong or out of date. Treat every result as a guide. If you are
        unsure, assume a snake is venomous and keep your distance. Never approach, handle or try to catch a snake.
      </p>

      <h2>Hospital and contact information</h2>
      <p>Hospital data comes from OpenStreetMap and may be incomplete or incorrect. Availability of antivenom is not shown. Always call ahead or call 108.</p>

      <h2>Use at your own risk</h2>
      <p>
        The service is provided “as is” without warranties of any kind. To the fullest extent permitted by law, the creators are not liable for any loss, injury or damage arising from
        the use of, or inability to use, the service or its information.
      </p>

      <h2>Third-party links</h2>
      <p>Links to other websites are provided for convenience. We do not control and are not responsible for their content.</p>

      <h2>Changes</h2>
      <p>These terms may be updated from time to time. The date at the top shows when they last changed.</p>
    </Shell>
  );
}
