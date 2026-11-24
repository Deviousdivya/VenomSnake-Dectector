import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Fade out the branded splash (index.html) once the app has painted and fonts are ready, so the page never flashes unstyled text.
const splash = document.getElementById('splash');
if (splash) {
  const shownAt = performance.now();
  const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1500))]);
  fontsReady.then(() =>
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const wait = Math.max(0, 600 - (performance.now() - shownAt));
        setTimeout(() => {
          splash.classList.add('hide');
          setTimeout(() => splash.remove(), 600);
        }, wait);
      })
    )
  );
}
