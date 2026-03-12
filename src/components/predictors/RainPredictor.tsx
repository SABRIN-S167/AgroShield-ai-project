import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronDown, MapPin, Search, Navigation } from "lucide-react";
import { Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateRainRisk, saveToHistory } from "@/lib/riskEngine";
import { I18N } from "@/lib/i18n";
import { calculateCropRainRisk, CROPS } from "@/lib/cropEngine";
import type { RainInputs, RiskResult } from "@/lib/types";
import RiskResultPanel from "@/components/RiskResultPanel";
import { useLang } from "@/context/LangContext";
import { INDIA_DISTRICTS } from "@/lib/districts";

const ALL_CITIES: string[] = Object.values(INDIA_DISTRICTS).flat() as string[];

async function fetchByCoords(lat: number, lon: number, apiKey: string) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
  );
  if (!res.ok) throw new Error("API error");
  const d = await res.json();
  return {
    rainfall: Math.round((d.rain?.["1h"] ?? 0) * 10),
    windSpeed: Math.round((d.wind?.speed ?? 0) * 3.6),
    humidity: d.main.humidity,
    city: d.name,
  };
}

async function fetchByCity(city: string, apiKey: string) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&appid=${apiKey}&units=metric`,
  );
  if (!res.ok) throw new Error("City not found");
  const d = await res.json();
  return {
    rainfall: Math.round((d.rain?.["1h"] ?? 0) * 10),
    windSpeed: Math.round((d.wind?.speed ?? 0) * 3.6),
    humidity: d.main.humidity,
    city: d.name,
  };
}


export default function RainPredictor() {
  const { lang } = useLang();
  const t = I18N[lang];

  const [inputs, setInputs] = useState<RainInputs>({
    rainfall: 60,
    soilMoisture: 60,
    windSpeed: 30,
  });
  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState<string>("generic");
  const [showCropMenu, setShowCropMenu] = useState(false);

  // Location search
  const [locationQuery, setLocationQuery] = useState("");
  const [pincodeQuery, setPincodeQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMsg, setLocationMsg] = useState("");
  const [searchMode, setSearchMode] = useState<"city" | "pincode" | "gps">(
    "city",
  );

  const selectedCrop = CROPS.find((c) => c.id === selectedCropId);

  const handleCityInput = (val: string) => {
    setLocationQuery(val);
    if (val.length >= 2) {
      const matches = ALL_CITIES.filter((c) =>
        c.toLowerCase().includes(val.toLowerCase()),
      ).slice(0, 8);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const applyWeather = (
    data: { rainfall: number; windSpeed: number; humidity?: number },
    city: string,
  ) => {
    setInputs((prev) => ({
      ...prev,
      rainfall: Math.max(0, Math.min(200, data.rainfall)),
      windSpeed: Math.max(0, Math.min(120, data.windSpeed)),
      soilMoisture: data.humidity
        ? Math.max(0, Math.min(100, Math.round(data.humidity * 0.9)))
        : prev.soilMoisture,
    }));
    setLocationMsg(`✅ Weather loaded for ${city}`);
    setResult(null);
  };

  const fetchByLocation = async (city: string) => {
    setLocationLoading(true);
    setLocationMsg("Fetching weather...");
    setSuggestions([]);
    const apiKey = "b6d8273c385a12d57ded7f623b25f7c5";
    if (apiKey) {
      const data = await fetchByCity(city, apiKey);
      applyWeather(data, data.city);
    }
    setLocationLoading(false);
  };

  const fetchByPincode = async () => {
    if (!pincodeQuery || pincodeQuery.length !== 6) return;
    setLocationLoading(true);
    setLocationMsg("Looking up pincode...");
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincodeQuery}`,
      );
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        const place = data[0].PostOffice?.[0];
        const city = place?.District || place?.Name || pincodeQuery;
        await fetchByLocation(city);
      } else {
        setLocationMsg("❌ Pincode not found");
      }
    } catch {
      setLocationMsg("❌ Pincode lookup failed");
    }
    setLocationLoading(false);
  };

  const fetchGPS = async () => {
    setLocationLoading(true);
    setLocationMsg("Getting GPS location...");
    if (!navigator.geolocation) {
      setLocationMsg("❌ GPS not supported on this device");
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const apiKey = "b6d8273c385a12d57ded7f623b25f7c5";
        if (apiKey) {
          const data = await fetchByCoords(latitude, longitude, apiKey);
          applyWeather(data, data.city);
        }
        setLocationLoading(false);
      },
      () => {
        setLocationMsg("❌ Location access denied");
        setLocationLoading(false);
      },
      { timeout: 8000 },
    );
  };

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      const res = selectedCrop
        ? calculateCropRainRisk(inputs, selectedCrop)
        : calculateRainRisk(inputs);
      setResult(res);
      saveToHistory({
        type: "rain",
        timestamp: Date.now(),
        inputs,
        result: res,
      });
      setLoading(false);
    }, 900);
  };

  return (
    <div className="space-y-5">
      {/* Location Search Panel */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <MapPin size={15} className="text-primary" />
          <h3 className="font-semibold text-sm">{t.searchLocation}</h3>
        </div>

        {/* Mode tabs */}
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

        {searchMode === "city" && (
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  value={locationQuery}
                  onChange={(e) => handleCityInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    locationQuery &&
                    fetchByLocation(locationQuery)
                  }
                  placeholder={t.cityPlaceholder}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
              <Button
                onClick={() => locationQuery && fetchByLocation(locationQuery)}
                disabled={locationLoading || !locationQuery}
                className="rounded-xl px-4 bg-primary text-primary-foreground"
                size="sm"
              >
                {locationLoading ? (
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
                      onClick={() => {
                        setLocationQuery(s);
                        fetchByLocation(s);
                      }}
                      className="w-full px-4 py-2.5 text-sm text-left hover:bg-muted/50 flex items-center gap-2"
                    >
                      <MapPin size={12} className="text-muted-foreground" /> {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {searchMode === "pincode" && (
          <div className="flex gap-2">
            <input
              value={pincodeQuery}
              onChange={(e) =>
                setPincodeQuery(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              onKeyDown={(e) => e.key === "Enter" && fetchByPincode()}
              placeholder={t.enterPincode}
              className="flex-1 px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-primary/50"
            />
            <Button
              onClick={fetchByPincode}
              disabled={locationLoading || pincodeQuery.length !== 6}
              className="rounded-xl px-4 bg-primary text-primary-foreground"
              size="sm"
            >
              {locationLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                t.lookup
              )}
            </Button>
          </div>
        )}

        {searchMode === "gps" && (
          <Button
            onClick={fetchGPS}
            disabled={locationLoading}
            className="w-full rounded-xl bg-primary text-primary-foreground"
          >
            {locationLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />{" "}
                {t.gettingLocation}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Navigation size={14} /> {t.useMyLocation}
              </span>
            )}
          </Button>
        )}

        {locationMsg && (
          <p
            className={`text-xs font-medium ${locationMsg.startsWith("✅") ? "text-emerald-600" : "text-destructive"}`}
          >
            {locationMsg}
          </p>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Droplets size={20} className="text-blue-500" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-foreground">
                {t.rainPredictor}
              </h2>
              <p className="text-xs text-muted-foreground">
                Adjust sliders or use location search above
              </p>
            </div>
          </div>

          {/* Crop Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCropMenu((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 border border-border text-sm font-medium hover:border-primary/40 transition-colors"
            >
              <span>
                {selectedCrop
                  ? `${selectedCrop.emoji} ${selectedCrop.name}`
                  : "🌱 Generic"}
              </span>
              <ChevronDown size={13} className="text-muted-foreground" />
            </button>
            <AnimatePresence>
              {showCropMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[140px]"
                >
                  <button
                    onClick={() => {
                      setSelectedCropId("generic");
                      setShowCropMenu(false);
                      setResult(null);
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-muted/50 transition-colors"
                  >
                    🌱 Generic
                  </button>
                  {CROPS.map((crop) => (
                    <button
                      key={crop.id}
                      onClick={() => {
                        setSelectedCropId(crop.id);
                        setShowCropMenu(false);
                        setResult(null);
                      }}
                      className={`w-full px-3 py-2 text-sm text-left hover:bg-muted/50 transition-colors ${selectedCropId === crop.id ? "bg-primary/10 text-primary font-semibold" : ""}`}
                    >
                      {crop.emoji} {crop.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {selectedCrop && (
          <div className="rounded-xl bg-primary/5 border border-primary/15 px-3 py-2 text-xs text-primary/80 font-medium">
            🎯 Risk thresholds adjusted for <strong>{selectedCrop.name}</strong>
            {" — "}flood at {selectedCrop.rain.floodThreshold}mm, soil moisture
            at {selectedCrop.rain.soilMoistureThreshold}%
          </div>
        )}

        {/* Rainfall */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="font-semibold text-sm">{t.rainfall}</Label>
            <span className="text-sm font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-lg">
              {inputs.rainfall} mm
            </span>
          </div>
          <Slider
            min={0}
            max={200}
            step={1}
            value={[inputs.rainfall]}
            onValueChange={([v]) => setInputs((p) => ({ ...p, rainfall: v }))}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0mm</span>
            <span>100mm</span>
            <span>200mm</span>
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="font-semibold text-sm">{t.soilMoisture}</Label>
            <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg">
              {inputs.soilMoisture}%
            </span>
          </div>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[inputs.soilMoisture]}
            onValueChange={([v]) =>
              setInputs((p) => ({ ...p, soilMoisture: v }))
            }
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="font-semibold text-sm">{t.windSpeed}</Label>
            <span className="text-sm font-bold text-orange-400 bg-orange-400/10 px-3 py-1 rounded-lg">
              {inputs.windSpeed} km/h
            </span>
          </div>
          <Slider
            min={0}
            max={120}
            step={1}
            value={[inputs.windSpeed]}
            onValueChange={([v]) => setInputs((p) => ({ ...p, windSpeed: v }))}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>60</span>
            <span>120</span>
          </div>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full h-12 rounded-xl font-bold text-base bg-hero-gradient text-white hover:opacity-90 transition-opacity"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Analyzing...
            </span>
          ) : (
            t.analyze
          )}
        </Button>
      </div>

      <AnimatePresence>
        {result && <RiskResultPanel result={result} labels={t} />}
      </AnimatePresence>
    </div>
  );
}
