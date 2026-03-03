import { tool } from "ai";
import { z } from "zod";

export const calculate = tool({
  description:
    "Calculate a basic mathematical operation (+, -, *, /, parentheses, decimals) for internal office tasks.",
  inputSchema: z.object({
    expression: z
      .string()
      .describe('Math expression, e.g. "2 + 3 * 4" or "(100 - 20) / 4"'),
  }),
  execute: async ({ expression }) => {
    const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, "");
    if (!sanitized.trim()) return { error: "Invalid expression" };
    try {
      const result = new Function(
        `"use strict"; return (${sanitized})`,
      )();
      return { expression, result: Number(result) };
    } catch {
      return { expression, error: "Could not evaluate expression" };
    }
  },
});
