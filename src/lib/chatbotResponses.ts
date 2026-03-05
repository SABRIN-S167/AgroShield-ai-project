export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: number;
}

interface ResponseRule {
  keywords: string[];
  responses: string[];
}

const RESPONSE_RULES: ResponseRule[] = [
  {
    keywords: ["soil moisture", "soil wet", "wet soil", "moisture", "मिट्टी नमी", "மண் ஈரப்பதம்"],
    responses: [
      "🌱 **High soil moisture detected.**\n\nIf moisture exceeds 85%, your crops face root rot and waterlogging risk.\n\n**Recommended actions:**\n• Improve field drainage channels\n• Avoid irrigation for 2–3 days\n• Check for fungal symptoms on roots\n• Monitor weather for incoming rain",
      "💧 **Soil moisture above safe levels** signals reduced oxygen in the root zone.\n\nFor rice: tolerates up to 90%. For cotton or chili: act immediately above 70%.\n\n→ Create raised bed channels to drain excess water.",
    ],
  },
  {
    keywords: ["rain", "rainfall", "flood", "water", "बारिश", "மழை", "heavy rain"],
    responses: [
      "🌧️ **Heavy rainfall advisory:**\n\nWhen rainfall exceeds 130mm, flood risk becomes critical.\n\n**Steps to protect your crops:**\n1. Open all drainage outlets immediately\n2. Apply mulch to prevent soil erosion\n3. Avoid applying fertilizer before rain\n4. Document field conditions for insurance\n\n→ Use AgroShield's **Rain Predictor** for precise risk scoring.",
      "🌊 **Flood risk management:**\n\nElevated soil moisture + high rainfall = critical waterlogging. Consider:\n• Temporary bunds around high-value crops\n• Harvesting early if crop is near maturity\n• Contacting local agriculture office for relief",
    ],
  },
  {
    keywords: ["pest", "insect", "bug", "infestation", "कीट", "பூச்சி", "fungal", "disease"],
    responses: [
      "🐛 **Pest risk alert:**\n\nWhen humidity exceeds 90% and temperature is above 35°C, pest breeding cycles accelerate rapidly.\n\n**Organic remedies:**\n• Neem oil spray (5ml/litre water)\n• Chilli-garlic extract spray\n• Trichogramma egg parasitoids for borers\n• Pheromone traps for moths\n\n→ Run the **Pest Predictor** for exact risk levels.",
      "🍃 **Integrated Pest Management tips:**\n\nFor immediate infestation:\n1. Inspect crop undersides for egg masses\n2. Remove and destroy affected leaves\n3. Apply Bacillus thuringiensis (Bt) spray\n4. Introduce predatory insects like ladybirds",
    ],
  },
  {
    keywords: ["locust", "टिड्डी", "வெட்டுக்கிளி", "swarm", "locust swarm"],
    responses: [
      "🦗 **Locust threat protocol:**\n\nIf locust swarms are spotted within 50km:\n\n**Immediate actions:**\n1. Alert all neighboring farmers\n2. Deploy noise-making devices at dawn\n3. Install protective crop nets for high-value crops\n4. Contact District Agriculture Officer immediately\n5. Do NOT use chemical pesticides near water bodies\n\n→ Use the **Locust Predictor** to assess swarm risk.",
    ],
  },
  {
    keywords: ["temperature", "heat", "hot", "तापमान", "வெப்பநிலை", "drought", "dry"],
    responses: [
      "🌡️ **High temperature stress management:**\n\nAbove 40°C, most crops face heat stress:\n\n• Irrigate during early morning (5–7am) or evening\n• Apply kaolin clay spray to reflect sunlight\n• Use shade nets for horticulture crops\n• Avoid nitrogen fertilizer during heat waves\n\nFor cotton above 35°C: pest breeding accelerates — monitor weekly.",
    ],
  },
  {
    keywords: ["wind", "storm", "cyclone", "हवा", "காற்று"],
    responses: [
      "💨 **High wind advisory:**\n\nWind speeds above 50 km/h risk crop lodging (stems bending/breaking).\n\n**Protection measures:**\n• Install windbreakers or tree lines on farm borders\n• Stake tall crops like maize and banana\n• Harvest mature crops early if storm warning issued\n• Drain fields before wind event to prevent uprooting",
    ],
  },
  {
    keywords: ["fertilizer", "खाद", "உரம்", "nutrient", "nitrogen", "potassium"],
    responses: [
      "🧪 **Smart fertilizer timing:**\n\nNever apply fertilizer:\n• Within 48 hours of expected heavy rain (leaching risk)\n• During extreme heat (nutrient burn)\n• When soil moisture > 90% (runoff)\n\n**Best practice:** Apply urea in split doses — 50% basal + 50% at tillering stage for rice/wheat.",
    ],
  },
  {
    keywords: ["rice", "wheat", "cotton", "maize", "potato", "chili", "crop", "फसल", "பயிர்"],
    responses: [
      "🌾 **Crop-specific risk assessment:**\n\nAgroShield AI now supports **crop-aware risk analysis!**\n\nSelect your crop in any predictor module to get thresholds tuned for:\n• 🌾 Rice – flood & blast disease sensitive\n• 🌽 Maize – wind lodging sensitive\n• 🌿 Cotton – humidity & bollworm sensitive\n• 🥔 Potato – late blight & waterlogging\n• 🌶️ Chili – leaf curl virus & aphids\n\n→ Open any predictor and choose your crop from the dropdown!",
    ],
  },
  {
    keywords: ["help", "मदद", "உதவி", "what", "how", "क्या", "எப்படி", "advice", "suggest"],
    responses: [
      "👋 **I'm AgroShield AI Assistant!**\n\nI can help you with:\n• 🌧️ Rain & flood risk advice\n• 🐛 Pest & disease management\n• 🦗 Locust threat response\n• 🌡️ Temperature & drought tips\n• 🌾 Crop-specific recommendations\n• 💧 Soil moisture guidance\n\nTry asking: *\"My soil moisture is 90%, what should I do?\"* or *\"How do I protect rice from locusts?\"*",
    ],
  },
];

