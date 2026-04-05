"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { PlusCircle, AlertTriangle, AlertCircle, Clock, CheckCircle, Package } from "lucide-react";

const API_URL = "http://localhost:5001/api/requests";
const SOCKET_URL = "http://localhost:5001";

export default function Dashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newRequest, setNewRequest] = useState({ title: "", description: "", location: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();

    const socket = io(SOCKET_URL);
    
    socket.on("requestUpdated", (updatedRequest) => {
      setRequests((prev) => {
        const exists = prev.find((r) => r._id === updatedRequest._id);
        if (exists) {
          return prev.map((r) => (r._id === updatedRequest._id ? updatedRequest : r));
        }
        return [updatedRequest, ...prev];
      });
    });

    socket.on("criticalAlert", (request) => {
      alert(`CRITICAL ALERT: ${request.title}\nWait, this requires immediate attention!`);
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

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, newRequest);
      setShowModal(false);
      setNewRequest({ title: "", description: "", location: "" });
    } catch (error) {
      console.error("Failed to submit", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "bg-red-100 text-red-800 border-red-200";
      case "HIGH": return "bg-orange-100 text-orange-800 border-orange-200";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Service Desk</h1>
            <p className="text-slate-500 mt-1">Manage and track IT service requests</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow active:scale-95"
          >
            <PlusCircle size={20} />
            New Request
          </button>
        </div>

        {/* Board */}
        {loading ? (
          <div className="text-center text-slate-400 py-12">Loading requests...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requests.length === 0 ? (
              <div className="text-center text-slate-400 py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <Package className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <p>No active requests. Good job!</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex flex-col md:flex-row gap-6">
                  
                  {/* Left Column (Meta logic & Title) */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(req.priority)}`}>
                        {req.priority}
                      </span>
                      <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {req.category}
                      </span>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${req.status === 'COMPLETED' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'}`}>
                        {req.status}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{req.title}</h3>
                      <p className="text-slate-600 mt-2 leading-relaxed">{req.description}</p>
                    </div>
                    
                    <div className="text-sm text-slate-500 flex gap-4">
                      <span className="flex items-center gap-1"><AlertCircle size={16}/> {req.location}</span>
                      <span className="flex items-center gap-1"><Clock size={16}/> {new Date(req.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Right Column (AI Panel) */}
                  <div className="flex-1 md:max-w-md bg-slate-50 rounded-xl p-5 border border-slate-100 group-hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center pointer-events-none">
                        <span className="text-white text-[10px] font-bold">AI</span>
                      </div>
                      <h4 className="font-semibold text-slate-700">AI Analysis</h4>
                    </div>
                    {req.ai_summary ? (
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Summary</span>
                          <p className="text-sm text-slate-600 mt-0.5">{req.ai_summary}</p>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Suggested Action</span>
                          <p className="text-sm text-slate-600 mt-0.5">{req.ai_suggested_resolution}</p>
                        </div>
                        {req.status !== 'COMPLETED' && (
                          <button 
                            onClick={async () => {
                              await axios.put(`${API_URL}/${req._id}/status`, { status: "COMPLETED" });
                            }}
                            className="mt-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full flex justify-center items-center gap-2"
                          >
                            <CheckCircle size={16} /> Mark Completed
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400 mt-4 flex items-center gap-2 animate-pulse">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-indigo-500 animate-spin"></div>
                        Awaiting Agent Analysis...
                      </div>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">New Service Request</h2>
              </div>
              <form onSubmit={submitRequest} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input required
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="E.g., Projector in Room 2B is not working"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea required rows={4}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Describe the issue in detail..."
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input required
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="E.g., Lab 3"
                    value={newRequest.location}
                    onChange={(e) => setNewRequest({ ...newRequest, location: e.target.value })}
                  />
                </div>
                <div className="pt-2 flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
