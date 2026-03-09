import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, Trash2, Droplets, Bug, AlertOctagon, Clock } from "lucide-react";
import { getHistory, clearHistory, getRiskColor } from "@/lib/riskEngine";
import type { HistoryEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";

const typeConfig = {
  rain: { label: "Rain Damage", icon: Droplets, color: "text-blue-500", bg: "bg-blue-500/10" },
  pest: { label: "Pest Attack", icon: Bug, color: "text-orange-500", bg: "bg-orange-500/10" },
  locust: { label: "Locust Movement", icon: AlertOctagon, color: "text-yellow-500", bg: "bg-yellow-500/10" },
};

export default function RiskHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setEntries([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={18} className="text-primary" />
          <h2 className="font-display font-bold text-lg">Risk History</h2>
        </div>
        {entries.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear} className="text-destructive border-destructive/30 hover:bg-destructive/10">
            <Trash2 size={14} className="mr-1" /> Clear
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 flex flex-col items-center gap-3 text-muted-foreground">
          <History size={40} className="opacity-30" />
          <p className="text-sm">No predictions yet. Run a predictor to see history.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, i) => {
            const cfg = typeConfig[entry.type];
            const Icon = cfg.icon;
            const colors = getRiskColor(entry.result.level);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-4 flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={18} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm">{cfg.label}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                      {entry.result.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock size={11} />
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className={`text-2xl font-display font-black ${colors.text}`}>
                  {entry.result.score}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
