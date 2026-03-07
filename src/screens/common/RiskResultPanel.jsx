import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { getRiskColor } from "../../lib/colors";

export default function RiskResultPanel({ result, labels }) {
  const colors = getRiskColor(result.level);

  let LevelIcon = CheckCircle;

  if (result.level === "HIGH") {
    LevelIcon = XCircle;
  } else if (result.level === "MEDIUM") {
    LevelIcon = AlertTriangle;
  }

  return (
    <div className="space-y-4">
      {/* Risk Score */}
      <div className={`rounded-2xl p-5 ${colors.bg}`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">Risk Score</p>

            <p className={`text-4xl font-bold ${colors.text}`}>
              {result.score}/100
            </p>
          </div>

          <div className="flex items-center gap-2">
            <LevelIcon size={18} className={colors.text} />
            <span className={`font-semibold ${colors.text}`}>
              {result.level}
            </span>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="glass-card rounded-2xl p-5">
        <p className="text-xs text-muted-foreground mb-3">AI Insights</p>

        <div className="space-y-2">
          {result.aiExplanation.factors.map((factor, index) => (
            <div
              key={index}
              className="flex justify-between p-3 rounded-lg bg-muted"
            >
              <span className="text-sm">{factor.label}</span>

              <span className="font-semibold">{factor.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reasons */}
      {result.reasons.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs text-muted-foreground mb-3">Risk Factors</p>

          <ul className="space-y-2">
            {result.reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <ChevronRight size={14} className={colors.text} />

                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      <div className="glass-card rounded-2xl p-5">
        <p className="text-xs text-muted-foreground mb-3">Recommendations</p>

        <ul className="space-y-2">
          {result.recommendations.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-primary/10"
            >
              <CheckCircle size={14} className="text-primary" />

              <span className="text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
