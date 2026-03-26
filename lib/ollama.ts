import { getEnv } from "./config";
import { Ollama } from "ollama";
import { ToolManager } from "./toolManager";
import { ConversationHandler } from "./conversationHandler";
import { tool } from "ai";
import z from "zod";
const OLLAMA_API_KEY = getEnv("OLLAMA_KEY");

const ollama = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: "Bearer " + OLLAMA_API_KEY,
  },
});

const weatherTool = tool({
  description: "Get the weather in a location",
  inputSchema: z
    .object({
      location: z.object({
        city: z.string(),
        state: z.string(),
        zip: z.string(),
      }),
    })
    .describe(
      "The City, State, and zipcode of the location we'll be getting the weather for",
    ),
  execute: async ({ location }) => {
    return {
      temp: 72,
      conditions: "sunny",
      location: `${location.city} ${location.state}, ${location.zip}`,
    };
  },
});

const availableTools = new ToolManager();

async function chat(): Promise<void> {
  availableTools.registerTool(weatherTool);
  const conversation = new ConversationHandler(availableTools, ollama);

  conversation.createSystemPrompt();
  conversation.run();
}

chat().catch(console.error);
