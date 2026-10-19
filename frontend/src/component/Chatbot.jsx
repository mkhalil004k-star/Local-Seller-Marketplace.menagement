import { useState, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_beckend_base_URL || "http://localhost:4000";

const QUICK_QUESTIONS = [
  "Order kaise karun?",
  "Payment kaise hoti hai?",
  "Seller kaise banun?",
  "Delivery kitne din mein hoti hai?",
];

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const WELCOME = {
  role: "assistant",
  content:
    "Assalam o Alaikum! 👋 Main Local Seller Marketplace ka assistant hu. Products, orders ya selling ke baare mein kuch bhi poochein.",
  time: now(),
};

const BotIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="8" width="16" height="11" rx="3" />
    <path d="M12 4v4M9 13h.01M15 13h.01M9 16.5h6" />
    <circle cx="12" cy="3.5" r="1" />
  </svg>
);

const SendIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.4 20.4 21 12 3.4 3.6 3.3 10l12 2-12 2z" />
  </svg>
);

const CloseIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const TrashIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
  </svg>
);

const ChatIcon = () => (
  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z" />
    <path d="M9 11h.01M12 11h.01M15 11h.01" strokeWidth="2.4" />
  </svg>
);

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const send = async (override) => {
    const text = (override ?? input).trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text, time: now() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      // error wale messages aur welcome ko AI ko mat bhejo, aakhri 10 hi kaafi hain
      const history = newMsgs
        .filter((m) => !m.error)
        .slice(-10)
        .map(({ role, content }) => ({ role, content }));

      // Gemini ko pehla message "user" ka chahiye
      while (history.length && history[0].role !== "user") history.shift();

      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");

      setMessages([...newMsgs, { role: "assistant", content: data.reply, time: now() }]);
    } catch {
      setMessages([
        ...newMsgs,
        {
          role: "assistant",
          error: true,
          content: "Maazrat, abhi jawab nahi de saka. Thodi der baad dobara try karein.",
          time: now(),
        },
      ]);
    }
    setLoading(false);
  };

  const clearChat = () => setMessages([{ ...WELCOME, time: now() }]);

  const showQuick = messages.length === 1;

  return (
    <>
      {open && (
        <div className="fixed inset-x-3 bottom-24 z-50 flex h-[75vh] max-h-[560px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:inset-x-auto sm:right-5 sm:w-[380px]">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-700 to-blue-500 px-4 py-3 text-white">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <BotIcon className="h-6 w-6" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-blue-600 bg-green-400" />
            </div>
            <div className="flex-1 leading-tight">
              <p className="text-sm font-semibold">Marketplace Assistant</p>
              <p className="text-xs text-blue-100">Online • Madad ke liye hazir</p>
            </div>
            <button
              onClick={clearChat}
              title="Chat saaf karein"
              className="rounded-full p-2 text-blue-100 transition hover:bg-white/20 hover:text-white"
            >
              <TrashIcon />
            </button>
            <button
              onClick={() => setOpen(false)}
              title="Band karein"
              className="rounded-full p-2 text-blue-100 transition hover:bg-white/20 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
                  {!isUser && (
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        m.error ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <BotIcon className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`flex max-w-[78%] flex-col ${isUser ? "items-end" : "items-start"}`}>
                    <div
                      className={`whitespace-pre-wrap break-words px-3.5 py-2.5 text-sm leading-relaxed ${
                        isUser
                          ? "rounded-2xl rounded-br-sm bg-blue-600 text-white"
                          : m.error
                          ? "rounded-2xl rounded-bl-sm border border-red-200 bg-red-50 text-red-700"
                          : "rounded-2xl rounded-bl-sm border border-slate-200 bg-white text-slate-800 shadow-sm"
                      }`}
                    >
                      {m.content}
                    </div>
                    <span className="mt-1 px-1 text-[10px] text-slate-400">{m.time}</span>
                  </div>
                </div>
              );
            })}

            {/* Quick questions */}
            {showQuick && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-600 hover:text-white"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <BotIcon className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 py-1 pl-4 pr-1 transition focus-within:border-blue-500 focus-within:bg-white">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                maxLength={500}
                placeholder="Apna sawal likhein..."
                className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <SendIcon />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-400">
              AI jawab galat bhi ho sakte hain. Zaroori baat ki tasdeeq karein.
            </p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Chatbot kholein"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/40 transition hover:scale-105"
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <ChatIcon />}
      </button>
    </>
  );
}