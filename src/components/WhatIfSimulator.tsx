import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sliders, TrendingUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateRainRisk, calculatePestRisk, getRiskColor } from "@/lib/riskEngine";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLang } from "@/context/LangContext";
import { LABELS } from "@/lib/riskEngine";

export default function WhatIfSimulator() {
  const { lang } = useLang();
  const t = LABELS[lang];

  const [rainfall, setRainfall] = useState(60);
  const [soilMoisture, setSoilMoisture] = useState(60);
  const [windSpeed, setWindSpeed] = useState(30);
  const [temperature, setTemperature] = useState(28);
  const [humidity, setHumidity] = useState(65);

  const rainResult = useMemo(() => calculateRainRisk({ rainfall, soilMoisture, windSpeed }), [rainfall, soilMoisture, windSpeed]);
  const pestResult = useMemo(() => calculatePestRisk({ temperature, humidity, soilMoisture }), [temperature, humidity, soilMoisture]);

  const rainColors = getRiskColor(rainResult.level);
  const pestColors = getRiskColor(pestResult.level);

  const chartData = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => {
      const rf = (i / 10) * 200;
      const rr = calculateRainRisk({ rainfall: rf, soilMoisture, windSpeed });
      const pr = calculatePestRisk({ temperature, humidity: humidity + (i - 5) * 2, soilMoisture });
      return {
        label: `${Math.round(rf)}mm`,
        rainRisk: rr.score,
        pestRisk: pr.score,
      };
    });
  }, [soilMoisture, windSpeed, temperature, humidity]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Sliders size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">{t.simulator}</h2>
            <p className="text-xs text-muted-foreground">Adjust parameters to see live risk changes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Rainfall (mm)", value: rainfall, set: setRainfall, min: 0, max: 200, color: "text-blue-500", bg: "bg-blue-500/10", unit: "mm" },
            { label: "Soil Moisture (%)", value: soilMoisture, set: setSoilMoisture, min: 0, max: 100, color: "text-emerald-500", bg: "bg-emerald-500/10", unit: "%" },
            { label: "Wind Speed (km/h)", value: windSpeed, set: setWindSpeed, min: 0, max: 120, color: "text-orange-400", bg: "bg-orange-400/10", unit: " km/h" },
            { label: "Temperature (°C)", value: temperature, set: setTemperature, min: 10, max: 50, color: "text-red-500", bg: "bg-red-500/10", unit: "°C" },
            { label: "Humidity (%)", value: humidity, set: setHumidity, min: 0, max: 100, color: "text-cyan-500", bg: "bg-cyan-500/10", unit: "%" },
          ].map(({ label, value, set, min, max, color, bg, unit }) => (
            <div key={label} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold">{label}</Label>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${color} ${bg}`}>{value}{unit}</span>
              </div>
              <Slider min={min} max={max} step={1} value={[value]} onValueChange={([v]) => set(v)} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Live Results */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Rain Risk", score: rainResult.score, level: rainResult.level, colors: rainColors },
          { label: "Pest Risk", score: pestResult.score, level: pestResult.level, colors: pestColors },
        ].map(({ label, score, level, colors }) => (
          <motion.div
            key={label}
            className={`glass-card rounded-2xl p-4 flex flex-col items-center gap-2 ${colors.bg}`}
            layout
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
            <motion.span
              key={score}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-4xl font-display font-black ${colors.text}`}
            >
              {score}
            </motion.span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>{level}</span>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-primary" />
          <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-foreground/80">
            Risk vs Rainfall Trend
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pestGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
            <Area type="monotone" dataKey="rainRisk" stroke="#3b82f6" fill="url(#rainGrad)" strokeWidth={2} name="Rain Risk" />
            <Area type="monotone" dataKey="pestRisk" stroke="#f59e0b" fill="url(#pestGrad)" strokeWidth={2} name="Pest Risk" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-blue-500" /> Rain Risk
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-amber-400" /> Pest Risk
          </div>
        </div>
      </motion.div>
    </div>
  );
}
