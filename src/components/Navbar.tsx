import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Droplets,
  Bug,
  AlertOctagon,
  Sliders,
  History,
  Shield,
  Globe,
  Menu,
  X,
  Leaf,
  Map,
  Bot,
  Tractor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LABELS, type LangCode } from "@/lib/riskEngine";
import { useLang } from "@/context/LangContext";

import flag from "/flag.svg";

const navItems = (t: (typeof LABELS)[LangCode]) => [
  { id: "dashboard", label: t.dashboard, icon: LayoutDashboard },
  { id: "rain", label: t.rainPredictor, icon: Droplets },
  { id: "pest", label: t.pestPredictor, icon: Bug },
  { id: "locust", label: t.locustPredictor, icon: AlertOctagon },
  { id: "simulator", label: t.simulator, icon: Sliders },
  { id: "heatmap", label: t.heatmap, icon: Map },
  { id: "chatbot", label: t.chatbot, icon: Bot },
  { id: "history", label: t.history, icon: History },
];

const LANGS: { code: LangCode; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "HI" },
  { code: "ta", label: "TA" },
];

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { lang, setLang } = useLang();
  const t = LABELS[lang];
  const items = navItems(t);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [activeTab]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-74 shrink-0 h-screen sticky top-0 bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-glow/20 flex items-center justify-center animate-pulse-glow">
              <Shield size={20} className="text-primary-glow" />
            </div>
            <div>
              <h1 className="font-display font-bold text-sidebar-foreground text-base leading-tight">
                AgroShield AI
              </h1>
              <p className="text-xs text-sidebar-foreground/50">
                Smart Crop Risk Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                activeTab === id
                  ? "bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-primary/30"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon size={17} />
              {label}
              {activeTab === id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Language Switcher */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={14} className="text-sidebar-foreground/50" />
            <span className="text-xs text-sidebar-foreground/50 font-medium uppercase tracking-wide">
              Language
            </span>
          </div>
          <div className="flex gap-2">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all",
                  lang === code
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Tractor size={16} />
            <span>Made for Indian Farmers</span>
            <img src={flag} className="w-6 h-6" />
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar/95 backdrop-blur-md border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-glow/20 flex items-center justify-center">
            <Shield size={16} className="text-primary-glow" />
          </div>
          <span className="font-display font-bold text-sidebar-foreground text-sm">
            AgroShield AI
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={cn(
                  "px-2 py-1 text-xs font-bold rounded-md transition-all",
                  lang === code
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "bg-sidebar-accent text-sidebar-foreground/60",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-sidebar-accent text-sidebar-foreground"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="lg:hidden fixed top-14 left-0 bottom-0 z-40 w-72 bg-sidebar border-r border-sidebar-border p-4 space-y-1 overflow-y-auto"
        >
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === id
                  ? "bg-sidebar-primary/20 text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </motion.div>
      )}

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 top-14"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
