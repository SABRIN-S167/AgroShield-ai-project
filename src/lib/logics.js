export function calculateRainRisk(inputs) {
  const { rainfall, soilMoisture, windSpeed } = inputs;
  let score = 0;
  const reasons = [];
  const factors = [];

  if (rainfall > 130) {
    score += 60;
    reasons.push("Extreme rainfall detected (>130mm) – severe flood risk");
  } else if (rainfall > 90) {
    score += 40;
    reasons.push("Heavy rainfall (>90mm) – high waterlogging possibility");
  }
  factors.push({
    label: "Rainfall intensity",
    value: `${rainfall}mm`,
    triggered: rainfall > 90,
  });

  if (soilMoisture > 85) {
    score += 25;
    reasons.push("Soil saturation critical (>85%) – runoff risk elevated");
  }
  factors.push({
    label: "Soil saturation",
    value: `${soilMoisture}%`,
    triggered: soilMoisture > 85,
  });

  if (windSpeed > 50) {
    score += 15;
    reasons.push("High wind speed (>50 km/h) – crop lodging risk");
  }
  factors.push({
    label: "Wind speed",
    value: `${windSpeed} km/h`,
    triggered: windSpeed > 50,
  });

  score = Math.min(score, 100);
  const level = getRiskLevel(score);

  const recommendations =
    level === "HIGH"
      ? [
          "Improve field drainage immediately",
          "Protect crops from wind damage",
          "Monitor weather forecast closely",
        ]
      : level === "MEDIUM"
        ? ["Keep water channels clear", "Monitor soil moisture regularly"]
        : ["Normal crop monitoring sufficient"];

  return { score, level, reasons, recommendations, aiExplanation: { factors } };
}

function getRiskLevel(score) {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export function calculateLocustRisk(inputs) {
  const { windSpeed, nearbyLocust } = inputs;
  let score = 0;
  const reasons = [];
  const factors = [];

  if (windSpeed > 60) {
    score += 60;
    reasons.push(
      "Wind speed >60 km/h – enables long-distance locust migration",
    );
  }
  factors.push({
    label: "Wind speed",
    value: `${windSpeed} km/h`,
    triggered: windSpeed > 60,
  });

  if (nearbyLocust) {
    score += 40;
    reasons.push("Nearby locust activity confirmed – imminent swarm risk");
  }
  factors.push({
    label: "Nearby locust activity",
    value: nearbyLocust ? "Yes" : "No",
    triggered: nearbyLocust,
  });

  score = Math.min(score, 100);
  const level = getRiskLevel(score);

  const recommendations =
    level === "HIGH"
      ? [
          "Alert nearby farmers immediately",
          "Deploy protective crop nets",
          "Contact local agriculture office",
        ]
      : level === "MEDIUM"
        ? ["Monitor wind patterns closely", "Prepare alert systems"]
        : ["No immediate action required"];

  return { score, level, reasons, recommendations, aiExplanation: { factors } };
}



export function calculatePestRisk(inputs) {
  const { temperature, humidity, soilMoisture } = inputs;
  let score = 0;
  const reasons= [];
  const factors = [];

  if (humidity > 90) {
    score += 50;
    reasons.push("Very high humidity (>90%) – ideal for fungal & pest growth");
  }
  factors.push({
    label: "Humidity level",
    value: `${humidity}%`,
    triggered: humidity > 90,
  });

  if (temperature > 35) {
    score += 30;
    reasons.push("High temperature (>35°C) – accelerates pest breeding cycle");
  }
  factors.push({
    label: "Temperature",
    value: `${temperature}°C`,
    triggered: temperature > 35,
  });

  if (soilMoisture > 80) {
    score += 20;
    reasons.push("Moist soil (>80%) – increases root-pest vulnerability");
  }
  factors.push({
    label: "Soil moisture",
    value: `${soilMoisture}%`,
    triggered: soilMoisture > 80,
  });

  score = Math.min(score, 100);
  const level = getRiskLevel(score);

  const recommendations =
    level === "HIGH"
      ? [
          "Apply organic pesticide immediately",
          "Inspect crop leaves for infestation signs",
        ]
      : level === "MEDIUM"
        ? ["Monitor pest activity daily", "Prepare organic spray as precaution"]
        : ["Normal crop monitoring sufficient"];

  return { score, level, reasons, recommendations, aiExplanation: { factors } };
}