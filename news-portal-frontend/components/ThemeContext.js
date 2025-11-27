// components/ThemeContext.js
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const lightTheme = {
  pageBg: "#e5e7eb",
  pageText: "#111827",
  headerBg: "linear-gradient(135deg, #020617 0%, #020617 40%, #111827 100%)",
  headerCapsuleBg: "rgba(255,255,255,0.10)",
  headerBorder: "rgba(148,163,184,0.35)",
  headerSubText: "#9ca3af",
};

const darkTheme = {
  pageBg: "#0f172a",
  pageText: "#e2e8f0",
  headerBg: "linear-gradient(135deg, #020617 0%, #020617 100%)",
  headerCapsuleBg: "rgba(255,255,255,0.06)",
  headerBorder: "rgba(255,255,255,0.12)",
  headerSubText: "#cbd5e1",
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("system");
  const [effectiveMode, setEffectiveMode] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme-mode");
    if (saved === "light" || saved === "dark" || saved === "system") {
      setMode(saved);
    }
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      const finalMode = mode === "system" ? (prefersDark ? "dark" : "light") : mode;
      setEffectiveMode(finalMode);

      const theme = finalMode === "dark" ? darkTheme : lightTheme;

      document.body.style.backgroundColor = theme.pageBg;
      document.body.style.color = theme.pageText;
    };

    applyTheme();

    if (mode === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme();
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, [mode]);

  const theme = effectiveMode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        mode,
        effectiveMode,
        theme,
        setMode: (m) => {
          setMode(m);
          localStorage.setItem("theme-mode", m);
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
