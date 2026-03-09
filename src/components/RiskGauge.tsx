import { motion } from "framer-motion";
import { getRiskColor } from "@/lib/riskEngine";
import type { RiskLevel } from "@/lib/types";

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

export default function RiskGauge({ score, level, size = 180 }: RiskGaugeProps) {
  const colors = getRiskColor(level);
  const radius = (size / 2) * 0.8;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = -210;
  const endAngle = 30;
  const totalAngle = endAngle - startAngle;
  const circumference = (Math.PI * radius * 2 * Math.abs(totalAngle)) / 360;
  const filledLength = (score / 100) * circumference;

  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const arcPath = (startA: number, endA: number) => {
    const s = polarToCartesian(startA);
    const e = polarToCartesian(endA);
    const large = Math.abs(endA - startA) > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const strokeWidth = size * 0.07;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.75} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <path
          d={arcPath(startAngle, endAngle)}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <motion.path
          d={arcPath(startAngle, endAngle)}
          fill="none"
          stroke={colors.hex}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filledLength }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${colors.hex}88)` }}
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy + 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.2}
          fontWeight="700"
          fill={colors.hex}
          fontFamily="Space Grotesk, sans-serif"
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + size * 0.14}
          textAnchor="middle"
          fontSize={size * 0.065}
          fill="hsl(var(--muted-foreground))"
          fontFamily="Inter, sans-serif"
        >
          / 100
        </text>
      </svg>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wider ${colors.bg} ${colors.text}`}
      >
        {level} RISK
      </motion.span>
    </div>
  );
}
