'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Uploader } from '@/components/Uploader';
import { Dashboard } from '@/components/Dashboard';
import { api, type AuditResult, type BiasResult, type SimulationResult } from '@/lib/api';
import {
    ShieldCheck, Loader2, Database, Activity, Scale,
    BrainCircuit, CheckCircle, AlertTriangle, FileText, ChevronRight,
    Info, Clock, Code, ListChecks, Check, UploadCloud, XCircle
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [progressText, setProgressText] = useState('');
    const [analyzedFile, setAnalyzedFile] = useState<string>('');
    const [previewData, setPreviewData] = useState<{ headers: string[], rows: string[][] }>({ headers: [], rows: [] });
    const [datasetStats, setDatasetStats] = useState({ rows: 0, cols: 0 });

    const [results, setResults] = useState<{
        audit?: AuditResult,
        bias?: BiasResult,
        simulate?: SimulationResult
    } | null>(null);

    const parseCSVForPreview = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (text) {
                const lines = text.split('\n').filter(line => line.trim() !== '');
                if (lines.length > 0) {
                    const headers = lines[0].split(',').map(h => h.trim());
                    const rows = lines.slice(1, 11).map(line => line.split(',').map(cell => cell.trim()));
                    setPreviewData({ headers, rows });
                    setDatasetStats({ rows: lines.length - 1, cols: headers.length });
                }
            }
        };
        reader.readAsText(file);
    };

    const handleUpload = async (file: File) => {
        setIsProcessing(true);
        setResults(null);
        setAnalysisStep(1);
        setAnalyzedFile(file.name);

        // Parse client side for preview
        if (file.name.endsWith('.csv')) {
            parseCSVForPreview(file);
        } else {
            setPreviewData({ headers: [], rows: [] });
        }

        try {
            setAnalysisStep(1);
            setProgressText('Data Parsing & Ingestion...');
            await api.uploadFile(file);

            setAnalysisStep(2);
            setProgressText('Feature Detection & Auditing...');
            const auditRes = await api.runAudit();

            setAnalysisStep(3);
            setProgressText('Bias & Fairness Analysis...');
            const biasRes = await api.runBiasDetection();

            setAnalysisStep(4);
            setProgressText('Risk Simulation with GenAI...');
            const simulateRes = await api.runSimulation();

            setAnalysisStep(5);
            setProgressText('Generating Explainable Insights...');
            await new Promise(r => setTimeout(r, 1000));

            setResults({
                audit: auditRes,
                bias: biasRes,
                simulate: simulateRes
            });

        } catch (error) {
            console.error('Processing failed:', error);
            alert('Failed to process dataset. Please ensure backend is running.');
        } finally {
            setIsProcessing(false);
            setAnalysisStep(0);
        }
    };

    const loadSampleDataset = (type: string) => {
        const dummyContent = "id,age,gender,income,loan_approved\n1,25,Male,45000,1\n2,35,Female,60000,1\n3,22,Male,30000,0\n4,45,Female,,0\n5,55,Male,120000,1\n6,28,Female,48000,0\n7,28,Female,48000,0\n8,60,Male,150000,1\n9,21,Female,20000,0\n10,40,Male,80000,1\n11,32,,65000,1\n12,200,Female,-5000,0";
        const file = new File([dummyContent], `${type}_dataset.csv`, { type: 'text/csv' });
        handleUpload(file);
    };

    return (
        <main className="min-h-screen py-16 px-4 md:px-8 relative overflow-hidden font-sans">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
                <div className="absolute top-[40%] right-[-10%] w-[40%] h-[60%] rounded-full bg-purple-600/10 blur-[150px]" />
            </div>

            <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 px-4">
                <Link href="/" className="flex items-center gap-2">
                    <ShieldCheck className="w-8 h-8 text-blue-400" />
                    <span className="font-bold text-xl tracking-tight">Data Guardian</span>
                </Link>
                <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Exit Dashboard
                </Link>
            </nav>

            <div className="max-w-7xl mx-auto flex flex-col items-center">

                <motion.header
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30">
                            <ShieldCheck className="w-10 h-10 text-blue-400" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                        Intelligent <span className="gradient-text">Analysis</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light">
                        Upload a dataset below to begin your full fairness, risk, and GenAI evaluation protocol.
                    </p>
                </motion.header>

                <AnimatePresence mode="wait">
                    {!isProcessing && !results && (
                        <motion.div
                            key="uploader"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                            className="w-full flex flex-col items-center"
                        >

                            {/* Feature 6: How Data Guardian Works (Horizontal Steps) */}
                            <div className="w-full max-w-5xl mb-12 hidden md:block">
                                <div className="flex justify-between items-center bg-slate-800/30 p-4 rounded-2xl border border-white/5">
                                    {[
                                        { step: 1, label: 'Upload Dataset', icon: UploadCloud },
                                        { step: 2, label: 'AI Audits Data', icon: Activity },
                                        { step: 3, label: 'Bias & Risk Det.', icon: Scale },
                                        { step: 4, label: 'GenAI Sim.', icon: BrainCircuit },
                                        { step: 5, label: 'Explanations', icon: FileText }
                                    ].map((s, i, arr) => (
                                        <div key={s.step} className="flex items-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 shadow-inner">
                                                    <s.icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</span>
                                            </div>
                                            {i < arr.length - 1 && <ChevronRight className="w-5 h-5 text-slate-600 mx-4" />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                                {/* Left Column: Guidelines */}
                                <div className="lg:col-span-1 space-y-6">
                                    {/* Feature 1: Dataset Guidelines */}
                                    <div className="glass-card p-6 rounded-2xl border border-white/10">
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <ListChecks className="w-5 h-5 text-blue-400" />
                                            Dataset Requirements
                                        </h3>
                                        <ul className="space-y-3 text-sm text-slate-300">
                                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> CSV or JSON dataset</li>
                                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Tabular structured data recommended</li>
                                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Include numerical or categorical features</li>
                                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Optional fairness attributes like gender or age</li>
                                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Maximum file size 50MB</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Center Column: Existing Uploader + Samples */}
                                <div className="lg:col-span-2 flex flex-col">
                                    <Uploader onUpload={handleUpload} />

                                    {/* Feature 2: Sample Dataset Loader */}
                                    <div className="mt-8 text-center">
                                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Try a Sample Dataset</p>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            <button onClick={() => loadSampleDataset('credit_risk')} className="px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 transition-colors border border-slate-700 text-sm font-medium flex items-center gap-2">
                                                <Database className="w-4 h-4 text-blue-400" /> Credit Risk Dataset
                                            </button>
                                            <button onClick={() => loadSampleDataset('healthcare')} className="px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 transition-colors border border-slate-700 text-sm font-medium flex items-center gap-2">
                                                <Database className="w-4 h-4 text-emerald-400" /> Healthcare Dataset
                                            </button>
                                            <button onClick={() => loadSampleDataset('hiring_bias')} className="px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 transition-colors border border-slate-700 text-sm font-medium flex items-center gap-2">
                                                <Database className="w-4 h-4 text-purple-400" /> Hiring Bias Dataset
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Recent Analyses */}
                                <div className="lg:col-span-1 space-y-6">
                                    {/* Feature 9: Recent Dataset Analyses */}
                                    <div className="glass-card p-6 rounded-2xl border border-white/10">
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-blue-400" />
                                            Recent Analyses
                                        </h3>
                                        <ul className="space-y-4">
                                            <li className="flex items-center justify-between text-sm">
                                                <span className="text-slate-300 font-medium truncate pr-2">credit_risk.csv</span>
                                                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20 whitespace-nowrap">Medium Risk</span>
                                            </li>
                                            <li className="flex items-center justify-between text-sm">
                                                <span className="text-slate-300 font-medium truncate pr-2">hiring_dataset.csv</span>
                                                <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20 whitespace-nowrap">High Risk</span>
                                            </li>
                                            <li className="flex items-center justify-between text-sm">
                                                <span className="text-slate-300 font-medium truncate pr-2">health_data.csv</span>
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 whitespace-nowrap">Low Risk</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 5: What Data Guardian Will Analyze */}
                            <div className="w-full max-w-6xl mt-24 text-center">
                                <h2 className="text-2xl font-bold mb-8">What Data Guardian Will Analyze</h2>
                                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 text-left">
                                    {[
                                        { img: Activity, title: 'Data Auditing', desc: 'Find anomalies & missing vals.' },
                                        { img: Scale, title: 'Bias Detection', desc: 'Identify unfair demographic skews.' },
                                        { img: BrainCircuit, title: 'Future Risk', desc: 'Predict impact using deep learning.' },
                                        { img: Code, title: 'GenAI Simulation', desc: 'Simulate edge cases.' },
                                        { img: Info, title: 'Explainable AI', desc: 'Human-readable analysis logic.' },
                                        { img: CheckCircle, title: 'Fix Suggestions', desc: 'One-click dataset balancing.' }
                                    ].map((f, idx) => (
                                        <div key={idx} className="glass-card p-5 rounded-2xl border border-white/5 hover:-translate-y-1 transition-transform">
                                            <f.img className="w-8 h-8 text-blue-400 mb-3" />
                                            <h4 className="text-sm font-bold text-white mb-1">{f.title}</h4>
                                            <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    )}

                    {isProcessing && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center py-20 w-full max-w-2xl"
                        >
                            <div className="relative mb-12">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                                <Loader2 className="w-20 h-20 text-blue-400 animate-spin relative z-10" />
                            </div>

                            <h3 className="text-2xl font-semibold mb-2">Analyzing Dataset</h3>
                            <p className="text-blue-300 mb-12">{progressText}</p>

                            {/* Feature 7: Analysis Progress Indicator */}
                            <div className="w-full glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                                {[
                                    { step: 1, label: 'Data Parsing' },
                                    { step: 2, label: 'Feature Detection' },
                                    { step: 3, label: 'Bias Analysis' },
                                    { step: 4, label: 'Risk Simulation' },
                                    { step: 5, label: 'Explainable AI' }
                                ].map((item) => (
                                    <div key={item.step} className="flex items-center gap-4">
                                        {analysisStep > item.step ? (
                                            <CheckCircle className="w-6 h-6 text-emerald-400" />
                                        ) : analysisStep === item.step ? (
                                            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full border-2 border-slate-600" />
                                        )}
                                        <span className={`text-sm font-medium ${analysisStep >= item.step ? 'text-white' : 'text-slate-500'}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {results && !isProcessing && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full"
                        >
                            <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
                                <div>
                                    <h2 className="text-3xl font-bold flex items-center gap-3">
                                        Analysis Complete
                                        {/* Feature 8: Risk Status Badge */}
                                        {results.audit?.status === 'Low Risk' && <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Safe Dataset</span>}
                                        {results.audit?.status === 'Medium Risk' && <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Medium Risk</span>}
                                        {results.audit?.status === 'High Risk' && <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-1"><XCircle className="w-4 h-4" /> High Risk</span>}
                                    </h2>
                                    <p className="text-slate-400 text-sm mt-1">Dataset: <span className="text-white font-medium">{analyzedFile}</span></p>
                                </div>

                                <button
                                    onClick={() => setResults(null)}
                                    className="px-6 py-2 rounded-full border border-slate-600 hover:bg-slate-800 transition-colors"
                                >
                                    Analyze New Dataset
                                </button>
                            </div>

                            {/* Feature 4: Dataset Quick Stats */}
                            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="glass-card p-4 rounded-xl border border-white/5 flex flex-col">
                                    <span className="text-xs text-slate-400 uppercase font-semibold mb-1 tracking-wider">Total Rows</span>
                                    <span className="text-2xl font-bold text-white">{datasetStats.rows > 0 ? datasetStats.rows.toLocaleString() : 'N/A'}</span>
                                </div>
                                <div className="glass-card p-4 rounded-xl border border-white/5 flex flex-col">
                                    <span className="text-xs text-slate-400 uppercase font-semibold mb-1 tracking-wider">Total Columns</span>
                                    <span className="text-2xl font-bold text-white">{datasetStats.cols > 0 ? datasetStats.cols.toLocaleString() : 'N/A'}</span>
                                </div>
                                <div className="glass-card p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col">
                                    <span className="text-xs text-amber-500 uppercase font-semibold mb-1 tracking-wider">Missing Values</span>
                                    <span className="text-2xl font-bold text-amber-400">{results.audit?.missing_values.toLocaleString()}</span>
                                </div>
                                <div className="glass-card p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 flex flex-col">
                                    <span className="text-xs text-purple-400 uppercase font-semibold mb-1 tracking-wider">Duplicate Rows</span>
                                    <span className="text-2xl font-bold text-purple-400">{results.audit?.duplicates.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Feature 3: Dataset Preview Table */}
                            {previewData.headers.length > 0 && (
                                <div className="max-w-6xl mx-auto mb-12">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-200">
                                        <Database className="w-5 h-5 text-blue-400" />
                                        Dataset Preview <span className="text-xs font-normal text-slate-500 ml-2">(First 10 rows)</span>
                                    </h3>
                                    <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-white/5">
                                                    <tr>
                                                        {previewData.headers.map((header, i) => (
                                                            <th key={i} className="px-6 py-3 font-semibold tracking-wider whitespace-nowrap">{header}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5 bg-slate-900/20">
                                                    {previewData.rows.map((row, i) => (
                                                        <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                                                            {row.map((cell, j) => (
                                                                <td key={j} className="px-6 py-4 text-slate-300 font-mono text-xs whitespace-nowrap">
                                                                    {cell || <span className="text-red-400 italic font-sans text-xs opacity-70">NaN</span>}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Core Dashboard UI (Unmodified sub-components) */}
                            <Dashboard results={results} />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </main>
    );
}
