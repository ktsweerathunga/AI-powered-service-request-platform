"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  Home, 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  Moon,
  Sun,
  Menu,
  X,
  Zap
} from "lucide-react";
import { useState, useEffect } from "react";

export function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Submit Request", href: "/submit", icon: PlusCircle },
    { name: "Agent Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Zap className="text-indigo-500 fill-indigo-500" size={24} />
          <span className="font-bold text-lg dark:text-white">AI Desk</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-slate-600 dark:text-slate-300">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col justify-between`}>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 px-2">
            <Zap className="text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" size={32} />
            <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">AI Desk</h1>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mt-2 font-medium ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 space-y-4">
          {/* Theme Toggle */}
          {mounted && (
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Theme</span>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-not-allowed">
            <Settings size={20} />
            <span className="font-medium">Settings (Soon)</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 w-full relative">
        {children}
      </main>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
