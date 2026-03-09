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
    keywords: ["soil moisture", "soil wet", "wet soil", "moisture", "மண் ஈரப்பதம்", "मिट्टी नमी", "nami", "ஈரம்"],
    responses: [
      "🌱 **உங்கள் மண் அதிக ஈரமாக உள்ளது (High Soil Moisture)**\n\nமண் ஈரப்பதம் 85% மேல் இருந்தால் வேர் அழுகல் மற்றும் நீர்தேக்கம் ஆபத்து உள்ளது.\n\n**உடனடி நடவடிக்கைகள் / Immediate actions:**\n• வடிகால் கால்வாய்களை சரிபார்க்கவும்\n• 2–3 நாட்கள் நீர்ப்பாசனம் தவிர்க்கவும்\n• வேர்களில் பூஞ்சை அறிகுறி இருக்கிறதா என்று பரிசோதிக்கவும்\n• வரும் மழை வானிலை கண்காணிக்கவும்\n\n→ Rice tolerates up to 90%, but Cotton & Chili — act immediately above 70%.",
      "💧 **Soil is Too Wet — Root Health Alert!**\n\nWhen soil moisture exceeds 85%, oxygen gets cut off from roots, causing:\n• Root rot in cotton, chili, potato\n• Nitrogen leaching — wasting your fertilizer\n• Fungal diseases spreading fast\n\n**Fix it now:**\n1. Dig small drain trenches across the field\n2. Do NOT irrigate for 3 days\n3. Apply neem cake to prevent fungal spread\n4. Check crop leaves for yellowing (early rot sign)\n\n*Use AgroShield's Rain Predictor to check exact flood risk for your field.*",
    ],
  },
  {
    keywords: ["rain", "rainfall", "flood", "water", "மழை", "बारिश", "வெள்ளம்", "heavy rain", "baarish"],
    responses: [
      "🌧️ **Heavy Rain Protection Guide for Indian Farmers**\n\nWhen rainfall exceeds **130mm in 24 hours**, take these steps:\n\n1. **Open all drainage outlets** immediately — don't wait\n2. **Apply mulch** around crop base to prevent soil erosion\n3. **Never fertilize** 48 hours before or after heavy rain — it washes away\n4. **Harvest mature crops early** if storm warning is active\n5. **Document field damage** with photos for Pradhan Mantri Fasal Bima Yojana (PMFBY) crop insurance claim\n\n🌾 Rice can handle flooding for 2–3 days. Cotton and Groundnut cannot — act fast!\n\n→ Check the **Rain Damage Predictor** for your exact risk score.",
      "🌊 **Flood Risk Management for Tamil Nadu Farmers**\n\nMonsoon flooding? Here's your action plan:\n\n**Before rain arrives:**\n• Build temporary mud bunds around high-value crops (banana, sugarcane)\n• Ensure pump sets are available for quick drainage\n\n**During flooding:**\n• DO NOT enter flooded fields — soil is unstable\n• Spray 2% urea foliar spray to reduce plant stress after water recedes\n\n**After flooding:**\n• Apply lime (CaCO₃) to correct soil acidity\n• Replant gaps within 10 days for good yield\n• Contact local Agriculture Department for emergency seed kits",
    ],
  },
  {
    keywords: ["pest", "insect", "bug", "infestation", "கீட", "पूच्छी", "புழு", "பூச்சி", "fungal", "disease", "fungus", "blight"],
    responses: [
      "🐛 **Pest Attack Prevention & Control**\n\nWhen humidity > 90% + temp > 35°C, pests multiply **3x faster** than normal.\n\n**Organic Home Remedies (tried & tested by Indian farmers):**\n\n🍃 **Neem Oil Spray** — Mix 5ml neem oil + 1ml soap in 1 litre water. Spray every 7 days.\n🌶️ **Chili-Garlic Extract** — Boil 100g garlic + 50g chili in 1L water, cool, dilute 1:10, spray.\n🥛 **Butter milk spray** — Dilute 1:3 with water, apply on leaves to prevent fungal spread.\n🌿 **Tulsi leaf extract** — Effective against aphids and whiteflies.\n\n**When to use chemicals?** Only when >30% crop is affected. Use bio-pesticides first.\n\n→ Run the **Pest Attack Predictor** for your exact risk level.",
      "🍃 **Integrated Pest Management (IPM) for Indian Crops**\n\n*Follow these 4 steps in order:*\n\n1. **Scout your field** — Walk diagonally, check 20 plants at 5 spots\n2. **Count pest population** — Economic threshold for rice stem borer = 5% damaged tillers\n3. **Use biological controls first** — Release *Trichogramma* cards for borer control\n4. **Chemical last resort** — Prefer Emamectin benzoate or Chlorantraniliprole (safe for bees)\n\n**Signs of serious infestation:**\n• Leaf holes, yellowing, wilting, sticky residue\n• Ants crawling up stems (sign of aphids/mealybugs)\n\nCall Kisan Call Centre: **1800-180-1551** (free, 24/7)",
    ],
  },
  {
    keywords: ["locust", "வெட்டுக்கிளி", "टिड्डी", "swarm", "locust attack"],
    responses: [
      "🦗 **Locust Attack Response Protocol**\n\nIf locusts are spotted within 50km:\n\n**IMMEDIATE ACTIONS (first 6 hours):**\n1. 📢 Alert ALL neighboring farmers — use village PA system\n2. 🔊 Make loud noises at dawn and dusk when locusts feed\n3. 🪤 Install protective nets for high-value crops (banana, vegetables)\n4. 📞 Call **District Agriculture Officer immediately**\n5. 🚫 Do NOT use chemical pesticides near ponds or water bodies\n\n**Official channels:**\n• Locust Warning Organisation (LWO): **0141-2621526**\n• State Agriculture Helpline: 1800-180-1551\n\n**Did you know?** A locust swarm of 1 sq km can eat what 35,000 people eat in a day!\n\n→ Check the **Locust Predictor** to assess incoming swarm risk.",
    ],
  },
  {
    keywords: ["temperature", "heat", "hot", "வெப்பம்", "तापमान", "drought", "dry", "garmi", "heat stress"],
    responses: [
      "🌡️ **Heat Stress Management for Crops (Above 40°C)**\n\nExtreme heat damages crops in 3 ways: wilting, pollen sterility, and fruit drop.\n\n**Smart irrigation tactics:**\n• Irrigate between **5–7am or after 6pm** only — never midday\n• Use **drip irrigation** — saves 40% water, keeps roots cool\n• Apply **mulch (dry leaves/straw)** 5cm thick around base — reduces soil temp by 8°C\n\n**Crop-specific heat tips:**\n• 🌾 Rice above 35°C = spikelet sterility. Flood-irrigate during flowering stage\n• ☁️ Cotton above 40°C = boll drop. Apply potassium spray (SOP) 0.5%\n• 🌶️ Chili above 38°C = flower drop. Shade nets 50% help greatly\n• 🥔 Potato above 30°C = poor tuber formation. Harvest early if needed\n\n*Kaolin clay spray (5%) reflects sunlight — used by AP fruit farmers with great success.*",
    ],
  },
  {
    keywords: ["wind", "storm", "cyclone", "காற்று", "हवा", "cyclone warning", "thoofan"],
    responses: [
      "💨 **Cyclone & High Wind Crop Protection Guide**\n\nWind above 50 km/h = crop lodging risk. Above 80 km/h = severe damage.\n\n**Before storm arrives:**\n• Stake tall crops (banana, papaya, maize, sugarcane) with bamboo supports\n• Install windbreaker rows (casuarina, subabul) on farm borders\n• **Harvest any mature crop immediately** — don't wait\n• Drain waterlogged areas — wet soil + wind = uprooting\n\n**After cyclone:**\n• Wait 48 hours before entering damaged fields\n• Apply copper oxychloride spray to prevent wound infection on broken plants\n• Cut and remove damaged plant material — it breeds disease\n• Apply 20kg/acre urea to promote recovery growth\n\n**Insurance:** File crop damage report with local Agriculture Department within **72 hours** for PMFBY claim.",
    ],
  },
  {
    keywords: ["fertilizer", "खाद", "உரம்", "urea", "nutrient", "nitrogen", "potassium", "dap", "npk", "manure"],
    responses: [
      "🧪 **Smart Fertilizer Application Guide for Indian Farmers**\n\n**Golden Rules — When NOT to apply:**\n• 48 hours before expected rain (leaching loss)\n• When soil moisture > 90% (runoff)\n• During heat above 40°C (volatilization)\n• Standing water in field\n\n**Recommended Split Application (Rice example):**\n| Stage | Timing | What to apply |\n|---|---|---|\n| Basal | Before transplanting | DAP + MOP |\n| Tillering | 21 days after transplant | Urea 50% |\n| Panicle initiation | 45 days | Urea 50% + ZnSO₄ |\n\n**Organic alternatives:**\n• FYM (Farm Yard Manure): 5 tonnes/acre improves soil health long-term\n• Vermicompost: Best for vegetables and horticulture\n• Green manure (Sesbania): Plant and plow at flowering for nitrogen fixation\n\n*Soil testing every 3 years = save 20–30% fertilizer cost. Contact your local Krishi Vigyan Kendra.*",
    ],
  },
  {
    keywords: ["rice", "paddy", "நெல்", "धान", "cultivation", "grow rice", "paddy farming"],
    responses: [
      "🌾 **Complete Rice (Paddy) Cultivation Guide**\n\n**Season:** Kharif (June–Nov) or Rabi (Nov–April) in TN\n\n**Step-by-Step Process:**\n\n1. **Land Preparation** — Plow 2–3 times, flood, puddle thoroughly\n2. **Nursery** (25–30 days) — 20kg seed/acre, raise in 500 sq ft nursery bed\n3. **Transplanting** — 21-day seedlings, 2 per hill, 20×15cm spacing\n4. **Water Management** — 2–5cm standing water till panicle emergence\n5. **Fertilizer** — 120:60:60 kg NPK/ha in split doses\n6. **Pest Watch** — Brown plant hopper, stem borer, leaf folder are top threats\n7. **Harvest** — When 80% grains are golden, cut at panicle base\n\n**Varieties recommended for Tamil Nadu:**\n• ADT 43 — high yield, blast resistant\n• CO 51 — short duration (105 days)\n• TRY 3 — fine grain, good market price\n\n💰 **MSP 2024-25: ₹2,300/quintal** (Grade A)\n\nNeed help with a specific stage? Ask me!",
    ],
  },
  {
    keywords: ["cotton", "பருத்தி", "कपास", "bollworm", "cotton pest"],
    responses: [
      "☁️ **Cotton Cultivation Guide for Indian Farmers**\n\n**Best states:** Gujarat, Maharashtra, Telangana, Karnataka, Tamil Nadu\n\n**Key Growing Tips:**\n\n1. **Sow:** April–May (irrigated) or June–July (rainfed)\n2. **Spacing:** 90×60cm for Bt cotton varieties\n3. **Critical water stages:** Flowering + Boll formation — never stress here\n4. **Fertilizer:** 180:80:80 NPK kg/ha, +25kg ZnSO₄/ha\n\n**Common Problems & Solutions:**\n\n🦟 **Pink Bollworm** — Most damaging. Use Helicovicera NPV spray, pheromone traps (5/acre)\n🍃 **Leaf Curl Virus** — Spread by whitefly. Use imidacloprid seed treatment, remove infected plants\n🌿 **Mealybug** — Apply neem oil 2% + triazophos in severe cases\n\n**Harvest Tips:**\n• Pick when bolls open fully (3 pickings over 6 weeks)\n• Dry cotton properly (< 8% moisture) before selling\n• Avoid mixing yellow cotton — it reduces price by 15–20%\n\n💰 **MSP 2024-25:** Long Staple ₹7,521 | Medium ₹7,121/quintal",
    ],
  },
  {
    keywords: ["groundnut", "peanut", "கடலை", "मूंगफली", "arachis"],
    responses: [
      "🥜 **Groundnut Cultivation — Complete Farmer Guide**\n\n**Season:** Kharif (June–July) or Rabi (Oct–Nov)\n**Best soil:** Red sandy loam, well-drained\n\n**Cultivation Steps:**\n1. **Seed treatment** — Rhizobium + Thiram + PSB cultures\n2. **Sowing depth** — 5–7cm, 30×10cm spacing\n3. **Irrigate** at pegging stage (35–40 days) — most critical\n4. **Gypsum application** — 200kg/acre at pegging stage for calcium supply to pods\n5. **Harvesting** — When leaves turn yellow and pods are mature (3.5–4 months)\n\n**Key Threats:**\n• Tikka disease (leaf spot) — Spray Mancozeb 2g/L\n• Collar rot — Seed treatment with Trichoderma 4g/kg\n• Groundnut rosette virus — Remove infected plants immediately\n\n**Post-harvest:**\n• Dry in shade for 3–4 days before storage\n• Store at < 8% moisture to prevent aflatoxin\n\n💰 **MSP 2024-25: ₹6,783/quintal**",
    ],
  },
  {
    keywords: ["market", "price", "mandi", "sell", "விலை", "बेचना", "rate", "rate today", "best price"],
    responses: [
      "💰 **When to Sell Your Crop — Smart Farmer Strategy**\n\n**General principles:**\n1. **Never sell immediately after harvest** — prices are lowest at peak supply\n2. **Store for 1–3 months** if you have warehouse/cold storage access\n3. **Track MSP** — Minimum Support Price is your floor, never sell below it\n\n**Seasonal price patterns:**\n• 🌾 Rice: Prices rise Jan–April (lean season)\n• ☁️ Cotton: Dec–March is typically best (export demand)\n• 🥜 Groundnut: Nov–Jan peaks, then falls\n• 🍅 Tomato: Peaks in April–May (summer shortage)\n\n**Government schemes to use:**\n• **e-NAM** — National Agriculture Market for online auction\n• **APMC mandis** — Check daily rates at agmarknet.gov.in\n• **Warehouse Receipt Scheme** — Pledge stored grain for loan, sell later at better price\n\n→ Check the **Mandi Price Dashboard** in AgroShield for today's rates!",
    ],
  },
  {
    keywords: ["insurance", "pmfby", "crop insurance", "claim", "damage claim", "बीमा", "காப்பீடு"],
    responses: [
      "🛡️ **Pradhan Mantri Fasal Bima Yojana (PMFBY) — Crop Insurance Guide**\n\n**What is it?** Government crop insurance scheme covering:\n• Natural disasters (flood, drought, cyclone, hail)\n• Pest and disease losses\n• Post-harvest losses\n\n**Premium rates (farmer's share):**\n• Kharif crops: **2%** of sum insured\n• Rabi crops: **1.5%** of sum insured\n• Horticulture: **5%** of sum insured\n\n**How to claim after damage:**\n1. Report damage within **72 hours** to local Agriculture Department\n2. Provide photos/video evidence of damaged crops\n3. Submit claim through **Crop Insurance App** or nearest CSC center\n4. Block-level survey will be conducted within 10 days\n\n**Enroll before:**\n• Kharif: July 31\n• Rabi: December 31\n\n**Toll-free helpline:** 1800-200-7710\n📱 **App:** PM Fasal Bima on Play Store",
    ],
  },
  {
    keywords: ["help", "what can you do", "உதவி", "madad", "क्या करें", "advice", "suggest", "guide me"],
    responses: [
      "🌾 **Namaste! I'm AgroShield AI — Your Smart Farm Assistant!**\n\nI help Indian farmers with **real, practical advice** in simple language.\n\n**What I can help you with:**\n\n🌧️ **Weather & Risk** — Rain flood protection, wind damage, heat stress\n🐛 **Pest & Disease** — Organic remedies, IPM techniques, fungal control\n🌾 **Crop Cultivation** — Step-by-step guides for Rice, Cotton, Groundnut, more\n💰 **Market & Prices** — When to sell, MSP info, Agmarknet prices\n🛡️ **Government Schemes** — PMFBY insurance, PM-Kisan, KCC loans\n🧪 **Fertilizer Tips** — Smart application, soil health, organic alternatives\n\n**Try asking:**\n• *\"How do I grow cotton in black soil?\"*\n• *\"My rice has yellow leaves, what's wrong?\"*\n• *\"When is the best time to sell groundnut?\"*\n• *\"How to claim crop insurance after flood?\"*",
    ],
  },
  {
    keywords: ["yellow leaf", "yellowing", "yellow leaves", "wilting", "leaves turning", "crop sick", "plant dying"],
    responses: [
      "🍃 **Yellow Leaves / Wilting Diagnosis Guide**\n\nYellow leaves can have multiple causes. Let me help you diagnose:\n\n**1. Nitrogen Deficiency** (Most common)\n• Symptoms: Lower leaves turn pale yellow, starting from tips\n• Fix: Apply urea top dressing 25kg/acre (if soil is not waterlogged)\n\n**2. Waterlogging / Root Rot**\n• Symptoms: Sudden uniform yellowing, leaves droop despite moisture\n• Fix: Drain field immediately, apply Carbendazim fungicide\n\n**3. Iron/Zinc Deficiency** (Common in alkaline soils)\n• Symptoms: Yellow between green veins (interveinal chlorosis)\n• Fix: Spray ZnSO₄ (0.5%) + FeSO₄ (0.5%) on leaves\n\n**4. Viral Disease**\n• Symptoms: Mosaic pattern, curling, stunting\n• Fix: Remove infected plants, control vectors (whitefly, aphids)\n\n**5. Heat Stress**\n• Symptoms: Marginal scorch, leaf curl inward during afternoon\n• Fix: Irrigate in early morning, apply potassium spray\n\n**What crop are you growing?** Tell me the crop name for more specific advice!",
    ],
  },
];

