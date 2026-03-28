import { agent } from "@/server/ollama";
import { ConversationHandler } from "@/lib/modules/handlers/conversationHandler";
import { spawn } from "child_process";
import { McpClient } from "../modules/clients/mcpClient";

const server = spawn("npx", ["tsx", "./server/server.ts"], { shell: true });

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
