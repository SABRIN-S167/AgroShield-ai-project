import { useState } from "react";
import { Wind, AlertOctagon } from "lucide-react";

import WeatherAutoFill from "../common/WeatherAutoFill";
import RiskResultPanel from "../common/RiskResultPanel";
import { calculateLocustRisk } from "../../lib/logics";

export default function LocustPredictor() {
  const [inputs, setInputs] = useState({
    windSpeed: 40,
    nearbyLocust: false,
  });

  const [result, setResult] = useState(null);

  const handleWeatherFill = (data) => {
    setInputs((prev) => ({
      ...prev,
      windSpeed: data.windSpeed,
    }));

    setResult(null);
  };

  const handleAnalyze = () => {
    const res = calculateLocustRisk(inputs);

    setResult(res);
  };

  return (
    <div className="space-y-6">
      <WeatherAutoFill onFill={handleWeatherFill} />

      <div className="glass-card rounded-2xl p-6 space-y-6">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center">
            <AlertOctagon size={20} className="text-yellow-500" />
          </div>

          <div>
            <h2 className="font-bold text-lg">Locust Movement</h2>
            <p className="text-xs text-muted-foreground">Predictor</p>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-sm flex items-center gap-1.5">
              <Wind size={14} /> Wind Speed (km/h)
            </label>

            <span className="text-sm font-bold text-orange-400 bg-orange-400/10 px-3 py-1 rounded-lg">
              {inputs.windSpeed} km/h
            </span>
          </div>

          {/* Slider */}
          <input
            type="range"
            min="0"
            max="120"
            step="1"
            value={inputs.windSpeed}
            onChange={(e) =>
              setInputs({ ...inputs, windSpeed: Number(e.target.value) })
            }
            className="w-full h-2 rounded-lg bg-gray-200 accent-orange-400 cursor-pointer"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>60</span>
            <span>120</span>
          </div>
        </div>

        {/* Nearby Locust Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border">
          <div>
            <label className="font-semibold text-sm block">
              Nearby Locust Activity
            </label>

            <p className="text-xs text-muted-foreground mt-0.5">
              Confirmed sighting within 50km
            </p>
          </div>

          {/* Simple Toggle */}
          <input
            type="checkbox"
            checked={inputs.nearbyLocust}
            onChange={(e) =>
              setInputs({ ...inputs, nearbyLocust: e.target.checked })
            }
            className="w-5 h-5 accent-yellow-500 cursor-pointer"
          />
        </div>

        {/* Warning */}
        {inputs.nearbyLocust && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-500 text-sm font-medium">
            <AlertOctagon size={15} />
            Locust activity detected nearby — risk elevated
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          className="w-full h-12 rounded-xl font-bold text-base bg-linear-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90 transition"
        >
          Analyze
        </button>
      </div>

      {result && <RiskResultPanel result={result} />}
    </div>
  );
}
