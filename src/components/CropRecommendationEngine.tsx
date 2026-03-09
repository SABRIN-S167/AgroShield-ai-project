import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ChevronDown, Sparkles, TrendingUp, Droplets, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getRecommendations, SOIL_OPTIONS, SEASON_OPTIONS,
  type SoilType, type Season, type CropRecommendation
} from "@/lib/cropRecommendation";
import LocationSearchPanel, { type LocationWeatherData } from "@/components/LocationSearchPanel";

const SUITABILITY_CONFIG = {
  excellent: { label: "Excellent", class: "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30" },
  good: { label: "Good", class: "bg-blue-500/15 text-blue-600 border border-blue-500/30" },
  moderate: { label: "Moderate", class: "bg-amber-500/15 text-amber-600 border border-amber-500/30" },
};

const WATER_ICON = { low: "💧", medium: "💧💧", high: "💧💧💧" };

function CropCard({ crop, index }: { crop: CropRecommendation; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const sc = SUITABILITY_CONFIG[crop.suitability];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full p-4 text-left flex items-center gap-3"
      >
        <span className="text-3xl">{crop.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-sm">{crop.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-lg font-semibold ${sc.class}`}>{sc.label}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{crop.reason}</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
              <p className="text-xs text-foreground/80">{crop.reason}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar size={12} className="text-primary" />
                    <span className="text-xs font-semibold text-muted-foreground">Sowing</span>
                  </div>
                  <p className="text-xs font-bold">{crop.sowingMonth}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp size={12} className="text-primary" />
                    <span className="text-xs font-semibold text-muted-foreground">Harvest</span>
                  </div>
                  <p className="text-xs font-bold">{crop.harvestMonth}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="bg-muted/50 rounded-xl px-3 py-2 flex items-center gap-1.5">
                  <Droplets size={12} className="text-blue-500" />
                  <span className="text-xs">Water: {WATER_ICON[crop.waterNeed]} {crop.waterNeed}</span>
                </div>
                {crop.marketPrice && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                    <span className="text-xs font-semibold text-emerald-600">💰 {crop.marketPrice}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CropRecommendationEngine() {
  const [soilType, setSoilType] = useState<SoilType | null>(null);
  const [season, setSeason] = useState<Season | null>(null);
  const [results, setResults] = useState<CropRecommendation[] | null>(null);
  const [locationCity, setLocationCity] = useState<string | null>(null);

  const handleLocation = (data: LocationWeatherData) => {
    setLocationCity(data.city);
  };

  const handleAnalyze = () => {
    if (!soilType || !season) return;
    const recs = getRecommendations(soilType, season);
    setResults(recs);
  };

  const selectedSoil = SOIL_OPTIONS.find(s => s.value === soilType);
  const selectedSeason = SEASON_OPTIONS.find(s => s.value === season);

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient rounded-3xl p-6 text-white"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Leaf size={20} />
          </div>
          <div>
            <h2 className="font-display font-black text-xl">Crop Recommendation Engine</h2>
            <p className="text-white/70 text-xs">Best crops for your soil & season — powered by ICAR data</p>
          </div>
        </div>
      </motion.div>

      {/* Location Search */}
      {/* <LocationSearchPanel onLocation={handleLocation} />
      {locationCity && (
        <div className="bg-primary/5 border border-primary/15 rounded-xl px-4 py-2 text-xs text-primary/80 flex items-center gap-2">
          <span>📍</span>
          <span>Location set to <strong>{locationCity}</strong> — refine soil & season for best local crop picks</span>
        </div>
      )} */}

      <div className="glass-card rounded-2xl p-5 space-y-5">
        {/* Soil Type */}
        <div>
          <label className="text-sm font-semibold mb-3 block">
            🌍 Select Your Soil Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SOIL_OPTIONS.map(s => (
              <button
                key={s.value}
                onClick={() => { setSoilType(s.value); setResults(null); }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  soilType === s.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/30 hover:border-primary/40 text-foreground"
                }`}
              >
                <span className="text-lg block mb-1">{s.emoji}</span>
                <span className="text-xs font-bold block">{s.label}</span>
                <span className="text-xs text-muted-foreground">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Season */}
        <div>
          <label className="text-sm font-semibold mb-3 block">
            📅 Select Cropping Season
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SEASON_OPTIONS.map(s => (
              <button
                key={s.value}
                onClick={() => { setSeason(s.value); setResults(null); }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  season === s.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/30 hover:border-primary/40 text-foreground"
                }`}
              >
                <span className="text-lg block mb-1">{s.emoji}</span>
                <span className="text-xs font-bold block">{s.label}</span>
                <span className="text-xs text-muted-foreground">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected summary */}
        {selectedSoil && selectedSeason && (
          <div className="bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 text-xs text-primary/80">
            🎯 Analyzing best crops for <strong>{selectedSoil.label} soil</strong> during <strong>{selectedSeason.label}</strong> season
          </div>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={!soilType || !season}
          className="w-full h-11 rounded-xl font-bold bg-hero-gradient text-white hover:opacity-90"
        >
          <Sparkles size={15} className="mr-2" />
          Get Crop Recommendations
        </Button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 px-1">
              <Sparkles size={14} className="text-primary" />
              <h3 className="font-bold text-sm">
                {results.length} crops recommended for {selectedSoil?.label} soil in {selectedSeason?.label}
              </h3>
            </div>
            {results.map((crop, i) => (
              <CropCard key={crop.name} crop={crop} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
