import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Loader2,
  RefreshCw,
  Droplets,
  Bug,
  AlertOctagon,
  Thermometer,
  Wind,
  CloudRain,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Navigation,
  IndianRupee,
  BarChart3,
} from "lucide-react";
import {
  calculateRainRisk,
  calculatePestRisk,
  calculateLocustRisk,
  getRiskColor,
} from "@/lib/riskEngine";
import type { RiskLevel, RiskResult } from "@/lib/types";
import RiskGauge from "@/components/RiskGauge";
import { useLang } from "@/context/LangContext";
import { I18N } from "@/lib/i18n";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getHistory } from "@/lib/riskEngine";

interface LiveWeather {
  temp: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  description: string;
  city: string;
  lat: number;
  lon: number;
  feelsLike: number;
  pressure: number;
}

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

async function fetchWeatherByCoords(
  lat: number,
  lon: number,
): Promise<LiveWeather | null> {
  const apiKey = "b6d8273c385a12d57ded7f623b25f7c5";
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    );
    if (!res.ok) return null;
    const d = await res.json();
    return {
      temp: Math.round(d.main.temp),
      humidity: d.main.humidity,
      rainfall: d.rain?.["1h"] ?? 0,
      windSpeed: Math.round((d.wind?.speed ?? 0) * 3.6),
      description: d.weather?.[0]?.description ?? "Unknown",
      city: d.name,
      lat,
      lon,
      feelsLike: Math.round(d.main.feels_like),
      pressure: d.main.pressure,
    };
  } catch {
    return null;
  }
}

function getRiskBadgeClass(level: RiskLevel) {
  if (level === "HIGH")
    return "bg-destructive/15 text-destructive border border-destructive/30";
  if (level === "MEDIUM")
    return "bg-amber-500/15 text-amber-600 border border-amber-500/30";
  return "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30";
}

