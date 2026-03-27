import { getEnv } from "./config";
import { Ollama } from "ollama";
import { ConversationHandler } from "./conversationHandler";
import { spawn } from "child_process";
import { McpClient } from "./mcpClient";

const OLLAMA_API_KEY = getEnv("OLLAMA_KEY");

const ollama = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: "Bearer " + OLLAMA_API_KEY,
  },
});

const server = spawn("npx", ["tsx", "./lib/server.ts"], { shell: true });

async function chat(): Promise<void> {
  const client = new McpClient(server);
  const conversation = new ConversationHandler(ollama, client);
  const userPrompt = await conversation.createMessagePrompt();
  try {
    await conversation.run(userPrompt);
  } finally {
    server.kill();
  }
}

chat().catch(console.error);
