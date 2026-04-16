import { spawn } from "child_process";
import { agent } from "@/server/lib/agent";
import { ConversationHandler } from "@/server/lib/modules/handlers/conversationHandler";
import { McpTransportClient } from "../modules/clients/mcpTransportClient";
import type { ChatResponse } from "./types";
import type { ConversationMessage } from "@/lib/types";

const startServer = () => {
  return spawn("npx", ["tsx", "./server/server.ts"], { shell: true });
};

let sharedServer: ReturnType<typeof startServer> | null = null;
let sharedClient: McpTransportClient | null = null;

function getSharedMcpClient() {
  if (sharedClient) return sharedClient;

  sharedServer = startServer();
  sharedClient = new McpTransportClient(sharedServer);

  sharedServer.on("exit", () => {
    sharedServer = null;
    sharedClient = null;
  });

  return sharedClient;
}

export async function* chatStream(
  conversationHistory: ConversationMessage[],
): AsyncGenerator<string, void, void> {
  const client = getSharedMcpClient();
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
