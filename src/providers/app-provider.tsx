import { ReduxProvider } from "./redux-providers";
import { ThemeProvider } from "./theme-provider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ReduxProvider>
  );
};
