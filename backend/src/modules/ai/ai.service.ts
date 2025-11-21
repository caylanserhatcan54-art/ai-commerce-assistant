import OpenAI from "openai";
import {
  adminAssistantSystemPrompt,
  customerAssistantSystemPrompt,
} from "./prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

type RoleType = "admin" | "customer";

interface AskOptions {
  role: RoleType;
  shopId?: string;
  message: string;
  context?: any;
}

export const askAssistant = async (options: AskOptions) => {
  const { role, message, context } = options;

  const systemPrompt =
    role === "admin"
      ? adminAssistantSystemPrompt
      : customerAssistantSystemPrompt;

  const contextText = context
    ? `\n\nMAĞAZA BAĞLAM VERİSİ:\n${JSON.stringify(context, null, 2)}\n`
    : "";

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: systemPrompt + contextText,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return completion.choices[0]?.message?.content || "";
};
