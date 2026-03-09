export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface RiskResult {
  score: number;
  level: RiskLevel;
  reasons: string[];
  recommendations: string[];
  aiExplanation: {
    factors: { label: string; value: string; triggered: boolean }[];
  };
}

export interface RainInputs {
  rainfall: number;
  soilMoisture: number;
  windSpeed: number;
}

export interface PestInputs {
  temperature: number;
  humidity: number;
  soilMoisture: number;
}

export interface LocustInputs {
  windSpeed: number;
  nearbyLocust: boolean;
}

export type PredictorType = "rain" | "pest" | "locust";

export interface HistoryEntry {
  id: string;
  type: PredictorType;
  timestamp: number;
  inputs: RainInputs | PestInputs | LocustInputs;
  result: RiskResult;
}

export interface Language {
  code: "en" | "hi" | "ta";
  label: string;
}
