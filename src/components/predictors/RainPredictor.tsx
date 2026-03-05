import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateRainRisk, saveToHistory, LABELS } from "@/lib/riskEngine";
import { calculateCropRainRisk, CROPS } from "@/lib/cropEngine";
import type { RainInputs, RiskResult } from "@/lib/types";
import RiskResultPanel from "@/components/RiskResultPanel";
import WeatherAutoFill, { type WeatherData } from "@/components/WeatherAutoFill";
import { useLang } from "@/context/LangContext";

export default function RainPredictor() {
  const { lang } = useLang();
  const t = LABELS[lang];

  const [inputs, setInputs] = useState<RainInputs>({ rainfall: 60, soilMoisture: 60, windSpeed: 30 });
  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState<string>("generic");
  const [showCropMenu, setShowCropMenu] = useState(false);

  const selectedCrop = CROPS.find(c => c.id === selectedCropId);

  const handleWeatherFill = (data: WeatherData) => {
    setInputs(prev => ({ ...prev, rainfall: data.rainfall, windSpeed: data.windSpeed }));
    setResult(null);
  };

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      const res = selectedCrop
        ? calculateCropRainRisk(inputs, selectedCrop)
        : calculateRainRisk(inputs);
      setResult(res);
      saveToHistory({ type: "rain", timestamp: Date.now(), inputs, result: res });
      setLoading(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <WeatherAutoFill onFill={handleWeatherFill} />

      <div className="glass-card rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Droplets size={20} className="text-blue-500" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-foreground">{t.rainPredictor}</h2>
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
            🎯 Risk thresholds adjusted for <strong>{selectedCrop.name}</strong>
            {" — "}flood at {selectedCrop.rain.floodThreshold}mm, soil moisture at {selectedCrop.rain.soilMoistureThreshold}%
          </div>
        )}

        {/* Rainfall */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="font-semibold text-sm">Rainfall (mm)</Label>
            <span className="text-sm font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-lg">{inputs.rainfall} mm</span>
          </div>
          <Slider min={0} max={200} step={1} value={[inputs.rainfall]} onValueChange={([v]) => setInputs(p => ({ ...p, rainfall: v }))} className="cursor-pointer" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>0mm</span><span>100mm</span><span>200mm</span></div>
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

        {/* Wind Speed */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="font-semibold text-sm">Wind Speed (km/h)</Label>
            <span className="text-sm font-bold text-orange-400 bg-orange-400/10 px-3 py-1 rounded-lg">{inputs.windSpeed} km/h</span>
          </div>
          <Slider min={0} max={120} step={1} value={[inputs.windSpeed]} onValueChange={([v]) => setInputs(p => ({ ...p, windSpeed: v }))} />
          <div className="flex justify-between text-xs text-muted-foreground"><span>0</span><span>60</span><span>120</span></div>
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
