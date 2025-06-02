// hooks/useThemeColors.js
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

const themeByPath = {
  "/": 0,
  "/create": 0,
  "/game": 1
};

const colorList = [
  { bg: "bg-primary", text: "text-primary-content", btn: "btn-primary" },
  { bg: "bg-secondary", text: "text-secondary-content", btn: "btn-secondary" }
];

const useThemeColors = () => {
  const location = useLocation();

  return useMemo(() => {
    const index = themeByPath[location.pathname] ?? 0;
    return colorList[index];
  }, [location.pathname]);
};

export default useThemeColors;
