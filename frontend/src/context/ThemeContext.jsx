import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
const ThemeContext = createContext(null);
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('tripmate_dark_mode');
    return saved === 'true' || (saved === null && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('tripmate_dark_mode', String(isDarkMode));
  }, [isDarkMode]);
  const value = useMemo(() => ({ isDarkMode, toggleDarkMode: () => setIsDarkMode(v => !v), setDarkMode: setIsDarkMode }), [isDarkMode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
