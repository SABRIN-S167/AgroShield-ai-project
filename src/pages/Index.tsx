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
import { LangProvider } from "@/context/LangContext";

const tabs: Record<string, React.ReactNode> = {};

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
          </div>
        </main>
      </div>
    </LangProvider>
  );
}
