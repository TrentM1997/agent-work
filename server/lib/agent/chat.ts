import { spawn } from "child_process";
import { agent } from "@/server/lib/agent";
import { ConversationHandler } from "@/server/lib/modules/handlers/conversationHandler";
import { McpTransportClient } from "../modules/clients/mcpTransportClient";
import type { ChatResponse } from "./types";
import type { ConversationMessage } from "@/lib/types";

export async function chat(
  conversationHistory: ConversationMessage[],
): Promise<ChatResponse> {
  const server = spawn("npx", ["tsx", "./server/server.ts"], { shell: true });
  const client = new McpTransportClient(server);
  const conversation = new ConversationHandler(agent, client);

  try {
    const message = await conversation.run(conversationHistory);
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
