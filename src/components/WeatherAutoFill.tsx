import { useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CloudRain, Loader2, CheckCircle, AlertCircle, Key, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const DEMO_CITIES: Record<string, WeatherData> = {
  mumbai: { city: "Mumbai", country: "IN", rainfall: 112, humidity: 88, temperature: 32, windSpeed: 38, description: "heavy rain", icon: "🌧️" },
  delhi: { city: "Delhi", country: "IN", rainfall: 8, humidity: 65, temperature: 38, windSpeed: 22, description: "haze", icon: "🌤️" },
  chennai: { city: "Chennai", country: "IN", rainfall: 45, humidity: 92, temperature: 34, windSpeed: 28, description: "moderate rain", icon: "🌦️" },
  bengaluru: { city: "Bengaluru", country: "IN", rainfall: 22, humidity: 78, temperature: 26, windSpeed: 18, description: "light rain", icon: "🌧️" },
  kolkata: { city: "Kolkata", country: "IN", rainfall: 68, humidity: 85, temperature: 33, windSpeed: 42, description: "heavy shower", icon: "⛈️" },
  pune: { city: "Pune", country: "IN", rainfall: 35, humidity: 75, temperature: 28, windSpeed: 25, description: "moderate rain", icon: "🌦️" },
  hyderabad: { city: "Hyderabad", country: "IN", rainfall: 15, humidity: 70, temperature: 36, windSpeed: 20, description: "partly cloudy", icon: "⛅" },
  ahmedabad: { city: "Ahmedabad", country: "IN", rainfall: 5, humidity: 58, temperature: 40, windSpeed: 30, description: "sunny", icon: "☀️" },
  jaipur: { city: "Jaipur", country: "IN", rainfall: 0, humidity: 45, temperature: 42, windSpeed: 35, description: "hot & dry", icon: "☀️" },
  lucknow: { city: "Lucknow", country: "IN", rainfall: 28, humidity: 80, temperature: 31, windSpeed: 18, description: "drizzle", icon: "🌦️" },
  patna: { city: "Patna", country: "IN", rainfall: 52, humidity: 86, temperature: 29, windSpeed: 45, description: "heavy rain", icon: "🌧️" },
  bhopal: { city: "Bhopal", country: "IN", rainfall: 18, humidity: 72, temperature: 30, windSpeed: 22, description: "light rain", icon: "🌦️" },
  // Tamil Nadu districts demo
  thanjavur: { city: "Thanjavur", country: "IN", rainfall: 78, humidity: 90, temperature: 31, windSpeed: 24, description: "moderate rain", icon: "🌦️" },
  coimbatore: { city: "Coimbatore", country: "IN", rainfall: 35, humidity: 82, temperature: 29, windSpeed: 20, description: "light rain", icon: "🌦️" },
  madurai: { city: "Madurai", country: "IN", rainfall: 12, humidity: 71, temperature: 35, windSpeed: 18, description: "partly cloudy", icon: "⛅" },
  salem: { city: "Salem", country: "IN", rainfall: 22, humidity: 76, temperature: 33, windSpeed: 16, description: "cloudy", icon: "⛅" },
  tiruchirappalli: { city: "Tiruchirappalli", country: "IN", rainfall: 40, humidity: 85, temperature: 32, windSpeed: 22, description: "moderate rain", icon: "🌦️" },
  vellore: { city: "Vellore", country: "IN", rainfall: 18, humidity: 73, temperature: 34, windSpeed: 19, description: "partly cloudy", icon: "⛅" },
};

const API_KEY_STORAGE = "owm_api_key";

async function fetchWeatherFromAPI(city: string, apiKey: string): Promise<WeatherData> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
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
    icon: d.weather[0]?.main === "Rain" ? "🌧️"
      : d.weather[0]?.main === "Thunderstorm" ? "⛈️"
      : d.weather[0]?.main === "Drizzle" ? "🌦️"
      : d.weather[0]?.main === "Clouds" ? "⛅"
      : "☀️",
  };
}

function getDemoWeather(city: string): WeatherData | null {
  const key = city.toLowerCase().trim();
  return DEMO_CITIES[key] || null;
}

export default function WeatherAutoFill({ onFill }: WeatherAutoFillProps) {
  const [city, setCity] = useState("");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || "");
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
    // Demo cities fallback
    if (matches.length < 6) {
      Object.values(DEMO_CITIES).forEach(c => {
        if (c.city.toLowerCase().includes(q) && !matches.find(m => m.label === c.city)) {
          matches.push({ label: c.city, sub: c.country });
        }
      });
    }
    return matches.slice(0, 6);
  }, [city]);

  const handleSaveKey = () => {
    localStorage.setItem(API_KEY_STORAGE, apiKey);
    setShowKeyInput(false);
  };

  const handleFetch = useCallback(async (overrideCity?: string) => {
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
      } else {
        data = getDemoWeather(q);
        demo = true;
        if (!data) {
          // Generate plausible demo data from district name seed
          const hash = q.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
          data = {
            city: q,
            country: "IN",
            rainfall: (hash * 7) % 120,
            humidity: 60 + (hash % 35),
            temperature: 24 + (hash % 18),
            windSpeed: 10 + (hash % 45),
            description: "simulated data",
            icon: hash % 3 === 0 ? "🌧️" : hash % 3 === 1 ? "⛅" : "☀️",
          };
        }
      }

      setResult(data);
      setUsedDemo(demo);
      onFill(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  }, [city, apiKey, onFill]);

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
          <span className="text-sm font-semibold text-foreground">Weather Auto-Fill</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground font-medium">
            {apiKey ? "Live API" : "Demo"}
          </span>
        </div>
        <button
          onClick={() => setShowKeyInput(v => !v)}
          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
        >
          <Key size={12} />
          {apiKey ? "Change Key" : "Add API Key"}
        </button>
      </div>

      {/* API Key Input */}
      <AnimatePresence>
        {showKeyInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-background rounded-xl p-3 border border-border space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                OpenWeatherMap API Key{" "}
                <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  (Get free key)
                </a>
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showKey ? "text" : "password"}
                    placeholder="Enter your API key..."
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    className="text-sm pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <Button size="sm" onClick={handleSaveKey} className="shrink-0">Save</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Without a key, simulated data for any Indian district/city is used.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* City Search with Autocomplete */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search district or city..."
              value={city}
              onChange={e => { setCity(e.target.value); setShowSuggestions(true); }}
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
                  <MapPin size={11} className="text-muted-foreground shrink-0" />
                  <span className="font-medium text-foreground">{label}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{sub}</span>
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
                  <p className="text-sm font-bold">{result.city}, {result.country}</p>
                  <p className="text-xs text-muted-foreground capitalize">{result.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                <CheckCircle size={13} />
                {usedDemo ? "Demo data" : "Live data"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Rainfall", value: `${result.rainfall}mm`, color: "text-blue-500", bg: "bg-blue-500/8" },
                { label: "Humidity", value: `${result.humidity}%`, color: "text-cyan-500", bg: "bg-cyan-500/8" },
                { label: "Temperature", value: `${result.temperature}°C`, color: "text-red-500", bg: "bg-red-500/8" },
                { label: "Wind", value: `${result.windSpeed} km/h`, color: "text-orange-400", bg: "bg-orange-400/8" },
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
