export type SoilType = "clay" | "loamy" | "sandy" | "black" | "red" | "alluvial";
export type Season = "kharif" | "rabi" | "zaid";

export interface CropRecommendation {
  name: string;
  emoji: string;
  suitability: "excellent" | "good" | "moderate";
  reason: string;
  sowingMonth: string;
  harvestMonth: string;
  waterNeed: "low" | "medium" | "high";
  marketPrice?: string;
}

interface RecommendationRule {
  soils: SoilType[];
  seasons: Season[];
  crops: CropRecommendation[];
}

const RECOMMENDATION_RULES: RecommendationRule[] = [
  {
    soils: ["alluvial", "loamy"],
    seasons: ["kharif"],
    crops: [
      { name: "Paddy (Rice)", emoji: "🌾", suitability: "excellent", reason: "Alluvial/loamy soil holds water well — ideal for paddy cultivation", sowingMonth: "June–July", harvestMonth: "Oct–Nov", waterNeed: "high", marketPrice: "₹2,183/quintal (MSP)" },
      { name: "Maize", emoji: "🌽", suitability: "excellent", reason: "Well-drained loamy soil promotes strong maize root development", sowingMonth: "June–July", harvestMonth: "Sep–Oct", waterNeed: "medium", marketPrice: "₹1,962/quintal (MSP)" },
      { name: "Soybean", emoji: "🫘", suitability: "good", reason: "Loamy soil with good organic matter supports nitrogen fixation", sowingMonth: "June–July", harvestMonth: "Sep–Oct", waterNeed: "medium", marketPrice: "₹4,300/quintal (MSP)" },
      { name: "Groundnut", emoji: "🥜", suitability: "good", reason: "Sandy loam ideal for pegging and pod development", sowingMonth: "June", harvestMonth: "Sep–Oct", waterNeed: "medium", marketPrice: "₹6,377/quintal (MSP)" },
    ],
  },
  {
    soils: ["black"],
    seasons: ["kharif"],
    crops: [
      { name: "Cotton", emoji: "☁️", suitability: "excellent", reason: "Black cotton soil has high water-holding capacity — perfect for long-season cotton", sowingMonth: "April–May", harvestMonth: "Nov–Jan", waterNeed: "medium", marketPrice: "₹6,620/quintal (MSP)" },
      { name: "Sorghum (Jowar)", emoji: "🌾", suitability: "excellent", reason: "Drought-tolerant jowar thrives in black soil's mineral richness", sowingMonth: "June–July", harvestMonth: "Sep–Oct", waterNeed: "low", marketPrice: "₹3,180/quintal (MSP)" },
      { name: "Pigeon Pea (Tur)", emoji: "🫘", suitability: "excellent", reason: "Black soil's deep structure supports tap root of tur/arhar", sowingMonth: "June–July", harvestMonth: "Jan–Mar", waterNeed: "low", marketPrice: "₹7,000/quintal (MSP)" },
      { name: "Sugarcane", emoji: "🎋", suitability: "good", reason: "High nutrient black soil supports heavy sugarcane biomass", sowingMonth: "Oct–Nov", harvestMonth: "12–14 months later", waterNeed: "high", marketPrice: "₹305/quintal (FRP)" },
    ],
  },
  {
    soils: ["red"],
    seasons: ["kharif"],
    crops: [
      { name: "Groundnut", emoji: "🥜", suitability: "excellent", reason: "Red soil's sandy texture promotes excellent pod expansion", sowingMonth: "June", harvestMonth: "Sep–Oct", waterNeed: "medium", marketPrice: "₹6,377/quintal (MSP)" },
      { name: "Millets (Ragi)", emoji: "🌾", suitability: "excellent", reason: "Ragi is highly adapted to red laterite soils with low fertility", sowingMonth: "June–July", harvestMonth: "Oct–Nov", waterNeed: "low", marketPrice: "₹3,846/quintal (MSP)" },
      { name: "Chili", emoji: "🌶️", suitability: "good", reason: "Red soil's good drainage prevents root rot in chili plants", sowingMonth: "July–Aug", harvestMonth: "Dec–Feb", waterNeed: "medium", marketPrice: "₹8,000–15,000/quintal" },
      { name: "Sunflower", emoji: "🌻", suitability: "good", reason: "Red soil suits sunflower's deep taproot system", sowingMonth: "June–July", harvestMonth: "Sep–Oct", waterNeed: "low", marketPrice: "₹6,760/quintal (MSP)" },
    ],
  },
  {
    soils: ["alluvial", "loamy", "clay"],
    seasons: ["rabi"],
    crops: [
      { name: "Wheat", emoji: "🌾", suitability: "excellent", reason: "Well-drained alluvial/loamy soil is the prime choice for wheat production", sowingMonth: "Oct–Nov", harvestMonth: "Mar–Apr", waterNeed: "medium", marketPrice: "₹2,275/quintal (MSP)" },
      { name: "Mustard", emoji: "🌿", suitability: "excellent", reason: "Loamy soil with good drainage promotes excellent mustard yield", sowingMonth: "Oct", harvestMonth: "Feb–Mar", waterNeed: "low", marketPrice: "₹5,650/quintal (MSP)" },
      { name: "Potato", emoji: "🥔", suitability: "excellent", reason: "Loose alluvial soil allows easy tuber expansion and harvesting", sowingMonth: "Oct–Nov", harvestMonth: "Jan–Feb", waterNeed: "medium", marketPrice: "₹600–1,200/quintal" },
      { name: "Chickpea (Chana)", emoji: "🫘", suitability: "good", reason: "Clay-loam soil retains moisture for chickpea root nodulation", sowingMonth: "Oct–Nov", harvestMonth: "Feb–Mar", waterNeed: "low", marketPrice: "₹5,440/quintal (MSP)" },
    ],
  },
  {
    soils: ["black", "red"],
    seasons: ["rabi"],
    crops: [
      { name: "Lentil (Masoor)", emoji: "🫘", suitability: "good", reason: "Black soil retains moisture well into rabi season for pulse crops", sowingMonth: "Oct–Nov", harvestMonth: "Mar–Apr", waterNeed: "low", marketPrice: "₹6,000/quintal (MSP)" },
      { name: "Sunflower", emoji: "🌻", suitability: "good", reason: "Red soil's texture supports sunflower cultivation as a winter crop", sowingMonth: "Oct–Nov", harvestMonth: "Feb–Mar", waterNeed: "medium", marketPrice: "₹6,760/quintal (MSP)" },
      { name: "Safflower", emoji: "🌼", suitability: "excellent", reason: "Deep black soil retains subsoil moisture — ideal for safflower's long taproot", sowingMonth: "Oct–Nov", harvestMonth: "Mar–Apr", waterNeed: "low", marketPrice: "₹5,800/quintal (MSP)" },
    ],
  },
  {
    soils: ["sandy", "red", "alluvial"],
    seasons: ["zaid"],
    crops: [
      { name: "Watermelon", emoji: "🍉", suitability: "excellent", reason: "Sandy soil drains fast and warms up quickly — perfect for summer melons", sowingMonth: "Feb–Mar", harvestMonth: "May–Jun", waterNeed: "medium", marketPrice: "₹500–800/quintal" },
      { name: "Cucumber", emoji: "🥒", suitability: "excellent", reason: "Light sandy soil helps cucumbers grow without waterlogging", sowingMonth: "Feb–Mar", harvestMonth: "Apr–May", waterNeed: "medium", marketPrice: "₹400–700/quintal" },
      { name: "Bitter Gourd", emoji: "🥬", suitability: "good", reason: "Alluvial sandy loam provides good drainage for gourd crops", sowingMonth: "Feb–Mar", harvestMonth: "May–Jun", waterNeed: "medium", marketPrice: "₹1,000–2,000/quintal" },
      { name: "Moong Dal", emoji: "🫘", suitability: "good", reason: "Short-duration summer moong fits zaid season in warm sandy soil", sowingMonth: "Mar–Apr", harvestMonth: "Jun–Jul", waterNeed: "low", marketPrice: "₹8,558/quintal (MSP)" },
    ],
  },
];

