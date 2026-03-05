export const INDIA_DISTRICTS: Record<string, string[]> = {
  "Tamil Nadu": [
    "Ariyalur",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kanchipuram",
    "Kanyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Salem",
    "Sivaganga",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar",
  ],
  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Nashik",
    "Aurangabad",
    "Solapur",
    "Kolhapur",
    "Amravati",
    "Sangli",
    "Latur",
    "Ahmednagar",
    "Satara",
    "Ratnagiri",
  ],
  Karnataka: [
    "Bengaluru",
    "Mysuru",
    "Hubballi",
    "Mangaluru",
    "Belgaum",
    "Gulbarga",
    "Davanagere",
    "Bellary",
    "Shimoga",
    "Tumkur",
    "Raichur",
    "Dharwad",
  ],
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Tirupati",
    "Kurnool",
    "Rajahmundry",
    "Kakinada",
    "Eluru",
    "Anantapur",
    "Kadapa",
    "Srikakulam",
  ],
  Telangana: [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Karimnagar",
    "Khammam",
    "Mahbubnagar",
    "Adilabad",
    "Medak",
    "Nalgonda",
    "Ranga Reddy",
  ],
  Kerala: [
    "Thiruvananthapuram",
    "Kochi",
    "Kozhikode",
    "Thrissur",
    "Kannur",
    "Kollam",
    "Palakkad",
    "Alappuzha",
    "Malappuram",
    "Kasaragod",
    "Kottayam",
    "Pathanamthitta",
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Varanasi",
    "Agra",
    "Allahabad",
    "Meerut",
    "Ghaziabad",
    "Bareilly",
    "Aligarh",
    "Moradabad",
    "Noida",
    "Gorakhpur",
  ],
  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Jamnagar",
    "Gandhinagar",
    "Anand",
    "Mehsana",
    "Amreli",
    "Junagadh",
    "Kutch",
  ],
  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Kota",
    "Bikaner",
    "Ajmer",
    "Alwar",
    "Sikar",
    "Jhunjhunu",
    "Bhilwara",
    "Barmer",
    "Nagaur",
  ],
  Punjab: [
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    "Patiala",
    "Bathinda",
    "Mohali",
    "Pathankot",
    "Hoshiarpur",
    "Moga",
    "Firozpur",
    "Gurdaspur",
    "Faridkot",
  ],
  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Asansol",
    "Durgapur",
    "Siliguri",
    "Bardhaman",
    "Kharagpur",
    "Bankura",
    "Malda",
    "Murshidabad",
    "Jalpaiguri",
    "Purulia",
  ],
  "Madhya Pradesh": [
    "Bhopal",
    "Indore",
    "Jabalpur",
    "Gwalior",
    "Ujjain",
    "Sagar",
    "Dewas",
    "Satna",
    "Ratlam",
    "Rewa",
    "Chhindwara",
    "Mandsaur",
  ],
};

import cities from "@/data/cities.json";

export const ALL_DISTRICTS = (cities as any[]).map((city) => ({
  district: city.name,
  state: city.state,
}));

// Simulated risk data for the heatmap
export interface DistrictRisk {
  district: string;
  state: string;
  rainRisk: number;
  pestRisk: number;
  locustRisk: number;
  overallRisk: number;
  level: "LOW" | "MEDIUM" | "HIGH";
}

// Seeded random based on district name (deterministic)
function seededRandom(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash % 100);
}

export function getDistrictRisk(district: string, state: string): DistrictRisk {
  const base = seededRandom(district + state);
  const rainRisk = (base * 7 + 13) % 100;
  const pestRisk = (base * 11 + 7) % 100;
  const locustRisk = (base * 3 + 41) % 100;
  const overallRisk = Math.round((rainRisk + pestRisk + locustRisk) / 3);
  const level: "LOW" | "MEDIUM" | "HIGH" =
    overallRisk >= 70 ? "HIGH" : overallRisk >= 40 ? "MEDIUM" : "LOW";
  return {
    district,
    state,
    rainRisk,
    pestRisk,
    locustRisk,
    overallRisk,
    level,
  };
}

export function getAllDistrictRisks(): DistrictRisk[] {
  return ALL_DISTRICTS.map(({ district, state }) =>
    getDistrictRisk(district, state),
  );
}
