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

const API_KEY = "579b464db66ec23bdd000001f399ffc00c424fe56c8d5f0b5d0e94e5";

const API_URL =
  `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070` +
  `?api-key=${API_KEY}&format=json&limit=50`;

function getEmoji(crop: string) {
  const name = crop.toLowerCase();

  if (name.includes("rice") || name.includes("paddy")) return "🌾";
  if (name.includes("cotton")) return "☁️";
  if (name.includes("groundnut")) return "🥜";
  if (name.includes("tomato")) return "🍅";
  if (name.includes("banana")) return "🍌";
  if (name.includes("chili")) return "🌶️";
  if (name.includes("maize")) return "🌽";
  if (name.includes("onion")) return "🧅";
  if (name.includes("potato")) return "🥔";

  return "🌱";
}

function getAdvice(price: number) {
  if (price > 7000) return "High demand. Good time to sell.";
  if (price > 3000) return "Market stable. Sell gradually.";
  return "Prices low. Consider waiting if storage available.";
}

export async function getMarketPrices(): Promise<MandiPrice[]> {
  const res = await fetch(API_URL);
  const data = await res.json();

  return data.records.map((r: any) => {
    const modal = Number(r.modal_price);
    const min = Number(r.min_price);
    const max = Number(r.max_price);

    let trend: "up" | "down" | "stable" = "stable";
    let trendPct = Math.round(((modal - min) / min) * 100);

    if (trendPct > 5) trend = "up";
    if (trendPct < -5) trend = "down";

    return {
      crop: r.commodity,
      emoji: getEmoji(r.commodity),
      currentPrice: modal,
      minPrice: min,
      maxPrice: max,
      unit: "quintal",
      market: r.market,
      state: r.state,
      trend,
      trendPct,
      bestSellMonth: "Seasonal",
      advice: getAdvice(modal),
      lastUpdated: r.arrival_date,
    };
  });
}

export async function getPriceForCrop(cropName: string) {
  const prices = await getMarketPrices();

  return prices.find((p) =>
    p.crop.toLowerCase().includes(cropName.toLowerCase()),
  );
}
