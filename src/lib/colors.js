export function getRiskColor(level) {
  switch (level) {
    case "HIGH":
      return {
        text: "text-risk-high",
        bg: "bg-risk-high-bg",
        gradient: "bg-risk-gradient-high",
        hex: "#ef4444",
      };
    case "MEDIUM":
      return {
        text: "text-risk-medium",
        bg: "bg-risk-medium-bg",
        gradient: "bg-risk-gradient-medium",
        hex: "#f59e0b",
      };
    default:
      return {
        text: "text-risk-low",
        bg: "bg-risk-low-bg",
        gradient: "bg-risk-gradient-low",
        hex: "#16a34a",
      };
  }
}
