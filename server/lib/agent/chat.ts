import { spawn } from "child_process";
import { agent } from "@/server/lib/agent";
import { ConversationHandler } from "@/server/lib/modules/handlers/conversationHandler";
import { McpTransportClient } from "../modules/clients/mcpTransportClient";
import type { ChatResponse } from "./types";
import type { ConversationMessage } from "@/lib/types";

export async function* chatStream(
  conversationHistory: ConversationMessage[],
): AsyncGenerator<string, void, void> {
  const server = spawn("npx", ["tsx", "./server/server.ts"], { shell: true });
  const client = new McpTransportClient(server);
  const conversation = new ConversationHandler(agent, client);

  try {
    yield* conversation.runStream(conversationHistory);
  } finally {
    server.kill();
  }
}

export async function chat(
  conversationHistory: ConversationMessage[],
): Promise<ChatResponse> {
  try {
    let message = "";

    for await (const chunk of chatStream(conversationHistory)) {
      message += chunk;
    }

    return {
      ok: true,
      message,
    };
  } catch (err) {
    return {
      ok: false,
      error: `${err}`,
    };
  }
}
