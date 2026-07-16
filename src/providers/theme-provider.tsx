import { useEffect } from "react";
import { useAppSelector } from "../app/redux/hooks";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
};
