import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IndianRupee, ChevronDown, ChevronUp, ExternalLink, CheckCircle2,
  Users, Calendar, FileText, Phone, Star, Shield, Sprout, Droplets, Home
} from "lucide-react";
import { useLang } from "@/context/LangContext";
import LocationSearchPanel, { type LocationWeatherData } from "@/components/LocationSearchPanel";

interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  nameTa: string;
  category: "income" | "insurance" | "loan" | "input" | "infra";
  subsidy: string;
  subsidyHi: string;
  subsidyTa: string;
  eligibility: string[];
  eligibilityHi: string[];
  eligibilityTa: string[];
  howToApply: string;
  howToApplyHi: string;
  howToApplyTa: string;
  helpline: string;
  tag: string;
  tagHi: string;
  tagTa: string;
  icon: typeof IndianRupee;
  color: string;
  bg: string;
  featured?: boolean;
}

const SCHEMES: Scheme[] = [
  {
    id: "pmkisan",
    name: "PM-KISAN",
    nameHi: "पीएम-किसान",
    nameTa: "பிஎம்-கிசான்",
    category: "income",
    subsidy: "₹6,000/year (₹2,000 × 3 installments)",
    subsidyHi: "₹6,000/वर्ष (₹2,000 × 3 किस्त)",
    subsidyTa: "₹6,000/ஆண்டு (₹2,000 × 3 தவணை)",
    eligibility: ["Small & marginal farmers", "Land holding up to 2 hectares", "Valid Aadhaar card required", "Linked bank account"],
    eligibilityHi: ["छोटे और सीमांत किसान", "2 हेक्टेयर तक भूमि", "आधार कार्ड आवश्यक", "बैंक खाता लिंक होना चाहिए"],
    eligibilityTa: ["சிறு மற்றும் குறு விவசாயிகள்", "2 ஹெக்டேர் வரை நிலம்", "ஆதார் அட்டை கட்டாயம்", "வங்கி கணக்கு இணைக்கப்பட வேண்டும்"],
    howToApply: "Visit pmkisan.gov.in or nearest Common Service Centre (CSC)",
    howToApplyHi: "pmkisan.gov.in पर जाएं या नजदीकी CSC केंद्र जाएं",
    howToApplyTa: "pmkisan.gov.in தளத்திற்கு செல்லவும் அல்லது அருகிலுள்ள CSC மையம் செல்லவும்",
    helpline: "155261 / 011-23381092",
    tag: "Income Support",
    tagHi: "आय सहायता",
    tagTa: "வருமான உதவி",
    icon: IndianRupee,
    color: "text-emerald-600",
    bg: "bg-emerald-500/15",
    featured: true,
  },
  {
    id: "pmfby",
    name: "PM Fasal Bima Yojana (PMFBY)",
    nameHi: "पीएम फसल बीमा योजना",
    nameTa: "பிஎம் பயிர் காப்பீட்டு திட்டம்",
    category: "insurance",
    subsidy: "Premium as low as 2% (Kharif), 1.5% (Rabi)",
    subsidyHi: "प्रीमियम मात्र 2% (खरीफ), 1.5% (रबी)",
    subsidyTa: "பிரீமியம் வெறும் 2% (கரீப்), 1.5% (ரபி)",
    eligibility: ["All farmers growing notified crops", "Loanee & non-loanee farmers", "Sharecroppers & tenant farmers", "Valid land records"],
    eligibilityHi: ["अधिसूचित फसल उगाने वाले किसान", "ऋणी व गैर-ऋणी किसान", "बंटाईदार व काश्तकार किसान", "भूमि अभिलेख आवश्यक"],
    eligibilityTa: ["அறிவிக்கப்பட்ட பயிர்கள் பயிரிடும் விவசாயிகள்", "கடன் பெற்ற மற்றும் பெறாத விவசாயிகள்", "குத்தகை விவசாயிகள்", "நில ஆவணங்கள் தேவை"],
    howToApply: "Apply at nearest bank branch, CSC or pmfby.gov.in before cut-off date",
    howToApplyHi: "नजदीकी बैंक, CSC या pmfby.gov.in पर अंतिम तिथि से पहले आवेदन करें",
    howToApplyTa: "அருகிலுள்ள வங்கி, CSC அல்லது pmfby.gov.in தளத்தில் கடைசி தேதிக்கு முன் விண்ணப்பிக்கவும்",
    helpline: "1800-180-1551",
    tag: "Crop Insurance",
    tagHi: "फसल बीमा",
    tagTa: "பயிர் காப்பீடு",
    icon: Shield,
    color: "text-blue-600",
    bg: "bg-blue-500/15",
    featured: true,
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC)",
    nameHi: "किसान क्रेडिट कार्ड",
    nameTa: "கிசான் கிரெடிட் கார்டு",
    category: "loan",
    subsidy: "Credit up to ₹3 lakh @ 4% interest",
    subsidyHi: "₹3 लाख तक ऋण @ 4% ब्याज",
    subsidyTa: "₹3 லட்சம் வரை கடன் @ 4% வட்டி",
    eligibility: ["All farmers, sharecroppers, tenant farmers", "Fishermen & livestock owners", "Age 18–75 years", "Basic KYC documents"],
    eligibilityHi: ["सभी किसान, बंटाईदार, काश्तकार", "मछुआरे व पशुपालक", "आयु 18–75 वर्ष", "केवाईसी दस्तावेज"],
    eligibilityTa: ["அனைத்து விவசாயிகள், குத்தகைதாரர்கள்", "மீனவர்கள் & கால்நடை வளர்ப்போர்", "வயது 18–75", "KYC ஆவணங்கள்"],
    howToApply: "Visit any nationalized bank or cooperative bank with land records & ID proof",
    howToApplyHi: "नजदीकी राष्ट्रीयकृत या सहकारी बैंक में भूमि अभिलेख व पहचान पत्र लेकर जाएं",
    howToApplyTa: "அருகிலுள்ள தேசியமயமாக்கப்பட்ட வங்கிக்கு நில ஆவணங்களுடன் செல்லவும்",
    helpline: "1800-11-0001",
    tag: "Easy Credit",
    tagHi: "सस्ता ऋण",
    tagTa: "எளிய கடன்",
    icon: FileText,
    color: "text-violet-600",
    bg: "bg-violet-500/15",
  },
  {
    id: "pkvy",
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    nameHi: "परंपरागत कृषि विकास योजना",
    nameTa: "பாரம்பரிய விவசாய மேம்பாட்டு திட்டம்",
    category: "input",
    subsidy: "₹50,000/hectare for 3 years for organic farming",
    subsidyHi: "जैविक खेती के लिए 3 वर्ष में ₹50,000/हेक्टेयर",
    subsidyTa: "இயற்கை விவசாயத்திற்கு 3 ஆண்டுகளில் ₹50,000/ஹெக்டேர்",
    eligibility: ["Farmers willing to adopt organic farming", "Minimum cluster of 50 farmers", "20 acre contiguous land", "FSSAI norms compliance"],
    eligibilityHi: ["जैविक खेती अपनाने के इच्छुक किसान", "न्यूनतम 50 किसानों का समूह", "20 एकड़ भूमि", "FSSAI मानदंड"],
    eligibilityTa: ["இயற்கை விவசாயம் கடைபிடிக்க விரும்பும் விவசாயிகள்", "குறைந்தது 50 விவசாயிகள் கூட்டு", "20 ஏக்கர் நிலம்", "FSSAI விதிமுறைகள்"],
    howToApply: "Apply through District Agriculture Office or pgsindia.net",
    howToApplyHi: "जिला कृषि कार्यालय या pgsindia.net के माध्यम से आवेदन करें",
    howToApplyTa: "மாவட்ட வேளாண்மை அலுவலகம் அல்லது pgsindia.net மூலம் விண்ணப்பிக்கவும்",
    helpline: "1800-180-1551",
    tag: "Organic Farming",
    tagHi: "जैविक खेती",
    tagTa: "இயற்கை விவசாயம்",
    icon: Sprout,
    color: "text-lime-600",
    bg: "bg-lime-500/15",
  },
  {
    id: "pmksy",
    name: "PM Krishi Sinchai Yojana (PMKSY)",
    nameHi: "पीएम कृषि सिंचाई योजना",
    nameTa: "பிஎம் விவசாய நீர்ப்பாசன திட்டம்",
    category: "infra",
    subsidy: "55% subsidy (SC/ST: 60%) on micro-irrigation",
    subsidyHi: "सूक्ष्म सिंचाई पर 55% सब्सिडी (SC/ST: 60%)",
    subsidyTa: "நுண் நீர்ப்பாசனத்தில் 55% மானியம் (SC/ST: 60%)",
    eligibility: ["All farmers with own land", "Tenant farmers with 7-year lease agreement", "FPOs & SHGs eligible", "Water-stressed areas prioritized"],
    eligibilityHi: ["भूमि स्वामी किसान", "7 वर्ष के पट्टे वाले काश्तकार", "FPO व SHG पात्र", "जल संकट क्षेत्र प्राथमिकता"],
    eligibilityTa: ["நில உரிமையாளர் விவசாயிகள்", "7 ஆண்டு குத்தகை விவசாயிகள்", "FPO & SHG தகுதியானவர்கள்", "நீர் பஞ்சம் பகுதிகள் முன்னுரிமை"],
    howToApply: "Apply through State Agriculture Department or pmksy.gov.in",
    howToApplyHi: "राज्य कृषि विभाग या pmksy.gov.in के माध्यम से आवेदन करें",
    howToApplyTa: "மாநில வேளாண்மை திணைக்களம் அல்லது pmksy.gov.in மூலம் விண்ணப்பிக்கவும்",
    helpline: "1800-180-1551",
    tag: "Irrigation",
    tagHi: "सिंचाई",
    tagTa: "நீர்ப்பாசனம்",
    icon: Droplets,
    color: "text-cyan-600",
    bg: "bg-cyan-500/15",
  },
  {
    id: "housing",
    name: "PM Awas Yojana – Gramin",
    nameHi: "पीएम आवास योजना – ग्रामीण",
    nameTa: "பிஎம் வீட்டு வசதி திட்டம் – கிராமப்புறம்",
    category: "infra",
    subsidy: "₹1.2 lakh (plains) / ₹1.3 lakh (hilly areas)",
    subsidyHi: "₹1.2 लाख (मैदान) / ₹1.3 लाख (पहाड़ी क्षेत्र)",
    subsidyTa: "₹1.2 லட்சம் (சமவெளி) / ₹1.3 லட்சம் (மலைப் பகுதி)",
    eligibility: ["Households without pucca house", "Name in SECC 2011 list", "BPL or Antyodaya card holders", "Not availed housing scheme before"],
    eligibilityHi: ["पक्के घर के बिना परिवार", "SECC 2011 सूची में नाम", "BPL/अंत्योदय कार्डधारक", "पहले योजना का लाभ न लिया हो"],
    eligibilityTa: ["நிரந்தர வீடு இல்லாத குடும்பங்கள்", "SECC 2011 பட்டியலில் பெயர்", "BPL/அந்தியோதய் அட்டையாளர்கள்", "முன்பு திட்டம் பெறாதவர்கள்"],
    howToApply: "Apply at Gram Panchayat or pmayg.nic.in",
    howToApplyHi: "ग्राम पंचायत या pmayg.nic.in पर आवेदन करें",
    howToApplyTa: "கிராம பஞ்சாயத்து அல்லது pmayg.nic.in-ல் விண்ணப்பிக்கவும்",
    helpline: "1800-11-6446",
    tag: "Rural Housing",
    tagHi: "ग्रामीण आवास",
    tagTa: "கிராம வீடு",
    icon: Home,
    color: "text-orange-600",
    bg: "bg-orange-500/15",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Schemes", labelHi: "सभी योजनाएं", labelTa: "அனைத்து திட்டங்கள்" },
  { id: "income", label: "Income", labelHi: "आय", labelTa: "வருமானம்" },
  { id: "insurance", label: "Insurance", labelHi: "बीमा", labelTa: "காப்பீடு" },
  { id: "loan", label: "Loans", labelHi: "ऋण", labelTa: "கடன்" },
  { id: "input", label: "Farming Aid", labelHi: "कृषि सहायता", labelTa: "வேளாண் உதவி" },
  { id: "infra", label: "Infrastructure", labelHi: "अवसंरचना", labelTa: "உள்கட்டமைப்பு" },
];

