import { useState } from "react";
import { Bug } from "lucide-react";
import { calculatePestRisk } from "../../lib/logics";
import RiskResultPanel from "../common/RiskResultPanel";
import WeatherAutoFill from "../common/WeatherAutoFill";

export default function PestPredictor() {
  const [inputs, setInputs] = useState({
    temperature: 28,
    humidity: 70,
    soilMoisture: 60,
  });

  const [result, setResult] = useState(null);

  const handleWeatherFill = (data) => {
    setInputs((prev) => ({
      ...prev,
      temperature: data.temperature,
      humidity: data.humidity,
    }));

    setResult(null);
  };

  const handleAnalyze = () => {
    const res = calculatePestRisk(inputs);

    setResult(res);
  };

  return (
    <div className="space-y-6">
      <WeatherAutoFill onFill={handleWeatherFill} />

      <div className="glass-card rounded-2xl p-6 space-y-6">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
            <Bug size={20} className="text-orange-500" />
          </div>

          <div>
            <h2 className="font-bold text-lg">Pest Attack</h2>
            <p className="text-xs text-muted-foreground">Predictor</p>
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-sm">Temperature (°C)</label>

            <span className="text-sm font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded-lg">
              {inputs.temperature}°C
            </span>
          </div>

          <input
            type="range"
            min="10"
            max="50"
            step="1"
            value={inputs.temperature}
            onChange={(e) =>
              setInputs({ ...inputs, temperature: Number(e.target.value) })
            }
            className="w-full h-2 rounded-lg bg-gray-200 accent-red-500 cursor-pointer"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10°C</span>
            <span>30°C</span>
            <span>50°C</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-sm">Humidity (%)</label>

            <span className="text-sm font-bold text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-lg">
              {inputs.humidity}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={inputs.humidity}
            onChange={(e) =>
              setInputs({ ...inputs, humidity: Number(e.target.value) })
            }
            className="w-full h-2 rounded-lg bg-gray-200 accent-cyan-500 cursor-pointer"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-sm">Soil Moisture (%)</label>

            <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg">
              {inputs.soilMoisture}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={inputs.soilMoisture}
            onChange={(e) =>
              setInputs({
                ...inputs,
                soilMoisture: Number(e.target.value),
              })
            }
            className="w-full h-2 rounded-lg bg-gray-200 accent-emerald-500 cursor-pointer"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          className="w-full h-12 rounded-xl font-bold text-base bg-linear-to-r from-orange-500 to-red-500 text-white hover:opacity-90 transition"
        >
          Analyze
        </button>
      </div>

      {result && <RiskResultPanel result={result} />}
    </div>
  );
}