const sampleWeekData = [
  { day: "Mon", rain: 25, pest: 30, locust: 10 },
  { day: "Tue", rain: 55, pest: 45, locust: 20 },
  { day: "Wed", rain: 40, pest: 70, locust: 60 },
  { day: "Thu", rain: 75, pest: 55, locust: 40 },
  { day: "Fri", rain: 60, pest: 80, locust: 70 },
  { day: "Sat", rain: 35, pest: 40, locust: 30 },
  { day: "Today", rain: 50, pest: 65, locust: 45 },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { lang } = useLang();
  const t = I18N[lang];

  const [weather, setWeather] = useState<LiveWeather | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [locationName, setLocationName] = useState("");

  const [rainRisk, setRainRisk] = useState<RiskResult | null>(null);
  const [pestRisk, setPestRisk] = useState<RiskResult | null>(null);
  const [locustRisk, setLocustRisk] = useState<RiskResult | null>(null);

  const history = getHistory();
  const highRiskCount = history.filter((h) => h.result.level === "HIGH").length;

  const computeRisks = useCallback((w: LiveWeather) => {
    const rain = calculateRainRisk({
      rainfall: w.rainfall,
      soilMoisture: Math.min(w.humidity, 100),
      windSpeed: w.windSpeed,
    });
    const pest = calculatePestRisk({
      temperature: w.temp,
      humidity: w.humidity,
      soilMoisture: Math.min(w.humidity * 0.85, 100),
    });
    const locust = calculateLocustRisk({
      windSpeed: w.windSpeed,
      nearbyLocust: w.windSpeed > 55,
    });
    setRainRisk(rain);
    setPestRisk(pest);
    setLocustRisk(locust);
  }, []);

  const fetchGPS = useCallback(async () => {
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const live = await fetchWeatherByCoords(latitude, longitude);
      if (live) {
        setWeather(live);
        setLocationName(live.city);
        computeRisks(live);
        setLocationStatus("success");
      }
    });
  }, [computeRisks]);

  useEffect(() => {
    fetchGPS();
  }, [fetchGPS]);

  const overallScore =
    rainRisk && pestRisk && locustRisk
      ? Math.round((rainRisk.score + pestRisk.score + locustRisk.score) / 3)
      : 0;
  const overallLevel: RiskLevel =
    overallScore >= 70 ? "HIGH" : overallScore >= 40 ? "MEDIUM" : "LOW";
  const overallColors = getRiskColor(overallLevel);
  const LevelIcon =
    overallLevel === "HIGH"
      ? XCircle
      : overallLevel === "MEDIUM"
        ? AlertTriangle
        : CheckCircle;

  const risks = [
    {
      id: "rain",
      label: t.rainPredictor,
      emoji: "🌧️",
      icon: Droplets,
      result: rainRisk,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      id: "pest",
      label: t.pestPredictor,
      emoji: "🐛",
      icon: Bug,
      result: pestRisk,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      id: "locust",
      label: t.locustPredictor,
      emoji: "🦗",
      icon: AlertOctagon,
      result: locustRisk,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Hero with location */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient rounded-3xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200">
            <path
              fill="currentColor"
              d="M43.5,-57.2C55.9,-46.4,64.4,-30.9,68.1,-14.1C71.8,2.7,70.8,20.8,62.5,34.3C54.1,47.9,38.5,56.8,21.8,62.4C5,67.9,-12.9,70,-28.1,64.8C-43.2,59.5,-55.5,46.8,-62.9,31.6C-70.3,16.3,-72.7,-1.5,-67.8,-17.1C-62.9,-32.7,-50.6,-46,-37,-55.9C-23.4,-65.7,-8.4,-72,5.8,-79.1C20,-86.2,31.1,-67.9,43.5,-57.2Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-white/70" />
              <span className="text-white/70 text-xs font-medium">
                AgroShield AI
              </span>
            </div>
            <button
              onClick={fetchGPS}
              disabled={locationStatus === "loading"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-medium transition-all border border-white/20"
            >
              {locationStatus === "loading" ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <RefreshCw size={12} />
              )}
              Refresh
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              {/* Location */}
              <div className="flex items-center gap-2 mb-1">
                {locationStatus === "loading" ? (
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Loader2 size={14} className="animate-spin" />{" "}
                    {t.detectingLocation}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-white/80 text-sm">
                    <Navigation size={13} />
                    <span>{locationName || "Loading..."}</span>
                  </div>
                )}
              </div>
              <h1 className="font-display text-2xl font-black leading-tight mb-1">
                {t.todayReport}
              </h1>
              <p className="text-white/60 text-xs">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              {/* Weather strip */}
              {weather && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {[
                    {
                      icon: Thermometer,
                      val: `${weather.temp}°C`,
                      label: t.temp,
                    },
                    {
                      icon: CloudRain,
                      val: `${weather.humidity}%`,
                      label: t.humLabel,
                    },
                    {
                      icon: Wind,
                      val: `${weather.windSpeed} km/h`,
                      label: t.wind,
                    },
                    {
                      icon: Droplets,
                      val: `${weather.rainfall}mm`,
                      label: t.rainLabel,
                    },
                  ].map(({ icon: Icon, val, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 bg-white/10 rounded-xl px-2.5 py-1.5 text-xs"
                    >
                      <Icon size={11} className="text-white/70" />
                      <span className="font-semibold">{val}</span>
                      <span className="text-white/50">{label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick nav buttons */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {[
                  { id: "crop-recommend", label: `🌱 ${t.cropGuide}` },
                  { id: "market", label: `💰 ${t.mandiPrices}` },
                  { id: "schemes", label: `🏛️ ${t.schemes}` },
                  { id: "expenses", label: `📊 ${t.expenses}` },
                  { id: "chatbot", label: `🤖 ${t.chatbot}` },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => onNavigate(id)}
                    className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-semibold text-white border border-white/20 transition-all"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center md:justify-end shrink-0">
              <RiskGauge score={overallScore} level={overallLevel} size={150} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Risk Cards — clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {risks.map(({ id, label, emoji, icon: Icon, result, color, bg }, i) => (
          <motion.button
            key={id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            onClick={() => onNavigate(id)}
            className="glass-card rounded-2xl p-5 text-left hover-lift group w-full"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <Icon size={18} className={color} />
              </div>
              {result && (
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg ${getRiskBadgeClass(result.level)}`}
                >
                  {result.level}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
              {label}
            </p>
            {result ? (
              <>
                <p
                  className={`text-3xl font-display font-black ${getRiskColor(result.level).text}`}
                >
                  {result.score}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {result.reasons[0] || "Risk calculated from live weather"}
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <Loader2
                  size={14}
                  className="animate-spin text-muted-foreground"
                />
                <span className="text-xs text-muted-foreground">
                  Calculating...
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 mt-3 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              View Details <ChevronRight size={12} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Active alerts */}
      {rainRisk && pestRisk && locustRisk && (
        <AnimatePresence>
          {[
            rainRisk.level !== "LOW" && {
              msg: `🌧️ Rain Damage: ${rainRisk.level} risk — ${rainRisk.recommendations[0]}`,
              level: rainRisk.level as RiskLevel,
            },
            pestRisk.level !== "LOW" && {
              msg: `🐛 Pest Attack: ${pestRisk.level} risk — ${pestRisk.recommendations[0]}`,
              level: pestRisk.level as RiskLevel,
            },
            locustRisk.level !== "LOW" && {
              msg: `🦗 Locust: ${locustRisk.level} — ${locustRisk.recommendations[0]}`,
              level: locustRisk.level as RiskLevel,
            },
          ].filter(Boolean).length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={15} className="text-amber-500" />
                <h3 className="font-semibold text-sm">
                  Active Alerts for {locationName}
                </h3>
              </div>
              <div className="space-y-2">
                {[rainRisk, pestRisk, locustRisk].map(
                  (r, i) =>
                    r.level !== "LOW" && (
                      <div
                        key={i}
                        className={`flex items-start gap-3 p-3 rounded-xl text-sm ${getRiskColor(r.level).bg}`}
                      >
                        <AlertTriangle
                          size={13}
                          className={`${getRiskColor(r.level).text} shrink-0 mt-0.5`}
                        />
                        <span
                          className={`font-medium ${getRiskColor(r.level).text}`}
                        >
                          {r.recommendations[0]}
                        </span>
                      </div>
                    ),
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Quick stats row */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <LevelIcon size={16} className={overallColors.text} />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {t.overallRisk}
            </span>
          </div>
          <p
            className={`text-3xl font-display font-black ${overallColors.text}`}
          >
            {overallScore}/100
          </p>
          <p className="text-xs text-muted-foreground mt-1">{t.basedOnLive}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-primary" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {t.predictionsLabel}
            </span>
          </div>
          <p className="text-3xl font-display font-black text-foreground">
            {history.length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {highRiskCount} {t.highRiskEvents}
          </p>
        </motion.div>
      </div>

      {/* Weekly chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="font-semibold text-sm text-foreground/80 mb-4">
          {t.weeklyTrend}
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={sampleWeekData} barSize={9} barCategoryGap="30%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))", radius: 8 }}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: 11,
              }}
            />
            <Bar
              dataKey="rain"
              name="Rain"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pest"
              name="Pest"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="locust"
              name="Locust"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center flex-wrap">
          {[
            [t.rain, "#3b82f6"],
            [t.pest, "#f59e0b"],
            [t.locust, "#ef4444"],
          ].map(([k, c]) => (
            <div
              key={k}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: c }}
              />{" "}
              {k}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Module cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          {
            id: "rain",
            label: t.rainPredictor,
            desc: t.floodWaterlogging,
            icon: Droplets,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            id: "pest",
            label: t.pestPredictor,
            desc: t.detectPest,
            icon: Bug,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
          },
          {
            id: "locust",
            label: t.locustPredictor,
            desc: t.trackSwarm,
            icon: AlertOctagon,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
          },
          {
            id: "crop-recommend",
            label: t.cropGuide,
            desc: t.bestCrops,
            icon: CheckCircle,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            id: "market",
            label: t.mandiPrices,
            desc: t.todayMandi,
            icon: ChevronRight,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
          {
            id: "schemes",
            label: t.schemes,
            desc: t.schemesDesc,
            icon: Shield,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
          },
        ].map(({ id, label, desc, icon: Icon, color, bg }, i) => (
          <motion.button
            key={id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.06 }}
            onClick={() => onNavigate(id)}
            className="glass-card rounded-2xl p-4 text-left hover-lift group"
          >
            <div
              className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
            >
              <Icon size={16} className={color} />
            </div>
            <h3 className="font-bold text-sm mb-0.5">{label}</h3>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
