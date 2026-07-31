"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Hey! I'm the BLAST 2026 assistant. Ask me about speakers, workshops, competitions, dates, or venue.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        { role: "assistant", content: res.ok ? data.reply : data.error ?? "Something went wrong." },
      ]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Network error — please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="telemetry-frame flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl bg-ink-2/95 shadow-2xl shadow-violet/20 backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="eyebrow">Mission assistant</p>
              <p className="font-display text-sm text-chrome">BLAST 2026 Help</p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/15 px-2 py-1 text-xs text-mist/70 transition hover:border-cyan/60 hover:text-cyan"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-snug ${
                  m.role === "user"
                    ? "ml-auto bg-gradient-to-r from-violet to-violet-soft text-white"
                    : "border border-white/10 bg-white/5 text-mist"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="max-w-[60%] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-mist/60">
                <span className="blink">Typing…</span>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-white/10 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about BLAST 2026…"
              className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-chrome placeholder:text-mist/40 outline-none transition focus:border-cyan/60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-full bg-gradient-to-r from-cyan to-cyan-deep px-4 py-2 text-sm font-semibold text-ink disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="glow-pulse flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet to-cyan text-2xl shadow-lg shadow-violet/40 transition hover:brightness-110"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
