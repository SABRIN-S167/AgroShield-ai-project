import { useState } from "react";
import { MapPin, CloudRain } from "lucide-react";

const API_KEY = "b6d8273c385a12d57ded7f623b25f7c5";

export default function WeatherAutoFill({ onFill }) {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return;
    setError("");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
      );

      const data = await res.json();

      const result = {
        city: data.name,
        country: data.sys.country,
        rainfall: data.rain?.["1h"] || 0,
        humidity: data.main.humidity,
        temperature: Math.round(data.main.temp),
        windSpeed: Math.round(data.wind.speed * 3.6),
        description: data.weather[0].description,
      };

      setWeather(result);

      // fill data to parent
      onFill(result);
    } catch (err) {
      setError("Failed to fetch weather");
    }
  };

  return (
    <div className="border rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <CloudRain size={16} />
        <p className="font-semibold text-sm">Weather Auto Fill</p>
      </div>

      {/* Search */}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={fetchWeather}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Fetch
        </button>
      </div>
      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Result */}
      {weather && (
        <div className="border rounded-lg p-3 space-y-2">
          <p className="font-semibold">
            {weather.city}, {weather.country}
          </p>

          <p className="text-sm text-gray-500">{weather.description}</p>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <b>Rainfall:</b> {weather.rainfall} mm
            </div>

            <div>
              <b>Humidity:</b> {weather.humidity} %
            </div>

            <div>
              <b>Temperature:</b> {weather.temperature} °C
            </div>

            <div>
              <b>Wind:</b> {weather.windSpeed} km/h
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
