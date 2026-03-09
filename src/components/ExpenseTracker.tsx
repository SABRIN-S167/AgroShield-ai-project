import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle, Trash2, TrendingUp, TrendingDown, IndianRupee,
  Sprout, Droplets, Users, Truck, Wrench, Package, ChevronDown, ChevronUp,
  BarChart3, AlertTriangle, CheckCircle2
} from "lucide-react";
import { useLang } from "@/context/LangContext";

type Category = "seed" | "fertilizer" | "pesticide" | "labor" | "water" | "equipment" | "transport" | "other";

interface Expense {
  id: string;
  category: Category;
  label: string;
  amount: number;
  date: string;
}

const CATEGORY_CONFIG: Record<Category, { icon: typeof Sprout; color: string; bg: string; labelEn: string; labelHi: string; labelTa: string }> = {
  seed: { icon: Sprout, color: "text-lime-600", bg: "bg-lime-500/15", labelEn: "Seeds", labelHi: "बीज", labelTa: "விதைகள்" },
  fertilizer: { icon: Package, color: "text-yellow-600", bg: "bg-yellow-500/15", labelEn: "Fertilizer", labelHi: "उर्वरक", labelTa: "உரம்" },
  pesticide: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/15", labelEn: "Pesticide", labelHi: "कीटनाशक", labelTa: "பூச்சிக்கொல்லி" },
  labor: { icon: Users, color: "text-blue-500", bg: "bg-blue-500/15", labelEn: "Labor", labelHi: "मजदूरी", labelTa: "தொழிலாளர்" },
  water: { icon: Droplets, color: "text-cyan-500", bg: "bg-cyan-500/15", labelEn: "Irrigation", labelHi: "सिंचाई", labelTa: "நீர்ப்பாசனம்" },
  equipment: { icon: Wrench, color: "text-violet-500", bg: "bg-violet-500/15", labelEn: "Equipment", labelHi: "उपकरण", labelTa: "கருவிகள்" },
  transport: { icon: Truck, color: "text-orange-500", bg: "bg-orange-500/15", labelEn: "Transport", labelHi: "परिवहन", labelTa: "போக்குவரத்து" },
  other: { icon: IndianRupee, color: "text-gray-500", bg: "bg-gray-500/15", labelEn: "Other", labelHi: "अन्य", labelTa: "மற்றவை" },
};

const LABELS_EXTRA = {
  en: {
    title: "Crop Expense Tracker",
    subtitle: "Track your farming costs & calculate profit",
    addExpense: "Add Expense",
    category: "Category",
    description: "Description",
    amount: "Amount (₹)",
    date: "Date",
    add: "Add",
    totalExpenses: "Total Expenses",
    expectedRevenue: "Expected Revenue",
    estimatedProfit: "Est. Profit / Loss",
    profitLabel: "Profit",
    lossLabel: "Loss",
    breakEven: "Break Even",
    expenseBreakdown: "Expense Breakdown",
    noExpenses: "No expenses added yet",
    noExpensesDesc: "Start adding your farming expenses to track costs",
    revenueHint: "Enter expected selling price × quantity",
    cropName: "Crop / Season Name",
    profitMargin: "Profit Margin",
    costPerAcre: "Cost / Acre",
    summary: "Summary",
    advice: "Financial Advice",
    adviceHigh: "Expenses are high. Consider reducing pesticide use with integrated pest management.",
    adviceMedium: "Costs are moderate. Optimize water usage with drip irrigation for savings.",
    adviceLow: "Good cost management! Consider bulk purchase of fertilizers for next season.",
    delete: "Delete",
    revenueInput: "Set Expected Revenue",
  },
  hi: {
    title: "फसल खर्च ट्रैकर",
    subtitle: "खेती की लागत ट्रैक करें और मुनाफा जानें",
    addExpense: "खर्च जोड़ें",
    category: "श्रेणी",
    description: "विवरण",
    amount: "राशि (₹)",
    date: "तारीख",
    add: "जोड़ें",
    totalExpenses: "कुल खर्च",
    expectedRevenue: "अपेक्षित आय",
    estimatedProfit: "अनुमानित लाभ / हानि",
    profitLabel: "लाभ",
    lossLabel: "हानि",
    breakEven: "समतुल्य",
    expenseBreakdown: "खर्च विवरण",
    noExpenses: "अभी कोई खर्च नहीं जोड़ा",
    noExpensesDesc: "लागत ट्रैक करने के लिए खेती का खर्च जोड़ें",
    revenueHint: "बिक्री मूल्य × मात्रा दर्ज करें",
    cropName: "फसल / सीजन नाम",
    profitMargin: "लाभ मार्जिन",
    costPerAcre: "लागत / एकड़",
    summary: "सारांश",
    advice: "वित्तीय सुझाव",
    adviceHigh: "खर्च अधिक है। एकीकृत कीट प्रबंधन से कीटनाशक खर्च कम करें।",
    adviceMedium: "लागत मध्यम है। ड्रिप सिंचाई से पानी की बचत करें।",
    adviceLow: "अच्छा लागत प्रबंधन! अगले सीजन के लिए उर्वरक थोक में खरीदें।",
    delete: "हटाएं",
    revenueInput: "अपेक्षित आय दर्ज करें",
  },
  ta: {
    title: "பயிர் செலவு கண்காணிப்பு",
    subtitle: "விவசாய செலவுகளை கண்காணித்து லாபம் கணக்கிடுங்கள்",
    addExpense: "செலவு சேர்க்கவும்",
    category: "வகை",
    description: "விவரம்",
    amount: "தொகை (₹)",
    date: "தேதி",
    add: "சேர்",
    totalExpenses: "மொத்த செலவு",
    expectedRevenue: "எதிர்பார்க்கும் வருவாய்",
    estimatedProfit: "மதிப்பிடப்பட்ட லாபம் / நஷ்டம்",
    profitLabel: "லாபம்",
    lossLabel: "நஷ்டம்",
    breakEven: "சரிசமம்",
    expenseBreakdown: "செலவு விவரம்",
    noExpenses: "இன்னும் செலவுகள் சேர்க்கப்படவில்லை",
    noExpensesDesc: "விவசாய செலவுகளை சேர்க்கத் தொடங்குங்கள்",
    revenueHint: "விற்பனை விலை × அளவை உள்ளிடவும்",
    cropName: "பயிர் / பருவம் பெயர்",
    profitMargin: "லாப விகிதம்",
    costPerAcre: "செலவு / ஏக்கர்",
    summary: "சுருக்கம்",
    advice: "நிதி ஆலோசனை",
    adviceHigh: "செலவு அதிகம். ஒருங்கிணைந்த பூச்சி மேலாண்மையால் பூச்சிக்கொல்லி செலவை குறைக்கவும்.",
    adviceMedium: "செலவு மிதமானது. சொட்டு நீர்ப்பாசனம் மூலம் நீர் சேமிக்கவும்.",
    adviceLow: "நல்ல செலவு மேலாண்மை! அடுத்த பருவத்திற்கு மொத்தமாக உரம் வாங்கவும்.",
    delete: "நீக்கு",
    revenueInput: "எதிர்பார்க்கும் வருவாயை உள்ளிடவும்",
  },
};

