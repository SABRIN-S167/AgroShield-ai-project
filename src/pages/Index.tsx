import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import RainPredictor from "@/components/predictors/RainPredictor";
import PestPredictor from "@/components/predictors/PestPredictor";
import LocustPredictor from "@/components/predictors/LocustPredictor";
import WhatIfSimulator from "@/components/WhatIfSimulator";
import RiskHistory from "@/components/RiskHistory";
import DistrictHeatmap from "@/components/DistrictHeatmap";
import ChatbotAdvisor from "@/components/ChatbotAdvisor";
import CropRecommendationEngine from "@/components/CropRecommendationEngine";
import MarketPriceDashboard from "@/components/MarketPriceDashboard";
import GovernmentSchemes from "@/components/GovernmentSchemes";
import ExpenseTracker from "@/components/ExpenseTracker";
import { LangProvider } from "@/context/LangContext";

export default function Index() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTab = (navigate: (tab: string) => void) => {
    switch (activeTab) {
      case "dashboard": return <Dashboard onNavigate={navigate} />;
      case "rain": return <RainPredictor />;
      case "pest": return <PestPredictor />;
      case "locust": return <LocustPredictor />;
      case "simulator": return <WhatIfSimulator />;
      case "heatmap": return <DistrictHeatmap />;
      case "chatbot": return <ChatbotAdvisor />;
      case "history": return <RiskHistory />;
      case "crop-recommend": return <CropRecommendationEngine />;
      case "market": return <MarketPriceDashboard />;
      case "schemes": return <GovernmentSchemes />;
      case "expenses": return <ExpenseTracker />;
      default: return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <LangProvider>
      <div className="min-h-screen flex bg-background">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:pt-0 pt-14">
          <div className="max-w-3xl mx-auto px-4 py-6 pb-16">

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {renderTab(setActiveTab)}
              </motion.div>
            </AnimatePresence>

            {/* ✅ BUTTON OUTSIDE animation (SAFE) */}
            <div style={{ marginTop: "20px" }}>
  <a href="/smart-agriculture-final.html" target="_blank">
    <button
      style={{
        padding: "10px",
        backgroundColor: "green",
        color: "white",
        borderRadius: "5px",
        cursor: "pointer"
      }}
    >
      Open Agriculture Dashboard
    </button>
  </a>
</div>

          </div>
        </main>
      </div>
    </LangProvider>
  );
}