import type {
  RiskLevel,
  RiskResult,
  RainInputs,
  PestInputs,
  LocustInputs,
  HistoryEntry,
  PredictorType,
} from "./types";

function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export function calculateRainRisk(inputs: RainInputs): RiskResult {
  const { rainfall, soilMoisture, windSpeed } = inputs;
  let score = 0;
  const reasons: string[] = [];
  const factors = [];

  if (rainfall > 130) {
    score += 60;
    reasons.push("Extreme rainfall detected (>130mm) – severe flood risk");
  } else if (rainfall > 90) {
    score += 40;
    reasons.push("Heavy rainfall (>90mm) – high waterlogging possibility");
  }
  factors.push({
    label: "Rainfall intensity",
    value: `${rainfall}mm`,
    triggered: rainfall > 90,
  });

  if (soilMoisture > 85) {
    score += 25;
    reasons.push("Soil saturation critical (>85%) – runoff risk elevated");
  }
  factors.push({
    label: "Soil saturation",
    value: `${soilMoisture}%`,
    triggered: soilMoisture > 85,
  });

  if (windSpeed > 50) {
    score += 15;
    reasons.push("High wind speed (>50 km/h) – crop lodging risk");
  }
  factors.push({
    label: "Wind speed",
    value: `${windSpeed} km/h`,
    triggered: windSpeed > 50,
  });

  score = Math.min(score, 100);
  const level = getRiskLevel(score);

  const recommendations =
    level === "HIGH"
      ? ["Improve field drainage immediately", "Protect crops from wind damage", "Monitor weather forecast closely"]
      : level === "MEDIUM"
      ? ["Keep water channels clear", "Monitor soil moisture regularly"]
      : ["Normal crop monitoring sufficient"];

  return { score, level, reasons, recommendations, aiExplanation: { factors } };
}

export function calculatePestRisk(inputs: PestInputs): RiskResult {
  const { temperature, humidity, soilMoisture } = inputs;
  let score = 0;
  const reasons: string[] = [];
  const factors = [];

  if (humidity > 90) {
    score += 50;
    reasons.push("Very high humidity (>90%) – ideal for fungal & pest growth");
  }
  factors.push({
    label: "Humidity level",
    value: `${humidity}%`,
    triggered: humidity > 90,
  });

  if (temperature > 35) {
    score += 30;
    reasons.push("High temperature (>35°C) – accelerates pest breeding cycle");
  }
  factors.push({
    label: "Temperature",
    value: `${temperature}°C`,
    triggered: temperature > 35,
  });

  if (soilMoisture > 80) {
    score += 20;
    reasons.push("Moist soil (>80%) – increases root-pest vulnerability");
  }
  factors.push({
    label: "Soil moisture",
    value: `${soilMoisture}%`,
    triggered: soilMoisture > 80,
  });

  score = Math.min(score, 100);
  const level = getRiskLevel(score);

  const recommendations =
    level === "HIGH"
      ? ["Apply organic pesticide immediately", "Inspect crop leaves for infestation signs"]
      : level === "MEDIUM"
      ? ["Monitor pest activity daily", "Prepare organic spray as precaution"]
      : ["Normal crop monitoring sufficient"];

  return { score, level, reasons, recommendations, aiExplanation: { factors } };
}

export function calculateLocustRisk(inputs: LocustInputs): RiskResult {
  const { windSpeed, nearbyLocust } = inputs;
  let score = 0;
  const reasons: string[] = [];
  const factors = [];

  if (windSpeed > 60) {
    score += 60;
    reasons.push("Wind speed >60 km/h – enables long-distance locust migration");
  }
  factors.push({
    label: "Wind speed",
    value: `${windSpeed} km/h`,
    triggered: windSpeed > 60,
  });

  if (nearbyLocust) {
    score += 40;
    reasons.push("Nearby locust activity confirmed – imminent swarm risk");
  }
  factors.push({
    label: "Nearby locust activity",
    value: nearbyLocust ? "Yes" : "No",
    triggered: nearbyLocust,
  });

  score = Math.min(score, 100);
  const level = getRiskLevel(score);

  const recommendations =
    level === "HIGH"
      ? ["Alert nearby farmers immediately", "Deploy protective crop nets", "Contact local agriculture office"]
      : level === "MEDIUM"
      ? ["Monitor wind patterns closely", "Prepare alert systems"]
      : ["No immediate action required"];

  return { score, level, reasons, recommendations, aiExplanation: { factors } };
}

