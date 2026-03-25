import { Ollama } from "ollama";
import { ToolManager } from "./toolManager";

export class ConversationHandler {
  constructor(
    private readonly toolManager: ToolManager,
    private readonly client: Ollama,
  ) {}

  async run() {
    await this.createSystemPrompt();
    const prompt = await this.createMessagePrompt();
    const response = await this.client.chat({
      model: "gpt-oss:120b-cloud",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    for await (const part of response) {
      process.stdout.write(part.message.content);
    }
  }

  async createSystemPrompt() {
    const prompt = `
You are a helpful assistant with access to the following tools.
To use a tool, you must respond with a JSON object with two keys: "tool_name" and "parameters".

Here are the available tools: ${this.toolManager.tools}

If you decide to use a tool, your response MUST be only the JSON object.
If you don't need a tool, answer the user's question directly.
`;

    return prompt;
  }

  async createMessagePrompt() {
    const controller = new AbortController();
    const result = await this.toolManager.executeTool(
      "Get the weather in a location",
      { city: "Chicago", state: "Illinois", zip: "60601" },
      controller.signal,
    );

    return `First, please tell me these results: 
    ${JSON.stringify(result)}
    — then, tell me if the city is known to be a good time or not in these conditions
    `;
  }
}
