// src/hooks/useTheme.ts

import { setTheme, toggleTheme } from "../app/redux/features/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../app/redux/hooks";

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  const isDarkMode = theme === "dark";

  const toggle = () => dispatch(toggleTheme());

  const set = (mode: "light" | "dark") => dispatch(setTheme(mode));

  return {
    theme,
    isDarkMode,
    toggleTheme: toggle,
    setTheme: set,
  };
};