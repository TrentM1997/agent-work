import { Ollama, type Message } from "ollama";
import { McpTransportClient } from "@/server/lib/modules/clients/mcpTransportClient";
import type { ConversationMessage } from "@/lib/types";
import { LocationResolutionHandler } from "@/server/lib/modules/handlers/locationResolutionHandler";

export class ConversationHandler {
  private readonly locationResolver: LocationResolutionHandler;

  constructor(
    private readonly agent: Ollama,
    private readonly client: McpTransportClient,
  ) {
    this.locationResolver = new LocationResolutionHandler(agent);
  }

  public async run(
    conversationHistory: ConversationMessage[],
  ): Promise<string> {
    const tools = await this.client.listTools();

    const resolution = await this.locationResolver.resolve(
      conversationHistory,
      tools,
    );

    if (resolution.type === "needs_clarification") {
      return resolution.message;
    }

    const toolResult = await this.client.callTool("open_weather_api", {
      locationQuery: resolution.locationQuery,
    });

    return await this.writeFinalAnswer(
      conversationHistory,
      resolution.locationQuery,
      toolResult,
    );
  }

  private async writeFinalAnswer(
    conversationHistory: ConversationMessage[],
    locationQuery: string,
    toolResult: unknown,
  ): Promise<string> {
    const systemPrompt = `
You are a weather assistant.

The weather tool has already been called successfully.
Your job is to answer the user naturally.

Rules:
- Do not call any tools.
- Do not output JSON.
- Do not repeat raw tool payloads.
- Use the weather data to answer directly and clearly.
- If useful, mention the resolved location.
`.trim();

    const messages: Message[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      {
        role: "system",
        content: `Resolved location query: ${locationQuery}`,
      },
      {
        role: "system",
        content: `Weather tool result:\n${JSON.stringify(toolResult, null, 2)}`,
      },
    ];

    const response = await this.askModel(messages);
    const finalReply = response.trim();

    if (!finalReply) {
      throw new Error("Agent returned an empty final answer");
    }

    return finalReply;
  }

  private async askModel(messages: Message[]): Promise<string> {
    const response = await this.agent.chat({
      model: "gpt-oss:120b-cloud",
      messages,
      stream: true,
    });

    let fullResponse = "";

    for await (const part of response) {
      const chunk = part.message.content ?? "";
      process.stdout.write(chunk);
      fullResponse += chunk;
    }

    return fullResponse;
  }
}
