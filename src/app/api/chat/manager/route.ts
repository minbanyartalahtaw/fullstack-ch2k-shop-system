import { streamText, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { cookies } from "next/headers";
import { chatTools } from "@/lib/chatbot/tools";
import { verifyJwt } from "@/lib/jwt";

export async function POST(req: Request) {
  const token = (await cookies()).get("staff-token")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });
  const payload = await verifyJwt(token);
  if (!payload) return new Response("Unauthorized", { status: 401 });
  if (payload.role !== "MANAGER")
    return new Response("Forbidden", { status: 403 });

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
