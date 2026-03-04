import { tool } from "ai";
import { z } from "zod";

const CAPABILITIES = {
  summary:
    "ချမ်းထော Office AI: ရက်စွဲ၊ သင်္ချာ၊ ဘောက်ချာနှင့် ပစ္စည်းအချက်အလက်များ ကူညီပေးပါသည်။",
  capabilities: [
    {
      id: "inv-id",
      title: "ဘောက်ချာရှာရန်",
      desc: "နံပါတ် (ဥပမာ INV-123) ဖြင့် အသေးစိတ်ကြည့်နိုင်ပါသည်။",
    },
    {
      id: "orders",
      title: "အော်ဒါစာရင်း",
      desc: "နောက်ဆုံးအော်ဒါ ၁၀ ခုနှင့် ပေးပြီး/မပေးရသေး အခြေအနေပြပေးပါသည်။",
    },
    {
      id: "inv-date",
      title: "ရက်စွဲဖြင့်ရှာရန်",
      desc: "သတ်မှတ်ရက်အတွင်း ဘောက်ချာများ စာရင်းထုတ်ပေးပါသည်။",
    },
    {
      id: "products",
      title: "ပစ္စည်းအမျိုးအစား",
      desc: "အမျိုးအစားအလိုက် အရေအတွက်နှင့် အရောင်းရဆုံးကို ပြပေးပါသည်။",
    },
    {
      id: "total-sales",
      title: "နေ့စဉ်အရောင်း",
      desc: "သတ်မှတ်ရက်အလိုက် စုစုပေါင်းရောင်းရငွေ တွက်ပေးပါသည်။",
    },
  ],
};

export const getAssistantCapabilities = tool({
  description:
    "Explain what this assistant can do. Use when the user asks: what can you do, what can you help with, ဘာတွေလုပ်ပေးလို့ရလဲ, ဘာတွေမေးလို့ရလဲ, help, capabilities, features. Return the structured capabilities so you can present them clearly (e.g. as a short list or table) in the user's language.",
  inputSchema: z.object({}),
  execute: async () => {
    return CAPABILITIES;
  },
});
