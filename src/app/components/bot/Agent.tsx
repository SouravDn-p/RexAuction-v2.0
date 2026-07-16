import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, X, ChevronDown, Loader2, Bot, User } from "lucide-react";
import rexLogo from "@/assets/logo.png";
import { useTheme } from "../../../hooks/useTheme";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "model";
  text: string;
  isError?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────

const TypingDots = () => (
  <span className="inline-flex items-center gap-1">
    <span className="text-sm mr-1">Thinking</span>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce"
        style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
      />
    ))}
  </span>
);

const Agent = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  const generateResponse = async (history: ChatMessage[]) => {
    setIsLoading(true);

    const updateHistory = (text: string, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
      setIsLoading(false);
    };

    const formatted = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    try {
      const response = await fetch(import.meta.env.VITE_GOOGLE_GEMENI_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: formatted }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Something went wrong");
      }

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(
        error instanceof Error ? error.message : "Something went wrong",
        true
      );
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const newMessage: ChatMessage = { role: "user", text: inputMessage };
    const updated = [...chatHistory, newMessage];

    setChatHistory([...updated, { role: "model", text: "Thinking..." }]);
    setInputMessage("");
    generateResponse(updated);
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end`}>
      {/* Chatbot Panel */}
      <div
        className={`mb-3 w-80 sm:w-96 flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${
          showChatbot
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none h-0"
        } ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
        style={{ height: showChatbot ? "500px" : "0px" }}
      >
        {/* Header */}
        <div className="bg-purple-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Animated bot avatar */}
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src={rexLogo}
                  alt="AI"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              {/* Online dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-purple-600 rounded-full" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">AI Assistant</h2>
              <p className="text-xs text-purple-200">Always here to help</p>
            </div>
          </div>
          <button
            onClick={() => setShowChatbot(false)}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Minimize chatbot"
          >
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Body */}
        <div
          ref={chatBodyRef}
          className={`flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth ${
            isDarkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          {/* Welcome message */}
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img
                src={rexLogo}
                alt="AI"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  el.parentElement!.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' class='w-4 h-4 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15l-3.75 3.75m0 0H8.25m7.8 0a2.25 2.25 0 01-2.25 2.25H10.5a2.25 2.25 0 01-2.25-2.25m7.8 0H8.25' /></svg>`;
                }}
              />
            </div>
            <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-bl-sm bg-purple-600 text-white text-sm leading-relaxed shadow-md">
              Hello! 👋
              <br />
              I'm your AI assistant. How can I help you today?
            </div>
          </div>

          {/* Chat history */}
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                chat.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
                  chat.role === "user" ? "bg-purple-400" : "bg-purple-600"
                }`}
              >
                {chat.role === "user" ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-white" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-md ${
                  chat.role === "user"
                    ? "bg-purple-500 text-white rounded-br-sm"
                    : chat.isError
                    ? "bg-red-500 text-white rounded-bl-sm"
                    : "bg-purple-600 text-white rounded-bl-sm"
                }`}
              >
                {chat.text === "Thinking..." ? (
                  <TypingDots />
                ) : (
                  <span className="whitespace-pre-wrap">{chat.text}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <form
          onSubmit={handleSubmit}
          className={`flex-shrink-0 px-3 py-3 border-t flex gap-2 ${
            isDarkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className={`flex-1 text-sm px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors disabled:opacity-50 ${
              isDarkMode
                ? "bg-gray-800 text-white placeholder-gray-400 border-gray-600"
                : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300"
            }`}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          showChatbot
            ? "bg-red-500 hover:bg-red-600 rotate-0"
            : "bg-purple-600 hover:bg-purple-700"
        } text-white`}
        aria-label={showChatbot ? "Close chatbot" : "Open chatbot"}
      >
        {showChatbot ? (
          <X size={22} />
        ) : (
          <>
            <MessageSquare size={22} />
            {/* Pulse ring when closed */}
            <span className="absolute w-14 h-14 rounded-full bg-purple-400 animate-ping opacity-30 pointer-events-none" />
          </>
        )}
      </button>
    </div>
  );
};

export default Agent;