const FALLBACK_RESPONSES = [
  "🌱 **That's a great question for your farm!**\n\nBased on general best practices for Indian agriculture:\n\n• Monitor crops daily during monsoon season — early detection saves 70% of yield\n• Use AgroShield's risk predictors for data-driven analysis\n• Consult your **Krishi Vigyan Kendra (KVK)** for region-specific variety recommendations\n• **Kisan Call Centre: 1800-180-1551** (free, 24/7 in 22 languages)\n\nCould you share more details? Like:\n• What crop are you growing?\n• What symptoms or problems are you seeing?\n• What's your location/district?",
  "📊 **Let me give you some general farming advice:**\n\n**For immediate crop issues**, use AgroShield tools:\n→ 🌧️ Rain Damage Predictor — for flood/waterlogging risk\n→ 🐛 Pest Predictor — for pest & disease conditions\n→ 🌱 Crop Guide — for best crops for your soil type\n→ 💰 Mandi Dashboard — for today's selling prices\n\n**Describe your problem more specifically** — mention:\n• Crop name (rice, cotton, etc.)\n• Problem symptoms\n• Weather conditions\n\nI'll give you a targeted solution!",
  "🤝 **Namaste, kisan ji!**\n\nAgroShield AI is here to support you with scientific, practical farming advice.\n\nFor your question, I recommend:\n1. Check the relevant predictor tool for quantified risk assessment\n2. Contact your local **Agriculture Extension Officer** for hands-on inspection\n3. Visit **eKrishi** portal or **mKisan** for government scheme information\n\n**Quick tip:** *The most profitable farmers in India monitor their fields twice a week during critical growth stages — early detection is cheaper than treatment!*",
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

  const response = FALLBACK_RESPONSES[responseIndex % FALLBACK_RESPONSES.length];
  responseIndex++;
  return response;
}

export function getGreetingMessage(): ChatMessage {
  return {
    id: "greeting",
    role: "bot",
    text: "🌾 **Namaste! I'm AgroShield AI — Your Smart Farm Assistant!**\n\nI'm here to help you grow better crops, protect your harvest, and earn more from your farm.\n\n**Ask me anything like:**\n• *\"How do I grow cotton in black soil?\"*\n• *\"My soil moisture is 90%, what to do?\"*\n• *\"How to protect rice from pests?\"*\n• *\"When is best time to sell groundnut?\"*\n• *\"How to claim crop insurance after flood?\"*\n\nI speak simple language — just ask naturally! 🙏",
    timestamp: Date.now(),
  };
}
