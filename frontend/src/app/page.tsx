"use client";

import Link from "next/link";
import { ArrowRight, Bot, Zap, ShieldAlert, Sparkles, Activity } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center select-none">
      
      {/* Hero Section */}
      <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-semibold text-sm">
          <Sparkles size={16} /> Welcome to the future of IT Operations
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Supercharge your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Service Desk.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Autonomous AI agents perfectly triage, prioritize, and suggest resolutions for every single ticket instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            href="/submit" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 group"
          >
            Get Help Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-500 text-slate-900 dark:text-white font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Activity size={20} className="text-indigo-600 dark:text-indigo-400" />
            Agent Portal
          </Link>
        </div>
      </div>

      {/* Futuristic Background Gradients */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-32 relative z-10">
        <FeatureCard 
          icon={<Bot size={32} className="text-indigo-500" />}
          title="AI Classification"
          description="Instantly categorizes incoming requests and determines priority levels automatically."
        />
        <FeatureCard 
          icon={<ShieldAlert size={32} className="text-rose-500" />}
          title="SLA Protection"
          description="Critical issues are instantly elevated and broadcasted to agents in real-time."
        />
        <FeatureCard 
          icon={<Zap size={32} className="text-amber-500" />}
          title="Instant Resolution"
          description="Generates actionable, step-by-step resolution plans for common known issues."
        />
      </div>

    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-left hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-xl">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{description}</p>
    </div>
  );
}
