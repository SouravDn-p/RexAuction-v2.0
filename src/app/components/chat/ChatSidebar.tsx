import { useState } from "react";
import { CURRENT_CHAT_USER, MOCK_CHAT_USERS } from "../../../data/MOCK_CHAT_DATA";

export default function ChatSidebar({
  isDarkMode,
  onSelectUser,
  unreadMessages = {},
  selectedUserEmail,
  recentMessages = {},
}: {
  isDarkMode: boolean;
  onSelectUser: (user: any) => void;
  unreadMessages?: Record<string, number>;
  selectedUserEmail?: string;
  recentMessages?: Record<string, any>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users] = useState(MOCK_CHAT_USERS);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`h-full border-r ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 text-gray-200"
          : "bg-white border-gray-200 text-gray-800"
      } overflow-y-auto w-full md:w-80`}
    >
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Messages</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-2 rounded-md ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-gray-100 border-gray-300 text-gray-800"
          } border`}
        />
      </div>

      <div className="divide-y">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const lastMessage = recentMessages[user.email];
            const messageSnippet = lastMessage
              ? lastMessage.text.length > 25
                ? `${lastMessage.text.substring(0, 25)}...`
                : lastMessage.text
              : "No messages yet";

            const isUnread = unreadMessages[user.email] > 0;
            const isSentByCurrentUser =
              lastMessage && lastMessage.senderId === CURRENT_CHAT_USER.email;

            return (
              <div
                key={user._id || user.email}
                onClick={() => onSelectUser(user)}
                className={`p-4 cursor-pointer hover:bg-opacity-10 ${
                  selectedUserEmail === user.email
                    ? isDarkMode
                      ? "bg-purple-900 bg-opacity-30"
                      : "bg-purple-100"
                    : ""
                } ${
                  unreadMessages[user.email] > 0
                    ? isDarkMode
                      ? "bg-gray-700 bg-opacity-50"
                      : "bg-purple-50"
                    : ""
                } ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <div className="flex items-center">
                  <div className="relative">
                    {user.photo ? (
                      <img
                        src={user.photo || "/placeholder.svg"}
                        alt={user.name || "User"}
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40&text=User";
                        }}
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
                      </div>
                    )}

                    {unreadMessages[user.email] > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {unreadMessages[user.email] > 9
                          ? "9+"
                          : unreadMessages[user.email]}
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <p
                        className={`${
                          unreadMessages[user.email] > 0
                            ? "font-bold"
                            : "font-medium"
                        }`}
                      >
                        {user.name || "No name"}
                      </p>
                      {lastMessage && (
                        <p
                          className={`text-xs ${
                            unreadMessages[user.email] > 0
                              ? isDarkMode
                                ? "text-purple-300 font-semibold"
                                : "text-purple-600 font-semibold"
                              : isDarkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {user.email}
                    </p>
                    <p
                      className={`text-sm truncate ${
                        isUnread
                          ? isDarkMode
                            ? "font-bold text-white"
                            : "font-bold text-purple-700"
                          : isSentByCurrentUser
                          ? isDarkMode
                            ? "text-gray-400 italic"
                            : "text-gray-500 italic"
                          : isDarkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      {lastMessage &&
                        lastMessage.senderId === CURRENT_CHAT_USER.email && (
                          <span className="mr-1">You:</span>
                        )}
                      {messageSnippet}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center">No users found</div>
        )}
      </div>
    </div>
  );
}