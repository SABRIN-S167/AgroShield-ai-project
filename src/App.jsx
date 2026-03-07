import Navbar from "./screens/common/Navbar";
import RainPredictor from "./screens/pages/RainPredictor";
import LocustPredictor from "./screens/pages/LocustPredictor";
import PestPredictor from "./screens/pages/PestPredictor";

import { Routes, Route } from "react-router";
import Dashboard from "./screens/pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen flex bg-background">
      <Navbar />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        <div className="max-w-2xl mx-auto px-4 py-6 pb-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rain" element={<RainPredictor />} />
            <Route path="/locust" element={<LocustPredictor />} />
            <Route path="/pest" element={<PestPredictor />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
