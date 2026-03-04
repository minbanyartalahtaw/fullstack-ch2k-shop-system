"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/app-icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Invoice ရှာပေးပါ",
  "ရက်စွဲဖြင့်ရှာမယ်",
  "အော်ဒါစာရင်းပြပေးပါ",
  "ပစ္စည်းအမျိုးအစားများပြပေးပါ",
  "ဘယ်ပစ္စည်းအမျိုးအစားက အများဆုံး/အနည်းဆုံး/သာမန် ရောင်းရလည်း ?",
  "ဒီနေ့ဘယ်လောက်ရောင်းရလည်း ?",
  "ဘာတွေကူညီပေးနိုင်လဲ ?",
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);
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
    setIsAssistantThinking(true);
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
        setIsAssistantThinking(false);
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
      setIsAssistantThinking(false);
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

  function handleSuggestionWheel(e: React.WheelEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-2rem)] max-w-3xl mx-auto w-full rounded-xl overflow-hidden">
      {/* Messages - scrollable, scrollbar hidden */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-6 space-y-6 min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:size-0">
        {messages.length === 0 && (
          <div className="flex flex-1 min-h-0 flex-col items-center justify-center px-4 select-none">
            <div className="flex flex-col items-center gap-6 text-center max-w-sm">
              <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <AppIcon name="bot" className="h-7 w-7 text-primary/70" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-base font-semibold text-foreground tracking-tight">
                  AI Assistant
                </h2>
                <p className="text-sm text-muted-foreground/90 leading-relaxed">
                  ချမ်းထော Office Management System
                </p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="shrink-0 mt-1.5">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center ring-1 ring-primary/5">
                  <AppIcon name="bot" className="h-4 w-4 text-primary" />
                </div>
              </div>
            )}

            <div
              className={`max-w-[85%] text-sm leading-relaxed break-words ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-5 py-3 shadow-sm whitespace-pre-wrap"
                  : "bg-muted/50 text-foreground rounded-2xl rounded-bl-md px-5 py-4 border border-border/30"
              }`}>
              {msg.role === "assistant" ? (
                <div className="markdown-body text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      p: ({ children }) => (
                        <p className="mb-4 last:mb-0 text-foreground/90 leading-6">
                          {children}
                        </p>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-lg font-semibold text-foreground mt-6 mb-3 first:mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-base font-semibold text-foreground mt-5 mb-2">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-sm font-medium text-foreground mt-4 mb-1.5">
                          {children}
                        </h3>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-outside pl-5 mb-4 space-y-1 text-foreground/90">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-outside pl-5 mb-4 space-y-1 text-foreground/90">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-6">{children}</li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-primary/50 pl-4 my-4 text-muted-foreground text-sm italic leading-6">
                          {children}
                        </blockquote>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline underline-offset-2 hover:no-underline">
                          {children}
                        </a>
                      ),
                      table: ({ children }) => (
                        <div className="my-4 overflow-x-auto overflow-y-hidden rounded-lg border border-border w-full [scrollbar-width:thin]">
                          <table className="w-max min-w-full border-collapse text-sm">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-muted/60">{children}</thead>
                      ),
                      tbody: ({ children }) => (
                        <tbody className="divide-y divide-border">
                          {children}
                        </tbody>
                      ),
                      tr: ({ children }) => (
                        <tr className="border-border">{children}</tr>
                      ),
                      th: ({ children }) => (
                        <th className="px-4 py-2.5 text-left font-medium text-foreground border-b border-border whitespace-nowrap">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-2.5 text-foreground/90 leading-5 whitespace-nowrap">
                          {children}
                        </td>
                      ),
                    }}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <span className="block py-0.5">{msg.content}</span>
              )}
            </div>
          </div>
        ))}
        {isAssistantThinking && (
          <div className="flex gap-3 justify-start">
            <div className="shrink-0 mt-1.5">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center ring-1 ring-primary/5">
                <AppIcon name="bot" className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="bg-muted/50 text-foreground rounded-2xl rounded-bl-md px-5 py-4 border border-border/30">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.2s]" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.1s]" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input - fixed at bottom */}
      <div className="shrink-0 px-2 pb-2 pt-0 bg-background/50 border-t border-border/50">
        {/* Suggestions - horizontal chips, scrollbar hidden */}
        <div
          onWheel={handleSuggestionWheel}
          className="overflow-x-auto overflow-y-hidden py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x">
          <div className="flex gap-2 justify-start py-0.5 min-w-max snap-x snap-mandatory scroll-px-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => sendSuggestion(s)}
                className="px-3.5 py-2 text-xs font-medium rounded-full border border-border/80 bg-background text-muted-foreground hover:bg-accent/60 hover:text-foreground hover:border-accent-foreground/20 transition-colors cursor-pointer shrink-0 snap-start whitespace-nowrap">
                {s}
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 items-end w-full">
          <div className="flex-1 flex items-end rounded-lg border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring transition-all">
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
          AI can make mistakes, please check the information carefully.
        </p>
      </div>
    </div>
  );
}
