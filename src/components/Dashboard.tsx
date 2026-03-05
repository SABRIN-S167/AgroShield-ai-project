import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import {
  Shield, TrendingUp, AlertTriangle, CheckCircle, XCircle,
  Droplets, Bug, AlertOctagon, Activity, Bell
} from "lucide-react";
import { getHistory, getRiskColor, LABELS } from "@/lib/riskEngine";
import { calculateRainRisk, calculatePestRisk, calculateLocustRisk } from "@/lib/riskEngine";
import type { RiskLevel } from "@/lib/types";
import RiskGauge from "@/components/RiskGauge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLang } from "@/context/LangContext";

const sampleWeekData = [
  { day: "Mon", rain: 25, pest: 30, locust: 10 },
  { day: "Tue", rain: 55, pest: 45, locust: 20 },
  { day: "Wed", rain: 40, pest: 70, locust: 60 },
  { day: "Thu", rain: 75, pest: 55, locust: 40 },
  { day: "Fri", rain: 60, pest: 80, locust: 70 },
  { day: "Sat", rain: 35, pest: 40, locust: 30 },
  { day: "Today", rain: 50, pest: 65, locust: 45 },
];

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sub?: string;
  delay?: number;
  levelClass?: string;
}

function StatCard({ label, value, icon, sub, delay = 0, levelClass }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-2xl p-5 hover-lift"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-display font-black ${levelClass || "text-foreground"}`}>{value}</p>
    </motion.div>
  );
}

export default function Dashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { lang } = useLang();
  const t = LABELS[lang];

  const history = getHistory();
  const totalPredictions = history.length;
  const highRiskCount = history.filter(h => h.result.level === "HIGH").length;

  const todayRisk = useMemo(() => calculateRainRisk({ rainfall: 95, soilMoisture: 75, windSpeed: 45 }), []);
  const todayPest = useMemo(() => calculatePestRisk({ temperature: 34, humidity: 85, soilMoisture: 70 }), []);
  const todayLocust = useMemo(() => calculateLocustRisk({ windSpeed: 55, nearbyLocust: false }), []);

  const overallScore = Math.round((todayRisk.score + todayPest.score + todayLocust.score) / 3);
  const overallLevel: RiskLevel = overallScore >= 70 ? "HIGH" : overallScore >= 40 ? "MEDIUM" : "LOW";
  const overallColors = getRiskColor(overallLevel);

  const alerts = [
    todayRisk.level !== "LOW" && { msg: `Rain Damage: ${todayRisk.level} risk detected`, level: todayRisk.level },
    todayPest.level !== "LOW" && { msg: `Pest Attack: ${todayPest.level} risk – monitor crops`, level: todayPest.level },
    todayLocust.level !== "LOW" && { msg: `Locust: ${todayLocust.level} – check wind patterns`, level: todayLocust.level },
  ].filter(Boolean) as { msg: string; level: RiskLevel }[];

  const LevelIcon = overallLevel === "HIGH" ? XCircle : overallLevel === "MEDIUM" ? AlertTriangle : CheckCircle;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient rounded-3xl p-7 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M43.5,-57.2C55.9,-46.4,64.4,-30.9,68.1,-14.1C71.8,2.7,70.8,20.8,62.5,34.3C54.1,47.9,38.5,56.8,21.8,62.4C5,67.9,-12.9,70,-28.1,64.8C-43.2,59.5,-55.5,46.8,-62.9,31.6C-70.3,16.3,-72.7,-1.5,-67.8,-17.1C-62.9,-32.7,-50.6,-46,-37,-55.9C-23.4,-65.7,-8.4,-72,5.8,-79.1C20,-86.2,31.1,-67.9,43.5,-57.2Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <span className="text-white/70 text-sm font-medium">AgroShield AI</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-black leading-tight mb-2">
              AI-Powered Crop Risk <br />Monitoring
            </h1>
            <p className="text-white/70 text-sm max-w-sm">
              Real-time agricultural intelligence for Indian farmers. Detect threats before they damage your crops.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { id: "rain", label: t.rainPredictor },
                { id: "pest", label: t.pestPredictor },
                { id: "simulator", label: t.simulator },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className="px-4 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-semibold text-white backdrop-blur-sm transition-all border border-white/20"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <RiskGauge score={overallScore} level={overallLevel} size={160} />
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Overall Risk"
          value={`${overallScore}/100`}
          icon={<LevelIcon size={18} className={overallColors.text} />}
          sub="Today"
          delay={0.1}
          levelClass={overallColors.text}
        />
        <StatCard
          label="Rain Risk"
          value={todayRisk.score}
          icon={<Droplets size={18} className="text-blue-500" />}
          sub={todayRisk.level}
          delay={0.15}
          levelClass={getRiskColor(todayRisk.level).text}
        />
        <StatCard
          label="Pest Risk"
          value={todayPest.score}
          icon={<Bug size={18} className="text-orange-500" />}
          sub={todayPest.level}
          delay={0.2}
          levelClass={getRiskColor(todayPest.level).text}
        />
        <StatCard
          label="Predictions"
          value={totalPredictions}
          icon={<Activity size={18} className="text-primary" />}
          sub={`${highRiskCount} high`}
          delay={0.25}
        />
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-accent" />
            <h3 className="font-display font-semibold text-sm uppercase tracking-wide">Active Alerts</h3>
          </div>
          <div className="space-y-2">
            {alerts.map((a, i) => {
              const c = getRiskColor(a.level);
              return (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${c.bg} text-sm`}>
                  <AlertTriangle size={14} className={c.text} />
                  <span className={`font-medium ${c.text}`}>{a.msg}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Weekly Trend Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-primary" />
          <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-foreground/80">Weekly Risk Trend</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sampleWeekData} barSize={10} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))", radius: 8 }}
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12 }}
            />
            <Bar dataKey="rain" name="Rain" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pest" name="Pest" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="locust" name="Locust" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center flex-wrap">
          {[["Rain", "#3b82f6"], ["Pest", "#f59e0b"], ["Locust", "#ef4444"]].map(([k, c]) => (
            <div key={k} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
              {k}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick access modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { id: "rain", label: t.rainPredictor, desc: "Predict waterlogging & flood risk", icon: Droplets, iconColor: "text-blue-500", bgColor: "bg-blue-500/10" },
          { id: "pest", label: t.pestPredictor, desc: "Detect pest & fungal conditions", icon: Bug, iconColor: "text-orange-500", bgColor: "bg-orange-500/10" },
          { id: "locust", label: t.locustPredictor, desc: "Track locust swarm movement", icon: AlertOctagon, iconColor: "text-yellow-500", bgColor: "bg-yellow-500/10" },
          { id: "heatmap", label: t.heatmap, desc: "District-level risk map across India", icon: Activity, iconColor: "text-emerald-500", bgColor: "bg-emerald-500/10" },
          { id: "chatbot", label: t.chatbot, desc: "Ask AI about crop risk & advice", icon: Bell, iconColor: "text-purple-500", bgColor: "bg-purple-500/10" },
          { id: "simulator", label: t.simulator, desc: "Simulate weather scenarios live", icon: TrendingUp, iconColor: "text-cyan-500", bgColor: "bg-cyan-500/10" },
        ].map(({ id, label, desc, icon: Icon, iconColor, bgColor }, i) => (
          <motion.button
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            onClick={() => onNavigate(id)}
            className="glass-card rounded-2xl p-5 text-left hover-lift group"
          >
            <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon size={22} className={iconColor} />
            </div>
            <h3 className="font-display font-bold text-base mb-1">{label}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
