import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type BrowseMode = "women" | "men";

interface BrowseModeContextValue {
  browseMode: BrowseMode;
  setBrowseMode: (mode: BrowseMode) => void;
  toggleBrowseMode: () => void;
}

const STORAGE_KEY = "royal-prince-fashion.browseMode";

const BrowseModeContext = createContext<BrowseModeContextValue | undefined>(undefined);

function readInitialMode(): BrowseMode {
  if (typeof window === "undefined") {
    return "women";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "men" ? "men" : "women";
}

export function BrowseModeProvider({ children }: { children: ReactNode }) {
  const [browseMode, setBrowseMode] = useState<BrowseMode>(readInitialMode);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, browseMode);
  }, [browseMode]);

  const value = useMemo(
    () => ({
      browseMode,
      setBrowseMode,
      toggleBrowseMode: () => {
        setBrowseMode((current) => (current === "women" ? "men" : "women"));
      },
    }),
    [browseMode]
  );

  return <BrowseModeContext.Provider value={value}>{children}</BrowseModeContext.Provider>;
}

export function useBrowseMode() {
  const context = useContext(BrowseModeContext);
  if (!context) {
    throw new Error("useBrowseMode must be used within BrowseModeProvider");
  }
  return context;
}
