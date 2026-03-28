import { agent } from "./ollama";
import { ConversationHandler } from "../modules/conversationHandler";
import { spawn } from "child_process";
import { McpClient } from "../modules/mcpClient";

const server = spawn("npx", ["tsx", "./lib/server.ts"], { shell: true });

export async function chat(): Promise<string> {
  const client = new McpClient(server);
  const conversation = new ConversationHandler(agent, client);
  const userPrompt = await conversation.createMessagePrompt();
  try {
    return await conversation.run(userPrompt);
  } finally {
    server.kill();
  }
}
