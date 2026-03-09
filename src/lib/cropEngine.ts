import type { RainInputs, PestInputs, LocustInputs, RiskResult, RiskLevel } from "./types";

export interface CropProfile {
  id: string;
  name: string;
  emoji: string;
  // Overridden thresholds
  rain: { heavyRainfallThreshold: number; floodThreshold: number; soilMoistureThreshold: number; windThreshold: number };
  pest: { humidityThreshold: number; temperatureThreshold: number; soilMoistureThreshold: number };
  locust: { windThreshold: number };
}

export const CROPS: CropProfile[] = [
  {
    id: "rice",
    name: "Rice",
    emoji: "🌾",
    rain: { floodThreshold: 150, heavyRainfallThreshold: 100, soilMoistureThreshold: 90, windThreshold: 45 },
    pest: { humidityThreshold: 85, temperatureThreshold: 32, soilMoistureThreshold: 75 },
    locust: { windThreshold: 55 },
  },
  {
    id: "maize",
    name: "Maize",
    emoji: "🌽",
    rain: { floodThreshold: 120, heavyRainfallThreshold: 80, soilMoistureThreshold: 80, windThreshold: 40 },
    pest: { humidityThreshold: 80, temperatureThreshold: 33, soilMoistureThreshold: 70 },
    locust: { windThreshold: 50 },
  },
  {
    id: "cotton",
    name: "Cotton",
    emoji: "🌿",
    rain: { floodThreshold: 100, heavyRainfallThreshold: 70, soilMoistureThreshold: 75, windThreshold: 35 },
    pest: { humidityThreshold: 85, temperatureThreshold: 36, soilMoistureThreshold: 65 },
    locust: { windThreshold: 50 },
  },
  {
    id: "potato",
    name: "Potato",
    emoji: "🥔",
    rain: { floodThreshold: 90, heavyRainfallThreshold: 60, soilMoistureThreshold: 70, windThreshold: 35 },
    pest: { humidityThreshold: 80, temperatureThreshold: 28, soilMoistureThreshold: 70 },
    locust: { windThreshold: 60 },
  },
  {
    id: "chili",
    name: "Chili",
    emoji: "🌶️",
    rain: { floodThreshold: 80, heavyRainfallThreshold: 55, soilMoistureThreshold: 65, windThreshold: 30 },
    pest: { humidityThreshold: 75, temperatureThreshold: 30, soilMoistureThreshold: 60 },
    locust: { windThreshold: 55 },
  },
];

function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export function calculateCropRainRisk(inputs: RainInputs, crop: CropProfile): RiskResult {
  const { rainfall, soilMoisture, windSpeed } = inputs;
  const { floodThreshold, heavyRainfallThreshold, soilMoistureThreshold, windThreshold } = crop.rain;
  let score = 0;
  const reasons: string[] = [];
  const factors = [];

  if (rainfall > floodThreshold) {
    score += 60;
    reasons.push(`Extreme rainfall (>${floodThreshold}mm) – severe flood risk for ${crop.name}`);
  } else if (rainfall > heavyRainfallThreshold) {
    score += 40;
    reasons.push(`Heavy rainfall (>${heavyRainfallThreshold}mm) – waterlogging risk for ${crop.name}`);
  }
  factors.push({ label: "Rainfall intensity", value: `${rainfall}mm`, triggered: rainfall > heavyRainfallThreshold });

  if (soilMoisture > soilMoistureThreshold) {
    score += 25;
    reasons.push(`Soil saturation critical (>${soilMoistureThreshold}%) – ${crop.name} root stress`);
  }
  factors.push({ label: "Soil saturation", value: `${soilMoisture}%`, triggered: soilMoisture > soilMoistureThreshold });

  if (windSpeed > windThreshold) {
    score += 15;
    reasons.push(`High wind (>${windThreshold} km/h) – ${crop.name} lodging risk`);
  }
  factors.push({ label: "Wind speed", value: `${windSpeed} km/h`, triggered: windSpeed > windThreshold });

  score = Math.min(score, 100);
  const level = getRiskLevel(score);
  const recommendations =
    level === "HIGH"
      ? [`Improve ${crop.name} field drainage immediately`, "Protect crops from wind damage", "Monitor weather forecast closely"]
      : level === "MEDIUM"
      ? ["Keep water channels clear", "Monitor soil moisture regularly"]
      : ["Normal crop monitoring sufficient"];

  return { score, level, reasons, recommendations, aiExplanation: { factors } };
}

export function calculateCropPestRisk(inputs: PestInputs, crop: CropProfile): RiskResult {
  const { temperature, humidity, soilMoisture } = inputs;
  const { humidityThreshold, temperatureThreshold, soilMoistureThreshold } = crop.pest;
  let score = 0;
  const reasons: string[] = [];
  const factors = [];

  if (humidity > humidityThreshold) {
    score += 50;
    reasons.push(`High humidity (>${humidityThreshold}%) – ideal fungal conditions for ${crop.name}`);
  }
  factors.push({ label: "Humidity level", value: `${humidity}%`, triggered: humidity > humidityThreshold });

  if (temperature > temperatureThreshold) {
    score += 30;
    reasons.push(`High temperature (>${temperatureThreshold}°C) – accelerates pest breeding on ${crop.name}`);
  }
  factors.push({ label: "Temperature", value: `${temperature}°C`, triggered: temperature > temperatureThreshold });

  if (soilMoisture > soilMoistureThreshold) {
    score += 20;
    reasons.push(`Moist soil (>${soilMoistureThreshold}%) – increases root-pest vulnerability in ${crop.name}`);
  }
  factors.push({ label: "Soil moisture", value: `${soilMoisture}%`, triggered: soilMoisture > soilMoistureThreshold });

  score = Math.min(score, 100);
  const level = getRiskLevel(score);
  const recommendations =
    level === "HIGH"
      ? [`Apply organic pesticide for ${crop.name} immediately`, "Inspect crop leaves for infestation signs"]
      : level === "MEDIUM"
      ? ["Monitor pest activity daily", "Prepare organic spray as precaution"]
      : ["Normal crop monitoring sufficient"];

  return { score, level, reasons, recommendations, aiExplanation: { factors } };
}
