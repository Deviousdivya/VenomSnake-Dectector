import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Activity, FileText, Loader2, Check, AlertCircle, Phone, Info, Download, AlertTriangle } from 'lucide-react';
import { HumanBody } from './HumanBodyModel';
import { analyzeSymptoms } from '../services/diagnosisService';
import { DiagnosisResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { jsPDF } from 'jspdf';
import { AntivenomDashboard } from './AntivenomDashboard';

export function BiteLogic() {
  const { t, languageName } = useLanguage();
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<DiagnosisResult | null>(null);
  const [showInventory, setShowInventory] = useState(false);

  const symptoms = [
    { id: 'swelling', label: t('symptom_swelling') },
    { id: 'bleeding', label: t('symptom_bleeding') },
    { id: 'vision', label: t('symptom_vision') },
    { id: 'breathing', label: t('symptom_breathing') },
    { id: 'pain', label: t('symptom_pain') },
    { id: 'nausea', label: t('symptom_nausea') },
    { id: 'muscle', label: t('symptom_muscle') },
  ];

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleDiagnose = async () => {
    if (!selectedPart || selectedSymptoms.length === 0) return;
    setLoading(true);
    try {
      const activeSymptoms = symptoms
        .filter(s => selectedSymptoms.includes(s.id))
        .map(s => s.label);
      
      const res = await analyzeSymptoms(selectedPart, activeSymptoms, languageName);
      setReport(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!report) return;
    
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    
    // Aesthetic Dossier Styling
    doc.setFillColor(31, 41, 55); // Dark blue-gray
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("VENOMSNAKE EMERGENCY DOSSIER", 15, 25);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated: ${timestamp}`, 150, 35);
    
    doc.setFontSize(14);
    doc.setTextColor(239, 68, 68); // Brand Danger
    doc.text("SYNDROMIC DIAGNOSIS REPORT", 15, 55);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Bite Site: ${selectedPart?.toUpperCase()}`, 15, 65);
    doc.text(`Venom Profile: ${report.venomType}`, 15, 75);
    doc.text(`Severity: ${report.severity}`, 15, 85);
    doc.text(`Confidence: ${report.confidence * 100}%`, 15, 95);
    
    doc.line(15, 100, 195, 100);
    
    doc.setFontSize(12);
    doc.text("SYMPTOMS LOGGED:", 15, 110);
    const symptomsText = symptoms.filter(s => selectedSymptoms.includes(s.id)).map(s => s.label).join(", ");
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(symptomsText, 170), 15, 120);
    
    doc.setFontSize(12);
    doc.text("CLINICAL SUMMARY:", 15, 140);
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(report.summary, 170), 15, 150);
    
    doc.setFontSize(12);
    doc.text("CRITICAL PHYSICIAN NOTES:", 15, 180);
    doc.setFontSize(10);
    report.physicianNotes.forEach((note, i) => {
      doc.text(`• ${note}`, 15, 190 + (i * 10));
    });
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("DISCLAIMER: AI-generated guidance. Do not delay serum administration pending this report. Use for triage indexing only.", 15, 280);
    
    doc.save(`VenomSnake_Report_${Date.now()}.pdf`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-32 space-y-12">
      {/* ... previous motion.div and grid ... */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-danger/10 border border-brand-danger/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-danger mb-2">
          <Activity size={12} />
          Emergency Syndromic Engine
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">{t('bite_logic_title')}</h2>
        <p className="text-white/40 max-w-2xl mx-auto">{t('bite_logic_subtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* left: 3D Interaction */}
        <div className="lg:col-span-5 glass rounded-[2rem] md:rounded-[2.5rem] aspect-square lg:aspect-[4/5] relative overflow-hidden group">
          <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10 space-y-2">
             <h3 className="font-bold text-lg uppercase tracking-tight">{t('select_bite_site')}</h3>
             <p className="text-xs text-brand-safe font-mono">{selectedPart || "NO SITE SELECTED"}</p>
          </div>
          
          <Canvas dpr={[1, 2]} shadows>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ef4444" />
            <Suspense fallback={null}>
              <HumanBody onSelect={setSelectedPart} selectedPart={selectedPart} />
              <Environment preset="night" />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Suspense>
          </Canvas>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20">
            <Info size={12} /> Drag to Rotate • Click to Select
          </div>
        </div>

        {/* Right: Symptom Selection & Results */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {!report ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass rounded-[2rem] p-8 md:p-12 space-y-10"
              >
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <ShieldAlert className="text-brand-danger" />
                    {t('select_symptoms')}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {symptoms.map((symptom) => (
                      <button
                        key={symptom.id}
                        onClick={() => toggleSymptom(symptom.id)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border transition-all text-sm font-bold",
                          selectedSymptoms.includes(symptom.id)
                            ? "bg-brand-danger/10 border-brand-danger/30 text-brand-danger"
                            : "bg-white/5 border-white/5 text-white/40 hover:bg-white/[0.08]"
                        )}
                      >
                        {symptom.label}
                        <div className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                          selectedSymptoms.includes(symptom.id) ? "bg-brand-danger border-brand-danger" : "border-white/20"
                        )}>
                          {selectedSymptoms.includes(symptom.id) && <Check size={12} className="text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                   <button
                    onClick={handleDiagnose}
                    disabled={!selectedPart || selectedSymptoms.length === 0 || loading}
                    className={cn(
                      "w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all",
                      !selectedPart || selectedSymptoms.length === 0 || loading
                        ? "bg-white/5 text-white/20 cursor-not-allowed"
                        : "bg-brand-danger text-white hover:scale-[1.02] shadow-[0_0_40px_rgba(239,68,68,0.3)]"
                    )}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Processing Syndromic Patterns...
                      </>
                    ) : (
                      <>
                        <FileText size={24} />
                        {t('btn_generate_report')}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="report"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className={cn(
                  "glass rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden border-2",
                  report.severity === 'CRITICAL' ? "border-brand-danger glow-crimson" : "border-brand-safe/30"
                )}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-3xl font-black uppercase tracking-tighter italic">{t('report_title')}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                         Verified AI Diagnosis • Triage: {report.severity}
                      </div>
                    </div>
                    <button 
                      onClick={() => setReport(null)}
                      className="p-3 glass rounded-2xl text-white/40 hover:text-white"
                    >
                      New Scan
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">{t('venom_type')}</p>
                      <div className="text-5xl font-black text-brand-danger tracking-tighter">
                        {report.venomType}
                      </div>
                      <div className="flex items-center gap-2 text-brand-safe font-mono text-xs">
                        {t('confidence_level')}: {report.confidence * 100}%
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">{t('clinical_summary')}</p>
                      <p className="text-sm text-white/70 leading-relaxed font-medium">
                        {report.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/10 space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">{t('doctor_notes')}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {report.physicianNotes.map((note, idx) => (
                        <div key={idx} className="flex gap-3 text-xs text-white/40">
                          <AlertCircle size={14} className="text-brand-danger shrink-0" />
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={() => setShowInventory(true)}
                    className="flex-1 py-5 rounded-3xl bg-brand-danger text-white font-black uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-3"
                  >
                    <AlertTriangle size={20} /> Alert Trauma Center
                  </button>
                  <button 
                    onClick={handleDownloadPDF}
                    className="flex-1 py-5 rounded-3xl glass text-white font-black uppercase tracking-widest text-sm border-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={20} /> Download PDF Dossier
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showInventory && (
          <AntivenomDashboard speciesName={report?.venomType || "Generic"} onClose={() => setShowInventory(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
