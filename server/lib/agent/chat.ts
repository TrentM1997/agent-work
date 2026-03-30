import { agent } from "@/server/ollama";
import { ConversationHandler } from "@/server/lib/modules/handlers/conversationHandler";
import { spawn } from "child_process";
import { McpClient } from "../modules/clients/mcpClient";
import { LocationRequestedSchemaType } from "@/schemas/weatherSchema";

const server = spawn("npx", ["tsx", "./server/server.ts"], { shell: true });

export async function chat(
  locationRequested: LocationRequestedSchemaType,
): Promise<string> {
  const client = new McpClient(server);
  const conversation = new ConversationHandler(agent, client);
  const userPrompt = await conversation.createMessagePrompt(locationRequested);
  try {
    return await conversation.run(userPrompt);
  } finally {
    server.kill();
  }
}
