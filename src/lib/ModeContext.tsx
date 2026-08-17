"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type AppMode = "passenger" | "driver";

const ModeContext = createContext<{
  mode: AppMode;
  setMode: (m: AppMode) => void;
} | null>(null);

const STORAGE_KEY = "fastgo-mode";

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppMode>("passenger");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "passenger" || stored === "driver") setModeState(stored);
  }, []);

  const setMode = (m: AppMode) => {
    setModeState(m);
    window.localStorage.setItem(STORAGE_KEY, m);
  };

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within a ModeProvider");
  return ctx;
}