export function getRecommendations(soilType: SoilType, season: Season): CropRecommendation[] {
  const matches = RECOMMENDATION_RULES.filter(
    rule => rule.soils.includes(soilType) && rule.seasons.includes(season)
  );
  if (matches.length === 0) {
    // Fallback: find by season only
    return RECOMMENDATION_RULES
      .filter(rule => rule.seasons.includes(season))
      .flatMap(r => r.crops)
      .slice(0, 4);
  }
  // Merge and deduplicate by crop name
  const all = matches.flatMap(r => r.crops);
  const seen = new Set<string>();
  return all.filter(c => {
    if (seen.has(c.name)) return false;
    seen.add(c.name);
    return true;
  });
}

export const SOIL_OPTIONS: { value: SoilType; label: string; emoji: string; desc: string }[] = [
  { value: "alluvial", label: "Alluvial", emoji: "🟤", desc: "Found in Indo-Gangetic plains, very fertile" },
  { value: "black", label: "Black (Regur)", emoji: "⚫", desc: "Found in Deccan plateau, good for cotton" },
  { value: "red", label: "Red & Yellow", emoji: "🔴", desc: "Found in South India, good for millets" },
  { value: "loamy", label: "Loamy", emoji: "🟫", desc: "Balanced texture, ideal for most crops" },
  { value: "sandy", label: "Sandy", emoji: "🟡", desc: "Found in Rajasthan, good drainage" },
  { value: "clay", label: "Clay", emoji: "🔵", desc: "Heavy soil, retains water well" },
];

export const SEASON_OPTIONS: { value: Season; label: string; emoji: string; desc: string }[] = [
  { value: "kharif", label: "Kharif (Monsoon)", emoji: "🌧️", desc: "Sown June–July, harvested Oct–Nov" },
  { value: "rabi", label: "Rabi (Winter)", emoji: "❄️", desc: "Sown Oct–Nov, harvested Feb–Apr" },
  { value: "zaid", label: "Zaid (Summer)", emoji: "☀️", desc: "Sown Feb–Mar, harvested May–June" },
];
