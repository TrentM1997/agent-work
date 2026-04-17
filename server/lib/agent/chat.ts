import { agent } from "@/server/lib/agent";
import { ConversationHandler } from "@/server/lib/modules/handlers/conversationHandler";
import type { ChatResponse } from "./types";
import type { ConversationMessage } from "@/lib/types";
import { McpClientManager } from "../modules/clients/mcpClientManager";

const mcpClientManager = new McpClientManager();

export async function* chatStream(
  conversationHistory: ConversationMessage[],
): AsyncGenerator<string, void, void> {
  const client = await mcpClientManager.getClient();
  const conversation = new ConversationHandler(agent, client);

  try {
    yield* conversation.runStream(conversationHistory);
  } catch (err) {
    console.error(err);
    throw err;
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
