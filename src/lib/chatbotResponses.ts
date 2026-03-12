import { getGeminiResponse } from "./geminiAI";

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

/*
RULE-BASED FARMING KNOWLEDGE
*/
const RESPONSE_RULES: ResponseRule[] = [
  {
    keywords: ["soil moisture", "soil wet", "wet soil", "moisture", "ஈரம்"],
    responses: [
      `🌱 **High Soil Moisture Alert**

If soil moisture > 85% there is risk of root rot.

**Immediate actions**
• Stop irrigation for 2–3 days  
• Open drainage channels  
• Inspect roots for fungal infection  
• Avoid fertilizer until soil dries

Rice tolerates higher moisture but cotton & chili cannot.`,
    ],
  },

  {
    keywords: ["rain", "rainfall", "flood", "heavy rain", "மழை"],
    responses: [
      `🌧️ **Heavy Rain Crop Protection**

When rainfall exceeds **130mm in 24 hours**:

• Open drainage channels immediately  
• Do NOT apply fertilizer  
• Harvest mature crops early  
• Take photos for crop insurance claims

Rice can tolerate flooding for 2–3 days, cotton cannot.`,
    ],
  },

  {
    keywords: ["pest", "insect", "bug", "fungus", "disease", "பூச்சி"],
    responses: [
      `🐛 **Pest Attack Control**

**Organic remedies**

🍃 Neem oil spray  
5ml neem oil + 1L water

🌶️ Garlic chili extract  
Boil garlic + chili and spray

🥛 Buttermilk spray prevents fungal diseases

Use chemical pesticide only if more than **30% crop affected**.`,
    ],
  },

  {
    keywords: ["fertilizer", "urea", "npk", "nutrient", "உரம்"],
    responses: [
      `🧪 **Smart Fertilizer Advice**

Do NOT apply fertilizer:

• 48 hours before rain  
• When soil moisture > 90%  
• During extreme heat  
• When field has standing water

Split fertilizer applications improve yield.`,
    ],
  },

  {
    keywords: ["rice", "paddy", "நெல்"],
    responses: [
      `🌾 **Rice Cultivation Basics**

1️⃣ Nursery preparation  
2️⃣ Transplant seedlings after 21 days  
3️⃣ Maintain 2–5cm water level  
4️⃣ Apply fertilizer in split doses  
5️⃣ Watch for stem borer & leaf folder pests

Harvest when **80% grains turn golden**.`,
    ],
  },

  {
    keywords: ["cotton", "பருத்தி"],
    responses: [
      `☁️ **Cotton Farming Tips**

• Best sowing: June–July  
• Spacing: 90 × 60 cm  
• Critical stage: flowering + boll formation  

**Major pest:** Pink bollworm  
Use pheromone traps (5 per acre).`,
    ],
  },

  {
    keywords: ["groundnut", "peanut", "கடலை"],
    responses: [
      `🥜 **Groundnut Cultivation Guide**

• Best soil: sandy loam  
• Seed treatment: Rhizobium culture  
• Critical irrigation: pegging stage  

Apply **gypsum 200kg/acre** during pegging stage.`,
    ],
  },

  {
    keywords: ["price", "market", "mandi", "sell", "விலை"],
    responses: [
      `💰 **Smart Crop Selling Strategy**

• Avoid selling immediately after harvest  
• Store crops for 1–3 months if possible  
• Track MSP before selling  

Use AgroShield **Mandi Dashboard** to check daily prices.`,
    ],
  },

  {
    keywords: ["insurance", "pmfby", "crop insurance"],
    responses: [
      `🛡️ **Crop Insurance (PMFBY)**

Covers:

• Flood  
• Drought  
• Pest attack  
• Cyclone damage

**Farmer premium**

• Kharif crops → 2%  
• Rabi crops → 1.5%

Report crop damage within **72 hours**.`,
    ],
  },

  {
    keywords: ["help", "guide", "advice", "what can you do"],
    responses: [
      `🌾 **I'm AgroShield AI**

I can help with:

🌧 Weather risk  
🐛 Pest attack  
🌾 Crop cultivation  
💰 Market prices  
🛡 Government schemes  
🧪 Fertilizer advice

Ask anything about your farm.`,
    ],
  },
];

/*
FALLBACK RESPONSES (if AI fails)
*/
const FALLBACK_RESPONSES = [
  `🌱 I need a little more information.

Please tell me:

• Crop name  
• Problem symptoms  
• Weather conditions

Then I can give better advice.`,

  `📊 You can also use AgroShield tools:

🌧 Rain Damage Predictor  
🐛 Pest Attack Predictor  
💰 Mandi Price Dashboard

Tell me your crop problem and I'll help!`,
];

let fallbackIndex = 0;

/*
MAIN CHATBOT LOGIC
*/
export async function getBotResponse(userMessage: string): Promise<string> {
  const lower = userMessage.toLowerCase();

  /*
  1️⃣ RULE ENGINE FIRST
  */

  for (const rule of RESPONSE_RULES) {
    if (rule.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      const responses = rule.responses;

      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  /*
  2️⃣ GEMINI AI FALLBACK
  */

  try {
    const aiResponse = await getGeminiResponse(userMessage);

    if (aiResponse && aiResponse.length > 10) {
      return aiResponse;
    }
  } catch (err) {
    console.error("Gemini error:", err);
  }

  /*
  3️⃣ STATIC FALLBACK
  */

  const response =
    FALLBACK_RESPONSES[fallbackIndex % FALLBACK_RESPONSES.length];

  fallbackIndex++;

  return response;
}

/*
GREETING MESSAGE
*/
export function getGreetingMessage(): ChatMessage {
  return {
    id: "greeting",
    role: "bot",
    text: `🌾 **Namaste! I'm AgroShield AI**

Your smart farming assistant.

You can ask me about:

• Crop cultivation  
• Pest control  
• Rain damage protection  
• Fertilizer usage  
• Crop prices  
• Government schemes

Example questions:

• "How to grow cotton?"  
• "My crop leaves are yellow"  
• "When should I sell groundnut?"`,
    timestamp: Date.now(),
  };
}
