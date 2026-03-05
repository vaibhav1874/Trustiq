import Link from 'next/link';
import { ShieldCheck, Activity, BrainCircuit, Lock, ArrowRight, ChevronRight, Github, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans">

      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[130px] opacity-70" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[130px] opacity-70" />
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] mix-blend-screen animate-pulse" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-card border-b border-white/5 bg-slate-900/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
              <span className="font-bold text-2xl tracking-tight text-white">Data Guardian</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Features</Link>
              <Link href="#how-it-works" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">How it Works</Link>
              <Link href="#about" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">About Us</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-slate-300 hover:text-white transition-colors text-sm font-medium hidden sm:block">Log In</Link>
              <Link href="/signup" className="px-5 py-2.5 rounded-full bg-white text-slate-900 font-semibold text-sm hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Introducing the Future of Trustworthy AI
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
            Build AI that is <br className="hidden md:block" />
            <span className="gradient-text">Safe, Fair, & Reliable.</span>
          </h1>
          <p className="mt-6 text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            An automated safety layer for GenAI pipelines. Prevent biased decisions, detect data anomalies, and simulate edge cases before your models hit production.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup" className="group px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2 hover:scale-105 active:scale-95 text-lg">
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard" className="px-8 py-4 rounded-full glass-card text-white hover:bg-white/5 transition-colors flex items-center gap-2 text-lg font-medium">
              View Demo Dashboard
            </Link>
          </div>
        </div>

        {/* Dashboard 3D Mockup Graphic Idea */}
        <div className="mt-20 max-w-5xl mx-auto relative perspective-1000">
          {/* Decorative elements representing abstract data shapes via CSS styling inline instead of huge svgs */}
          <div className="w-full aspect-[2/1] bg-gradient-to-tr from-slate-800/80 to-slate-900/90 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotate-x-12 translate-y-4 backdrop-blur-xl relative overflow-hidden flex flex-col">
            <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-slate-900/50">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="flex-1 p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 opacity-60">
              <div className="bg-slate-800/50 rounded-xl col-span-1 lg:col-span-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent"></div>
              </div>
              <div className="bg-slate-800/50 rounded-xl relative overflow-hidden">
                <div className="absolute bottom-0 w-full h-[60%] bg-amber-500/20 rounded-t-xl"></div>
              </div>
              <div className="bg-slate-800/50 rounded-xl relative flex justify-center items-center">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500/50 border-t-emerald-500 animate-spin"></div>
              </div>
            </div>
            {/* Overlay glow */}
            <div className="absolute inset-0 bg-blue-500/5 bg-blend-overlay pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Unrivaled <span className="gradient-text">Protection</span></h2>
            <p className="text-slate-400 text-lg">Our system evaluates datasets recursively, finding errors before they infect your AI models.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Activity, title: 'Automated Auditing', desc: 'Instantly identify missing values, duplicates, and outliers with our real-time processing engine.' },
              { icon: Scale, title: 'Bias & Fairness Testing', desc: 'Detect demographic bias to ensure equal opportunity and demographic parity across all categories.' },
              { icon: BrainCircuit, title: 'GenAI Simulation', desc: 'Spin up LLM agents to hammer your AI with millions of edge cases and adversarial attacks.' },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/30">
                  <feature.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Layer */}
      <section id="how-it-works" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Drop your data.<br />We do the rest.</h2>
              <p className="text-lg text-slate-400 mb-10 font-light leading-relaxed">
                Connect your database or drag-and-drop your CSV files. Our backend uses Fairlearn and AIF360 to perform statistical acrobatics that would take data scientists weeks to write.
              </p>

              <div className="space-y-8">
                {[
                  { step: '01', title: 'Ingest & Audit', desc: 'Raw data is analyzed for basic structural integrity.' },
                  { step: '02', title: 'Assess Bias Risk', desc: 'Hidden correlations predicting demographic traits are flagged.' },
                  { step: '03', title: 'Fix & Deploy', desc: 'One-click balancing and outlier removal before training begins.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-blue-300 font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 blur-3xl absolute inset-0"></div>
              <div className="glass-card p-8 rounded-2xl relative z-10 border border-white/10 h-full min-h-[400px] flex flex-col justify-center items-center text-center">
                <Lock className="w-20 h-20 text-indigo-400 mb-6 drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]" />
                <h3 className="text-2xl font-bold mb-2">Enterprise Grade Security</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">Your datasets never leave your perimeter. The Guardian operates on local isolated nodes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / About Us */}
      <footer id="about" className="border-t border-white/10 bg-slate-900 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-xl tracking-tight text-white">Data Guardian</span>
              </div>
              <p className="text-slate-400 max-w-sm font-light text-sm leading-relaxed mb-6">
                A research initiative turning ethical AI principles into actionable software. We believe the best AI models are built on impeccable data.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><Github className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-white/10 text-slate-500 text-sm">
            © 2026 Intelligent Data Guardian. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
