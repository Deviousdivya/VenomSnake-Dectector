import { useState } from 'react';
import { Check, CircleAlert, Download, FileText, Info, Loader2, Phone, RotateCcw, Siren } from 'lucide-react';
import { Seo } from '../seo/Seo';
import { BodyMap } from '../components/BodyMap';
import { analyzeSymptoms } from '../services/diagnosisService';
import { DiagnosisResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

const confidencePct = (c: number) => Math.round(c <= 1 ? c * 100 : c); // the model may answer 0.87 or 87

const severityStyle = {
  CRITICAL: { box: 'border-danger-600 bg-danger-50', text: 'text-danger-700', label: 'Critical — get emergency care now' },
  MODERATE: { box: 'border-warn-600/50 bg-warn-50', text: 'text-warn-600', label: 'Moderate — see a doctor urgently' },
  MILD: { box: 'border-brand-600/40 bg-brand-50', text: 'text-brand-800', label: 'Mild for now — still get checked' },
} as const;

export default function SymptomChecker() {
  const { t, languageName } = useLanguage();
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

  const submit = async () => {
    if (!part || selected.length === 0 || loading) return;
    setLoading(true);
    setError(null);
    try {
      setReport(await analyzeSymptoms(part, activeLabels(), languageName));
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

    doc.setFillColor(20, 97, 77);
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
    para(`AI confidence: ${confidencePct(report.confidence)}%`, 12, false, 8);
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
  };

  const sev = report ? severityStyle[report.severity] ?? severityStyle.MODERATE : null;

  return (
    <>
      <Seo path="/symptom-checker" />
      <div className="container-x py-12 sm:py-16">
        <header className="max-w-3xl">
          <p className="eyebrow">When there is no photo</p>
          <h1 className="h-section mt-3 sm:!text-5xl">{t('symptoms_title')}</h1>
          <p className="lead mt-4">Mark where the bite is and tick the symptoms you have. You'll get a plain-language summary and a PDF to show the doctor.</p>
        </header>

        <div className="mt-6 flex max-w-3xl items-start gap-3 rounded-2xl border border-danger-600/25 bg-danger-50 p-4 text-sm text-ink-2">
          <Siren size={20} className="mt-0.5 shrink-0 text-danger-600" aria-hidden />
          <p>
            <strong className="text-danger-700">Bitten right now?</strong> Call <a className="font-bold text-danger-700 underline" href="tel:108">108</a> first. This tool
            is guidance only and is not a diagnosis — don't wait for it.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,24rem)_1fr]">
          <section className="card card-pad" aria-labelledby="site-title">
            <h2 id="site-title" className="text-2xl">1. {t('select_bite_site')}</h2>
            <p className="mt-1 text-sm text-muted">Left and right are the patient's own left and right.</p>
            <div className="mt-5">
              <BodyMap selected={part} onSelect={setPart} />
            </div>
            <p className="mt-4 rounded-xl bg-paper px-4 py-3 text-center text-sm" aria-live="polite">
              {part ? (
                <>
                  Bite site: <strong>{part}</strong>
                </>
              ) : (
                <span className="text-muted">No site selected yet</span>
              )}
            </p>
          </section>

          <div className="min-w-0 space-y-6">
            {!report ? (
              <section className="card card-pad" aria-labelledby="sym-title">
                <h2 id="sym-title" className="text-2xl">2. {t('select_symptoms')}</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
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
                            'flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left text-[15px] font-semibold transition',
                            on ? 'border-danger-600 bg-danger-50 text-danger-700' : 'border-line bg-white text-ink-2 hover:border-brand-600'
                          )}
                        >
                          {s.label}
                          <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full border', on ? 'border-danger-600 bg-danger-600 text-white' : 'border-line')}>
                            {on && <Check size={14} aria-hidden />}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {error && (
                  <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl border border-warn-600/40 bg-warn-50 p-4 text-sm text-ink-2">
                    <CircleAlert size={18} className="mt-0.5 shrink-0 text-warn-600" aria-hidden />
                    <div>
                      <p>{error}</p>
                      <p className="mt-1">If symptoms are getting worse, call <a className="font-bold text-danger-700" href="tel:108">108</a> now.</p>
                    </div>
                  </div>
                )}

                <button type="button" onClick={submit} disabled={!part || selected.length === 0 || loading} className="btn btn-danger mt-6 w-full !py-4 text-base">
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" aria-hidden /> Checking your symptoms…
                    </>
                  ) : (
                    <>
                      <FileText size={20} aria-hidden /> {t('btn_summary')}
                    </>
                  )}
                </button>
                {(!part || selected.length === 0) && (
                  <p className="mt-3 text-center text-sm text-muted">Choose a bite site and at least one symptom to continue.</p>
                )}
              </section>
            ) : (
              <section className="card overflow-hidden" aria-labelledby="report-title" aria-live="polite">
                <div className={cn('border-b-2 px-6 py-5 sm:px-8', sev!.box)}>
                  <p className={cn('text-sm font-bold uppercase tracking-wider', sev!.text)}>{sev!.label}</p>
                  <h2 id="report-title" className="mt-1 text-3xl">{t('report_heading')}</h2>
                </div>
                <div className="card-pad space-y-8">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted">{t('venom_type')}</p>
                      <p className="mt-1 font-serif text-4xl font-semibold text-ink">{report.venomType}</p>
                      <p className="mt-2 text-sm text-muted">{t('confidence_level')}: {confidencePct(report.confidence)}%</p>
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

                  <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row">
                    <a href="tel:108" className="btn btn-danger">
                      <Phone size={18} aria-hidden /> Call 108
                    </a>
                    <button type="button" onClick={downloadPdf} className="btn btn-primary">
                      <Download size={18} aria-hidden /> Save as PDF
                    </button>
                    <button type="button" onClick={reset} className="btn btn-ghost">
                      <RotateCcw size={18} aria-hidden /> Start again
                    </button>
                  </div>
                  <p className="text-xs text-muted">AI-generated guidance, not a diagnosis. Don't delay treatment while waiting for a report.</p>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
