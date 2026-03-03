import { tool } from "ai";
import { z } from "zod";

const CAPABILITIES = {
  summary:
    "ချမ်းထော Office Management System အတွက် AI Assistant သည် ရက်စွဲ/အချိန်၊ သင်္ချာ၊ ဘောက်ချာနှင့် ပစ္စည်းအမျိုးအစားများ စစ်ဆေးခြင်းကို ကူညီပေးပါသည်။",
  capabilities: [
    {
      id: "calculate",
      titleEn: "Calculations",
      titleMm: "သင်္ချာတွက်ချက်ခြင်း",
      descriptionEn:
        "Basic math: add, subtract, multiply, divide (e.g. 2+3*4, (100-20)/4).",
      descriptionMm:
        "ပေါင်း၊ နုတ်၊ မြှောက်၊ စား စသည့် သင်္ချာအရိုးရှင်းဆုံးတွက်ချက်မှုများ လုပ်ပေးနိုင်ပါသည်။",
    },
    {
      id: "invoice-by-id",
      titleEn: "Invoice details by ID",
      titleMm: "ဘောက်ချာအသေးစိတ် (ဘောက်ချာနံပါတ်ဖြင့်)",
      descriptionEn:
        "Look up a single invoice by Invoice ID (e.g. INV-123). Shows customer, phone, date, amount, product, status.",
      descriptionMm:
        "ဘောက်ချာနံပါတ် (ဥပမာ INV-123) ဖြင့် ဘောက်ချာတစ်ခုချင်း အသေးစိတ်ကြည့်နိုင်ပါသည်။ အမည်၊ ဖုန်း၊ ရက်စွဲ၊ တန်ဖိုး၊ ပစ္စည်း၊ အော်ဒါအခြေအနေ ပြသပေးပါသည်။",
    },
    {
      id: "order-invoices",
      titleEn: "Latest order invoices",
      titleMm: "နောက်ဆုံး အော်ဒါဘောက်ချာများ",
      descriptionEn:
        "List up to 10 latest invoices that are orders (အော်ဒါဘောက်ချာ). Shows invoice ID, customer, phone, amount, product, payment status.",
      descriptionMm:
        "အော်ဒါဘောက်ချာ နောက်ဆုံး ၁၀ ခုကို စာရင်းပြသပေးပါသည်။ ဘောက်ချာနံပါတ်၊ အမည်၊ ဖုန်း၊ တန်ဖိုး၊ ပစ္စည်း၊ ပေးပြီး/မပေးရသေး ပါဝင်ပါသည်။",
    },
    {
      id: "invoices-by-date",
      titleEn: "Invoices by date range",
      titleMm: "ရက်စွဲအတွင်း ဘောက်ချာများ",
      descriptionEn:
        "List invoices within a date range. Provide start and/or end date (DD-MM-YYYY).",
      descriptionMm:
        "သတ်မှတ်ရက်စွဲ စမှတ်/ဆုံးမှတ် (DD-MM-YYYY) ပေးပါက ထိုရက်စွဲအတွင်း ဘောက်ချာများကို စာရင်းပြသပေးပါသည်။",
    },
    {
      id: "product-types",
      titleEn: "Product types and counts",
      titleMm: "ပစ္စည်းအမျိုးအစားများနှင့် အရေအတွက်",
      descriptionEn:
        "List all product types with how many products (ProductDetails) each type has. Use for category summary or “most sold” type of questions.",
      descriptionMm:
        "ပစ္စည်းအမျိုးအစားအားလုံးနှင့် အမျိုးအစားတစ်ခုချင်းစီမှာ ပစ္စည်းအရေအတွက် ပြသပေးပါသည်။ အမျိုးအစားစာရင်း သို့မဟုတ် အများဆုံးရောင်းသည့်အမျိုးအစား မေးမြန်းရာတွင် သုံးနိုင်ပါသည်။",
    },
    {
      id: "total-price-with-date",
      titleEn: "Total price with date",
      titleMm: "ရက်စွဲအတွင်း စုစုပေါင်းတန်ဖိုး",
      descriptionEn:
        "Get the total price of all products sold on a given date. Use when user asks daily total sales amount (e.g. 'ဒီနေ့စဘယ်လောက်ရောင်းရလဲ', '01-03-2026 ရဲ့စုစုပေါင်းတန်ဖိုး').",
      descriptionMm: "ရက်စွဲအတွင်း စုစုပေါင်းတန်ဖိုးကို ရယူပေးပါသည်။",
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
