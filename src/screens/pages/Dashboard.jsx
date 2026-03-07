import { Shield, Droplets, Bug, AlertOctagon } from "lucide-react";
import { useNavigate } from "react-router";

const features = [
  {
    id: "rain",
    icon: Droplets,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
    titleKey: "Rain Damage",
    desc: {
      en: "Predict flood and waterlogging risk based on rainfall, soil moisture and wind speed.",
    },
    path: "/rain",
  },
  {
    id: "pest",
    icon: Bug,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
    titleKey: "Pest Attack",
    desc: {
      en: "Detect pest and fungal attack conditions based on temperature, humidity and soil moisture.",
    },
    path: "/pest",
  },
  {
    id: "locust",
    icon: AlertOctagon,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    titleKey: "Locust Movement",
    desc: {
      en: "Predict locust swarm movement risk based on wind speed and nearby locust activity.",
    },
    path: "/locust",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="hero-gradient rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-black text-xl leading-tight">
              AgroShield AI
            </h1>
            <p className="text-white/70 text-xs">
              Smart Crop Risk Intelligence
            </p>
          </div>
        </div>
        <p className="text-white/80 text-sm mt-2">
          AI-powered agricultural risk prediction system for Indian farmers.
          Select a module below to get started.
        </p>
      </div>

      {/* 3 Feature Cards */}
      <div className="space-y-3">
        {features.map(
          ({ id, icon: Icon, iconColor, bgColor, titleKey, desc, path }) => (
            <button
              key={id}
              onClick={() => navigate(path)}
              className="w-full glass-card rounded-2xl p-5 text-left hover:border-primary/30 transition-colors border border-border"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center shrink-0`}
                >
                  <Icon size={22} className={iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display font-bold text-base text-foreground mb-1">
                    {titleKey}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc.en}
                  </p>
                </div>
                <div className="text-muted-foreground text-lg mt-1">›</div>
              </div>
            </button>
          ),
        )}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-muted-foreground pt-2">
        🇮🇳 Built for Indian farmers · Uses real-time weather data
      </p>
    </div>
  );
}
