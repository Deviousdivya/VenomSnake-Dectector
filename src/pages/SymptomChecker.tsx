import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, CircleAlert, Download, Info, Loader2, Phone, RotateCcw, Siren, TriangleAlert } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Seo } from '../seo/Seo';
import { BodyMap } from '../components/BodyMap';
import { PageHero } from '../components/PageHero';
import { bigFourPhotos } from '../data/bigFour';
import { analyzeSymptoms } from '../services/diagnosisService';
import { DiagnosisResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

const confidencePct = (c: number) => Math.round(c <= 1 ? c * 100 : c); // the model may answer 0.87 or 87

const severityStyle = {
  CRITICAL: { bar: 'bg-danger-600 text-white', title: 'Get emergency care now', line: 'Call 108 and go to a hospital straight away. Do not wait.' },
  MODERATE: { bar: 'bg-[#a35b00] text-white', title: 'See a doctor urgently', line: 'Get to a hospital soon. If you feel worse at any point, call 108.' },
  MILD: { bar: 'bg-brand-700 text-white', title: 'Mild for now, but get checked', line: 'Snakebite symptoms can change quickly. Have a doctor look at it today.' },
} as const;

const SERIOUS = ['breathing', 'vision', 'muscle'];

/** The first sentence only, so the headline answer stays short. */
const firstSentence = (s: string) => {
  const m = s.replace(/\s+/g, ' ').trim().match(/^.*?[.!?।](\s|$)/);
  return (m ? m[0] : s).trim();
};

type Step = 'site' | 'symptoms' | 'result';

export default function SymptomChecker() {
  const { t, languageName } = useLanguage();
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>('site');
  const [part, setPart] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<DiagnosisResult | null>(null);

  const symptoms = [
    { id: 'swelling', label: t('symptom_swelling') },
    { id: 'bleeding', label: t('symptom_bleeding') },
    { id: 'vision', label: t('symptom_vision') },
    { id: 'breathing', label: t('symptom_breathing') },
    { id: 'pain', label: t('symptom_pain') },
    { id: 'nausea', label: t('symptom_nausea') },
    { id: 'muscle', label: t('symptom_muscle') },
  ];
  const activeLabels = () => symptoms.filter((s) => selected.includes(s.id)).map((s) => s.label);
  const toggle = (id: string) => setSelected((p) => (p.includes(id) ? p.filter((s) => s !== id) : [...p, id]));
  const serious = selected.some((s) => SERIOUS.includes(s));

  const submit = async () => {
    if (!part || selected.length === 0 || loading) return;
    setLoading(true);
    setError(null);
    try {
      setReport(await analyzeSymptoms(part, activeLabels(), languageName, selected));
      setStep('result');
    } catch (e: any) {
      setError(e?.message || 'We could not generate the summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (!report) return;
    const { jsPDF } = await import('jspdf'); // loaded only when needed
    const doc = new jsPDF();
    const W = 180;
    let y = 0;
    const ensure = (h: number) => {
      if (y + h > 275) {
        doc.addPage();
        y = 20;
      }
    };
    const para = (text: string, size = 11, bold = false, gap = 6) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, W) as string[];
      ensure(lines.length * (size * 0.45) + gap);
      doc.text(lines, 15, y);
      y += lines.length * (size * 0.45) + gap;
    };

    doc.setFillColor(11, 42, 31);
    doc.rect(0, 0, 210, 34, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Snakebite summary for your doctor', 15, 21);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Created ${new Date().toLocaleString()}`, 15, 29);

    doc.setTextColor(16, 32, 27);
    y = 46;
    para(`Bite site: ${part}`, 12, true, 4);
    para(`Likely venom effect: ${report.venomType}`, 12, false, 4);
    para(`Urgency: ${report.severity}`, 12, false, 4);
    para(report.offline ? 'Source: built-in basic guidance (AI unavailable)' : `AI confidence: ${confidencePct(report.confidence)}%`, 12, false, 8);
    para('Symptoms reported', 12, true, 3);
    para(activeLabels().join(', '), 11, false, 8);
    para('Summary', 12, true, 3);
    para(report.summary, 11, false, 8);
    para('What to tell the doctor', 12, true, 3);
    report.physicianNotes.forEach((n) => para(`• ${n}`, 11, false, 3));

    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('AI-generated guidance, not a diagnosis. Do not delay antivenom or treatment while waiting for this report.', 15, 288);

    doc.save(`VenomSnake_Report_${Date.now()}.pdf`);
  };

  const reset = () => {
    setReport(null);
    setError(null);
    setPart(null);
    setSelected([]);
    setStep('site');
  };

  const sev = report ? severityStyle[report.severity] ?? severityStyle.MODERATE : null;
  const stepNo = step === 'site' ? 1 : step === 'symptoms' ? 2 : 3;
  const enter = reduce ? {} : { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.45, ease: [0.2, 0.7, 0.2, 1] as const } };

  return (
    <>
      <Seo path="/symptom-checker" />
      <PageHero
        eyebrow="When there is no photo"
        title={t('symptoms_title')}
        lead="Two quick questions. You'll get a plain-language answer and a PDF to show the doctor."
        image={bigFourPhotos.sawscaled.lg}
        position={bigFourPhotos.sawscaled.position}
      />

      <div className="container-x max-w-3xl py-12 sm:py-16">
        <div className="flex items-start gap-3 rounded-2xl border border-danger-600/25 bg-danger-50 p-4 text-sm text-ink-2">
          <Siren size={20} className="mt-0.5 shrink-0 text-danger-600" aria-hidden />
          <p>
            <strong className="text-danger-700">Bitten right now?</strong> Call <a className="font-bold text-danger-700 underline" href="tel:108">108</a> first. This tool is guidance only
            and is not a diagnosis — don't wait for it.
          </p>
        </div>

        {/* progress */}
        <ol className="mt-10 flex items-center gap-3" aria-label="Progress">
          {['Where', 'Symptoms', 'Answer'].map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-3" aria-current={stepNo === i + 1 ? 'step' : undefined}>
              <span
                className={cn(
                  'grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm font-semibold transition',
                  stepNo > i + 1 ? 'border-brand-700 bg-brand-700 text-white' : stepNo === i + 1 ? 'border-gold-500 bg-gold-100 text-gold-700' : 'border-line text-muted'
                )}
              >
                {stepNo > i + 1 ? <Check size={15} aria-hidden /> : i + 1}
              </span>
              <span className={cn('hidden text-sm font-semibold sm:block', stepNo === i + 1 ? 'text-ink' : 'text-muted')}>{label}</span>
              {i < 2 && <span aria-hidden className={cn('h-px flex-1 transition', stepNo > i + 1 ? 'bg-brand-700' : 'bg-line')} />}
            </li>
          ))}
        </ol>

        <div className="mt-8" aria-live="polite">
          {/* Step 1: where */}
          {step === 'site' && (
            <motion.section key="site" {...enter} className="card card-pad" aria-labelledby="site-title">
              <h2 id="site-title" className="text-3xl">{t('select_bite_site')}</h2>
              <p className="mt-1 text-sm text-muted">Tap the part of the body that was bitten. Left and right are the patient's own.</p>
              <div className="mt-6">
                <BodyMap selected={part} onSelect={setPart} />
              </div>
              <p className="mt-5 rounded-xl bg-paper px-4 py-3 text-center text-sm">
                {part ? (
                  <>
                    Bite site: <strong>{part}</strong>
                  </>
                ) : (
                  <span className="text-muted">No site selected yet</span>
                )}
              </p>
              <button type="button" disabled={!part} onClick={() => setStep('symptoms')} className="btn btn-primary mt-6 w-full !py-4 text-base">
                Next: symptoms <ArrowRight size={18} aria-hidden />
              </button>
            </motion.section>
          )}

          {/* Step 2: symptoms */}
          {step === 'symptoms' && (
            <motion.section key="symptoms" {...enter} className="card card-pad" aria-labelledby="sym-title">
              <h2 id="sym-title" className="text-3xl">{t('select_symptoms')}</h2>
              <p className="mt-1 text-sm text-muted">Tick everything you notice. Bite site: <strong className="text-ink">{part}</strong></p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {symptoms.map((s) => {
                  const on = selected.includes(s.id);
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        onClick={() => toggle(s.id)}
                        className={cn(
                          'flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left text-[15px] font-medium transition duration-200',
                          on ? 'border-danger-600 bg-danger-50 text-danger-700 shadow-[0_8px_20px_-12px_rgba(198,40,40,0.6)]' : 'border-line bg-surface text-ink-2 hover:-translate-y-0.5 hover:border-brand-600'
                        )}
                      >
                        {s.label}
                        <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full border transition', on ? 'border-danger-600 bg-danger-600 text-white' : 'border-line')}>
                          {on && <Check size={14} aria-hidden />}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {serious && (
                <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-danger-600/40 bg-danger-50 p-4 text-sm text-ink-2">
                  <TriangleAlert size={20} className="mt-0.5 shrink-0 text-danger-600" aria-hidden />
                  <p>
                    <strong className="text-danger-700">These can be signs of nerve poisoning.</strong> Call <a className="font-bold text-danger-700 underline" href="tel:108">108</a> now
                    — you can finish this later.
                  </p>
                </div>
              )}

              {error && (
                <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl border border-warn-600/40 bg-warn-50 p-4 text-sm text-ink-2">
                  <CircleAlert size={18} className="mt-0.5 shrink-0 text-warn-600" aria-hidden />
                  <div>
                    <p>{error}</p>
                    <p className="mt-1">If symptoms are getting worse, call <a className="font-bold text-danger-700" href="tel:108">108</a> now.</p>
                  </div>
                </div>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-[auto_1fr]">
                <button type="button" onClick={() => setStep('site')} className="btn btn-ghost">
                  <ArrowLeft size={18} aria-hidden /> Back
                </button>
                <button type="button" onClick={submit} disabled={selected.length === 0 || loading} className="btn btn-danger !py-4 text-base">
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" aria-hidden /> Checking your symptoms…
                    </>
                  ) : (
                    <>{t('btn_summary')}</>
                  )}
                </button>
              </div>
              {selected.length === 0 && <p className="mt-3 text-center text-sm text-muted">Choose at least one symptom to continue.</p>}
            </motion.section>
          )}

          {/* Step 3: the answer */}
          {step === 'result' && report && sev && (
            <motion.section key="result" {...enter} className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card" aria-labelledby="report-title">
              <div className={cn('px-6 py-6 sm:px-8', sev.bar)}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{t('report_heading')}</p>
                <h2 id="report-title" className="mt-2 text-3xl !text-white sm:text-4xl">{sev.title}</h2>
                <p className="mt-2 max-w-xl text-white/90">{sev.line}</p>
              </div>

              <div className="p-6 sm:p-8">
                <p className="text-lg leading-relaxed text-ink">{firstSentence(report.summary)}</p>
                {report.offline && <p className="badge badge-warn mt-4">Basic guidance — AI unavailable</p>}

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <a href="tel:108" className="btn btn-danger">
                    <Phone size={18} aria-hidden /> Call 108
                  </a>
                  <button type="button" onClick={downloadPdf} className="btn btn-primary">
                    <Download size={18} aria-hidden /> Save as PDF
                  </button>
                  <button type="button" onClick={reset} className="btn btn-outline">
                    <RotateCcw size={18} aria-hidden /> Start again
                  </button>
                </div>

                <details className="group mt-8 border-t border-line pt-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-xl font-medium">
                    More details for your doctor
                    <ChevronDown size={20} aria-hidden className="text-muted transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="mt-5 space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted">{t('venom_type')}</p>
                        <p className="mt-1 font-serif text-3xl">{report.venomType}</p>
                        {!report.offline && <p className="mt-1 text-sm text-muted">{t('confidence_level')}: {confidencePct(report.confidence)}%</p>}
                      </div>
                      <div>
                        <p className="text-sm text-muted">{t('clinical_summary')}</p>
                        <p className="mt-1 leading-relaxed text-ink-2">{report.summary}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-sans text-base font-bold tracking-normal">Tell your doctor</h3>
                      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                        {report.physicianNotes.map((n, i) => (
                          <li key={i} className="flex gap-2 rounded-xl bg-paper p-3 text-sm text-ink-2">
                            <Info size={16} className="mt-0.5 shrink-0 text-brand-700" aria-hidden /> {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-muted">AI-generated guidance, not a diagnosis. Don't delay treatment while waiting for a report.</p>
                  </div>
                </details>
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </>
  );
}
