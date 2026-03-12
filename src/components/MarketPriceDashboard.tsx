import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  ShoppingCart,
  Info,
} from "lucide-react";

import { getMarketPrices, type MandiPrice } from "@/lib/marketPrices";
import { I18N } from "@/lib/i18n";
import { useLang } from "@/context/LangContext";

function TrendBadge({
  trend,
  pct,
}: {
  trend: MandiPrice["trend"];
  pct: number;
}) {
  if (trend === "up")
    return (
      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
        <TrendingUp size={11} /> +{pct}%
      </span>
    );

  if (trend === "down")
    return (
      <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-500/10 px-2 py-0.5 rounded-lg">
        <TrendingDown size={11} /> {pct}%
      </span>
    );

  return (
    <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">
      <Minus size={11} /> {pct}%
    </span>
  );
}

function PriceCard({ item }: { item: MandiPrice }) {
  const [showAdvice, setShowAdvice] = useState(false);

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <span className="text-2xl">{item.emoji}</span>

          <div>
            <div className="flex gap-2 items-center">
              <h3 className="font-bold text-sm">{item.crop}</h3>
              <TrendBadge trend={item.trend} pct={item.trendPct} />
            </div>

            <p className="text-xs text-muted-foreground">
              {item.market}, {item.state}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold">
            ₹{item.currentPrice.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-muted-foreground">/{item.unit}</p>
        </div>
      </div>

      <div className="mt-3 flex justify-between text-xs">
        <div className="flex gap-3">
          <span>
            Low: <b>₹{item.minPrice}</b>
          </span>
          <span>
            High: <b>₹{item.maxPrice}</b>
          </span>
        </div>

        <button
          onClick={() => setShowAdvice(!showAdvice)}
          className="text-primary flex items-center gap-1"
        >
          <Info size={11} /> Advice
        </button>
      </div>

      {showAdvice && (
        <div className="mt-3 bg-primary/5 rounded-lg px-3 py-2 text-xs">
          💡 {item.advice}
        </div>
      )}
    </div>
  );
}

export default function MarketPriceDashboard() {
  const { lang } = useLang();
  const t = I18N[lang];

  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadPrices() {
      try {
        const data = await getMarketPrices();
        setPrices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPrices();
  }, []);

  const filtered = useMemo(() => {
    return prices.filter(
      (p) =>
        p.crop.toLowerCase().includes(search.toLowerCase()) ||
        p.market.toLowerCase().includes(search.toLowerCase()),
    );
  }, [prices, search]);

  if (loading)
    return (
      <div className="text-center py-20 text-muted-foreground">
        Loading live mandi prices...
      </div>
    );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="hero-gradient rounded-3xl p-6 text-white">
        <h2 className="text-xl font-bold">{t.mandiTitle}</h2>
        <p className="text-xs text-white/70">{t.mandiDesc}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-3" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.searchCrop}
          className="w-full pl-8 pr-3 py-2 rounded-lg border"
        />
      </div>

      {/* Price cards */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <PriceCard key={item.crop + item.market} item={item} />
        ))}
      </div>
    </div>
  );
}
