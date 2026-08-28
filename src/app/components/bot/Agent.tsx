import { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  Gavel,
  Loader2,
  MessageSquare,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

interface ChatMessage {
  role: "user" | "model";
  text: string;
  isError?: boolean;
}

const SUGGESTIONS = [
  "How do I place a bid?",
  "How do I become a seller?",
  "Where can I see won auctions?",
  "How do payments work?",
];

const TypingDots = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
    <span>Writing</span>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className={`w-1 h-1 rounded-full ${isDarkMode ? "bg-slate-400" : "bg-slate-400"} animate-bounce`}
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

  const panel = isDarkMode ? "bg-[#161820] border-[#252733]" : "bg-white border-gray-200";
  const muted = isDarkMode ? "text-gray-500" : "text-gray-500";
  const bodyBg = isDarkMode ? "bg-[#0E0F14]" : "bg-slate-50";

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
        throw new Error(data?.error?.message || "The assistant is unavailable right now.");
      }

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(
        error instanceof Error ? error.message : "The assistant is unavailable right now.",
        true
      );
    }
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const newMessage: ChatMessage = { role: "user", text: trimmed };
    const updated = [...chatHistory, newMessage];
    setChatHistory([...updated, { role: "model", text: "Thinking..." }]);
    setInputMessage("");
    generateResponse(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <div
        className={`w-[min(100vw-2rem,380px)] flex flex-col rounded-2xl border overflow-hidden origin-bottom-right transition-all duration-200 ${panel} ${
          showChatbot ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none h-0 border-0"
        }`}
        style={{ height: showChatbot ? 540 : 0 }}
        aria-hidden={!showChatbot}
      >
        <div className={`flex items-center justify-between px-4 py-3 border-b ${isDarkMode ? "border-[#252733]" : "border-gray-200"}`}>
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
              <Gavel className="w-4 h-4 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#161820]" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Rex Support</p>
              <p className={`text-[11px] ${muted}`}>Auction help · typically replies instantly</p>
            </div>
          </div>
          <button
            onClick={() => setShowChatbot(false)}
            className={`p-1.5 rounded-lg ${isDarkMode ? "hover:bg-white/5" : "hover:bg-slate-100"}`}
            aria-label="Minimize assistant"
          >
            <ChevronDown size={16} className={muted} />
          </button>
        </div>

        <div ref={chatBodyRef} className={`flex-1 overflow-y-auto p-4 space-y-4 ${bodyBg}`}>
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-tl-md text-sm leading-relaxed ${
                isDarkMode ? "bg-[#161820] border border-[#252733] text-slate-200" : "bg-white border border-gray-200 text-slate-700"
              }`}
            >
              Hello — I’m the RexAuction assistant. Ask about bidding, selling, payments, or account setup.
            </div>
          </div>

          {chatHistory.length === 0 && (
            <div className="grid grid-cols-1 gap-2 pl-9">
              {SUGGESTIONS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className={`text-left text-xs px-3 py-2 rounded-xl border transition-colors ${
                    isDarkMode
                      ? "border-[#252733] bg-[#161820] text-slate-300 hover:border-violet-500/40"
                      : "border-gray-200 bg-white text-slate-600 hover:border-violet-300"
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {chatHistory.map((chat, index) => (
            <div
              key={`${chat.role}-${index}`}
              className={`flex items-end gap-2 ${chat.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  chat.role === "user"
                    ? isDarkMode
                      ? "bg-slate-700"
                      : "bg-slate-200"
                    : "bg-violet-600"
                }`}
              >
                {chat.role === "user" ? (
                  <User size={14} className={isDarkMode ? "text-slate-200" : "text-slate-700"} />
                ) : (
                  <Bot size={14} className="text-white" />
                )}
              </div>
              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  chat.role === "user"
                    ? "bg-violet-600 text-white rounded-br-md"
                    : chat.isError
                      ? "bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-bl-md"
                      : isDarkMode
                        ? "bg-[#161820] border border-[#252733] text-slate-200 rounded-bl-md"
                        : "bg-white border border-gray-200 text-slate-700 rounded-bl-md"
                }`}
              >
                {chat.text === "Thinking..." ? (
                  <TypingDots isDarkMode={isDarkMode} />
                ) : (
                  <span className="whitespace-pre-wrap">{chat.text}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className={`flex-shrink-0 px-3 py-3 border-t flex gap-2 ${isDarkMode ? "border-[#252733] bg-[#161820]" : "border-gray-200 bg-white"}`}
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about auctions…"
            disabled={isLoading}
            className={`flex-1 text-sm px-3.5 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 disabled:opacity-50 ${
              isDarkMode
                ? "bg-[#0E0F14] text-white placeholder-gray-500 border-[#252733]"
                : "bg-slate-50 text-gray-900 placeholder-gray-400 border-gray-200"
            }`}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-40"
            aria-label="Send message"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      </div>

      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        className={`h-12 pl-3.5 pr-4 rounded-full flex items-center gap-2 border text-sm font-semibold transition-colors ${
          showChatbot
            ? isDarkMode
              ? "bg-[#161820] border-[#252733] text-slate-200"
              : "bg-white border-gray-200 text-slate-800"
            : "bg-violet-600 border-violet-600 text-white hover:bg-violet-700"
        }`}
        aria-label={showChatbot ? "Close assistant" : "Open assistant"}
      >
        {showChatbot ? <X size={16} /> : <MessageSquare size={16} />}
        {showChatbot ? "Close" : "Help"}
      </button>
    </div>
  );
};

export default Agent;
