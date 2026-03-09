import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Wind, Loader2, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { calculateLocustRisk, saveToHistory } from "@/lib/riskEngine";
import { I18N } from "@/lib/i18n";
import type { LocustInputs, RiskResult } from "@/lib/types";
import RiskResultPanel from "@/components/RiskResultPanel";
import LocationSearchPanel, { type LocationWeatherData } from "@/components/LocationSearchPanel";
import { useLang } from "@/context/LangContext";

export default function LocustPredictor() {
  const { lang } = useLang();
  const t = I18N[lang];

  const [inputs, setInputs] = useState<LocustInputs>({ windSpeed: 40, nearbyLocust: false });
  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleWeatherFill = (data: LocationWeatherData) => {
    setInputs(prev => ({ ...prev, windSpeed: data.windSpeed }));
    setResult(null);
  };

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      const res = calculateLocustRisk(inputs);
      setResult(res);
      saveToHistory({ type: "locust", timestamp: Date.now(), inputs, result: res });
      setLoading(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <LocationSearchPanel onLocation={handleWeatherFill} />

      <div className="glass-card rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center">
            <AlertOctagon size={20} className="text-yellow-500" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-foreground">{t.locustPredictor}</h2>
            <p className="text-xs text-muted-foreground">Predictor</p>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="font-semibold text-sm flex items-center gap-1.5">
              <Wind size={14} /> Wind Speed (km/h)
            </Label>
            <span className="text-sm font-bold text-orange-400 bg-orange-400/10 px-3 py-1 rounded-lg">
              {inputs.windSpeed} km/h
            </span>
          </div>
          <Slider
            min={0} max={120} step={1}
            value={[inputs.windSpeed]}
            onValueChange={([v]) => setInputs(p => ({ ...p, windSpeed: v }))}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span><span>60</span><span>120</span>
          </div>
        </div>

        {/* Nearby Locust Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
          <div>
            <Label className="font-semibold text-sm block">{t.nearbyLocustActivity}</Label>
            <p className="text-xs text-muted-foreground mt-0.5">{t.nearbyLocustDesc}</p>
          </div>
          <Switch
            checked={inputs.nearbyLocust}
            onCheckedChange={(v) => setInputs(p => ({ ...p, nearbyLocust: v }))}
          />
        </div>

        {inputs.nearbyLocust && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-risk-high-bg border border-risk-high/20 text-risk-high text-sm font-medium">
            <AlertOctagon size={16} />
            {t.locustDetected}
          </div>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full h-12 rounded-xl font-bold text-base bg-hero-gradient text-white hover:opacity-90 transition-opacity"
        >
          {loading ? (
            <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Analyzing...</span>
          ) : t.analyze}
        </Button>
      </div>

      <AnimatePresence>
        {result && <RiskResultPanel result={result} labels={t} />}
      </AnimatePresence>
    </div>
  );
}
