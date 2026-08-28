import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserData {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  role: string;
  AuctionsWon: number;
  ActiveBids: number;
  TotalSpent: number;
  AccountBalance: number;
  BiddingHistory: number;
  onGoingBid: number;
  location: string;
  memberSince: string;
}

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorMessage: string | null;
}

// ─── Mock Users Database ──────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    email: "demo@example.com",
    password: "Demo123",
    userData: {
      uid: "mock-user-001",
      name: "Demo User",
      email: "demo@example.com",
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
      role: "buyer",
      AuctionsWon: 5,
      ActiveBids: 2,
      TotalSpent: 1250,
      AccountBalance: 500,
      BiddingHistory: 15,
      onGoingBid: 2,
      location: "New York, USA",
      memberSince: "January 2024",
    },
  },
];

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  errorMessage: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.errorMessage = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.errorMessage = null;
    },
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    clearError: (state) => {
      state.errorMessage = null;
    },
  },
});

// ─── Mock Auth Functions ──────────────────────────────────────────────────────
export const mockLogin = async (email: string, password: string): Promise<UserData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = MOCK_USERS.find((u) => u.email === email);

  if (!user) {
    throw new Error("No account found with this email address");
  }

  if (user.password !== password) {
    throw new Error("Incorrect password");
  }

  return user.userData;
};

export const mockRegister = async (userData: {
  name: string;
  email: string;
  password: string;
  photoURL?: string;
}): Promise<UserData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Check if user already exists
  const existingUser = MOCK_USERS.find((u) => u.email === userData.email);
  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  // Create new user
  const newUser: UserData = {
    uid: `mock-user-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    photoURL: userData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
    role: "buyer",
    AuctionsWon: 0,
    ActiveBids: 0,
    TotalSpent: 0,
    AccountBalance: 0,
    BiddingHistory: 0,
    onGoingBid: 0,
    location: "",
    memberSince: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };

  return newUser;
};

export const mockGoogleSignIn = async (): Promise<UserData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    uid: `mock-google-${Date.now()}`,
    name: "Google User",
    email: "user@gmail.com",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
    role: "buyer",
    AuctionsWon: 0,
    ActiveBids: 0,
    TotalSpent: 0,
    AccountBalance: 0,
    BiddingHistory: 0,
    onGoingBid: 0,
    location: "",
    memberSince: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };
};

export const mockPasswordReset = async (email: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Always succeed for mock (in real app, would check if email exists)
  console.log(`Password reset email sent to: ${email}`);
};

/** Prototype email OTP — always this code until a real mailer is wired. */
export const MOCK_EMAIL_OTP = "123456";

export const mockSendEmailOtp = async (email: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log(`Mock OTP for ${email}: ${MOCK_EMAIL_OTP}`);
};

export const mockVerifyEmailOtp = async (code: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (code.trim() !== MOCK_EMAIL_OTP) {
    throw new Error("Invalid or expired verification code");
  }
};

// ─── Exports ──────────────────────────────────────────────────────────────────
export const { setLoading, setUser, logout, setErrorMessage, clearError } = authSlice.actions;
export default authSlice.reducer;
