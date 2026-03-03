"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/app-icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "ယနေ့ရက်စွဲက ဘာလဲ?",
  "Invoice ရှာပေးပါ",
  "ပစ္စည်းအသေးစိတ်ကြည့်ရန်",
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content || isLoading) return;

    const userMsg: Message = { role: "user", content };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });

      if (!res.ok) throw new Error("Request failed");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        const current = text;
        setMessages((prev) => {
          const msgs = [...prev];
          msgs[msgs.length - 1] = { role: "assistant", content: current };
          return msgs;
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "တစ်ခုခုမှားယွင်းသွားပါသည်။ ထပ်စမ်းကြည့်ပါ။",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function sendSuggestion(text: string) {
    setInput(text);
    setTimeout(() => {
      inputRef.current?.form?.requestSubmit();
    }, 0);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-3rem)] max-w-3xl mx-auto w-full rounded-xl overflow-hidden">
      {/* Messages - scrollable, scrollbar hidden */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-6 space-y-5 min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:size-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[280px] gap-8 select-none">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/5">
                <AppIcon name="bot" className="h-8 w-8 text-primary/80" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-lg font-semibold text-foreground tracking-tight">
                  AI Assistant
                </p>
                <p className="text-sm text-muted-foreground">
                  ချမ်းထော Office Management System
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-sm">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => sendSuggestion(s)}
                  className="px-4 py-2.5 text-xs font-medium rounded-full border border-border/80 bg-background/80 text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:border-accent-foreground/20 transition-colors cursor-pointer">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="shrink-0 mt-1">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center ring-1 ring-primary/5">
                  <AppIcon name="bot" className="h-4 w-4 text-primary" />
                </div>
              </div>
            )}

            <div
              className={`max-w-[82%] text-sm leading-relaxed whitespace-pre-wrap break-words ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 shadow-sm"
                  : "bg-muted/50 text-foreground rounded-2xl rounded-bl-md px-4 py-2.5 border border-border/30"
              }`}>
              {msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-0.5">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input - fixed at bottom */}
      <div className="shrink-0 p-4 pt-0 bg-background/50">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end w-full">
          <div className="flex-1 flex items-end rounded-2xl border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="မေးခွန်းရိုက်ထည့်ပါ..."
              className="flex-1 field-sizing-content min-h-10 max-h-32 resize-none bg-transparent px-4 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:opacity-50 rounded-2xl"
              rows={1}
              disabled={isLoading}
              autoFocus
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="shrink-0 h-10 w-10 rounded-xl mr-0.5 mb-0.5 text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-30 transition-colors"
              disabled={isLoading || !input.trim()}>
              <AppIcon name="send" className="h-4 w-4" />
            </Button>
          </div>
        </form>
        <p className="text-[11px] text-muted-foreground/50 text-center mt-2 select-none">
          AI ၏ အဖြေများသည် မှားယွင်းနိုင်ပါသည်
        </p>
      </div>
    </div>
  );
}