const HISTORY_KEY = "agroshield_history";

export function saveToHistory(entry: Omit<HistoryEntry, "id">): void {
  const history = getHistory();
  const newEntry: HistoryEntry = { ...entry, id: crypto.randomUUID() };
  const updated = [newEntry, ...history].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function getHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function getRiskColor(level: RiskLevel) {
  switch (level) {
    case "HIGH":
      return { text: "text-risk-high", bg: "bg-risk-high-bg", gradient: "bg-risk-gradient-high", hex: "#ef4444" };
    case "MEDIUM":
      return { text: "text-risk-medium", bg: "bg-risk-medium-bg", gradient: "bg-risk-gradient-medium", hex: "#f59e0b" };
    default:
      return { text: "text-risk-low", bg: "bg-risk-low-bg", gradient: "bg-risk-gradient-low", hex: "#16a34a" };
  }
}

export const LABELS = {
  en: {
    title: "AgroShield AI",
    subtitle: "Smart Crop Risk Intelligence",
    dashboard: "Dashboard",
    rainPredictor: "Rain Damage",
    pestPredictor: "Pest Attack",
    locustPredictor: "Locust Movement",
    simulator: "What-If Simulator",
    heatmap: "District Heatmap",
    chatbot: "AI Advisor",
    history: "Risk History",
    riskScore: "Risk Score",
    riskLevel: "Risk Level",
    recommendations: "Recommendations",
    aiInsights: "AI Insights",
    reasons: "Risk Factors",
    analyze: "Analyze Risk",
    low: "LOW RISK",
    medium: "MEDIUM RISK",
    high: "HIGH RISK",
  },
  hi: {
    title: "एग्रोशील्ड AI",
    subtitle: "स्मार्ट फसल जोखिम विश्लेषण",
    dashboard: "डैशबोर्ड",
    rainPredictor: "वर्षा क्षति",
    pestPredictor: "कीट हमला",
    locustPredictor: "टिड्डी आंदोलन",
    simulator: "क्या-अगर सिमुलेटर",
    heatmap: "जिला हीटमैप",
    chatbot: "AI सलाहकार",
    history: "जोखिम इतिहास",
    riskScore: "जोखिम स्कोर",
    riskLevel: "जोखिम स्तर",
    recommendations: "सुझाव",
    aiInsights: "AI अंतर्दृष्टि",
    reasons: "जोखिम कारण",
    analyze: "जोखिम विश्लेषण करें",
    low: "कम जोखिम",
    medium: "मध्यम जोखिम",
    high: "उच्च जोखिम",
  },
  ta: {
    title: "அக்ரோஷீல்ட் AI",
    subtitle: "ஸ்மார்ட் பயிர் அபாய நுண்ணறிவு",
    dashboard: "டாஷ்போர்டு",
    rainPredictor: "மழை சேதம்",
    pestPredictor: "பூச்சி தாக்குதல்",
    locustPredictor: "வெட்டுக்கிளி இயக்கம்",
    simulator: "என்ன-ஆனால் சிமுலேட்டர்",
    heatmap: "மாவட்ட வெப்ப வரைபடம்",
    chatbot: "AI ஆலோசகர்",
    history: "அபாய வரலாறு",
    riskScore: "அபாய மதிப்பெண்",
    riskLevel: "அபாய நிலை",
    recommendations: "பரிந்துரைகள்",
    aiInsights: "AI நுண்ணறிவு",
    reasons: "அபாய காரணங்கள்",
    analyze: "அபாயத்தை பகுப்பாய்வு செய்",
    low: "குறைந்த அபாயம்",
    medium: "நடுத்தர அபாயம்",
    high: "அதிக அபாயம்",
  },
} as const;

export type LangCode = keyof typeof LABELS;
