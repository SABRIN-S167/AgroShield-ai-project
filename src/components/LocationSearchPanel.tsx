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

async function fetchByCity(
  city: string,
  apiKey: string,
): Promise<LocationWeatherData> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&appid=${apiKey}&units=metric`,
  );
  if (!res.ok) throw new Error("City not found");
  const d = await res.json();
  return {
    city: d.name,
    rainfall: Math.round((d.rain?.["1h"] ?? 0) * 10),
    windSpeed: Math.round((d.wind?.speed ?? 0) * 3.6),
    humidity: d.main.humidity,
    temperature: Math.round(d.main.temp),
  };
}

async function fetchByCoords(
  lat: number,
  lon: number,
  apiKey: string,
): Promise<LocationWeatherData> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
  );
  if (!res.ok) throw new Error("API error");
  const d = await res.json();
  return {
    city: d.name,
    rainfall: Math.round((d.rain?.["1h"] ?? 0) * 10),
    windSpeed: Math.round((d.wind?.speed ?? 0) * 3.6),
    humidity: d.main.humidity,
    temperature: Math.round(d.main.temp),
  };
}

export default function LocationSearchPanel({
  onLocation,
}: LocationSearchPanelProps) {
  const { lang } = useLang();
  const t = I18N[lang];

  const [searchMode, setSearchMode] = useState<"city" | "pincode" | "gps">(
    "city",
  );
  const [cityQuery, setCityQuery] = useState("");
  const [pincodeQuery, setPincodeQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const apiKey = "b6d8273c385a12d57ded7f623b25f7c5";

  const handleCityInput = (val: string) => {
    setCityQuery(val);
    if (val.length >= 2) {
      const q = val.toLowerCase();
      setSuggestions(
        ALL_CITIES.filter((c) => c.toLowerCase().includes(q)).slice(0, 8),
      );
    } else {
      setSuggestions([]);
    }
  };

  const applyData = (data: LocationWeatherData, demo: boolean) => {
    onLocation(data);
  };

  const fetchLocation = async (city: string) => {
    setLoading(true);
    setMsg(t.fetchingWeather);
    setSuggestions([]);

    try {
      if (apiKey) {
        const data = await fetchByCity(city, apiKey);
        applyData(data, false);

        // ✅ success message
        setMsg(`✅ Weather loaded for ${data.city}`);
      }
    } catch (err) {
      setMsg("❌ Failed to fetch weather");
    }

    setLoading(false);
  };

  const fetchPincode = async () => {
    if (pincodeQuery.length !== 6) return;
    setLoading(true);
    setMsg(t.lookupPincode);
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincodeQuery}`,
      );
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        const place = data[0].PostOffice?.[0];
        const city = place?.District || place?.Name || pincodeQuery;
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
        if (apiKey) {
          const data = await fetchByCoords(latitude, longitude, apiKey);
          applyData(data, false);
          setMsg(`✅ Weather loaded for ${data.city}`);
          setLoading(false);
        }
      },
      () => {
        setMsg(t.locationDenied);
        setLoading(false);
      },
      { timeout: 8000 },
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
        {(
          [
            ["city", t.cityTab],
            ["pincode", t.pincodeTab],
            ["gps", t.gpsTab],
          ] as const
        ).map(([mode, label]) => (
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
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={cityQuery}
                onChange={(e) => handleCityInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && cityQuery && fetchLocation(cityQuery)
                }
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
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                t.fetch
              )}
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
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onMouseDown={() => {
                      setCityQuery(s);
                      setSuggestions([]);
                      fetchLocation(s);
                    }}
                    className="w-full px-4 py-2.5 text-sm text-left hover:bg-muted/50 flex items-center gap-2 transition-colors"
                  >
                    <MapPin
                      size={12}
                      className="text-muted-foreground shrink-0"
                    />
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
            onChange={(e) =>
              setPincodeQuery(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            onKeyDown={(e) => e.key === "Enter" && fetchPincode()}
            placeholder={t.enterPincode}
            className="flex-1 px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
          <Button
            onClick={fetchPincode}
            disabled={loading || pincodeQuery.length !== 6}
            size="sm"
            className="rounded-xl px-4 bg-primary text-primary-foreground shrink-0"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              t.lookup
            )}
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
        <p
          className={`text-xs font-medium ${isSuccess ? "text-emerald-600" : "text-destructive"}`}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
