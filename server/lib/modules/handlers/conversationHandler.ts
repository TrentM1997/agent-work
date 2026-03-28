import { Ollama } from "ollama";
import { McpClient } from "./mcpClient";
import type { ToolRequest } from "../types";

export class ConversationHandler {
  constructor(
    private readonly agent: Ollama,
    private readonly client: McpClient,
  ) {}

  public async run(userPrompt: string): Promise<string> {
    const tools = await this.client.listTools();

    const firstResponse = await this.askModel(
      this.createSystemPrompt(tools),
      userPrompt,
    );

    const toolRequest = this.parseToolRequest(firstResponse);

    if (!toolRequest) {
      console.error("No tool request returned");
      return firstResponse;
    }

    const toolResult = await this.client.callTool(
      toolRequest.tool_name,
      toolRequest.parameters,
    );

    return await this.askModel(
      this.createSystemPrompt(tools),
      `User asked: ${userPrompt}

Tool result:
${JSON.stringify(toolResult, null, 2)}

Now answer the user clearly.`,
    );
  }

  public createSystemPrompt(tools: unknown): string {
    return `
You are a helpful assistant with access to tools.

Here are the available tools:
${JSON.stringify(tools, null, 2)}

If you need a tool, respond ONLY with JSON in this format:
{
  "tool_name": "...",
  "parameters": { ... }
}

If you do not need a tool, answer normally.
`;
  }

  public async createMessagePrompt(): Promise<string> {
    const result = await this.client.callTool("open_weather_api", {
      location: {
        city: "Chicago",
        state: "IL",
        zip: "60601",
      },
    });

    return `Here are the weather results:
${JSON.stringify(result, null, 2)}

Tell me whether Chicago sounds like a good time in these conditions.`;
  }

  private async askModel(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<string> {
    const response = await this.agent.chat({
      model: "gpt-oss:120b-cloud",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
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

  private parseToolRequest(response: string): ToolRequest | null {
    let parsed: unknown;

    try {
      parsed = JSON.parse(response);
    } catch {
      return null;
    }

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const candidate = parsed as Record<string, unknown>;

    if (typeof candidate.tool_name !== "string") {
      return null;
    }

    if (!candidate.parameters || typeof candidate.parameters !== "object") {
      return null;
    }

    return {
      tool_name: candidate.tool_name,
      parameters: candidate.parameters as Record<string, unknown>,
    };
  }
}
