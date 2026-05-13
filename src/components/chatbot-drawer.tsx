"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AppIcon } from "./app-icons";
import { ChatPanel, type Message } from "./chat-panel";
import { useIsMobile } from "@/hooks/use-mobile";

const SUGGESTIONS = [
  "Invoice ရှာပေးပါ",
  "ရက်စွဲဖြင့်ရှာမယ်",
  "အော်ဒါစာရင်းပြပေးပါ",
  "ပစ္စည်းအမျိုးအစားများပြပေးပါ",
  "ဒီလဘယ်သူအများဆုံးရောင်းရလည်း",
  "ဒီနေ့ဘယ်လောက်ရောင်းရလည်း ?",
  "ဘာတွေကူညီပေးနိုင်လဲ ?",
];

export function ChatBotDrawer() {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>([]);
  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <button
          className="flex items-center justify-center rounded-full h-8 w-8 text-white shadow-sm cursor-pointer bg-[linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899,#3b82f6,#6366f1)] bg-[length:300%_300%] animate-[ai-gradient_4s_ease_infinite] hover:brightness-110 transition">
          <AppIcon name="bot" className="h-4 w-4" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="w-full h-full flex flex-col">
        <DrawerTitle className="sr-only">AI Assistant</DrawerTitle>
        <ChatPanel
          endpoint="/api/chat/manager"
          suggestions={SUGGESTIONS}
          messages={messages}
          setMessages={setMessages}
          className="h-full"
          emptyState={
            <div className="flex flex-col items-center justify-center h-full select-none">
              <div className="h-9 w-9 rounded-lg bg-primary/8 flex items-center justify-center mb-2">
                <AppIcon name="bot" className="h-4 w-4 text-primary/60" />
              </div>
              <p className="text-xs font-medium text-foreground">AI Assistant</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                မေးခွန်းတစ်ခုခုရိုက်ထည့်ပါ
              </p>
            </div>
          }
        />
      </DrawerContent>
    </Drawer>
  );
}
