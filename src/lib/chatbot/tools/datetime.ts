import { tool } from "ai";
import { z } from "zod";

export const getCurrentDateTime = tool({
  description:
    "Get the current date and time. Use this to assist staff or managers with time- or date-related queries.",
  inputSchema: z.object({}),
  execute: async () => {
    const now = new Date();
    return {
      iso: now.toISOString(),
      formatted: now.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      }),
    };
  },
});
