import { Ollama, type Message } from "ollama";
import { McpTransportClient } from "@/server/lib/modules/clients/mcpTransportClient";
import type { ConversationMessage } from "@/lib/types";
import { LocationResolutionHandler } from "@/server/lib/modules/handlers/locationResolutionHandler";
import { createModelTrace } from "@/server/lib/logging/modelTrace";

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
    let fullResponse = "";

    for await (const chunk of this.runStream(conversationHistory)) {
      fullResponse += chunk;
    }

    const finalReply = fullResponse.trim();

    if (!finalReply) {
      throw new Error("Agent returned an empty final answer");
    }

    return finalReply;
  }

  public async *runStream(
    conversationHistory: ConversationMessage[],
  ): AsyncGenerator<string, void, void> {
    const tools = await this.client.listTools();

    const resolution = await this.locationResolver.resolve(
      conversationHistory,
      tools,
    );

    if (resolution.type === "needs_clarification") {
      yield resolution.message;
      return;
    }

    const toolResult = await this.client.callTool("open_weather_api", {
      locationQuery: resolution.locationQuery,
    });

    yield* this.writeFinalAnswerStream(
      conversationHistory,
      resolution.locationQuery,
      toolResult,
    );
  }

  private async *writeFinalAnswerStream(
    conversationHistory: ConversationMessage[],
    locationQuery: string,
    toolResult: unknown,
  ): AsyncGenerator<string, void, void> {
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

    yield* this.askModelStream(messages);
  }

  private async *askModelStream(
    messages: Message[],
  ): AsyncGenerator<string, void, void> {
    const response = await this.agent.chat({
      model: "gpt-oss:120b-cloud",
      messages,
      stream: true,
    });

    const trace = createModelTrace("final-answer");
    let fullResponse = "";

    try {
      for await (const part of response) {
        const chunk = part.message.content ?? "";
        if (!chunk) {
          continue;
        }

        trace.append(chunk);
        fullResponse += chunk;
        yield chunk;
      }

      trace.flush();
    } catch (error) {
      trace.fail(error);
      throw error;
    }

    if (!fullResponse.trim()) {
      throw new Error("Agent returned an empty final answer");
    }
  }
}
