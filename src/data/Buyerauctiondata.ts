// ─── Types ────────────────────────────────────────────────────────────────────

export type AuctionStatus = "ongoing" | "ended" | "won" | "lost";
export type PaymentStatus = "pending" | "processing" | "paid" | "failed";
export type DeliveryStatus = "awaiting" | "preparing" | "shipped" | "in_transit" | "delivered";

export interface BidEntry {
  amount: number;
  time: string;
}

export interface BuyerAuction {
  _id: string;
  name: string;
  image: string;
  category: string;
  myBid: number;
  currentBid: number;
  startingPrice: number;
  endTime: string;
  startTime: string;
  status: AuctionStatus;
  totalBids: number;
  bidHistory: BidEntry[];
  seller: string;
  sellerRating: number;
  description: string;
  condition: string;
  // Only present when status === "won"
  paymentStatus?: PaymentStatus;
  deliveryStatus?: DeliveryStatus;
  deliveryAddress?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  invoiceId?: string;
  totalPaid?: number;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const now = new Date();

const future = (hours: number) =>
  new Date(now.getTime() + hours * 3600000).toISOString();
const past = (hours: number) =>
  new Date(now.getTime() - hours * 3600000).toISOString();

export const MOCK_BUYER_AUCTIONS: BuyerAuction[] = [
  // ── Ongoing ──
  {
    _id: "a1",
    name: "1967 Ford Mustang Fastback",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600",
    category: "Vehicles",
    myBid: 48500,
    currentBid: 51200,
    startingPrice: 40000,
    startTime: past(24),
    endTime: future(8),
    status: "ongoing",
    totalBids: 23,
    bidHistory: [
      { amount: 41000, time: past(23) },
      { amount: 44000, time: past(18) },
      { amount: 47000, time: past(10) },
      { amount: 48500, time: past(3) },
    ],
    seller: "ClassicMotors_US",
    sellerRating: 4.9,
    description: "Fully restored 1967 Mustang Fastback in Highland Green. Numbers matching 390 big block.",
    condition: "Restored",
  },
  {
    _id: "a2",
    name: "Rolex Submariner 116610LN",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600",
    category: "Jewelry",
    myBid: 12800,
    currentBid: 12800,
    startingPrice: 10000,
    startTime: past(12),
    endTime: future(2),
    status: "ongoing",
    totalBids: 14,
    bidHistory: [
      { amount: 10500, time: past(11) },
      { amount: 11200, time: past(8) },
      { amount: 12000, time: past(4) },
      { amount: 12800, time: past(1) },
    ],
    seller: "LuxuryWatches_HK",
    sellerRating: 4.7,
    description: "Rolex Submariner Date, reference 116610LN. Complete set with box, papers, and extra links.",
    condition: "Excellent",
  },
  {
    _id: "a3",
    name: "Banksy — Girl With Balloon (Print)",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600",
    category: "Art",
    myBid: 3200,
    currentBid: 3900,
    startingPrice: 2000,
    startTime: past(36),
    endTime: future(24),
    status: "ongoing",
    totalBids: 31,
    bidHistory: [
      { amount: 2100, time: past(35) },
      { amount: 2800, time: past(20) },
      { amount: 3200, time: past(6) },
    ],
    seller: "StreetArtGallery",
    sellerRating: 4.6,
    description: "Authenticated Banksy screen print, limited edition of 500. Certificate of authenticity included.",
    condition: "Mint",
  },
  // ── Ended – won ──
  {
    _id: "a4",
    name: "Gibson Les Paul '59 Reissue",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600",
    category: "Collectibles",
    myBid: 18000,
    currentBid: 18000,
    startingPrice: 12000,
    startTime: past(96),
    endTime: past(24),
    status: "won",
    totalBids: 19,
    bidHistory: [
      { amount: 12500, time: past(95) },
      { amount: 15000, time: past(72) },
      { amount: 17000, time: past(48) },
      { amount: 18000, time: past(25) },
    ],
    seller: "VintageInstruments",
    sellerRating: 5.0,
    description: "1959 Les Paul Standard Reissue. Hand-selected top, aged hardware, OHSC.",
    condition: "Excellent",
    paymentStatus: "paid",
    deliveryStatus: "in_transit",
    deliveryAddress: "42 Maple Street, Dhaka 1207",
    trackingNumber: "DHL-7832946510",
    estimatedDelivery: "Jun 10, 2026",
    invoiceId: "INV-2024-0041",
    totalPaid: 18900,
  },
  {
    _id: "a5",
    name: "Apple Mac Pro M2 Ultra",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
    category: "Electronics",
    myBid: 5800,
    currentBid: 5800,
    startingPrice: 4500,
    startTime: past(120),
    endTime: past(48),
    status: "won",
    totalBids: 11,
    bidHistory: [
      { amount: 4600, time: past(119) },
      { amount: 5200, time: past(96) },
      { amount: 5800, time: past(50) },
    ],
    seller: "TechResellers_BD",
    sellerRating: 4.8,
    description: "Apple Mac Pro M2 Ultra, 192GB RAM, 8TB SSD. Sealed box with 1 year Apple Care.",
    condition: "New",
    paymentStatus: "pending",
    deliveryStatus: "awaiting",
    deliveryAddress: "15 Gulshan Ave, Dhaka 1212",
    invoiceId: "INV-2024-0052",
    totalPaid: 6090,
  },
  {
    _id: "a6",
    name: "First Edition Harry Potter Philosopher's Stone",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600",
    category: "Collectibles",
    myBid: 9500,
    currentBid: 9500,
    startingPrice: 7000,
    startTime: past(200),
    endTime: past(120),
    status: "won",
    totalBids: 28,
    bidHistory: [
      { amount: 7200, time: past(198) },
      { amount: 8000, time: past(160) },
      { amount: 9000, time: past(130) },
      { amount: 9500, time: past(122) },
    ],
    seller: "RareBooksLondon",
    sellerRating: 4.9,
    description: "True first edition, first printing. 1997 Bloomsbury. Minor shelf wear, unclipped dust jacket.",
    condition: "Very Good",
    paymentStatus: "paid",
    deliveryStatus: "delivered",
    deliveryAddress: "42 Maple Street, Dhaka 1207",
    trackingNumber: "FedEx-4492817630",
    estimatedDelivery: "May 20, 2026",
    invoiceId: "INV-2024-0031",
    totalPaid: 9975,
  },
  // ── Ended – lost ──
  {
    _id: "a7",
    name: "Patek Philippe Nautilus 5711",
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600",
    category: "Jewelry",
    myBid: 95000,
    currentBid: 118000,
    startingPrice: 80000,
    startTime: past(168),
    endTime: past(72),
    status: "lost",
    totalBids: 47,
    bidHistory: [
      { amount: 82000, time: past(165) },
      { amount: 90000, time: past(130) },
      { amount: 95000, time: past(80) },
    ],
    seller: "GenevaAuctions",
    sellerRating: 5.0,
    description: "Patek Philippe Nautilus 5711/1A-010. Full set, mint condition.",
    condition: "Mint",
  },
  {
    _id: "a8",
    name: "Vintage Leica M3 Double Stroke",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600",
    category: "Collectibles",
    myBid: 2200,
    currentBid: 2750,
    startingPrice: 1500,
    startTime: past(144),
    endTime: past(48),
    status: "lost",
    totalBids: 16,
    bidHistory: [
      { amount: 1600, time: past(140) },
      { amount: 1900, time: past(100) },
      { amount: 2200, time: past(60) },
    ],
    seller: "CameraCollectors",
    sellerRating: 4.5,
    description: "1954 Leica M3 double stroke rangefinder. Fully CLA'd, light seals replaced.",
    condition: "Good",
  },
];