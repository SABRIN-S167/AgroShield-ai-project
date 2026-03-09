import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INDIA_DISTRICTS } from "@/lib/districts";
import { I18N } from "@/lib/i18n";
import { useLang } from "@/context/LangContext";

export interface LocationWeatherData {
  city: string;
  rainfall: number;
  humidity: number;
  temperature: number;
  windSpeed: number;
}

interface LocationSearchPanelProps {
  onLocation: (data: LocationWeatherData) => void;
  /** Optional status message from parent */
  statusMsg?: string;
}

const ALL_CITIES: string[] = Object.values(INDIA_DISTRICTS).flat() as string[];

const DEMO_DATA: Record<string, Omit<LocationWeatherData, "city">> = {
  chennai:        { rainfall: 12, windSpeed: 22, humidity: 88, temperature: 32 },
  coimbatore:     { rainfall:  5, windSpeed: 18, humidity: 72, temperature: 29 },
  madurai:        { rainfall:  0, windSpeed: 25, humidity: 65, temperature: 35 },
  thanjavur:      { rainfall: 18, windSpeed: 15, humidity: 82, temperature: 31 },
  salem:          { rainfall:  8, windSpeed: 20, humidity: 78, temperature: 33 },
  mumbai:         { rainfall: 45, windSpeed: 35, humidity: 92, temperature: 32 },
  delhi:          { rainfall:  2, windSpeed: 15, humidity: 55, temperature: 38 },
  pune:           { rainfall: 20, windSpeed: 18, humidity: 75, temperature: 28 },
  kolkata:        { rainfall: 35, windSpeed: 40, humidity: 85, temperature: 33 },
  bengaluru:      { rainfall: 22, windSpeed: 18, humidity: 78, temperature: 26 },
  hyderabad:      { rainfall: 15, windSpeed: 20, humidity: 70, temperature: 36 },
  ahmedabad:      { rainfall:  5, windSpeed: 30, humidity: 58, temperature: 40 },
  jaipur:         { rainfall:  0, windSpeed: 35, humidity: 45, temperature: 42 },
  lucknow:        { rainfall: 28, windSpeed: 18, humidity: 80, temperature: 31 },
  patna:          { rainfall: 52, windSpeed: 45, humidity: 86, temperature: 29 },
  bhopal:         { rainfall: 18, windSpeed: 22, humidity: 72, temperature: 30 },
  visakhapatnam:  { rainfall: 30, windSpeed: 28, humidity: 82, temperature: 31 },
  nagpur:         { rainfall: 25, windSpeed: 22, humidity: 74, temperature: 34 },
  thiruvananthapuram: { rainfall: 55, windSpeed: 20, humidity: 88, temperature: 30 },
  kochi:          { rainfall: 60, windSpeed: 22, humidity: 90, temperature: 29 },
  amritsar:       { rainfall:  5, windSpeed: 20, humidity: 60, temperature: 36 },
  chandigarh:     { rainfall:  8, windSpeed: 18, humidity: 62, temperature: 34 },
};

function getDemoData(query: string): LocationWeatherData {
  const key = query.toLowerCase().trim();
  const found = Object.keys(DEMO_DATA).find(k => key.includes(k) || k.includes(key));
  const base = found ? DEMO_DATA[found] : null;
  if (base) return { city: query, ...base };
  // Deterministic seed for unknown places
  const hash = query.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return {
    city: query,
    rainfall:    (hash * 7) % 120,
    humidity:    60 + (hash % 35),
    temperature: 24 + (hash % 18),
    windSpeed:   10 + (hash % 45),
  };
}

