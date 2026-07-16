// Mock users for chat
export const MOCK_CHAT_USERS = [
  {
    _id: "user-1",
    name: "Alice Johnson",
    email: "alice@example.com",
    photo: "https://i.pravatar.cc/150?img=1",
    role: "buyer",
    status: "online",
  },
  {
    _id: "user-2",
    name: "Bob Smith",
    email: "bob@example.com",
    photo: "https://i.pravatar.cc/150?img=2",
    role: "seller",
    status: "online",
  },
  {
    _id: "user-3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    photo: "https://i.pravatar.cc/150?img=3",
    role: "buyer",
    status: "offline",
  },
  {
    _id: "user-4",
    name: "Diana Prince",
    email: "diana@example.com",
    photo: "https://i.pravatar.cc/150?img=4",
    role: "admin",
    status: "online",
  },
  {
    _id: "user-5",
    name: "Ethan Hunt",
    email: "ethan@example.com",
    photo: "https://i.pravatar.cc/150?img=5",
    role: "seller",
    status: "offline",
  },
];

// Mock messages between current user and other users
interface MockMessage {
  messageId: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  status: string;
}

export const MOCK_MESSAGES: Record<string, MockMessage[]> = {
  "demo@rexauction.com_alice@example.com": [
    {
      messageId: "msg-1",
      senderId: "alice@example.com",
      receiverId: "demo@rexauction.com",
      text: "Hi! I'm interested in the vintage watch auction.",
      createdAt: "2025-06-01T10:00:00Z",
      status: "read",
    },
    {
      messageId: "msg-2",
      senderId: "demo@rexauction.com",
      receiverId: "alice@example.com",
      text: "Hello! Great, we have some amazing vintage watches available.",
      createdAt: "2025-06-01T10:05:00Z",
      status: "read",
    },
    {
      messageId: "msg-3",
      senderId: "alice@example.com",
      receiverId: "demo@rexauction.com",
      text: "Can you tell me more about the Rolex collection?",
      createdAt: "2025-06-01T10:10:00Z",
      status: "read",
    },
    {
      messageId: "msg-4",
      senderId: "demo@rexauction.com",
      receiverId: "alice@example.com",
      text: "Sure! The Rolex collection includes Submariner, Daytona, and Datejust models. All are authenticated and in excellent condition.",
      createdAt: "2025-06-01T10:15:00Z",
      status: "read",
    },
    {
      messageId: "msg-5",
      senderId: "alice@example.com",
      receiverId: "demo@rexauction.com",
      text: "That sounds perfect! When does the auction start?",
      createdAt: "2025-06-01T10:20:00Z",
      status: "delivered",
    },
  ],
  "demo@rexauction.com_bob@example.com": [
    {
      messageId: "msg-6",
      senderId: "bob@example.com",
      receiverId: "demo@rexauction.com",
      text: "Hey! I saw you're selling a classic car. Is it still available?",
      createdAt: "2025-05-31T14:00:00Z",
      status: "read",
    },
    {
      messageId: "msg-7",
      senderId: "demo@rexauction.com",
      receiverId: "bob@example.com",
      text: "Yes, the 1967 Ford Mustang is still available. Would you like to see more photos?",
      createdAt: "2025-05-31T14:30:00Z",
      status: "read",
    },
    {
      messageId: "msg-8",
      senderId: "bob@example.com",
      receiverId: "demo@rexauction.com",
      text: "Absolutely! Can you also share the maintenance history?",
      createdAt: "2025-05-31T15:00:00Z",
      status: "read",
    },
  ],
  "demo@rexauction.com_charlie@example.com": [
    {
      messageId: "msg-9",
      senderId: "charlie@example.com",
      receiverId: "demo@rexauction.com",
      text: "Hi there! I won the auction for the diamond necklace. When can I pick it up?",
      createdAt: "2025-06-01T09:00:00Z",
      status: "read",
    },
    {
      messageId: "msg-10",
      senderId: "demo@rexauction.com",
      receiverId: "charlie@example.com",
      text: "Congratulations! You can pick it up from our office anytime between 9 AM to 5 PM.",
      createdAt: "2025-06-01T09:15:00Z",
      status: "delivered",
    },
  ],
  "demo@rexauction.com_diana@example.com": [
    {
      messageId: "msg-11",
      senderId: "diana@example.com",
      receiverId: "demo@rexauction.com",
      text: "Welcome to Rex Auction! Let me know if you need any assistance.",
      createdAt: "2025-05-30T12:00:00Z",
      status: "read",
    },
    {
      messageId: "msg-12",
      senderId: "demo@rexauction.com",
      receiverId: "diana@example.com",
      text: "Thank you! I'm excited to start bidding on items.",
      createdAt: "2025-05-30T12:30:00Z",
      status: "read",
    },
  ],
};

// Current user for chat
export const CURRENT_CHAT_USER = {
  _id: "mock-user-001",
  name: "Sourav Dev",
  email: "demo@rexauction.com",
  photo: "https://i.pravatar.cc/150?img=12",
  role: "seller",
};

// Helper function to get messages for a specific chat
export const getMessagesForChat = (user1Email: string, user2Email: string) => {
  const roomKey = [user1Email, user2Email].sort().join("_");
  return MOCK_MESSAGES[roomKey] || [];
};

// Helper function to add a new message
export const addMessage = (
  user1Email: string,
  user2Email: string,
  message: MockMessage
) => {
  const roomKey = [user1Email, user2Email].sort().join("_");
  if (!MOCK_MESSAGES[roomKey]) {
    MOCK_MESSAGES[roomKey] = [];
  }
  MOCK_MESSAGES[roomKey].push(message);
  return message;
};
