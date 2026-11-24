import { Link } from 'react-router-dom';
import { Camera, Siren } from 'lucide-react';
import { Seo } from '../seo/Seo';

export default function NotFound() {
  return (
    <>
      <Seo path="/" noindex />
      <div className="container-x py-24 text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="h-section mt-3 sm:!text-5xl">We couldn't find that page</h1>
        <p className="lead mx-auto mt-4 max-w-lg">The link may be broken or the page may have moved.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn btn-primary">Back to home</Link>
          <Link to="/identify" className="btn btn-outline"><Camera size={18} aria-hidden /> Identify a snake</Link>
          <Link to="/emergency" className="btn btn-outline-danger"><Siren size={18} aria-hidden /> Emergency help</Link>
        </div>
      </div>
    </>
  );
}
