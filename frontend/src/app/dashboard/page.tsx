"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Link from "next/link";
import { PlusCircle, AlertCircle, Clock, CheckCircle, Package, Zap, MessageSquare, ShieldAlert, CheckCircle2, Inbox } from "lucide-react";

const API_URL = "http://localhost:5001/api/requests";
const SOCKET_URL = "http://localhost:5001";

interface ServiceRequest {
  _id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  priority: string;
  status: string;
  ai_summary: string;
  ai_suggested_resolution: string;
  createdAt: string;
}

export default function Dashboard() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();

    const socket = io(SOCKET_URL);
    
    socket.on("requestUpdated", (updatedRequest: ServiceRequest) => {
      setRequests((prev) => {
        const exists = prev.find((r) => r._id === updatedRequest._id);
        if (exists) {
          return prev.map((r) => (r._id === updatedRequest._id ? updatedRequest : r));
        }
        return [updatedRequest, ...prev];
      });
    });

    socket.on("criticalAlert", (request: ServiceRequest) => {
      alert(`🚨 CRITICAL SLA ALERT!\n${request.title}\nLocation: ${request.location}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(API_URL);
      setRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30 ring-1 ring-red-500/30";
      case "HIGH": return "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30 ring-1 ring-orange-500/30";
      case "MEDIUM": return "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 ring-1 ring-amber-500/30";
      case "LOW": return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 ring-1 ring-emerald-500/30";
      default: return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 ring-1 ring-slate-500/30";
    }
  };

  const stats = {
    total: requests.length,
    critical: requests.filter((r) => r.priority === "CRITICAL" && r.status !== "COMPLETED").length,
    completed: requests.filter((r) => r.status === "COMPLETED").length,
  };

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-100 dark:selection:bg-indigo-500/30 pb-20">
      
      {/* Premium Gradient Top Background */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 dark:from-indigo-950 dark:via-slate-900 dark:to-slate-950 -z-10" />

      <div className="max-w-6xl mx-auto px-6 pt-12 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-amber-400 fill-amber-400" size={32} />
              <h1 className="text-4xl font-extrabold tracking-tight">Active Requests</h1>
            </div>
            <p className="text-indigo-200 text-lg font-medium">Internal Agent Workspace</p>
          </div>
          <Link
            href="/submit"
            className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-indigo-500/20"
          >
            <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            New Request
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl"><Inbox size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Active</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stats.total}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl"><ShieldAlert size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">SLA Critical</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stats.critical}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl"><CheckCircle2 size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed By AI</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stats.completed}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Board */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 animate-pulse flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-48"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-1/2"></div>
                </div>
                <div className="flex-1 md:max-w-md bg-slate-50 dark:bg-slate-950 rounded-xl p-5 h-32"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requests.length === 0 ? (
              <div className="text-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-16 shadow-sm">
                <Package className="mx-auto h-16 w-16 text-indigo-300 dark:text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-white">No requests found</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">The AI has nothing to automate... yet.</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req._id} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-800 group flex flex-col md:flex-row gap-8 relative overflow-hidden">
                  
                  {/* Priority Accent Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${req.priority === 'CRITICAL' ? 'bg-red-500' : req.priority === 'HIGH' ? 'bg-orange-500' : 'bg-transparent'}`} />

                  {/* Left Column (Meta logic & Title) */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getPriorityStyles(req.priority)}`}>
                          {req.priority}
                        </span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                          {req.category}
                        </span>
                        <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border ${req.status === 'COMPLETED' ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' : 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20'}`}>
                          {req.status.replace("_", " ")}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{req.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mt-3 leading-relaxed text-lg">{req.description}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800"><AlertCircle size={16} className="text-indigo-500 dark:text-indigo-400"/> {req.location}</span>
                      <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800"><Clock size={16} className="text-indigo-500 dark:text-indigo-400"/> {new Date(req.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Right Column (AI Panel) */}
                  <div className="flex-1 md:max-w-md bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-2xl p-6 border border-indigo-100/50 dark:border-indigo-500/20 shadow-inner block relative">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-5 pointer-events-none">
                      <Zap size={64} className="text-indigo-900 dark:text-indigo-100" />
                    </div>

                    <div className="flex items-center gap-3 mb-5 border-b border-indigo-100 dark:border-indigo-500/20 pb-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/30 flex items-center justify-center">
                        <Zap size={16} className="text-white fill-white" />
                      </div>
                      <h4 className="font-bold text-indigo-900 dark:text-indigo-100 tracking-tight">Agent Analysis</h4>
                    </div>

                    {req.ai_summary ? (
                      <div className="space-y-4 relative z-10">
                        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-white dark:border-slate-700">
                          <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1 block">Root Cause Summary</span>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{req.ai_summary}</p>
                        </div>
                        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-white dark:border-slate-700">
                          <span className="text-[10px] font-black text-purple-500 dark:text-purple-400 uppercase tracking-widest mb-1 block">Auto-Resolution Steps</span>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{req.ai_suggested_resolution}</p>
                        </div>
                        
                        {req.status !== 'COMPLETED' && (
                          <button 
                            onClick={async () => {
                              await axios.put(`${API_URL}/${req._id}/status`, { status: "COMPLETED" });
                            }}
                            className="w-full mt-4 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-4 py-3 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-emerald-500/10 active:scale-95 flex items-center justify-center gap-2 group/btn"
                          >
                            <CheckCircle size={18} className="group-hover/btn:scale-110 transition-transform" /> 
                            Confirm Resolution
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                        <div className="relative w-12 h-12 mb-4">
                          <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Agent is triaging...</p>
                        <p className="text-xs font-medium text-indigo-400 mt-1">Analyzing context & assigning priority</p>
                      </div>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
