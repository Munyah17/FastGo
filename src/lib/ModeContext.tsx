"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { driverToday } from "@/lib/data";

export type AppMode = "passenger" | "driver";

const ModeContext = createContext<{
  mode: AppMode;
  setMode: (m: AppMode) => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  online: boolean;
  setOnline: (v: boolean) => void;
} | null>(null);

const STORAGE_KEY = "fastgo-mode";

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppMode>("passenger");
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Driver's go-online/offline status — lives here (not in DriverHome) so
  // the retractable sidebar's toggle and the home tab stay in sync without
  // the home tab needing to render any online/offline UI of its own.
  const [online, setOnline] = useState(driverToday.online);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "passenger" || stored === "driver") setModeState(stored);
  }, []);

  const setMode = (m: AppMode) => {
    setModeState(m);
    window.localStorage.setItem(STORAGE_KEY, m);
  };

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
        online,
        setOnline,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within a ModeProvider");
  return ctx;
}