const LABELS_EXTRA = {
  en: {
    title: "Government Schemes",
    subtitle: "Find subsidies & schemes available for you",
    eligibility: "Eligibility",
    howToApply: "How to Apply",
    helpline: "Helpline",
    featured: "Featured",
    allSchemes: "schemes available",
    filterBy: "Filter by",
  },
  hi: {
    title: "सरकारी योजनाएं",
    subtitle: "आपके लिए उपलब्ध सब्सिडी और योजनाएं खोजें",
    eligibility: "पात्रता",
    howToApply: "आवेदन कैसे करें",
    helpline: "हेल्पलाइन",
    featured: "विशेष",
    allSchemes: "योजनाएं उपलब्ध",
    filterBy: "फ़िल्टर करें",
  },
  ta: {
    title: "அரசு திட்டங்கள்",
    subtitle: "உங்களுக்கு கிடைக்கும் மானியங்கள் மற்றும் திட்டங்களை கண்டறியுங்கள்",
    eligibility: "தகுதி",
    howToApply: "விண்ணப்பிக்கும் முறை",
    helpline: "உதவி எண்",
    featured: "சிறப்பு",
    allSchemes: "திட்டங்கள் கிடைக்கின்றன",
    filterBy: "வடிகட்டு",
  },
};

export default function GovernmentSchemes() {
  const { lang } = useLang();
  const t = LABELS_EXTRA[lang];
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>("pmkisan");
  const [locationCity, setLocationCity] = useState<string | null>(null);

  const handleLocation = (data: LocationWeatherData) => {
    setLocationCity(data.city);
  };

  const filtered = activeCategory === "all"
    ? SCHEMES
    : SCHEMES.filter(s => s.category === activeCategory);

  const getName = (s: Scheme) => lang === "hi" ? s.nameHi : lang === "ta" ? s.nameTa : s.name;
  const getSubsidy = (s: Scheme) => lang === "hi" ? s.subsidyHi : lang === "ta" ? s.subsidyTa : s.subsidy;
  const getTag = (s: Scheme) => lang === "hi" ? s.tagHi : lang === "ta" ? s.tagTa : s.tag;
  const getEligibility = (s: Scheme) => lang === "hi" ? s.eligibilityHi : lang === "ta" ? s.eligibilityTa : s.eligibility;
  const getHowToApply = (s: Scheme) => lang === "hi" ? s.howToApplyHi : lang === "ta" ? s.howToApplyTa : s.howToApply;
  const getCatLabel = (c: typeof CATEGORIES[0]) => lang === "hi" ? c.labelHi : lang === "ta" ? c.labelTa : c.label;

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient rounded-3xl p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <IndianRupee size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl font-black">{t.title}</h1>
            <p className="text-white/70 text-xs">{t.subtitle}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 w-fit">
          <Star size={13} className="text-yellow-300" />
          <span className="text-xs font-semibold">{filtered.length} {t.allSchemes}</span>
        </div>
      </motion.div>

      {/* Location Search */}
      {/* <LocationSearchPanel onLocation={handleLocation} /> */}
      {locationCity && (
        <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
          <span>📍</span>
          <span>Showing schemes relevant to <strong className="text-foreground">{locationCity}</strong></span>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {getCatLabel(cat)}
          </button>
        ))}
      </div>

      {/* Scheme Cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((scheme, i) => {
            const isOpen = expandedId === scheme.id;
            const Icon = scheme.icon;
            return (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                {/* Header Row */}
                <button
                  className="w-full p-4 text-left flex items-start gap-3"
                  onClick={() => setExpandedId(isOpen ? null : scheme.id)}
                >
                  <div className={`w-10 h-10 rounded-xl ${scheme.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon size={18} className={scheme.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-sm">{getName(scheme)}</h3>
                      {scheme.featured && (
                        <span className="px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-600 text-xs font-bold border border-yellow-400/30">
                          ★ {t.featured}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-md ${scheme.bg} ${scheme.color} font-medium`}>
                      {getTag(scheme)}
                    </span>
                    <p className="text-sm font-semibold text-foreground mt-2">{getSubsidy(scheme)}</p>
                  </div>
                  <div className="text-muted-foreground shrink-0 mt-1">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-4 border-t border-border/50 pt-3">
                        {/* Eligibility */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Users size={13} className="text-primary" />
                            <h4 className="text-xs font-bold text-foreground/80 uppercase tracking-wide">{t.eligibility}</h4>
                          </div>
                          <div className="space-y-1.5">
                            {getEligibility(scheme).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* How to Apply */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Calendar size={13} className="text-primary" />
                            <h4 className="text-xs font-bold text-foreground/80 uppercase tracking-wide">{t.howToApply}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground bg-muted/50 rounded-xl p-3">{getHowToApply(scheme)}</p>
                        </div>

                        {/* Helpline */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/15">
                          <div className="flex items-center gap-2">
                            <Phone size={13} className="text-primary" />
                            <span className="text-xs font-medium text-foreground/80">{t.helpline}:</span>
                            <span className="text-xs font-bold text-primary">{scheme.helpline}</span>
                          </div>
                          <ExternalLink size={13} className="text-muted-foreground" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
