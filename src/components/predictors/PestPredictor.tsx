import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculatePestRisk, saveToHistory, LABELS } from "@/lib/riskEngine";
import { calculateCropPestRisk, CROPS } from "@/lib/cropEngine";
import type { PestInputs, RiskResult } from "@/lib/types";
import RiskResultPanel from "@/components/RiskResultPanel";
import WeatherAutoFill, { type WeatherData } from "@/components/WeatherAutoFill";
import { useLang } from "@/context/LangContext";

export default function PestPredictor() {
  const { lang } = useLang();
  const t = LABELS[lang];

  const [inputs, setInputs] = useState<PestInputs>({ temperature: 28, humidity: 70, soilMoisture: 60 });
  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState<string>("generic");
  const [showCropMenu, setShowCropMenu] = useState(false);

  const selectedCrop = CROPS.find(c => c.id === selectedCropId);

  const handleWeatherFill = (data: WeatherData) => {
    setInputs(prev => ({ ...prev, temperature: data.temperature, humidity: data.humidity }));
    setResult(null);
  };

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      const res = selectedCrop
        ? calculateCropPestRisk(inputs, selectedCrop)
        : calculatePestRisk(inputs);
      setResult(res);
      saveToHistory({ type: "pest", timestamp: Date.now(), inputs, result: res });
      setLoading(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <WeatherAutoFill onFill={handleWeatherFill} />

      <div className="glass-card rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
              <Bug size={20} className="text-orange-500" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-foreground">{t.pestPredictor}</h2>
              <p className="text-xs text-muted-foreground">Predictor</p>
            </div>
          </div>

          {/* Crop Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCropMenu(v => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 border border-border text-sm font-medium hover:border-primary/40 transition-colors"
            >
              <span>{selectedCrop ? `${selectedCrop.emoji} ${selectedCrop.name}` : "🌱 Generic"}</span>
              <ChevronDown size={13} className="text-muted-foreground" />
            </button>
            <AnimatePresence>
              {showCropMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[140px]"
                >
                  <button
                    onClick={() => { setSelectedCropId("generic"); setShowCropMenu(false); setResult(null); }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-muted/50 transition-colors"
                  >
                    🌱 Generic
                  </button>
                  {CROPS.map(crop => (
                    <button
                      key={crop.id}
                      onClick={() => { setSelectedCropId(crop.id); setShowCropMenu(false); setResult(null); }}
                      className={`w-full px-3 py-2 text-sm text-left hover:bg-muted/50 transition-colors ${selectedCropId === crop.id ? "bg-primary/10 text-primary font-semibold" : ""}`}
                    >
                      {crop.emoji} {crop.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {selectedCrop && (
          <div className="rounded-xl bg-primary/5 border border-primary/15 px-3 py-2 text-xs text-primary/80 font-medium">
            🎯 Pest thresholds adjusted for <strong>{selectedCrop.name}</strong>
            {" — "}humidity at {selectedCrop.pest.humidityThreshold}%, temp at {selectedCrop.pest.temperatureThreshold}°C
          </div>
        )}

        {/* Temperature */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="font-semibold text-sm">Temperature (°C)</Label>
            <span className="text-sm font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded-lg">{inputs.temperature}°C</span>
          </div>
          <Slider min={10} max={50} step={1} value={[inputs.temperature]} onValueChange={([v]) => setInputs(p => ({ ...p, temperature: v }))} />
          <div className="flex justify-between text-xs text-muted-foreground"><span>10°C</span><span>30°C</span><span>50°C</span></div>
        </div>

        {/* Humidity */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="font-semibold text-sm">Humidity (%)</Label>
            <span className="text-sm font-bold text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-lg">{inputs.humidity}%</span>
          </div>
          <Slider min={0} max={100} step={1} value={[inputs.humidity]} onValueChange={([v]) => setInputs(p => ({ ...p, humidity: v }))} />
          <div className="flex justify-between text-xs text-muted-foreground"><span>0%</span><span>50%</span><span>100%</span></div>
        </div>

        {/* Soil Moisture */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="font-semibold text-sm">Soil Moisture (%)</Label>
            <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg">{inputs.soilMoisture}%</span>
          </div>
          <Slider min={0} max={100} step={1} value={[inputs.soilMoisture]} onValueChange={([v]) => setInputs(p => ({ ...p, soilMoisture: v }))} />
          <div className="flex justify-between text-xs text-muted-foreground"><span>0%</span><span>50%</span><span>100%</span></div>
        </div>

        <Button onClick={handleAnalyze} disabled={loading} className="w-full h-12 rounded-xl font-bold text-base bg-hero-gradient text-white hover:opacity-90 transition-opacity">
          {loading ? <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Analyzing...</span> : t.analyze}
        </Button>
      </div>

      <AnimatePresence>
        {result && <RiskResultPanel result={result} labels={t} />}
      </AnimatePresence>
    </div>
  );
}
