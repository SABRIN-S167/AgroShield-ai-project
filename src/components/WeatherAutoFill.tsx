import { useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  CloudRain,
  Loader2,
  CheckCircle,
  AlertCircle,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ALL_DISTRICTS } from "@/lib/districts";

export interface WeatherData {
  city: string;
  country: string;
  rainfall: number;
  humidity: number;
  temperature: number;
  windSpeed: number;
  description: string;
  icon: string;
}

interface WeatherAutoFillProps {
  onFill: (data: WeatherData) => void;
}

const apiKey = "b6d8273c385a12d57ded7f623b25f7c5";

async function fetchWeatherFromAPI(
  city: string,
  apiKey: string,
): Promise<WeatherData> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `City not found (${response.status})`);
  }
  const d = await response.json();
  return {
    city: d.name,
    country: d.sys.country,
    rainfall: Math.round((d.rain?.["1h"] || 0) * 10) / 10,
    humidity: d.main.humidity,
    temperature: Math.round(d.main.temp),
    windSpeed: Math.round(d.wind.speed * 3.6),
    description: d.weather[0]?.description || "",
    icon:
      d.weather[0]?.main === "Rain"
        ? "🌧️"
        : d.weather[0]?.main === "Thunderstorm"
          ? "⛈️"
          : d.weather[0]?.main === "Drizzle"
            ? "🌦️"
            : d.weather[0]?.main === "Clouds"
              ? "⛅"
              : "☀️",
  };
}

export default function WeatherAutoFill({ onFill }: WeatherAutoFillProps) {
  const [city, setCity] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usedDemo, setUsedDemo] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    if (!city.trim() || city.length < 2) return [];
    const q = city.toLowerCase();
    const matches: { label: string; sub: string }[] = [];
    // District list first
    for (const { district, state } of ALL_DISTRICTS) {
      if (district.toLowerCase().includes(q)) {
        matches.push({ label: district, sub: state });
        if (matches.length >= 6) break;
      }
    }

    return matches.slice(0, 6);
  }, [city]);

  const handleFetch = useCallback(
    async (overrideCity?: string) => {
      const q = overrideCity || city.trim();
      if (!q) return;
      setLoading(true);
      setError(null);
      setResult(null);
      setShowSuggestions(false);

      try {
        let data: WeatherData | null = null;
        let demo = false;

        if (apiKey.trim()) {
          data = await fetchWeatherFromAPI(q, apiKey.trim());
        }

        setResult(data);
        setUsedDemo(demo);
        onFill(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch weather",
        );
      } finally {
        setLoading(false);
      }
    },
    [city, apiKey, onFill],
  );

  const handleSelectSuggestion = (label: string) => {
    setCity(label);
    setShowSuggestions(false);
    handleFetch(label);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleFetch();
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
            <CloudRain size={14} className="text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            Weather Auto-Fill
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground font-medium">
            {apiKey ? "Live API" : "Demo"}
          </span>
        </div>
        <button
          onClick={() => setShowKeyInput((v) => !v)}
          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
        >
          <Key size={12} />
          {apiKey ? "Change Key" : "Add API Key"}
        </button>
      </div>

      {/* City Search with Autocomplete */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search district or city..."
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="pl-8 text-sm"
            />
          </div>
          <Button
            onClick={() => handleFetch()}
            disabled={loading || !city.trim()}
            size="sm"
            className="shrink-0 bg-primary text-primary-foreground"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Fetch"}
          </Button>
        </div>

        {/* Autocomplete dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute top-full left-0 right-0 z-50 mt-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
            >
              {suggestions.map(({ label, sub }) => (
                <button
                  key={label + sub}
                  onMouseDown={() => handleSelectSuggestion(label)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/50 transition-colors text-sm text-left"
                >
                  <MapPin
                    size={11}
                    className="text-muted-foreground shrink-0"
                  />
                  <span className="font-medium text-foreground">{label}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {sub}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs"
          >
            <AlertCircle size={13} className="mt-0.5 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-background rounded-xl p-3 border border-primary/20 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{result.icon}</span>
                <div>
                  <p className="text-sm font-bold">
                    {result.city}, {result.country}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {result.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                <CheckCircle size={13} />
                {usedDemo ? "Demo data" : "Live data"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  label: "Rainfall",
                  value: `${result.rainfall}mm`,
                  color: "text-blue-500",
                  bg: "bg-blue-500/8",
                },
                {
                  label: "Humidity",
                  value: `${result.humidity}%`,
                  color: "text-cyan-500",
                  bg: "bg-cyan-500/8",
                },
                {
                  label: "Temperature",
                  value: `${result.temperature}°C`,
                  color: "text-red-500",
                  bg: "bg-red-500/8",
                },
                {
                  label: "Wind",
                  value: `${result.windSpeed} km/h`,
                  color: "text-orange-400",
                  bg: "bg-orange-400/8",
                },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`rounded-lg px-3 py-2 ${bg}`}>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className={`text-sm font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-primary/70 font-medium flex items-center gap-1">
              <CheckCircle size={11} />
              Fields auto-filled below ↓
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!apiKey && !result && (
        <p className="text-xs text-muted-foreground">
          Type any Indian district or city name for simulated weather data.
        </p>
      )}
    </div>
  );
}