const INITIAL_EXPENSES: Expense[] = [
  { id: "1", category: "seed", label: "Paddy seeds (50 kg)", amount: 3000, date: new Date().toISOString().split("T")[0] },
  { id: "2", category: "fertilizer", label: "Urea + DAP", amount: 4500, date: new Date().toISOString().split("T")[0] },
  { id: "3", category: "labor", label: "Ploughing & sowing", amount: 6000, date: new Date().toISOString().split("T")[0] },
  { id: "4", category: "water", label: "Irrigation charges", amount: 2000, date: new Date().toISOString().split("T")[0] },
];

export default function ExpenseTracker() {
  const { lang } = useLang();
  const t = LABELS_EXTRA[lang];

  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [cropName, setCropName] = useState("Paddy – Kharif 2025");
  const [revenue, setRevenue] = useState(22000);
  const [acreCount, setAcreCount] = useState(2);
  const [showForm, setShowForm] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const [form, setForm] = useState({ category: "seed" as Category, label: "", amount: "", date: new Date().toISOString().split("T")[0] });

  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const profit = revenue - totalExpenses;
  const profitMargin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;
  const costPerAcre = acreCount > 0 ? Math.round(totalExpenses / acreCount) : 0;

  const byCategory = useMemo(() => {
    const acc: Record<string, number> = {};
    expenses.forEach(e => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
    });
    return Object.entries(acc).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const handleAdd = () => {
    if (!form.label || !form.amount) return;
    setExpenses(prev => [...prev, { id: crypto.randomUUID(), ...form, amount: Number(form.amount) }]);
    setForm({ category: "seed", label: "", amount: "", date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
  };

  const handleDelete = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));

  const getCatLabel = (cat: Category) => {
    const c = CATEGORY_CONFIG[cat];
    return lang === "hi" ? c.labelHi : lang === "ta" ? c.labelTa : c.labelEn;
  };

  const adviceText = totalExpenses > 18000 ? t.adviceHigh : totalExpenses > 10000 ? t.adviceMedium : t.adviceLow;

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient rounded-3xl p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <BarChart3 size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl font-black">{t.title}</h1>
            <p className="text-white/70 text-xs">{t.subtitle}</p>
          </div>
        </div>
        <input
          value={cropName}
          onChange={e => setCropName(e.target.value)}
          placeholder={t.cropName}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15"
        />
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t.totalExpenses, value: `₹${totalExpenses.toLocaleString("en-IN")}`, color: "text-destructive", bg: "bg-destructive/10" },
          { label: t.expectedRevenue, value: `₹${revenue.toLocaleString("en-IN")}`, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          {
            label: profit >= 0 ? t.profitLabel : t.lossLabel,
            value: `${profit >= 0 ? "+" : ""}₹${Math.abs(profit).toLocaleString("en-IN")}`,
            color: profit >= 0 ? "text-emerald-600" : "text-destructive",
            bg: profit >= 0 ? "bg-emerald-500/10" : "bg-destructive/10"
          },
        ].map(({ label, value, color, bg }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className={`glass-card rounded-2xl p-3 text-center ${bg}`}
          >
            <p className="text-xs text-muted-foreground mb-1 leading-tight">{label}</p>
            <p className={`font-display font-black text-base leading-tight ${color}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue & Metrics */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-sm">{t.summary}</h3>
        {/* Revenue Input */}
        <div>
          <label className="text-xs text-muted-foreground font-medium block mb-1">{t.revenueInput}</label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">₹</span>
            <input
              type="number"
              value={revenue}
              onChange={e => setRevenue(Number(e.target.value))}
              className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{t.revenueHint}</p>
        </div>
        {/* Acres */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground font-medium block mb-1">Acres</label>
            <input
              type="number"
              min={1}
              value={acreCount}
              onChange={e => setAcreCount(Number(e.target.value))}
              className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground font-medium block mb-1">{t.profitMargin}</label>
            <div className={`rounded-xl px-3 py-2 text-sm font-bold ${profit >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"}`}>
              {profitMargin}%
            </div>
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground font-medium block mb-1">{t.costPerAcre}</label>
            <div className="rounded-xl bg-muted/50 px-3 py-2 text-sm font-bold">
              ₹{costPerAcre.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Profit Bar */}
        {revenue > 0 && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{t.totalExpenses}</span>
              <span>{Math.min(100, Math.round((totalExpenses / revenue) * 100))}% of revenue</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (totalExpenses / Math.max(revenue, 1)) * 100)}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`h-full rounded-full ${profit >= 0 ? "bg-emerald-500" : "bg-destructive"}`}
              />
            </div>
          </div>
        )}

        {/* Financial Advice */}
        <div className={`flex items-start gap-2 p-3 rounded-xl ${profit >= 0 ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
          {profit >= 0 ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" /> : <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />}
          <p className="text-xs text-muted-foreground">{adviceText}</p>
        </div>
      </motion.div>

      {/* Expense Breakdown */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between p-5"
        >
          <div className="flex items-center gap-2">
            <BarChart3 size={15} className="text-primary" />
            <h3 className="font-semibold text-sm">{t.expenseBreakdown}</h3>
          </div>
          {showBreakdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-3">
                {byCategory.map(([cat, amount]) => {
                  const cfg = CATEGORY_CONFIG[cat as Category];
                  const Icon = cfg.icon;
                  const pct = Math.round((amount / totalExpenses) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-lg ${cfg.bg} flex items-center justify-center`}>
                            <Icon size={11} className={cfg.color} />
                          </div>
                          <span className="text-xs font-medium">{getCatLabel(cat as Category)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold">₹{amount.toLocaleString("en-IN")}</span>
                          <span className="text-xs text-muted-foreground ml-1">({pct}%)</span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6 }}
                          className={`h-full rounded-full ${cfg.color.replace("text-", "bg-")}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Expense List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{expenses.length} items</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <PlusCircle size={13} />
            {t.addExpense}
          </button>
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card rounded-2xl p-4 space-y-3 border border-primary/20">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground font-medium block mb-1">{t.category}</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
                      className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    >
                      {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                        <option key={key} value={key}>{getCatLabel(key as Category)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium block mb-1">{t.amount}</label>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                      placeholder="₹"
                      className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium block mb-1">{t.description}</label>
                  <input
                    type="text"
                    value={form.label}
                    onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                    placeholder="e.g. Urea 50kg"
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <button
                  onClick={handleAdd}
                  disabled={!form.label || !form.amount}
                  className="w-full py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {t.add}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {expenses.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <IndianRupee size={32} className="text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm font-medium text-muted-foreground">{t.noExpenses}</p>
            <p className="text-xs text-muted-foreground/60 mt-1">{t.noExpensesDesc}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.map((expense, i) => {
              const cfg = CATEGORY_CONFIG[expense.category];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-card rounded-xl p-3 flex items-center gap-3"
                >
                  <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={14} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{expense.label}</p>
                    <p className="text-xs text-muted-foreground">{getCatLabel(expense.category)} · {expense.date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold">₹{expense.amount.toLocaleString("en-IN")}</span>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Profit / Loss Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-2xl p-5 flex items-center gap-4 ${profit >= 0 ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-destructive/10 border border-destructive/20"}`}
      >
        {profit >= 0
          ? <TrendingUp size={28} className="text-emerald-600 shrink-0" />
          : <TrendingDown size={28} className="text-destructive shrink-0" />
        }
        <div>
          <p className="text-xs text-muted-foreground font-medium">{t.estimatedProfit}</p>
          <p className={`text-2xl font-display font-black ${profit >= 0 ? "text-emerald-600" : "text-destructive"}`}>
            {profit >= 0 ? "+" : ""}₹{Math.abs(profit).toLocaleString("en-IN")}
          </p>
          {acreCount > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              ₹{Math.round(Math.abs(profit) / acreCount).toLocaleString("en-IN")} per acre · {profitMargin}% margin
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
