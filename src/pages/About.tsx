import { Link } from 'react-router-dom';
import { Seo } from '../seo/Seo';

export default function About() {
  return (
    <>
      <Seo path="/about" />
      <div className="container-x max-w-3xl py-12 sm:py-16">
        <p className="eyebrow">About</p>
        <h1 className="h-section mt-3 sm:!text-5xl">About VenomSnake Detector</h1>
        <p className="lead mt-4">
          A free tool that helps people work out what kind of snake they have seen, and find help fast if someone is bitten.
        </p>

        <div className="prose-lite mt-10">
          <h2>What it does</h2>
          <ul>
            <li><strong>Identifies snakes from a photo</strong> and says whether the species is venomous.</li>
            <li><strong>For venomous snakes</strong>, shows call buttons, nearby hospitals and emergency contacts.</li>
            <li><strong>Checks symptoms</strong> when there is no photo, and creates a PDF to show a doctor.</li>
            <li><strong>Explains first aid</strong> in plain language, based on public-health guidance.</li>
          </ul>

          <h2>How identification works</h2>
          <p>
            Your photo is resized in your browser and sent to Google's Gemini AI model, which returns the likely species, its venom status and safety advice. The AI is asked to
            answer in the language you picked. It is a general-purpose model, not a snake expert, and no accuracy figure is claimed.
          </p>

          <h2>Where the hospital list comes from</h2>
          <p>
            Nearby hospitals come from OpenStreetMap, a community-built map. The list can be incomplete and cannot show whether a hospital has antivenom in stock — always phone ahead,
            or call 108.
          </p>

          <h2>What it cannot do</h2>
          <ul>
            <li>It cannot replace a doctor, an ambulance or a trained snake handler.</li>
            <li>It can misidentify snakes, especially from blurry, dark or partial photos.</li>
            <li>AI-suggested phone numbers and facility names must be verified before you rely on them.</li>
          </ul>

          <h2>Feedback</h2>
          <p>
            Found a mistake or have an idea? Open an issue on{' '}
            <a href="https://github.com/Deviousdivya/VenomSnake-Dectector/issues" target="_blank" rel="noopener noreferrer">GitHub</a>.
            Read our <Link to="/privacy">privacy policy</Link> and <Link to="/terms">terms and medical disclaimer</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