const FALLBACK_RESPONSES = [
  "🤔 I understand your concern. Based on typical agricultural conditions in India, I recommend:\n\n• Monitor your crops daily during monsoon season\n• Check AgroShield's risk predictors for data-driven analysis\n• Consult your local Krishi Vigyan Kendra (KVK) for region-specific advice\n\nCould you provide more details about the specific issue you're facing?",
  "📊 That's an important question for crop health. For the most accurate risk assessment:\n\n1. Use the **Rain Damage Predictor** for weather-related risks\n2. Use the **Pest Predictor** for biological threats\n3. Check the **Heatmap** for your district's current risk level\n\nWhat specific crop or risk are you concerned about?",
  "🌱 AgroShield AI is here to help! For personalized advice, try describing:\n• Your crop type\n• Current weather conditions\n• Visible symptoms (if any)\n\nOr use our predictors for an instant risk score!",
];

let responseIndex = 0;

export function getBotResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  for (const rule of RESPONSE_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      const responses = rule.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Fallback round-robin
  const response = FALLBACK_RESPONSES[responseIndex % FALLBACK_RESPONSES.length];
  responseIndex++;
  return response;
}

export function getGreetingMessage(): ChatMessage {
  return {
    id: "greeting",
    role: "bot",
    text: "🌾 **Namaste! I'm AgroShield AI Assistant.**\n\nI can help you with crop risk management, pest control, flood protection, and agricultural best practices.\n\nTry asking me:\n• *\"My soil moisture is 90%, what should I do?\"*\n• *\"How do I protect cotton from pests?\"*\n• *\"What to do during locust attack?\"*",
    timestamp: Date.now(),
  };
}
