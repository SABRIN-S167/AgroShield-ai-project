import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, Brain, ChevronRight } from "lucide-react";
import type { RiskResult } from "@/lib/types";
import { getRiskColor } from "@/lib/riskEngine";
import RiskGauge from "./RiskGauge";

interface RiskResultPanelProps {
  result: RiskResult;
  labels: { riskScore: string; riskLevel: string; recommendations: string; aiInsights: string; reasons: string };
}

export default function RiskResultPanel({ result, labels }: RiskResultPanelProps) {
  const colors = getRiskColor(result.level);

  const LevelIcon = result.level === "HIGH" ? XCircle : result.level === "MEDIUM" ? AlertTriangle : CheckCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      {/* Gauge */}
      <div className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3">
        <h3 className="font-display font-semibold text-foreground/80 text-sm uppercase tracking-widest">
          {labels.riskScore}
        </h3>
        <RiskGauge score={result.score} level={result.level} />
      </div>

      {/* AI Factors */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain size={18} className="text-primary" />
          <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-foreground/80">
            {labels.aiInsights}
          </h3>
        </div>
        <div className="space-y-3">
          {result.aiExplanation.factors.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                f.triggered ? `${colors.bg} border border-current/20` : "bg-muted/50"
              }`}
            >
              <span className={`text-sm font-medium ${f.triggered ? colors.text : "text-muted-foreground"}`}>
                {f.label}
              </span>
              <span
                className={`text-sm font-bold px-2 py-0.5 rounded-lg ${
                  f.triggered ? `${colors.text} bg-current/10` : "text-muted-foreground"
                }`}
              >
                {f.value}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Reasons */}
      {result.reasons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <LevelIcon size={18} className={colors.text} />
            <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-foreground/80">
              {labels.reasons}
            </h3>
          </div>
          <ul className="space-y-2">
            {result.reasons.map((r, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i + 0.4 }}
                className="flex items-start gap-2 text-sm text-foreground/80"
              >
                <ChevronRight size={14} className={`mt-0.5 shrink-0 ${colors.text}`} />
                {r}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-foreground/80 mb-3">
          {labels.recommendations}
        </h3>
        <ul className="space-y-2">
          {result.recommendations.map((rec, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i + 0.5 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-primary/8 border border-primary/15 text-sm font-medium text-foreground"
            >
              <CheckCircle size={15} className="text-primary shrink-0" />
              {rec}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
