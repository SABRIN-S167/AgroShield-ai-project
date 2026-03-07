import { useState } from "react";
import { Droplets } from "lucide-react";
import WeatherAutoFill from "../common/WeatherAutoFill";
import { calculateRainRisk } from "../../lib/logics";
import RiskResultPanel from "../common/RiskResultPanel";

export default function RainPredictor() {
  const [inputs, setInputs] = useState({
    rainfall: 60,
    soilMoisture: 60,
    windSpeed: 30,
  });

  const [result, setResult] = useState(null);

  const handleWeatherFill = (data) => {
    setInputs({
      ...inputs,
      rainfall: data.rainfall,
      windSpeed: data.windSpeed,
    });

    setResult(null);
  };

  const handleAnalyze = () => {
    const risk = calculateRainRisk(inputs);

    setResult(risk);
  };

  return (
    <div className="space-y-6">
      <WeatherAutoFill onFill={handleWeatherFill} />

      <div className="rounded-2xl p-6 space-y-6 bg-white shadow-sm border">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Droplets size={20} className="text-blue-500" />
          </div>

          <div>
            <h2 className="font-bold text-lg">Rain Damage</h2>
            <p className="text-xs text-gray-500">Predictor</p>
          </div>
        </div>

        {/* Rainfall */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="font-medium">Rainfall (mm)</label>
            <span className="text-blue-500 font-bold">
              {inputs.rainfall} mm
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="200"
            value={inputs.rainfall}
            onChange={(e) =>
              setInputs({ ...inputs, rainfall: Number(e.target.value) })
            }
            className="w-full h-2 rounded-lg bg-gray-200 accent-blue-500 cursor-pointer"
          />
        </div>

        {/* Soil Moisture */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="font-medium">Soil Moisture (%)</label>
            <span className="text-emerald-500 font-bold">
              {inputs.soilMoisture}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={inputs.soilMoisture}
            onChange={(e) =>
              setInputs({ ...inputs, soilMoisture: Number(e.target.value) })
            }
            className="w-full h-2 rounded-lg bg-gray-200 accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Wind Speed */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="font-medium">Wind Speed (km/h)</label>
            <span className="text-orange-500 font-bold">
              {inputs.windSpeed} km/h
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="120"
            value={inputs.windSpeed}
            onChange={(e) =>
              setInputs({ ...inputs, windSpeed: Number(e.target.value) })
            }
            className="w-full h-2 rounded-lg bg-gray-200 accent-orange-500 cursor-pointer"
          />
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          className="w-full h-12 rounded-xl font-bold bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Analyze
        </button>
      </div>

      {result && <RiskResultPanel result={result} />}
    </div>
  );
}
