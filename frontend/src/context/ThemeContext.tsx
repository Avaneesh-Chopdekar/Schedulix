import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const storageKey = "schedulix-theme";

function getInitialMode(): ThemeMode {
  const saved = window.localStorage.getItem(storageKey);
  return saved === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === "dark" ? "#90caf9" : "#1976d2" },
          background: {
            default: mode === "dark" ? "#121212" : "#f8fafc",
            paper: mode === "dark" ? "#1d1d1d" : "#ffffff",
          },
        },
        shape: { borderRadius: 10 },
      }),
    [mode],
  );

  function toggleMode() {
    setMode((current) => {
      const next = current === "light" ? "dark" : "light";
      window.localStorage.setItem(storageKey, next);
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeMode must be used inside ThemeProvider.");
  return context;
}