async function fetchByCity(city: string, apiKey: string): Promise<LocationWeatherData> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&appid=${apiKey}&units=metric`
  );
  if (!res.ok) throw new Error("City not found");
  const d = await res.json();
  return {
    city: d.name,
    rainfall:    Math.round((d.rain?.["1h"] ?? 0) * 10),
    windSpeed:   Math.round((d.wind?.speed ?? 0) * 3.6),
    humidity:    d.main.humidity,
    temperature: Math.round(d.main.temp),
  };
}

async function fetchByCoords(lat: number, lon: number, apiKey: string): Promise<LocationWeatherData> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  if (!res.ok) throw new Error("API error");
  const d = await res.json();
  return {
    city: d.name,
    rainfall:    Math.round((d.rain?.["1h"] ?? 0) * 10),
    windSpeed:   Math.round((d.wind?.speed ?? 0) * 3.6),
    humidity:    d.main.humidity,
    temperature: Math.round(d.main.temp),
  };
}

export default function LocationSearchPanel({ onLocation }: LocationSearchPanelProps) {
  const { lang } = useLang();
  const t = I18N[lang];

  const [searchMode, setSearchMode] = useState<"city" | "pincode" | "gps">("city");
  const [cityQuery, setCityQuery]     = useState("");
  const [pincodeQuery, setPincodeQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading]         = useState(false);
  const [msg, setMsg]                 = useState("");

  const apiKey = localStorage.getItem("owm_api_key") ?? "";

  const handleCityInput = (val: string) => {
    setCityQuery(val);
    if (val.length >= 2) {
      const q = val.toLowerCase();
      setSuggestions(ALL_CITIES.filter(c => c.toLowerCase().includes(q)).slice(0, 8));
    } else {
      setSuggestions([]);
    }
  };

  const applyData = (data: LocationWeatherData, demo: boolean) => {
    onLocation(data);
    setMsg(demo
      ? `${t.demoLoaded} ${data.city} ${t.demoHint}`
      : `${t.weatherLoaded} ${data.city}`);
  };

  const fetchLocation = async (city: string) => {
    setLoading(true);
    setMsg(t.fetchingWeather);
    setSuggestions([]);
    try {
      if (apiKey) {
        const data = await fetchByCity(city, apiKey);
        applyData(data, false);
      } else {
        applyData(getDemoData(city), true);
      }
    } catch {
      applyData(getDemoData(city), true);
    }
    setLoading(false);
  };

  const fetchPincode = async () => {
    if (pincodeQuery.length !== 6) return;
    setLoading(true);
    setMsg(t.lookupPincode);
    try {
      const res  = await fetch(`https://api.postalpincode.in/pincode/${pincodeQuery}`);
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        const place = data[0].PostOffice?.[0];
        const city  = place?.District || place?.Name || pincodeQuery;
        await fetchLocation(city);
      } else {
        setMsg(t.pincodeNotFound);
      }
    } catch {
      setMsg(t.pincodeFailed);
    }
    setLoading(false);
  };

  const fetchGPS = () => {
    setLoading(true);
    setMsg(t.gettingLocation);
    if (!navigator.geolocation) {
      setMsg(t.gpsNotSupported);
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          if (apiKey) {
            const data = await fetchByCoords(latitude, longitude, apiKey);
            applyData(data, false);
          } else {
            applyData(getDemoData(`GPS (${latitude.toFixed(2)}°N)`), true);
          }
        } catch {
          applyData(getDemoData("Chennai"), true);
        }
        setLoading(false);
      },
      () => { setMsg(t.locationDenied); setLoading(false); },
      { timeout: 8000 }
    );
  };

  const isSuccess = msg.startsWith("✅");

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MapPin size={15} className="text-primary" />
        <h3 className="font-semibold text-sm">{t.searchLocation}</h3>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-1 bg-muted/40 rounded-xl p-1">
        {([
          ["city",    t.cityTab],
          ["pincode", t.pincodeTab],
          ["gps",     t.gpsTab],
        ] as const).map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => setSearchMode(mode)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              searchMode === mode
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* City Search */}
      {searchMode === "city" && (
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={cityQuery}
                onChange={e => handleCityInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && cityQuery && fetchLocation(cityQuery)}
                placeholder={t.cityPlaceholder}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <Button
              onClick={() => cityQuery && fetchLocation(cityQuery)}
              disabled={loading || !cityQuery}
              size="sm"
              className="rounded-xl px-4 bg-primary text-primary-foreground shrink-0"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : t.fetch}
            </Button>
          </div>
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
              >
                {suggestions.map(s => (
                  <button
                    key={s}
                    onMouseDown={() => { setCityQuery(s); setSuggestions([]); fetchLocation(s); }}
                    className="w-full px-4 py-2.5 text-sm text-left hover:bg-muted/50 flex items-center gap-2 transition-colors"
                  >
                    <MapPin size={12} className="text-muted-foreground shrink-0" />
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Pincode */}
      {searchMode === "pincode" && (
        <div className="flex gap-2">
          <input
            value={pincodeQuery}
            onChange={e => setPincodeQuery(e.target.value.replace(/\D/g, "").slice(0, 6))}
            onKeyDown={e => e.key === "Enter" && fetchPincode()}
            placeholder={t.enterPincode}
            className="flex-1 px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
          <Button
            onClick={fetchPincode}
            disabled={loading || pincodeQuery.length !== 6}
            size="sm"
            className="rounded-xl px-4 bg-primary text-primary-foreground shrink-0"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : t.lookup}
          </Button>
        </div>
      )}

      {/* GPS */}
      {searchMode === "gps" && (
        <Button
          onClick={fetchGPS}
          disabled={loading}
          className="w-full rounded-xl bg-primary text-primary-foreground"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> {t.gettingLocation}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Navigation size={14} /> {t.useMyLocation}
            </span>
          )}
        </Button>
      )}

      {/* Status */}
      {msg && (
        <p className={`text-xs font-medium ${isSuccess ? "text-emerald-600" : "text-destructive"}`}>
          {msg}
        </p>
      )}
    </div>
  );
}
