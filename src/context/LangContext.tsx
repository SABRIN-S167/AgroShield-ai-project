import React, { createContext, useContext, useState } from "react";
import type { LangCode } from "@/lib/riskEngine";

interface LangContextType {
  lang: LangCode;
  setLang: (l: LangCode) => void;
}

const LangContext = createContext<LangContextType>({ lang: "en", setLang: () => {} });

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<LangCode>("en");
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);
