export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "auction" | "general";
  read: boolean;
  timestamp: string;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    _id: "1",
    title: "New Bid on Vintage Guitar",
    message: "Someone placed a $19,500 bid on your listed item.",
    type: "auction",
    read: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    _id: "2",
    title: "Auction Ending Soon",
    message: "The 1967 Ford Mustang auction ends in less than 1 hour.",
    type: "auction",
    read: false,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    _id: "3",
    title: "Outbid Alert",
    message: "You've been outbid on Diamond Necklace. Current bid: $9,200.",
    type: "general",
    read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "4",
    title: "Payment Confirmed",
    message: "Your payment of $3,200 for Limited Edition Sneakers was received.",
    type: "general",
    read: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "5",
    title: "New Auction Listed",
    message: "A new Antique Pocket Watch has been listed in your favourite category.",
    type: "auction",
    read: true,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];