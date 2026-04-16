import { Ollama, type Message } from "ollama";
import { createModelTrace } from "@/server/lib/logging/modelTrace";
import { z } from "zod";
import type { ConversationMessage } from "@/lib/types";

const LocationResolutionSchema = z.union([
  z.object({
    type: z.literal("resolved"),
    locationQuery: z.string().min(1),
  }),
  z.object({
    type: z.literal("needs_clarification"),
    message: z.string().min(1),
  }),
]);

export type LocationResolution = z.infer<typeof LocationResolutionSchema>;

export class LocationResolutionHandler {
  constructor(private readonly agent: Ollama) {}

  public async resolve(
    conversationHistory: ConversationMessage[],
    tools: unknown,
  ): Promise<LocationResolution> {
    const messages: Message[] = [
      {
        role: "system",
        content: this.createSystemPrompt(tools),
      },
      ...conversationHistory,
    ];

    const raw = await this.askModel(messages);
    const parsed = this.parseResolution(raw);

    if (!parsed) {
      throw new Error(`Failed to parse location resolution: ${raw}`);
    }

    return parsed;
  }

  private createSystemPrompt(tools: unknown): string {
    return `
You are a location-resolution assistant for a weather app.

You have access to this tool:
${JSON.stringify(tools, null, 2)}

Your only job is to inspect the conversation and do exactly one of these:

1. Resolve the user's intended weather location into a single locationQuery string.
2. Ask a concise clarification question if the location is missing or too ambiguous.

Rules:
- Use prior conversation turns to resolve follow-up replies like:
  - "yes"
  - "that one"
  - "how about Normal Illinois?"
  - "zip code 61761 for Normal, IL"
- If the location appears inside a larger sentence, extract only the location.
- Prefer the most specific usable query you can confidently infer.
- Do not answer the weather question.
- Do not narrate your plan.
- Do not use markdown.
- Respond with JSON only.

Valid outputs:

{"type":"resolved","locationQuery":"Chicago, IL"}
{"type":"resolved","locationQuery":"61761"}
{"type":"needs_clarification","message":"Which city should I check?"}
`.trim();
  }

  private async askModel(messages: Message[]): Promise<string> {
    const response = await this.agent.chat({
      model: "gpt-oss:120b-cloud",
      messages,
      stream: true,
    });

    const trace = createModelTrace("location-resolution");
    let fullResponse = "";

    try {
      for await (const part of response) {
        const chunk = part.message.content ?? "";
        if (!chunk) {
          continue;
        }

        trace.append(chunk);
        fullResponse += chunk;
      }

      trace.flush();
      return fullResponse;
    } catch (error) {
      trace.fail(error);
      throw error;
    }
  }

  private parseResolution(response: string): LocationResolution | null {
    const parsedJson =
      this.parseJson(this.stripCodeFences(response)) ??
      this.parseEmbeddedJson(response);

    if (!parsedJson) {
      return null;
    }

    const result = LocationResolutionSchema.safeParse(parsedJson);
    return result.success ? result.data : null;
  }

  private parseJson(value: string): unknown | null {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  private stripCodeFences(value: string): string {
    const trimmed = value.trim();
    const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    return match?.[1]?.trim() ?? trimmed;
  }

  private parseEmbeddedJson(value: string): unknown | null {
    const candidate = this.extractFirstJsonObject(this.stripCodeFences(value));
    return candidate ? this.parseJson(candidate) : null;
  }

  private extractFirstJsonObject(value: string): string | null {
    const start = value.indexOf("{");
    if (start === -1) return null;

    let depth = 0;
    let inString = false;
    let escaping = false;

    for (let i = start; i < value.length; i++) {
      const char = value[i];

      if (escaping) {
        escaping = false;
        continue;
      }

      if (char === "\\") {
        escaping = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (inString) continue;

      if (char === "{") depth += 1;
      if (char === "}") {
        depth -= 1;
        if (depth === 0) {
          return value.slice(start, i + 1);
        }
      }
    }

    return null;
  }
}
