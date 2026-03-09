import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Search, ShoppingCart, Info } from "lucide-react";
import { getMarketPrices, type MandiPrice } from "@/lib/marketPrices";
import LocationSearchPanel, { type LocationWeatherData } from "@/components/LocationSearchPanel";
import { I18N } from "@/lib/i18n";
import { useLang } from "@/context/LangContext";

function TrendBadge({ trend, pct }: { trend: MandiPrice["trend"]; pct: number }) {
  if (trend === "up") return (
    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
      <TrendingUp size={11} /> +{pct}%
    </span>
  );
  if (trend === "down") return (
    <span className="flex items-center gap-1 text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-lg border border-destructive/20">
      <TrendingDown size={11} /> {pct}%
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">
      <Minus size={11} /> {pct > 0 ? "+" : ""}{pct}%
    </span>
  );
}

function PriceCard({ item, index }: { item: MandiPrice; index: number }) {
  const [showAdvice, setShowAdvice] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass-card rounded-2xl p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{item.emoji}</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm">{item.crop}</h3>
              <TrendBadge trend={item.trend} pct={item.trendPct} />
            </div>
            <p className="text-xs text-muted-foreground">{item.market}, {item.state}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-display font-black text-foreground">₹{item.currentPrice.toLocaleString("en-IN")}</p>
          <p className="text-xs text-muted-foreground">/{item.unit}</p>
        </div>
      </div>

      <div className="mt-3 flex gap-2 items-center justify-between flex-wrap">
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span>Low: <strong className="text-foreground">₹{item.minPrice.toLocaleString("en-IN")}</strong></span>
          <span>High: <strong className="text-foreground">₹{item.maxPrice.toLocaleString("en-IN")}</strong></span>
          <span className="text-primary font-medium">📅 Best: {item.bestSellMonth}</span>
        </div>
        <button
          onClick={() => setShowAdvice(v => !v)}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <Info size={11} /> {showAdvice ? "Hide" : "Sell Advice"}
        </button>
      </div>

      {showAdvice && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 bg-primary/5 border border-primary/15 rounded-xl px-3 py-2.5 text-xs text-foreground/80"
        >
          💡 {item.advice}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function MarketPriceDashboard() {
  const { lang } = useLang();
  const t = I18N[lang];
  const [search, setSearch] = useState("");
  const [locationCity, setLocationCity] = useState<string | null>(null);
  const prices = useMemo(() => getMarketPrices(), []);

  const handleLocation = (data: LocationWeatherData) => {
    setLocationCity(data.city);
    // Auto-search by detected city/district
    setSearch(data.city);
  };

  const filtered = prices.filter(p =>
    p.crop.toLowerCase().includes(search.toLowerCase()) ||
    p.market.toLowerCase().includes(search.toLowerCase()) ||
    p.state.toLowerCase().includes(search.toLowerCase())
  );

  const rising = prices.filter(p => p.trend === "up").length;
  const falling = prices.filter(p => p.trend === "down").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient rounded-3xl p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <ShoppingCart size={20} />
          </div>
          <div>
            <h2 className="font-display font-black text-xl">{t.mandiTitle}</h2>
            <p className="text-white/70 text-xs">{t.mandiDesc}</p>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="bg-white/15 rounded-xl px-4 py-2 text-center">
            <p className="text-xl font-black">{prices.length}</p>
            <p className="text-xs text-white/70">{t.cropsTracked}</p>
          </div>
          <div className="bg-emerald-400/20 rounded-xl px-4 py-2 text-center">
            <p className="text-xl font-black text-emerald-200">{rising} ↑</p>
            <p className="text-xs text-white/70">{t.rising}</p>
          </div>
          <div className="bg-red-400/20 rounded-xl px-4 py-2 text-center">
            <p className="text-xl font-black text-red-200">{falling} ↓</p>
            <p className="text-xs text-white/70">{t.falling}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-white/70 mb-0.5">{t.dataSource}</p>
            <p className="text-xs font-bold">Agmarknet / eNAM</p>
          </div>
        </div>
      </motion.div>

      {/* Location Search */}
      {/* <LocationSearchPanel onLocation={handleLocation} /> */}

      {/* Text Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t.searchCrop}
          className="w-full pl-9 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-700">
        {t.disclaimer}
      </div>

      {/* Price cards */}
      <div className="space-y-3">
        {filtered.map((item, i) => (
          <PriceCard key={item.crop} item={item} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">{t.noCropsFound} "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
