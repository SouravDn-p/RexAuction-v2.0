export type Role = "buyer" | "seller" | "admin";

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: "Deposit" | "Withdrawal" | "purchase";
  description: string;
  status: "pending" | "completed" | "won" | "lost";
}

export interface MockUser {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;

  role: Role;

  status: "active" | "inactive" | "suspended";

  auctionsWon: number;
  activeBids: number;
  biddingHistory: number;
  ongoingBids: number;

  totalSpent: number;
  accountBalance: number;

  location: string;
  memberSince: string;

  transactions: Transaction[];
} 

export const MOCK_USER: MockUser = {
  uid: "mock-user-001",
  email: "demo@rexauction.com",
  name: "Sourav Debnath",
  role: "admin",
  photoURL: "https://res.cloudinary.com/dc6zbxbvm/image/upload/v1778042327/projects/lln9m2puev0eytzinxnd.jpg",
  status: "active",
  auctionsWon: 5,
  activeBids: 2,
  totalSpent: 1250,
  accountBalance: 500,
  biddingHistory: 15,
  ongoingBids: 2,
  location: "New York, USA",
  memberSince: "January 2024",
  transactions: [
    {
      id: "1",
      amount: 1250,
      date: "2023-04-01",
      type: "Deposit",
      description: "Auction 1",
      status: "won",
    },
    {
      id: "2",
      amount: 500,
      date: "2023-04-01",
      type: "Withdrawal",
      description: "Auction 2",
      status: "lost",
    }
  ],
};