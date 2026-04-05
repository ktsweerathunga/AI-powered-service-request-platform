"use client";

import { useState } from "react";
import axios from "axios";
import { Send, MapPin, AlignLeft, Target, LayoutGrid, CheckCircle } from "lucide-react";

export default function SubmitRequest() {
  const [formData, setFormData] = useState({ title: "", description: "", location: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:5001/api/requests", formData);
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to submit", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in zoom-in duration-500">
        <CheckCircle size={80} className="text-emerald-500 mb-6 drop-shadow-md" />
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Request Submitted!</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 text-center max-w-md">
          Our AI Agent has received your request and is currently triaging it. Help is on the way.
        </p>
        <button 
          onClick={() => { setIsSuccess(false); setFormData({ title: "", description: "", location: "" }); }}
          className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Get IT Help</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Describe your issue in detail. Our AI will automatically assign and prioritize it.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        
        {/* Decorative corner glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={submitRequest} className="space-y-8 relative z-10">
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <Target size={16} className="text-indigo-500" /> Subject
            </label>
            <input required
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl px-5 py-4 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none transition-all font-medium placeholder-slate-400 dark:placeholder-slate-600 text-lg"
              placeholder="E.g., Complete Network Outage in Lab 3"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <AlignLeft size={16} className="text-indigo-500" /> Detailed Description
            </label>
            <textarea required rows={5}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl px-5 py-4 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none transition-all font-medium placeholder-slate-400 dark:placeholder-slate-600 text-lg resize-none"
              placeholder="What specifically is happening? Include any error codes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <MapPin size={16} className="text-indigo-500" /> Location
            </label>
            <input required
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl px-5 py-4 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none transition-all font-medium placeholder-slate-400 dark:placeholder-slate-600 text-lg"
              placeholder="E.g., Computing Building, 2nd Floor, Room 204"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-indigo-500/30 active:scale-95 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Send to AI Agent <Send size={20} /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
