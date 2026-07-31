import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const DEFAULT_THEME = "vs-dark";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return (
      localStorage.getItem("editor-theme") ||
      DEFAULT_THEME
    );
  });

  useEffect(() => {
    localStorage.setItem("editor-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "vs-dark" ? "light" : "vs-dark"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useThemeContext must be used inside ThemeProvider"
    );
  }

  return context;
}