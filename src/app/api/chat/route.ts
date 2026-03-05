import { streamText, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { chatTools } from "@/lib/chatbot/tools";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-3.1-flash-lite-preview"),
    system: `You are an assistant for the Chan Htaw (ချမ်းထော) office management system, supporting staff and managers with internal operations.
You assist with general questions, calculations, and access to internal data like product and invoice records.
Do not use sales language or try to sell products—reply as an office assistant would.
Respond in the Burmese language.
Be concise, clear, factual, and focused on assisting with office tasks.`,
    messages,
    tools: chatTools,
    stopWhen: stepCountIs(5),
  });

  return result.toTextStreamResponse();
}
