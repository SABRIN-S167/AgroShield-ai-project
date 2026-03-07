import { useState } from "react";
import {
  LayoutDashboard,
  Droplets,
  Bug,
  AlertOctagon,
  Shield,
  Menu,
  X,
  Leaf,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router";

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  const items = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { id: "rain", label: "Rain Damage", icon: Droplets, path: "/rain" },
    { id: "pest", label: "Pest Attack", icon: Bug, path: "/pest" },
    {
      id: "locust",
      label: "Locust Movement",
      icon: AlertOctagon,
      path: "/locust",
    },
  ];

  const handleNav = (url) => {
    navigate(url);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-sidebar border-r border-sidebar-border">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
              <Shield size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-sidebar-foreground text-sm leading-tight">
                AgroShield AI
              </h1>
              <p className="text-xs text-sidebar-foreground/50">
                Smart Crop Risk Intelligence
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-2">
          {items.map(({ id, label, icon: Icon, path }) => (
            <button
              key={id}
              onClick={() => handleNav(path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                activeTab === id
                  ? "bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-primary/30"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 text-xs text-sidebar-foreground/40">
            <Leaf size={12} />
            <span>Made for Indian Farmers 🇮🇳</span>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar/95 backdrop-blur-md border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <Shield size={14} className="text-primary" />
          </div>
          <span className="font-display font-bold text-sidebar-foreground text-sm">
            AgroShield AI
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-sidebar-accent text-sidebar-foreground"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed top-14 left-0 bottom-0 z-40 w-64 bg-sidebar border-r border-sidebar-border p-3 space-y-1">
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                activeTab === id
                  ? "bg-sidebar-primary/20 text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      )}

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 top-14"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
