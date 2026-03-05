import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, TrendingUp, AlertTriangle, CheckCircle, XCircle, Search } from "lucide-react";
import { INDIA_DISTRICTS, getAllDistrictRisks, getDistrictRisk, type DistrictRisk } from "@/lib/districts";
import { ALL_DISTRICTS } from "@/lib/districts";
import { useLang } from "@/context/LangContext";
import { LABELS } from "@/lib/riskEngine";

function RiskBadge({ level }: { level: "LOW" | "MEDIUM" | "HIGH" }) {
  const cls =
    level === "HIGH"
      ? "bg-risk-high-bg text-risk-high border-risk-high/30"
      : level === "MEDIUM"
      ? "bg-risk-medium-bg text-risk-medium border-risk-medium/30"
      : "bg-risk-low-bg text-risk-low border-risk-low/30";
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cls}`}>{level}</span>
  );
}

function RiskBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

export default function DistrictHeatmap() {
  const { lang } = useLang();
  const t = LABELS[lang];
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<string>("Tamil Nadu");
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictRisk | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const allRisks = useMemo(() => getAllDistrictRisks(), []);

  const stateRisks = useMemo(() =>
    allRisks.filter(r => r.state === selectedState),
    [allRisks, selectedState]
  );

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return ALL_DISTRICTS.filter(d => d.district.toLowerCase().includes(q)).slice(0, 8);
  }, [search]);

  const stateStats = useMemo(() => {
    const high = stateRisks.filter(r => r.level === "HIGH").length;
    const med = stateRisks.filter(r => r.level === "MEDIUM").length;
    const low = stateRisks.filter(r => r.level === "LOW").length;
    return { high, med, low };
  }, [stateRisks]);

  const handleSelectSuggestion = (district: string, state: string) => {
    setSelectedState(state);
    const risk = getDistrictRisk(district, state);
    setSelectedDistrict(risk);
    setSearch(district);
    setShowSuggestions(false);
  };

  const states = Object.keys(INDIA_DISTRICTS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient rounded-3xl p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <MapPin size={18} />
          </div>
          <div>
            <h2 className="font-display font-black text-xl">District Risk Heatmap</h2>
            <p className="text-white/70 text-xs">Government-scale agricultural risk intelligence</p>
          </div>
        </div>
        <p className="text-white/60 text-sm">Select a state or search a district to view simulated risk levels across India.</p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <div className="flex items-center gap-2 glass-card rounded-2xl px-4 py-3 border border-primary/20">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
            placeholder="Search district... (e.g. Thanjavur, Coimbatore)"
            value={search}
            onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          {search && (
            <button onClick={() => { setSearch(""); setSelectedDistrict(null); }} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
          )}
        </div>

        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 right-0 z-50 mt-1 bg-card border border-border rounded-2xl overflow-hidden shadow-xl"
            >
              {suggestions.map(({ district, state }) => {
                const r = getDistrictRisk(district, state);
                return (
                  <button
                    key={`${state}-${district}`}
                    onMouseDown={() => handleSelectSuggestion(district, state)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 transition-colors text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-muted-foreground" />
                      <span className="font-medium">{district}</span>
                      <span className="text-muted-foreground text-xs">{state}</span>
                    </div>
                    <RiskBadge level={r.level} />
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* State Selector */}
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2 px-1">Select State</p>
        <div className="flex flex-wrap gap-2">
          {states.map(state => (
            <button
              key={state}
              onClick={() => { setSelectedState(state); setSelectedDistrict(null); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                selectedState === state
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* State Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "High Risk", count: stateStats.high, Icon: XCircle, cls: "text-risk-high", bg: "bg-risk-high-bg" },
          { label: "Medium Risk", count: stateStats.med, Icon: AlertTriangle, cls: "text-risk-medium", bg: "bg-risk-medium-bg" },
          { label: "Low Risk", count: stateStats.low, Icon: CheckCircle, cls: "text-risk-low", bg: "bg-risk-low-bg" },
        ].map(({ label, count, Icon, cls, bg }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${bg} rounded-2xl p-3 text-center`}
          >
            <Icon size={18} className={`${cls} mx-auto mb-1`} />
            <p className={`text-xl font-black font-display ${cls}`}>{count}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* District Grid */}
      <div className="glass-card rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={15} className="text-primary" />
          <h3 className="font-display font-bold text-sm text-foreground/80">
            {selectedState} – District Risk Overview
          </h3>
        </div>
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {stateRisks
            .sort((a, b) => b.overallRisk - a.overallRisk)
            .map((r, i) => (
              <motion.button
                key={r.district}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => setSelectedDistrict(r)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all hover:bg-muted/50 ${
                  selectedDistrict?.district === r.district ? "bg-primary/10 border border-primary/20" : ""
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      r.level === "HIGH" ? "hsl(var(--risk-high))" :
                      r.level === "MEDIUM" ? "hsl(var(--risk-medium))" :
                      "hsl(var(--risk-low))",
                  }}
                />
                <span className="text-sm font-medium flex-1">{r.district}</span>
                <span className="text-xs text-muted-foreground font-bold">{r.overallRisk}/100</span>
                <RiskBadge level={r.level} />
              </motion.button>
            ))}
        </div>
      </div>

      {/* Selected District Detail */}
      <AnimatePresence>
        {selectedDistrict && (
          <motion.div
            key={selectedDistrict.district}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-card rounded-2xl p-5 border border-primary/20 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={14} className="text-primary" />
                  <h3 className="font-display font-black text-lg">{selectedDistrict.district}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{selectedDistrict.state}</p>
              </div>
              <RiskBadge level={selectedDistrict.level} />
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>🌧️ Rain Risk</span>
                </div>
                <RiskBar value={selectedDistrict.rainRisk} color="#3b82f6" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>🐛 Pest Risk</span>
                </div>
                <RiskBar value={selectedDistrict.pestRisk} color="#f59e0b" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>🦗 Locust Risk</span>
                </div>
                <RiskBar value={selectedDistrict.locustRisk} color="#ef4444" />
              </div>
            </div>

            <div
              className="rounded-xl p-3 text-sm font-medium flex items-center gap-2"
              style={{
                backgroundColor:
                  selectedDistrict.level === "HIGH" ? "hsl(var(--risk-high-bg))" :
                  selectedDistrict.level === "MEDIUM" ? "hsl(var(--risk-medium-bg))" :
                  "hsl(var(--risk-low-bg))",
                color:
                  selectedDistrict.level === "HIGH" ? "hsl(var(--risk-high))" :
                  selectedDistrict.level === "MEDIUM" ? "hsl(var(--risk-medium))" :
                  "hsl(var(--risk-low))",
              }}
            >
              {selectedDistrict.level === "HIGH" ? <XCircle size={15} /> :
               selectedDistrict.level === "MEDIUM" ? <AlertTriangle size={15} /> :
               <CheckCircle size={15} />}
              {selectedDistrict.level === "HIGH"
                ? `${selectedDistrict.district} is at HIGH risk — alert farmers immediately`
                : selectedDistrict.level === "MEDIUM"
                ? `${selectedDistrict.district} is at MEDIUM risk — monitor closely`
                : `${selectedDistrict.district} shows LOW risk — normal monitoring`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
