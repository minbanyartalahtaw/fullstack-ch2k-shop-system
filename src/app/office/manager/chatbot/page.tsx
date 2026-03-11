"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/app-icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

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
    <div className="flex flex-col h-[calc(100dvh-2rem)] max-w-3xl mx-auto w-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-8 space-y-6 min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:size-0">
        {messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center h-full select-none">
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/8 flex items-center justify-center">
                <AppIcon name="bot" className="h-8 w-8 text-primary/60" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground tracking-tight">
                  AI Assistant
                </h2>
                <p className="text-sm text-muted-foreground">
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
              <div className="shrink-0 mt-1">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <AppIcon name="bot" className="h-3.5 w-3.5 text-primary" />
                </div>
              </div>
            )}

            <div
              className={`max-w-[85%] text-sm leading-relaxed break-words ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-3 shadow-xs whitespace-pre-wrap"
                  : "bg-muted/50 border border-border/40 text-foreground rounded-2xl rounded-bl-sm px-5 py-4"
              }`}>
              {msg.role === "assistant" ? (
                <div className="markdown-body text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      p: ({ children }) => (
                        <p className="mb-3 last:mb-0 text-foreground/90 leading-6">
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
                        <ul className="list-disc list-outside pl-5 mb-3 space-y-1 text-foreground/90">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-outside pl-5 mb-3 space-y-1 text-foreground/90">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-6">{children}</li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-primary/40 pl-4 my-3 text-muted-foreground text-sm italic leading-6">
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
                        <div className="my-4 overflow-x-auto overflow-y-hidden rounded-xl border border-border/60 w-full [scrollbar-width:thin]">
                          <table className="w-max min-w-full border-collapse text-sm">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-muted/40">{children}</thead>
                      ),
                      tbody: ({ children }) => (
                        <tbody className="divide-y divide-border/60">
                          {children}
                        </tbody>
                      ),
                      tr: ({ children }) => (
                        <tr className="border-border/60">{children}</tr>
                      ),
                      th: ({ children }) => (
                        <th className="px-4 py-2.5 text-left font-medium text-foreground border-b border-border/60 whitespace-nowrap">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-2.5 text-foreground/80 leading-5 whitespace-nowrap">
                          {children}
                        </td>
                      ),
                    }}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <span className="block">{msg.content}</span>
              )}
            </div>
          </div>
        ))}

        {isAssistantThinking && (
          <div className="flex gap-3 justify-start">
            <div className="shrink-0 mt-1">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <AppIcon name="bot" className="h-3.5 w-3.5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 px-4 sm:px-6 pb-4 pt-2">
        {/* Suggestions */}
        <div
          onWheel={handleSuggestionWheel}
          className="overflow-x-auto overflow-y-hidden pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x">
          <div className="flex gap-1.5 min-w-max">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => sendSuggestion(s)}
                className="px-3 py-1.5 text-xs rounded-full border border-border/60 bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer shrink-0 whitespace-nowrap">
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col rounded-2xl border border-input bg-background shadow-sm focus-within:border-ring/60 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="မေးခွန်းရိုက်ထည့်ပါ..."
              className="w-full min-h-16 max-h-48 resize-none bg-transparent px-5 pt-4 pb-2 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none disabled:opacity-50 leading-relaxed field-sizing-content"
              rows={2}
              disabled={isLoading}
              autoFocus
            />
            <div className="flex items-center justify-end px-3 pb-3">
              <Button
                type="submit"
                size="icon"
                className="h-9 w-9 rounded-xl shrink-0 disabled:opacity-30 transition-opacity"
                disabled={isLoading || !input.trim()}>
                <AppIcon name="send" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>

        <p className="text-[11px] text-muted-foreground/40 text-center mt-3 select-none">
          AI can make mistakes — verify important information.
        </p>
      </div>
    </div>
  );
}
