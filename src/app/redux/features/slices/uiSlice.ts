import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  loading: boolean;
  modal: {
    open: boolean;
    type: string | null;
  };
}

const getInitialTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
    // Optional: check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }
  return "light";
};

const initialState: UiState = {
  theme: getInitialTheme(),
  sidebarOpen: false,
  loading: false,
  modal: {
    open: false,
    type: null,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },

    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      localStorage.setItem("theme", state.theme);
    },

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    openModal: (state, action: PayloadAction<string>) => {
      state.modal.open = true;
      state.modal.type = action.payload;
    },

    closeModal: (state) => {
      state.modal.open = false;
      state.modal.type = null;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setLoading,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;