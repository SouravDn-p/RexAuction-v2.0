export type AuctionStatus = "Active" | "Accepted" | "Ended" | "pending" | "Rejected";

export interface BidEntry {
  id: string;
  auctionId: string;
  userId: string;
  amount: number;
  createdAt: string;
}

export interface AuctionItem {
  _id: string;
  name: string;
  category: string;
  description: string;
  startingPrice: number;
  currentBid?: number; // Optional, as items might not have bids yet
  status: AuctionStatus;
  startTime: string;
  endTime: string;
  images: string[];
  condition: string;
  itemYear: number;
  history: string;
  reference: string;
  sellerDisplayName: string;
  sellerEmail: string;
  sellerPhotoUrl: string;
  bidHistory?: BidEntry[];
}