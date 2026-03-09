export interface MandiPrice {
  crop: string;
  emoji: string;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  unit: string;
  market: string;
  state: string;
  trend: "up" | "down" | "stable";
  trendPct: number;
  bestSellMonth: string;
  advice: string;
  lastUpdated: string;
}

// Simulated Agmarknet-style data (refreshes deterministically by day-of-week)
const BASE_PRICES: MandiPrice[] = [
  {
    crop: "Paddy (Rice)", emoji: "🌾", currentPrice: 2240, minPrice: 2100, maxPrice: 2450,
    unit: "quintal", market: "Thanjavur", state: "Tamil Nadu",
    trend: "up", trendPct: 3.2, bestSellMonth: "Nov–Dec",
    advice: "Prices peak post-harvest. Hold 20–30% stock if you have storage.",
    lastUpdated: "Today",
  },
  {
    crop: "Cotton", emoji: "☁️", currentPrice: 6850, minPrice: 6200, maxPrice: 7400,
    unit: "quintal", market: "Coimbatore", state: "Tamil Nadu",
    trend: "up", trendPct: 5.1, bestSellMonth: "Dec–Jan",
    advice: "Cotton prices rising due to export demand. Good time to sell premium grade.",
    lastUpdated: "Today",
  },
  {
    crop: "Groundnut", emoji: "🥜", currentPrice: 6200, minPrice: 5800, maxPrice: 6800,
    unit: "quintal", market: "Madurai", state: "Tamil Nadu",
    trend: "stable", trendPct: 0.8, bestSellMonth: "Oct–Nov",
    advice: "Stable market. Sell now or wait for post-Diwali demand spike.",
    lastUpdated: "Today",
  },
  {
    crop: "Tomato", emoji: "🍅", currentPrice: 1800, minPrice: 800, maxPrice: 3200,
    unit: "quintal", market: "Koyambedu", state: "Tamil Nadu",
    trend: "down", trendPct: -12.5, bestSellMonth: "Feb–Mar",
    advice: "Prices dropped due to oversupply. Consider cold storage or processing.",
    lastUpdated: "Today",
  },
  {
    crop: "Banana", emoji: "🍌", currentPrice: 1400, minPrice: 1100, maxPrice: 1700,
    unit: "quintal", market: "Trichy", state: "Tamil Nadu",
    trend: "up", trendPct: 7.8, bestSellMonth: "Mar–Apr",
    advice: "Festival season demand rising. Sell before supply peaks in March.",
    lastUpdated: "Today",
  },
  {
    crop: "Chili (Dry)", emoji: "🌶️", currentPrice: 9500, minPrice: 7000, maxPrice: 12000,
    unit: "quintal", market: "Guntur", state: "Andhra Pradesh",
    trend: "up", trendPct: 9.3, bestSellMonth: "Apr–May",
    advice: "High spice demand. Premium S4 variety fetching ₹12,000+. Grade & sell.",
    lastUpdated: "Today",
  },
  {
    crop: "Maize", emoji: "🌽", currentPrice: 1980, minPrice: 1750, maxPrice: 2200,
    unit: "quintal", market: "Erode", state: "Tamil Nadu",
    trend: "stable", trendPct: 1.2, bestSellMonth: "Dec–Jan",
    advice: "Poultry feed demand keeps maize prices steady. Sell in bulk for better rates.",
    lastUpdated: "Today",
  },
  {
    crop: "Onion", emoji: "🧅", currentPrice: 1200, minPrice: 600, maxPrice: 3500,
    unit: "quintal", market: "Nashik", state: "Maharashtra",
    trend: "down", trendPct: -8.4, bestSellMonth: "Jun–Jul",
    advice: "Seasonal low. If possible, store and sell in summer when prices double.",
    lastUpdated: "Today",
  },
  {
    crop: "Potato", emoji: "🥔", currentPrice: 900, minPrice: 600, maxPrice: 1400,
    unit: "quintal", market: "Agra", state: "Uttar Pradesh",
    trend: "stable", trendPct: -1.5, bestSellMonth: "May–Jun",
    advice: "Cold storage available. Hold stock until summer for 40–60% price gain.",
    lastUpdated: "Today",
  },
  {
    crop: "Soybean", emoji: "🫘", currentPrice: 4450, minPrice: 4100, maxPrice: 4900,
    unit: "quintal", market: "Indore", state: "Madhya Pradesh",
    trend: "up", trendPct: 4.7, bestSellMonth: "Nov–Dec",
    advice: "Oil mill demand is strong. Sell processed meal for 15% premium.",
    lastUpdated: "Today",
  },
];

// Simulate price variation by day
export function getMarketPrices(): MandiPrice[] {
  const dayVariation = (new Date().getDay() * 0.7) - 2;
  return BASE_PRICES.map(p => ({
    ...p,
    currentPrice: Math.round(p.currentPrice * (1 + (dayVariation * 0.01))),
  }));
}

export function getPriceForCrop(cropName: string): MandiPrice | undefined {
  const prices = getMarketPrices();
  return prices.find(p => p.crop.toLowerCase().includes(cropName.toLowerCase()));
}
