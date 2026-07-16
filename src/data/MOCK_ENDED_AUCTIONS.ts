// src/data/MOCK_ENDED_AUCTIONS.ts

export interface TopBidder {
  name: string;
  email: string;
  amount: number;
  photo: string;
}

export interface EndedAuction {
  _id: string;
  name: string;
  category: string;
  startingPrice: number;
  currentBid: number;
  startTime: string;
  endTime: string;
  images: string[];
  condition: string;
  itemYear: number;
  sellerDisplayName: string;
  sellerEmail: string;
  description: string;
  topBidders: TopBidder[];
  paymentStatus?: "pending" | "completed" | "processing";
  deliveryStatus?: "awaiting" | "shipped" | "delivered";
}

export const MOCK_ENDED_AUCTIONS: EndedAuction[] = [
  {
    _id: "ea1",
    name: "Vintage Rolex Submariner 1965",
    category: "Watches",
    startingPrice: 12500,
    currentBid: 18750,
    startTime: "2025-05-15T10:00:00",
    endTime: "2025-05-22T22:00:00",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f4574771d1c",
      "https://images.unsplash.com/photo-1547996160-8d8d8f8f8f8f",
    ],
    condition: "Excellent",
    itemYear: 1965,
    sellerDisplayName: "Ahmed Khan",
    sellerEmail: "ahmed@auction.com",
    description: "Rare vintage Rolex with original papers, box, and certificate of authenticity. Excellent condition with minimal signs of wear.",
    topBidders: [
      { name: "Sadia Rahman", email: "sadia@gmail.com", amount: 18750, photo: "https://i.pravatar.cc/150?img=1" },
      { name: "Rahim Khan", email: "rahim@gmail.com", amount: 17200, photo: "https://i.pravatar.cc/150?img=2" },
      { name: "Nadia Islam", email: "nadia@gmail.com", amount: 16500, photo: "https://i.pravatar.cc/150?img=3" },
    ],
    paymentStatus: "completed",
    deliveryStatus: "delivered",
  },
  {
    _id: "ea2",
    name: "Signed Lionel Messi Jersey",
    category: "Sports Memorabilia",
    startingPrice: 3200,
    currentBid: 5200,
    startTime: "2025-05-10T14:00:00",
    endTime: "2025-05-18T20:00:00",
    images: ["https://images.unsplash.com/photo-1613856628977-0f8c6e2c5f3e"],
    condition: "New",
    itemYear: 2024,
    sellerDisplayName: "Sports Gallery",
    sellerEmail: "sports@auction.com",
    description: "Match-worn jersey signed by Lionel Messi with certificate of authenticity.",
    topBidders: [
      { name: "Fahim Ahmed", email: "fahim@gmail.com", amount: 5200, photo: "https://i.pravatar.cc/150?img=4" },
      { name: "Tania Akter", email: "tania@gmail.com", amount: 4800, photo: "https://i.pravatar.cc/150?img=5" },
    ],
    paymentStatus: "completed",
    deliveryStatus: "shipped",
  },
  {
    _id: "ea3",
    name: "1967 Shelby GT500 Eleanor",
    category: "Vehicles",
    startingPrice: 85000,
    currentBid: 112500,
    startTime: "2025-05-01T09:00:00",
    endTime: "2025-05-20T18:00:00",
    images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf"],
    condition: "Restored",
    itemYear: 1967,
    sellerDisplayName: "Heritage Motors",
    sellerEmail: "heritage@motors.com",
    description: "Meticulously restored iconic muscle car with documented history.",
    topBidders: [
      { name: "Victor Morales", email: "victor@gmail.com", amount: 112500, photo: "https://i.pravatar.cc/150?img=6" },
    ],
    paymentStatus: "pending",
    deliveryStatus: "awaiting",
  },
  {
    _id: "ea4",
    name: "Diamond Pendant Necklace",
    category: "Jewelry",
    startingPrice: 8500,
    currentBid: 12400,
    startTime: "2025-05-12T11:00:00",
    endTime: "2025-05-25T15:00:00",
    images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338"],
    condition: "New",
    itemYear: 2024,
    sellerDisplayName: "Luxury Gems",
    sellerEmail: "gems@luxury.com",
    description: "18k white gold with 2.5 carat diamond pendant. GIA certified.",
    topBidders: [
      { name: "Meherun Nisa", email: "meherun@gmail.com", amount: 12400, photo: "https://i.pravatar.cc/150?img=7" },
      { name: "Omar Faruk", email: "omar@gmail.com", amount: 11800, photo: "https://i.pravatar.cc/150?img=8" },
    ],
    paymentStatus: "completed",
    deliveryStatus: "delivered",
  },
];

export default MOCK_ENDED_AUCTIONS;