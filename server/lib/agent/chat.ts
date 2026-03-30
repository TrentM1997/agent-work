import { spawn } from "child_process";
import { agent } from "@/server/lib/agent";
import { ConversationHandler } from "@/server/lib/modules/handlers/conversationHandler";
import { McpTransportClient } from "../modules/clients/mcpTransportClient";
import { LocationRequestedSchemaType } from "@/schemas/weatherSchema";
import type { ChatResponse } from "./types";

export async function chat(
  locationRequested: LocationRequestedSchemaType,
): Promise<ChatResponse> {
  const server = spawn("npx", ["tsx", "./server/server.ts"], { shell: true });
  const client = new McpTransportClient(server);
  const conversation = new ConversationHandler(agent, client);
  const userPrompt = await conversation.createMessagePrompt(locationRequested);

  try {
    const message = await conversation.run(userPrompt);
    return {
      ok: true,
      message,
    };
  } catch (err) {
    return {
      ok: false,
      error: `${err}`,
    };
  } finally {
    server.kill();
  }
}
