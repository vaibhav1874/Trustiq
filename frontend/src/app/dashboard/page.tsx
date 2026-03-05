'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Uploader } from '@/components/Uploader';
import { Dashboard } from '@/components/Dashboard';
import { api, type AuditResult, type BiasResult, type SimulationResult } from '@/lib/api';
import { ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progressText, setProgressText] = useState('');
    const [results, setResults] = useState<{
        audit?: AuditResult,
        bias?: BiasResult,
        simulate?: SimulationResult
    } | null>(null);

    const handleUpload = async (file: File) => {
        setIsProcessing(true);
        setResults(null);

        try {
            setProgressText('Ingesting dataset...');
            await api.uploadFile(file);

            setProgressText('Running statistical data audit...');
            const auditRes = await api.runAudit();

            setProgressText('Detecting demographic fairness & bias...');
            const biasRes = await api.runBiasDetection();

            setProgressText('Simulating GenAI edge-case scenarios...');
            const simulateRes = await api.runSimulation();

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
        }
    };

    return (
        <main className="min-h-screen py-16 px-4 md:px-8 relative overflow-hidden">

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
                    className="text-center mb-16"
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
                            className="w-full"
                        >
                            <Uploader onUpload={handleUpload} />
                        </motion.div>
                    )}

                    {isProcessing && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                                <Loader2 className="w-20 h-20 text-blue-400 animate-spin relative z-10" />
                            </div>

                            <h3 className="text-2xl font-semibold mt-8 mb-2">Analyzing Dataset</h3>
                            <p className="text-blue-300 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                {progressText}
                            </p>
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
                                <h2 className="text-3xl font-bold">Analysis Complete</h2>
                                <button
                                    onClick={() => setResults(null)}
                                    className="px-6 py-2 rounded-full border border-slate-600 hover:bg-slate-800 transition-colors"
                                >
                                    Analyze New Dataset
                                </button>
                            </div>
                            <Dashboard results={results} />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </main>
    );
}
