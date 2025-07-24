import { useState, useEffect } from "react";

const useDarkMode = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === "dark";
    root.classList.toggle("dark", isDark);
    console.log(
      `Theme set to ${theme}, dark mode is ${isDark ? "enabled" : "disabled"}`
    );
    localStorage.setItem("theme", theme);
  }, [theme]);

  return [theme, setTheme];
};

export default useDarkMode;
